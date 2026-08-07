'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import {
  completeItem,
  getPreferences,
  getWeeklyPlan,
  listProgress,
  listUserProjects,
  moveTask,
  saveNote,
  savePreferences,
  saveUserProject,
  saveWeeklyPlan,
  setTaskCompletion,
  startRoadmap,
  toggleSavedResource,
  rateResource,
  uncompleteItem,
} from '@/lib/db/repository';
import { generateWeeklyPlan, adjustWorkload } from '@/lib/engine/weekly-plan';
import { pathById } from '@/content/paths';
import { projectById } from '@/content/projects';
import { startOfIsoWeek } from '@/lib/utils';

/**
 * Server actions for learning progress.
 *
 * Each one re-checks the session rather than trusting anything from the client.
 * They return a small result object instead of throwing, so a failure renders as
 * a French message rather than an error boundary.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

const UNAUTHENTICATED: ActionResult = {
  ok: false,
  error: 'Connectez-vous pour enregistrer votre progression.',
};

async function requireUser(): Promise<string | null> {
  const session = await getSession();
  return session?.userId ?? null;
}

// ---------------------------------------------------------------------------
// Roadmaps
// ---------------------------------------------------------------------------

export async function startPathAction(pathId: string): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;
  if (!pathById.has(pathId)) return { ok: false, error: 'Parcours inconnu.' };

  await startRoadmap(userId, pathId, true);

  // A new roadmap invalidates the current week's plan, which was built from the
  // previous one. Regenerating here means the dashboard is never inconsistent.
  await regenerateCurrentPlan(userId, pathId);

  revalidatePath('/tableau-de-bord');
  revalidatePath('/mon-parcours');
  revalidatePath('/plan-semaine');
  return { ok: true };
}

const itemSchema = z.object({
  pathId: z.string().min(1).max(120),
  stageId: z.string().min(1).max(160),
  itemId: z.string().min(1).max(200),
});

export async function setItemCompletionAction(
  input: z.input<typeof itemSchema> & { done: boolean },
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Requête invalide.' };

  // Verify the item actually exists in the content before recording progress
  // against it — otherwise a crafted request could pollute the progress table.
  const path = pathById.get(parsed.data.pathId);
  const stage = path?.stages.find((candidate) => candidate.id === parsed.data.stageId);
  const item = stage?.items.find((candidate) => candidate.id === parsed.data.itemId);
  if (!item) return { ok: false, error: 'Élément introuvable.' };

  if (input.done) {
    await completeItem(userId, parsed.data.pathId, parsed.data.stageId, parsed.data.itemId);
  } else {
    await uncompleteItem(userId, parsed.data.itemId);
  }

  revalidatePath('/mon-parcours');
  revalidatePath('/tableau-de-bord');
  return { ok: true };
}

const noteSchema = z.object({
  scope: z.enum(['stage', 'project', 'employer', 'reflection']),
  refId: z.string().min(1).max(200),
  body: z.string().max(10_000),
});

export async function saveNoteAction(input: z.input<typeof noteSchema>): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Note invalide.' };

  await saveNote(userId, parsed.data.scope, parsed.data.refId, parsed.data.body);
  revalidatePath('/mon-parcours');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Weekly plan
// ---------------------------------------------------------------------------

async function regenerateCurrentPlan(userId: string, pathId: string, weekStart?: string) {
  const week = weekStart ?? startOfIsoWeek(new Date());
  const preferences = await getPreferences(userId);
  const [progress, projects] = await Promise.all([
    listProgress(userId),
    listUserProjects(userId),
  ]);

  const plan = generateWeeklyPlan({
    userId,
    pathId,
    weekStart: week,
    hoursPerWeek: preferences.hoursPerWeek,
    connectivity: preferences.connectivity,
    learningStyle: preferences.learningStyle,
    completedItemIds: progress.map((entry) => entry.itemId),
    completedProjectIds: projects
      .filter((project) => project.completedAt)
      .map((project) => project.projectId),
  });

  return saveWeeklyPlan(plan);
}

export async function generatePlanAction(
  pathId: string,
  weekStart?: string,
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;
  if (!pathById.has(pathId)) return { ok: false, error: 'Parcours inconnu.' };

  await regenerateCurrentPlan(userId, pathId, weekStart);
  revalidatePath('/plan-semaine');
  revalidatePath('/tableau-de-bord');
  return { ok: true };
}

export async function setTaskCompletionAction(
  taskId: string,
  done: boolean,
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  await setTaskCompletion(userId, taskId, done);

  // Ticking a plan task that maps to a roadmap item should also tick the item —
  // otherwise the same work has to be marked done twice.
  const week = startOfIsoWeek(new Date());
  const plan = await getWeeklyPlan(userId, week);
  const task = plan?.tasks.find((candidate) => candidate.id === taskId);
  if (task?.itemId && task.pathId && task.stageId) {
    if (done) await completeItem(userId, task.pathId, task.stageId, task.itemId);
    else await uncompleteItem(userId, task.itemId);
  }

  revalidatePath('/plan-semaine');
  revalidatePath('/tableau-de-bord');
  revalidatePath('/mon-parcours');
  return { ok: true };
}

export async function moveTaskAction(taskId: string, day: number): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;
  if (!Number.isInteger(day) || day < 0 || day > 6) {
    return { ok: false, error: 'Jour invalide.' };
  }

  await moveTask(userId, taskId, day);
  revalidatePath('/plan-semaine');
  return { ok: true };
}

export async function adjustWorkloadAction(
  direction: 'lighter' | 'heavier',
  pathId: string,
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  const preferences = await getPreferences(userId);
  const hours = adjustWorkload(preferences.hoursPerWeek, direction);
  await savePreferences(userId, { hoursPerWeek: hours });
  await regenerateCurrentPlan(userId, pathId);

  revalidatePath('/plan-semaine');
  revalidatePath('/profil');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const projectSchema = z.object({
  projectId: z.string().min(1).max(120),
  work: z.string().max(20_000).optional(),
  evidenceUrl: z
    .string()
    .max(500)
    .refine((value) => value === '' || /^https?:\/\//.test(value), {
      message: 'Le lien doit commencer par http:// ou https://',
    })
    .optional(),
  reflection: z.string().max(10_000).optional(),
  checklistDone: z.array(z.string().max(120)).max(50).optional(),
  completed: z.boolean().optional(),
  inPortfolio: z.boolean().optional(),
});

export async function saveProjectAction(
  input: z.input<typeof projectSchema>,
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Données invalides.' };
  }

  const project = projectById.get(parsed.data.projectId);
  if (!project) return { ok: false, error: 'Projet inconnu.' };

  await saveUserProject(userId, parsed.data.projectId, {
    work: parsed.data.work,
    evidenceUrl: parsed.data.evidenceUrl ? parsed.data.evidenceUrl : null,
    reflection: parsed.data.reflection,
    checklistDone: parsed.data.checklistDone,
    inPortfolio: parsed.data.inPortfolio,
    ...(parsed.data.completed === undefined
      ? {}
      : { completedAt: parsed.data.completed ? new Date().toISOString() : null }),
  });

  revalidatePath('/projets');
  revalidatePath(`/projets/${project.slug}`);
  revalidatePath('/tableau-de-bord');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export async function toggleResourceAction(resourceId: string): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  await toggleSavedResource(userId, resourceId);
  revalidatePath('/ressources');
  revalidatePath('/enregistre');
  return { ok: true };
}

export async function rateResourceAction(
  resourceId: string,
  rating: 'useful' | 'not-useful',
): Promise<ActionResult> {
  const userId = await requireUser();
  if (!userId) return UNAUTHENTICATED;

  await rateResource(userId, resourceId, rating);
  revalidatePath('/ressources');
  return { ok: true };
}
