'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import {
  deleteAnalysis,
  getCvProfile,
  getOnboarding,
  listAnalyses,
  listProgress,
  listRoadmaps,
  listUserProjects,
  replaceSkillGaps,
  saveAnalysis,
  saveAnalysisAnswers,
  saveChecklistState,
  saveConfidenceWork,
  saveCvProfile,
  saveEmployerResearch,
  saveInterviewAnswer,
  saveStarExample,
  deleteStarExample,
  saveValueProposition,
  setSkillGapStatus,
  getValueProposition,
  listInterviewAnswers,
  listStarExamples,
  listChecklistStates,
  listEmployerResearch,
  getConfidenceWork,
} from '@/lib/db/repository';
import { JobTextError, analyzeJobDescription } from '@/lib/engine/job-analyzer';
import { compareProfileToJob } from '@/lib/engine/matching';
import { buildProfileSnapshot } from '@/lib/engine/profile-snapshot';
import { aggregateSkillGaps } from '@/lib/engine/skill-gaps';
import { buildValueProposition } from '@/lib/engine/value-proposition';
import { refineJobExtraction, refineValueProposition } from '@/lib/ai/tasks';
import { checkRateLimit } from '@/lib/rate-limit';
import { interviewQuestionById } from '@/content/interview-questions';
import { checklistById } from '@/content/checklists';
import type { JobAnalysis, JobComparison, JobExtraction, SixQuestionKey } from '@/lib/types';

export type JobActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Builds the profile snapshot used by the matching engine.
 * Guests get an empty snapshot: the extraction still runs, the comparison does
 * not, and the UI says so rather than inventing a profile.
 */
async function snapshotFor(userId: string | null) {
  if (!userId) return null;

  const [onboarding, progress, roadmaps, projects, cv, valueProp, answers, stars, _checklists, employers, analyses] =
    await Promise.all([
      getOnboarding(userId),
      listProgress(userId),
      listRoadmaps(userId),
      listUserProjects(userId),
      getCvProfile(userId),
      getValueProposition(userId),
      listInterviewAnswers(userId),
      listStarExamples(userId),
      listChecklistStates(userId),
      listEmployerResearch(userId),
      listAnalyses(userId),
    ]);

  return buildProfileSnapshot({
    onboarding,
    progress,
    activePathIds: roadmaps.map((roadmap) => roadmap.pathId),
    userProjects: projects,
    declaredSkills: cv?.skills ?? [],
    declaredTools: cv?.tools ?? [],
    preparation: {
      hasCv: Boolean(cv && cv.headline.length > 0),
      analyses: analyses.length,
      hasValueProposition: Boolean(valueProp),
      interviewAnswers: answers.length,
      starExamples: stars.length,
      employerResearch: employers.some((entry) => entry.notes.trim().length > 0),
      projectsCompleted: projects.filter((project) => project.completedAt).length,
    },
  });
}

// ---------------------------------------------------------------------------
// Job description analysis
// ---------------------------------------------------------------------------

const analyzeSchema = z.object({
  text: z.string().min(1).max(30_000),
  jobTitle: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  useAi: z.boolean().optional(),
});

export interface AnalysisPayload {
  id: string | null;
  extraction: JobExtraction;
  comparison: JobComparison | null;
  aiNotice: string | null;
  usedAi: boolean;
  hasProfile: boolean;
}

