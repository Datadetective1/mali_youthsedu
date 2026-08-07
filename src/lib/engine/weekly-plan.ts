import type {
  ConnectivityQuality,
  LearningStyle,
  RoadmapItem,
  RoadmapStage,
  WeeklyPlan,
  WeeklyTask,
  WeeklyTaskKind,
} from '@/lib/types';
import { pathById } from '@/content/paths';
import { projectsForPath } from '@/content/projects';
import { resourceById } from '@/content/resources';
import { createRng } from '@/lib/utils';

/**
 * Weekly plan generation.
 *
 * Design constraints, in priority order:
 *  1. Realistic. The plan must fit the hours the person actually has, not the
 *     hours we wish they had. Over-scheduling is the fastest way to make
 *     someone quit.
 *  2. Deterministic. The same inputs always produce the same plan, so a reload
 *     never reshuffles the week. Randomness is seeded, never ambient.
 *  3. Always ends with something practical and something reflective, because a
 *     week of pure reading produces nothing showable to an employer.
 */

export interface WeeklyPlanInput {
  userId: string;
  pathId: string;
  /** ISO date of the Monday. */
  weekStart: string;
  hoursPerWeek: number;
  connectivity: ConnectivityQuality;
  completedItemIds: string[];
  completedProjectIds: string[];
  learningStyle?: LearningStyle;
}

/** Tasks per week. Below three the week feels empty; above five it feels punishing. */
const MIN_TASKS = 3;
const MAX_TASKS = 5;

/**
 * Only fill part of the declared budget with scheduled learning. Life happens,
 * and a plan that consumes 100% of the available time is a plan that fails in
 * week two.
 */
const BUDGET_UTILISATION = 0.85;

function daysForBudget(hoursPerWeek: number): number[] {
  if (hoursPerWeek <= 3) return [1, 3, 5]; // mardi, jeudi, samedi
  if (hoursPerWeek <= 6) return [0, 2, 4, 5];
  if (hoursPerWeek <= 12) return [0, 1, 3, 4, 5];
  return [0, 1, 2, 3, 4, 5];
}

/** Highest connectivity requirement among an item's linked resources. */
function itemConnectivityCost(item: RoadmapItem): number {
  const weights = { offline: 0, low: 1, medium: 2, high: 3 } as const;
  let worst = 0;
  for (const resourceId of item.resourceIds ?? []) {
    const resource = resourceById.get(resourceId);
    if (resource) worst = Math.max(worst, weights[resource.connectivity]);
  }
  return worst;
}

function connectivityBudget(connectivity: ConnectivityQuality): number {
  switch (connectivity) {
    case 'rare':
      return 1;
    case 'limitee':
      return 2;
    default:
      return 3;
  }
}

function styleAffinity(kind: RoadmapItem['kind'], style: LearningStyle | undefined): number {
  if (!style) return 0;
  if (style === 'lecture' && kind === 'lecture') return 1;
  if (style === 'pratique' && kind === 'pratique') return 1;
  if (style === 'video' && kind === 'lecture') return 0.5;
  if (style === 'groupe' && kind === 'reflexion') return 0.5;
  return 0;
}

interface Candidate {
  item: RoadmapItem;
  stage: RoadmapStage;
  /** Lower is scheduled earlier. */
  rank: number;
}