export async function analyzeJobAction(
  input: z.input<typeof analyzeSchema>,
): Promise<JobActionResult<AnalysisPayload>> {
  const parsed = analyzeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Requête invalide.' };

  const session = await getSession();
  const userId = session?.userId ?? null;

  const limit = await checkRateLimit(`analyze:${userId ?? 'anon'}`, {
    limit: 30,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.allowed) {
    return { ok: false, error: 'Trop d’analyses lancées. Patientez avant de réessayer.' };
  }

  // The deterministic engine always runs first and always produces the result.
  let extraction: JobExtraction;
  try {
    extraction = analyzeJobDescription(parsed.data.text, {
      jobTitle: parsed.data.jobTitle,
      company: parsed.data.company,
    });
  } catch (error) {
    if (error instanceof JobTextError) {
      return {
        ok: false,
        error:
          error.reason === 'too-short'
            ? 'Le texte est trop court pour être analysé. Collez l’annonce complète.'
            : 'Le texte est trop long. Collez uniquement l’annonce.',
      };
    }
    return { ok: false, error: 'L’analyse a échoué. Vérifiez le texte collé.' };
  }

  let aiNotice: string | null = null;
  let usedAi = false;

  if (parsed.data.useAi) {
    const refined = await refineJobExtraction(
      parsed.data.text,
      extraction,
      userId ?? 'anon',
    );
    extraction = refined.value;
    aiNotice = refined.notice;
    usedAi = refined.usedAi;
  }

  const profile = await snapshotFor(userId);
  const comparison = profile ? compareProfileToJob(extraction, profile) : null;

  let analysisId: string | null = null;
  if (userId) {
    const saved = await saveAnalysis({
      userId,
      jobTitle: extraction.jobTitle,
      company: extraction.company,
      rawText: parsed.data.text,
      extraction,
      comparison,
    });
    analysisId = saved.id;

    // Refresh the aggregated gap list so /preparation-emploi/ecarts stays true.
    const analyses = await listAnalyses(userId);
    await replaceSkillGaps(userId, aggregateSkillGaps(analyses));
    revalidatePath('/preparation-emploi/ecarts');
    revalidatePath('/preparation-emploi');
  }

  return {
    ok: true,
    data: { id: analysisId, extraction, comparison, aiNotice, usedAi, hasProfile: Boolean(profile) },
  };
}

const answersSchema = z.object({
  analysisId: z.string().min(1).max(80),
  answers: z
    .object({
      whyRole: z.string().max(4000).optional(),
      whyCompany: z.string().max(4000).optional(),
      whyMe: z.string().max(4000).optional(),
      myGaps: z.string().max(4000).optional(),
      howCompensate: z.string().max(4000).optional(),
      whatValue: z.string().max(4000).optional(),
    })
    .strict(),
});

export async function saveAnalysisAnswersAction(
  input: z.input<typeof answersSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer vos réponses.' };

  const parsed = answersSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Réponses invalides.' };

  await saveAnalysisAnswers(
    session.userId,
    parsed.data.analysisId,
    parsed.data.answers as Partial<Record<SixQuestionKey, string>>,
  );
  revalidatePath(`/preparation-emploi/analyser/${parsed.data.analysisId}`);
  return { ok: true };
}

export async function deleteAnalysisAction(analysisId: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };

  await deleteAnalysis(session.userId, analysisId);
  const analyses = await listAnalyses(session.userId);
  await replaceSkillGaps(session.userId, aggregateSkillGaps(analyses));

  revalidatePath('/preparation-emploi/analyser');
  revalidatePath('/preparation-emploi/ecarts');
  return { ok: true };
}

export async function setSkillGapStatusAction(
  label: string,
  status: 'todo' | 'learning' | 'addressed',
): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  await setSkillGapStatus(session.userId, label, status);
  revalidatePath('/preparation-emploi/ecarts');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Value proposition
// ---------------------------------------------------------------------------

const valuePropSchema = z.object({
  problem: z.string().max(2000),
  skills: z.string().max(2000),
  results: z.string().max(2000),
  proof: z.string().max(2000),
  approach: z.string().max(2000),
  motivation: z.string().max(2000),
  targetRole: z.string().max(200).optional(),
  useAi: z.boolean().optional(),
});

export async function buildValuePropositionAction(
  input: z.input<typeof valuePropSchema>,
): Promise<
  JobActionResult<{
    output: ReturnType<typeof buildValueProposition>;
    aiNotice: string | null;
    usedAi: boolean;
  }>
> {
  const parsed = valuePropSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Réponses invalides.' };

  const session = await getSession();
  const { useAi, ...answers } = parsed.data;

  // Deterministic output first: this is what gets shown if anything else fails.
  const deterministic = buildValueProposition(answers);

  let output = deterministic;
  let aiNotice: string | null = null;
  let usedAi = false;

  if (useAi) {
    const refined = await refineValueProposition(
      answers,
      deterministic,
      session?.userId ?? 'anon',
    );
    output = refined.value;
    aiNotice = refined.notice;
    usedAi = refined.usedAi;
  }

  if (session) {
    await saveValueProposition(session.userId, answers, output);
    revalidatePath('/preparation-emploi/valeur');
    revalidatePath('/preparation-emploi');
  }

  return { ok: true, data: { output, aiNotice, usedAi } };
}

// ---------------------------------------------------------------------------
// Interview preparation
// ---------------------------------------------------------------------------

export async function saveInterviewAnswerAction(
  questionId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer vos réponses.' };
  if (!interviewQuestionById.has(questionId)) return { ok: false, error: 'Question inconnue.' };
  if (body.length > 10_000) return { ok: false, error: 'Réponse trop longue.' };

  await saveInterviewAnswer(session.userId, questionId, body);
  revalidatePath('/preparation-emploi/entretien');
  return { ok: true };
}

const starSchema = z.object({
  id: z.string().max(80).optional(),
  label: z.string().max(200),
  situation: z.string().max(3000),
  task: z.string().max(3000),
  action: z.string().max(3000),
  result: z.string().max(3000),
});

export async function saveStarExampleAction(
  input: z.input<typeof starSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer vos exemples.' };

  const parsed = starSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Exemple invalide.' };

  await saveStarExample(session.userId, { id: parsed.data.id ?? '', ...parsed.data });
  revalidatePath('/preparation-emploi/entretien');
  return { ok: true };
}

export async function deleteStarExampleAction(id: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  await deleteStarExample(session.userId, id);
  revalidatePath('/preparation-emploi/entretien');
  return { ok: true };
}

export async function saveConfidenceWorkAction(input: {
  fearedQuestion: string;
  preparedAnswer: string;
  evidence: string;
}): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer.' };

  await saveConfidenceWork(session.userId, {
    fearedQuestion: input.fearedQuestion.slice(0, 2000),
    preparedAnswer: input.preparedAnswer.slice(0, 5000),
    evidence: input.evidence.slice(0, 5000),
  });
  revalidatePath('/preparation-emploi/entretien');
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Checklists, employer research, CV
// ---------------------------------------------------------------------------

export async function saveChecklistAction(
  checklistId: string,
  doneItemIds: string[],
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer.' };

  const checklist = checklistById.get(checklistId);
  if (!checklist) return { ok: false, error: 'Liste inconnue.' };

  // Only keep ids that exist in the checklist, so a stale client cannot store
  // arbitrary strings.
  const valid = new Set(checklist.items.map((item) => item.id));
  await saveChecklistState(
    session.userId,
    checklistId,
    doneItemIds.filter((id) => valid.has(id)),
  );

  revalidatePath('/preparation-emploi/entretien');
  revalidatePath('/preparation-emploi/checklist');
  revalidatePath('/preparation-emploi');
  return { ok: true };
}

export async function saveEmployerResearchAction(input: {
  company: string;
  notes: string;
  doneItemIds: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer.' };

  await saveEmployerResearch(session.userId, input.company.slice(0, 200), {
    notes: input.notes.slice(0, 10_000),
    doneItemIds: input.doneItemIds.slice(0, 50),
  });
  revalidatePath('/preparation-emploi/employeur');
  return { ok: true };
}

const cvSchema = z.object({
  fullName: z.string().max(120),
  headline: z.string().max(200),
  summary: z.string().max(2000),
  phone: z.string().max(40),
  city: z.string().max(120),
  experiences: z
    .array(
      z.object({
        id: z.string().max(60),
        role: z.string().max(200),
        organisation: z.string().max(200),
        period: z.string().max(80),
        description: z.string().max(3000),
      }),
    )
    .max(20),
  education: z
    .array(
      z.object({
        id: z.string().max(60),
        diploma: z.string().max(200),
        institution: z.string().max(200),
        year: z.string().max(20),
      }),
    )
    .max(20),
  languages: z
    .array(z.object({ id: z.string().max(60), name: z.string().max(80), level: z.string().max(80) }))
    .max(10),
  skills: z.array(z.string().max(120)).max(40),
  tools: z.array(z.string().max(120)).max(40),
  projects: z.array(z.string().max(500)).max(20),
  extras: z.string().max(3000),
});

export async function saveCvAction(
  input: z.input<typeof cvSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Connectez-vous pour enregistrer votre CV.' };

  const parsed = cvSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont trop longs.' };

  await saveCvProfile(session.userId, parsed.data);
  revalidatePath('/preparation-emploi/cv');
  revalidatePath('/preparation-emploi');
  return { ok: true };
}

export async function getConfidenceWorkAction() {
  const session = await getSession();
  if (!session) return null;
  return getConfidenceWork(session.userId);
}

export type { JobAnalysis };