export function generateWeeklyPlan(input: WeeklyPlanInput): WeeklyPlan {
  const path = pathById.get(input.pathId);
  const generatedAt = new Date().toISOString();
  const planId = `${input.userId}:${input.pathId}:${input.weekStart}`;

  if (!path) {
    return {
      id: planId,
      userId: input.userId,
      weekStart: input.weekStart,
      pathId: input.pathId,
      objective: 'Choisissez un parcours pour construire votre plan.',
      hoursTarget: input.hoursPerWeek,
      tasks: [],
      generatedAt,
    };
  }

  const completed = new Set(input.completedItemIds);
  const completedProjects = new Set(input.completedProjectIds);
  const budgetMinutes = Math.round(input.hoursPerWeek * 60 * BUDGET_UTILISATION);
  const maxConnectivity = connectivityBudget(input.connectivity);

  // --- Gather candidate items in curriculum order -------------------------
  const candidates: Candidate[] = [];
  let position = 0;
  for (const stage of path.stages) {
    for (const item of stage.items) {
      if (completed.has(item.id)) {
        position += 1;
        continue;
      }
      // Items whose resources exceed the user's connectivity are pushed back
      // rather than dropped: they stay reachable, just not this week's priority.
      const overBudget = itemConnectivityCost(item) > maxConnectivity ? 1000 : 0;
      const styleBonus = styleAffinity(item.kind, input.learningStyle) * -2;
      candidates.push({ item, stage, rank: position + overBudget + styleBonus });
      position += 1;
    }
  }

  const activeStage =
    path.stages.find((stage) => stage.items.some((item) => !completed.has(item.id))) ??
    path.stages[path.stages.length - 1];

  const ordered = candidates.slice().sort((a, b) => a.rank - b.rank);

  // --- Fill the budget ----------------------------------------------------
  const chosen: Candidate[] = [];
  let scheduled = 0;
  for (const candidate of ordered) {
    if (chosen.length >= MAX_TASKS) break;
    const wouldExceed = scheduled + candidate.item.minutes > budgetMinutes;
    if (wouldExceed && chosen.length >= MIN_TASKS) break;
    chosen.push(candidate);
    scheduled += candidate.item.minutes;
  }

  const tasks: WeeklyTask[] = [];
  const rng = createRng(planId);
  const days = daysForBudget(input.hoursPerWeek);

  chosen.forEach((candidate, index) => {
    tasks.push({
      id: `${planId}:item:${candidate.item.id}`,
      planId,
      title: candidate.item.title,
      description: candidate.item.description,
      kind: candidate.item.kind as WeeklyTaskKind,
      minutes: candidate.item.minutes,
      day: days[index % days.length] ?? 0,
      pathId: path.id,
      stageId: candidate.stage.id,
      itemId: candidate.item.id,
      projectId: null,
      completedAt: null,
      order: index,
    });
  });

  // --- Guarantee one practical activity -----------------------------------
  const hasPractical = tasks.some((task) => task.kind === 'pratique' || task.kind === 'projet');
  if (!hasPractical && activeStage) {
    const project = projectsForPath(path.id).find(
      (candidate) => !completedProjects.has(candidate.id),
    );
    if (project) {
      tasks.push({
        id: `${planId}:project:${project.id}`,
        planId,
        title: `Projet pratique : ${project.title}`,
        description: project.objective,
        kind: 'projet',
        // A whole project rarely fits in one week; schedule a first session.
        minutes: Math.min(project.estimatedMinutes, 90),
        day: days[days.length - 1] ?? 5,
        pathId: path.id,
        stageId: null,
        itemId: null,
        projectId: project.id,
        completedAt: null,
        order: tasks.length,
      });
    } else {
      tasks.push({
        id: `${planId}:exercise:${activeStage.id}`,
        planId,
        title: `Exercice pratique : ${activeStage.practicalExercise.title}`,
        description: activeStage.practicalExercise.deliverable,
        kind: 'pratique',
        minutes: 60,
        day: days[days.length - 1] ?? 5,
        pathId: path.id,
        stageId: activeStage.id,
        itemId: null,
        projectId: null,
        completedAt: null,
        order: tasks.length,
      });
    }
  }

  // --- Guarantee one reflection / confidence activity ---------------------
  const hasReflection = tasks.some((task) => task.kind === 'reflexion');
  if (!hasReflection && activeStage) {
    tasks.push({
      id: `${planId}:reflection:${activeStage.id}`,
      planId,
      title: 'Prendre du recul',
      description: activeStage.reflection,
      kind: 'reflexion',
      minutes: 20,
      // Sunday: a quiet slot that does not compete with the practical work.
      day: 6,
      pathId: path.id,
      stageId: activeStage.id,
      itemId: null,
      projectId: null,
      completedAt: null,
      order: tasks.length,
    });
  }

  // Nudge one task by a day so consecutive weeks do not look identical, while
  // staying fully reproducible for a given user/week/path.
  if (tasks.length > 2) {
    const index = Math.floor(rng() * tasks.length);
    const task = tasks[index];
    if (task && task.kind !== 'reflexion') {
      task.day = days[Math.floor(rng() * days.length)] ?? task.day;
    }
  }

  tasks.sort((a, b) => a.day - b.day || a.order - b.order);

  return {
    id: planId,
    userId: input.userId,
    weekStart: input.weekStart,
    pathId: path.id,
    objective: activeStage?.objective ?? 'Terminer votre parcours et consolider vos preuves.',
    hoursTarget: input.hoursPerWeek,
    tasks,
    generatedAt,
  };
}

export function planTotalMinutes(plan: WeeklyPlan): number {
  return plan.tasks.reduce((sum, task) => sum + task.minutes, 0);
}

export function planCompletion(plan: WeeklyPlan): { done: number; total: number } {
  return {
    done: plan.tasks.filter((task) => task.completedAt !== null).length,
    total: plan.tasks.length,
  };
}

/** Step the weekly workload down or up through the onboarding brackets. */
export function adjustWorkload(currentHours: number, direction: 'lighter' | 'heavier'): number {
  const brackets = [2, 5, 10, 20];
  const index = brackets.findIndex((bracket) => bracket >= currentHours);
  const current = index === -1 ? brackets.length - 1 : index;
  const next = direction === 'lighter' ? current - 1 : current + 1;
  return brackets[Math.max(0, Math.min(brackets.length - 1, next))] ?? currentHours;
}
