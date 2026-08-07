import { dataConfig } from '@/config';
import type {
  ChecklistState,
  ConfidenceWork,
  CvProfile,
  EmployerResearch,
  Feedback,
  InterviewAnswer,
  JobAnalysis,
  MetricEvent,
  OnboardingAnswers,
  ProgressEntry,
  SavedResource,
  SkillGapEntry,
  StarExample,
  UserNote,
  UserProfile,
  UserProject,
  UserRoadmap,
  ValueProposition,
  ValuePropositionInput,
  ValuePropositionOutput,
  WeeklyPlan,
  WeeklyTask,
} from '@/lib/types';
import { localStore } from './local-store';
import { SupabaseStore, createRequestClient } from './supabase-store';
import type { Row, Store } from './store';

/**
 * Domain repository.
 *
 * Written once against the `Store` primitive so both drivers behave
 * identically. Row shapes use PostgreSQL column names; the mapping to and from
 * domain types happens here and nowhere else.
 */

export async function getStore(): Promise<Store> {
  if (dataConfig.driver === 'supabase') {
    return new SupabaseStore(await createRequestClient());
  }
  return localStore();
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}
function num(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}
function nullableStr(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}
function json<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function toProfile(row: Row, onboarding: OnboardingAnswers | null): UserProfile {
  return {
    id: str(row.id),
    email: str(row.email),
    displayName: str(row.display_name),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
    onboarding,
    onboardingCompletedAt: nullableStr(row.onboarding_completed_at),
    locale: str(row.locale, 'fr'),
    isAdmin: bool(row.is_admin),
  };
}

function toProgress(row: Row): ProgressEntry {
  return {
    id: str(row.id),
    userId: str(row.user_id),
    pathId: str(row.path_id),
    stageId: str(row.stage_id),
    itemId: str(row.item_id),
    completedAt: str(row.completed_at),
  };
}

function toRoadmap(row: Row): UserRoadmap {
  return {
    id: str(row.id),
    userId: str(row.user_id),
    pathId: str(row.path_id),
    isPrimary: bool(row.is_primary),
    startedAt: str(row.started_at),
    completedAt: nullableStr(row.completed_at),
    archivedAt: nullableStr(row.archived_at),
  };
}

function toWeeklyTask(row: Row): WeeklyTask {
  return {
    id: str(row.id),
    planId: str(row.plan_id),
    title: str(row.title),
    description: nullableStr(row.description) ?? undefined,
    kind: str(row.kind, 'lecture') as WeeklyTask['kind'],
    minutes: num(row.minutes),
    day: num(row.day),
    pathId: nullableStr(row.path_id),
    stageId: nullableStr(row.stage_id),
    itemId: nullableStr(row.item_id),
    projectId: nullableStr(row.project_id),
    completedAt: nullableStr(row.completed_at),
    order: num(row.sort_order),
  };
}

function toUserProject(row: Row): UserProject {
  return {
    id: str(row.id),
    userId: str(row.user_id),
    projectId: str(row.project_id),
    startedAt: str(row.started_at),
    completedAt: nullableStr(row.completed_at),
    work: str(row.work),
    evidenceUrl: nullableStr(row.evidence_url),
    reflection: str(row.reflection),
    checklistDone: json<string[]>(row.checklist_done, []),
    inPortfolio: bool(row.in_portfolio),
    updatedAt: str(row.updated_at),
  };
}

// ---------------------------------------------------------------------------
// Profile & preferences
// ---------------------------------------------------------------------------

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const store = await getStore();
  const row = await store.getOne('profiles', { id: userId });
  if (!row) return null;
  const onboarding = await getOnboarding(userId);
  return toProfile(row, onboarding);
}

export async function updateProfile(
  userId: string,
  patch: { displayName?: string; locale?: string },
): Promise<void> {
  const store = await getStore();
  const row: Row = {};
  if (patch.displayName !== undefined) row.display_name = patch.displayName;
  if (patch.locale !== undefined) row.locale = patch.locale;
  if (Object.keys(row).length === 0) return;
  await store.update('profiles', { id: userId }, row);
}

export interface UserPreferences {
  hoursPerWeek: number;
  connectivity: OnboardingAnswers['connectivity'];
  device: OnboardingAnswers['device'];
  learningStyle: OnboardingAnswers['learningStyle'];
  locale: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  hoursPerWeek: 5,
  connectivity: 'correcte',
  device: 'smartphone',
  learningStyle: 'pratique',
  locale: 'fr',
};

export async function getPreferences(userId: string): Promise<UserPreferences> {
  const store = await getStore();
  const row = await store.getOne('user_preferences', { user_id: userId });
  if (!row) return DEFAULT_PREFERENCES;
  return {
    hoursPerWeek: num(row.hours_per_week, DEFAULT_PREFERENCES.hoursPerWeek),
    connectivity: str(row.connectivity, DEFAULT_PREFERENCES.connectivity) as UserPreferences['connectivity'],
    device: str(row.device, DEFAULT_PREFERENCES.device) as UserPreferences['device'],
    learningStyle: str(row.learning_style, DEFAULT_PREFERENCES.learningStyle) as UserPreferences['learningStyle'],
    locale: str(row.locale, 'fr'),
  };
}

export async function savePreferences(
  userId: string,
  patch: Partial<UserPreferences>,
): Promise<void> {
  const store = await getStore();
  const current = await getPreferences(userId);
  const next = { ...current, ...patch };
  await store.upsert(
    'user_preferences',
    {
      user_id: userId,
      hours_per_week: next.hoursPerWeek,
      connectivity: next.connectivity,
      device: next.device,
      learning_style: next.learningStyle,
      locale: next.locale,
    },
    ['user_id'],
  );
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export async function getOnboarding(userId: string): Promise<OnboardingAnswers | null> {
  const store = await getStore();
  const row = await store.getOne('onboarding_responses', { user_id: userId });
  if (!row) return null;
  return json<OnboardingAnswers | null>(row.answers, null);
}

export async function saveOnboarding(
  userId: string,
  answers: OnboardingAnswers,
): Promise<void> {
  const store = await getStore();
  const completedAt = new Date().toISOString();

  await store.upsert(
    'onboarding_responses',
    { user_id: userId, answers, completed_at: completedAt },
    ['user_id'],
  );
  await store.update('profiles', { id: userId }, { onboarding_completed_at: completedAt });

  // Preferences mirror the answers that drive planning, so the user can adjust
  // them later without redoing the whole questionnaire.
  await savePreferences(userId, {
    hoursPerWeek: answers.hoursPerWeek,
    connectivity: answers.connectivity,
    device: answers.device,
    learningStyle: answers.learningStyle,
  });

  await recordMetric('onboarding_completed');
}

// ---------------------------------------------------------------------------
// Roadmaps & progress
// ---------------------------------------------------------------------------

export async function listRoadmaps(userId: string): Promise<UserRoadmap[]> {
  const store = await getStore();
  const rows = await store.list(
    'user_roadmaps',
    { user_id: userId, archived_at: null },
    { orderBy: { column: 'started_at', ascending: false } },
  );
  return rows.map(toRoadmap);
}

export async function getPrimaryRoadmap(userId: string): Promise<UserRoadmap | null> {
  const roadmaps = await listRoadmaps(userId);
  return roadmaps.find((roadmap) => roadmap.isPrimary) ?? roadmaps[0] ?? null;
}

export async function startRoadmap(
  userId: string,
  pathId: string,
  isPrimary = true,
): Promise<UserRoadmap> {
  const store = await getStore();

  if (isPrimary) {
    await store.update('user_roadmaps', { user_id: userId }, { is_primary: false });
  }

  const row = await store.upsert(
    'user_roadmaps',
    {
      user_id: userId,
      path_id: pathId,
      is_primary: isPrimary,
      started_at: new Date().toISOString(),
      archived_at: null,
    },
    ['user_id', 'path_id'],
  );

  await recordMetric('roadmap_started');
  return toRoadmap(row);
}

export async function listProgress(userId: string): Promise<ProgressEntry[]> {
  const store = await getStore();
  const rows = await store.list('user_progress', { user_id: userId });
  return rows.map(toProgress);
}

export async function completeItem(
  userId: string,
  pathId: string,
  stageId: string,
  itemId: string,
  at = new Date().toISOString(),
): Promise<void> {
  const store = await getStore();
  // Unique on (user_id, item_id), so replaying a queued offline event is a no-op
  // rather than a duplicate.
  await store.upsert(
    'user_progress',
    { user_id: userId, path_id: pathId, stage_id: stageId, item_id: itemId, completed_at: at },
    ['user_id', 'item_id'],
  );
  await recordMetric('task_completed');
}

export async function uncompleteItem(userId: string, itemId: string): Promise<void> {
  const store = await getStore();
  await store.remove('user_progress', { user_id: userId, item_id: itemId });
}

// ---------------------------------------------------------------------------
// Notes & saved resources
// ---------------------------------------------------------------------------

export async function listNotes(userId: string): Promise<UserNote[]> {
  const store = await getStore();
  const rows = await store.list('user_notes', { user_id: userId });
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    scope: str(row.scope, 'stage') as UserNote['scope'],
    refId: str(row.ref_id),
    body: str(row.body),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  }));
}

export async function saveNote(
  userId: string,
  scope: UserNote['scope'],
  refId: string,
  body: string,
): Promise<void> {
  const store = await getStore();
  if (body.trim().length === 0) {
    await store.remove('user_notes', { user_id: userId, scope, ref_id: refId });
    return;
  }
  await store.upsert('user_notes', { user_id: userId, scope, ref_id: refId, body }, [
    'user_id',
    'scope',
    'ref_id',
  ]);
}

export async function listSavedResources(userId: string): Promise<SavedResource[]> {
  const store = await getStore();
  const rows = await store.list('saved_resources', { user_id: userId });
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    resourceId: str(row.resource_id),
    savedAt: str(row.saved_at),
    rating: (nullableStr(row.rating) as SavedResource['rating']) ?? null,
  }));
}

export async function toggleSavedResource(userId: string, resourceId: string): Promise<boolean> {
  const store = await getStore();
  const existing = await store.getOne('saved_resources', {
    user_id: userId,
    resource_id: resourceId,
  });

  if (existing) {
    await store.remove('saved_resources', { user_id: userId, resource_id: resourceId });
    return false;
  }
  await store.upsert(
    'saved_resources',
    { user_id: userId, resource_id: resourceId, saved_at: new Date().toISOString() },
    ['user_id', 'resource_id'],
  );
  return true;
}

export async function rateResource(
  userId: string,
  resourceId: string,
  rating: 'useful' | 'not-useful',
): Promise<void> {
  const store = await getStore();
  await store.upsert(
    'saved_resources',
    { user_id: userId, resource_id: resourceId, rating, saved_at: new Date().toISOString() },
    ['user_id', 'resource_id'],
  );
}

// ---------------------------------------------------------------------------
// Weekly plans
// ---------------------------------------------------------------------------

export async function getWeeklyPlan(userId: string, weekStart: string): Promise<WeeklyPlan | null> {
  const store = await getStore();
  const planRow = await store.getOne('weekly_plans', { user_id: userId, week_start: weekStart });
  if (!planRow) return null;

  const taskRows = await store.list(
    'weekly_tasks',
    { plan_id: str(planRow.id) },
    { orderBy: { column: 'sort_order', ascending: true } },
  );

  return {
    id: str(planRow.id),
    userId: str(planRow.user_id),
    weekStart: str(planRow.week_start),
    pathId: str(planRow.path_id),
    objective: str(planRow.objective),
    hoursTarget: num(planRow.hours_target, 5),
    generatedAt: str(planRow.generated_at),
    tasks: taskRows.map(toWeeklyTask).sort((a, b) => a.day - b.day || a.order - b.order),
  };
}

export async function saveWeeklyPlan(plan: WeeklyPlan): Promise<WeeklyPlan> {
  const store = await getStore();

  const planRow = await store.upsert(
    'weekly_plans',
    {
      user_id: plan.userId,
      week_start: plan.weekStart,
      path_id: plan.pathId,
      objective: plan.objective,
      hours_target: plan.hoursTarget,
      generated_at: plan.generatedAt,
    },
    ['user_id', 'week_start'],
  );
  const planId = str(planRow.id);

  // Regenerating replaces the week wholesale. Completions are re-applied by the
  // caller, which knows which items are already done.
  await store.remove('weekly_tasks', { plan_id: planId });

  const tasks: WeeklyTask[] = [];
  for (const task of plan.tasks) {
    const row = await store.insert('weekly_tasks', {
      plan_id: planId,
      user_id: plan.userId,
      title: task.title,
      description: task.description ?? null,
      kind: task.kind,
      minutes: task.minutes,
      day: task.day,
      path_id: task.pathId,
      stage_id: task.stageId,
      item_id: task.itemId,
      project_id: task.projectId,
      completed_at: task.completedAt,
      sort_order: task.order,
    });
    tasks.push(toWeeklyTask(row));
  }

  await recordMetric('weekly_plan_generated');
  return { ...plan, id: planId, tasks: tasks.sort((a, b) => a.day - b.day || a.order - b.order) };
}

export async function setTaskCompletion(
  userId: string,
  taskId: string,
  done: boolean,
): Promise<void> {
  const store = await getStore();
  await store.update(
    'weekly_tasks',
    { id: taskId, user_id: userId },
    { completed_at: done ? new Date().toISOString() : null },
  );
}

export async function moveTask(userId: string, taskId: string, day: number): Promise<void> {
  const store = await getStore();
  const clamped = Math.max(0, Math.min(6, Math.round(day)));
  await store.update('weekly_tasks', { id: taskId, user_id: userId }, { day: clamped });
}

// ---------------------------------------------------------------------------
// Projects & portfolio
// ---------------------------------------------------------------------------

export async function listUserProjects(userId: string): Promise<UserProject[]> {
  const store = await getStore();
  const rows = await store.list('user_projects', { user_id: userId });
  return rows.map(toUserProject);
}

export async function getUserProject(
  userId: string,
  projectId: string,
): Promise<UserProject | null> {
  const store = await getStore();
  const row = await store.getOne('user_projects', { user_id: userId, project_id: projectId });
  return row ? toUserProject(row) : null;
}

export async function saveUserProject(
  userId: string,
  projectId: string,
  patch: Partial<Omit<UserProject, 'id' | 'userId' | 'projectId'>>,
): Promise<UserProject> {
  const store = await getStore();
  const existing = await getUserProject(userId, projectId);
  const wasComplete = Boolean(existing?.completedAt);

  const row = await store.upsert(
    'user_projects',
    {
      user_id: userId,
      project_id: projectId,
      started_at: existing?.startedAt ?? new Date().toISOString(),
      completed_at: patch.completedAt !== undefined ? patch.completedAt : (existing?.completedAt ?? null),
      work: patch.work ?? existing?.work ?? '',
      evidence_url: patch.evidenceUrl !== undefined ? patch.evidenceUrl : (existing?.evidenceUrl ?? null),
      reflection: patch.reflection ?? existing?.reflection ?? '',
      checklist_done: patch.checklistDone ?? existing?.checklistDone ?? [],
      in_portfolio: patch.inPortfolio ?? existing?.inPortfolio ?? false,
    },
    ['user_id', 'project_id'],
  );

  const saved = toUserProject(row);
  if (!wasComplete && saved.completedAt) await recordMetric('project_completed');
  return saved;
}

// ---------------------------------------------------------------------------
// Job analyses
// ---------------------------------------------------------------------------

function toAnalysis(analysisRow: Row, descriptionRow: Row | null): JobAnalysis {
  const extraction = json<JobAnalysis['extraction']>(analysisRow.extraction, {
    jobTitle: '',
    company: null,
    responsibilities: [],
    requiredSkills: [],
    preferredSkills: [],
    languages: [],
    tools: [],
    education: [],
    experience: [],
    behavioral: [],
    keywords: [],
    interviewThemes: [],
    source: 'rules',
  });

  return {
    id: str(analysisRow.id),
    userId: nullableStr(analysisRow.user_id),
    jobTitle: str(descriptionRow?.job_title, extraction.jobTitle),
    company: nullableStr(descriptionRow?.company),
    rawText: str(descriptionRow?.raw_text),
    extraction,
    comparison: json<JobAnalysis['comparison']>(analysisRow.comparison, null),
    answers: json<JobAnalysis['answers']>(analysisRow.answers, {}),
    createdAt: str(analysisRow.created_at),
  };
}

export async function listAnalyses(userId: string): Promise<JobAnalysis[]> {
  const store = await getStore();
  const analysisRows = await store.list(
    'job_analyses',
    { user_id: userId },
    { orderBy: { column: 'created_at', ascending: false } },
  );

  const results: JobAnalysis[] = [];
  for (const row of analysisRows) {
    const description = await store.getOne('job_descriptions', {
      id: str(row.job_description_id),
    });
    results.push(toAnalysis(row, description));
  }
  return results;
}

export async function getAnalysis(userId: string, id: string): Promise<JobAnalysis | null> {
  const store = await getStore();
  const row = await store.getOne('job_analyses', { id, user_id: userId });
  if (!row) return null;
  const description = await store.getOne('job_descriptions', { id: str(row.job_description_id) });
  return toAnalysis(row, description);
}

export interface SaveAnalysisInput {
  userId: string | null;
  jobTitle: string;
  company: string | null;
  rawText: string;
  extraction: JobAnalysis['extraction'];
  comparison: JobAnalysis['comparison'];
}

export async function saveAnalysis(input: SaveAnalysisInput): Promise<JobAnalysis> {
  const store = await getStore();

  const description = await store.insert('job_descriptions', {
    user_id: input.userId,
    job_title: input.jobTitle,
    company: input.company,
    // A guest's pasted advert is retained only long enough to serve the page;
    // 0003_retention.sql purges it. Storing the text at all is what lets a
    // signed-in user revisit their own analysis.
    raw_text: input.userId ? input.rawText : '',
    source: 'paste',
  });

  // Normalised requirement rows make future querying possible without
  // re-parsing every stored advert.
  const allRequirements = [
    ...input.extraction.requiredSkills,
    ...input.extraction.preferredSkills,
    ...input.extraction.languages,
    ...input.extraction.tools,
    ...input.extraction.education,
    ...input.extraction.experience,
    ...input.extraction.behavioral,
  ];
  for (const requirement of allRequirements) {
    await store.insert('job_requirements', {
      job_description_id: str(description.id),
      kind: requirement.kind,
      label: requirement.label,
      evidence: requirement.evidence,
      skill_id: requirement.skillId ?? null,
      confidence: requirement.confidence,
    });
  }

  const analysis = await store.insert('job_analyses', {
    user_id: input.userId,
    job_description_id: str(description.id),
    extraction: input.extraction,
    comparison: input.comparison,
    answers: {},
    readiness_score: input.comparison?.readiness.score ?? null,
    engine: input.extraction.source,
  });

  await recordMetric('job_analysis_run');
  return toAnalysis(analysis, description);
}

export async function saveAnalysisAnswers(
  userId: string,
  analysisId: string,
  answers: JobAnalysis['answers'],
): Promise<void> {
  const store = await getStore();
  await store.update('job_analyses', { id: analysisId, user_id: userId }, { answers });
}

export async function deleteAnalysis(userId: string, analysisId: string): Promise<void> {
  const store = await getStore();
  const row = await store.getOne('job_analyses', { id: analysisId, user_id: userId });
  if (!row) return;
  await store.remove('job_analyses', { id: analysisId, user_id: userId });
  await store.remove('job_descriptions', { id: str(row.job_description_id), user_id: userId });
}

// ---------------------------------------------------------------------------
// Skill gaps
// ---------------------------------------------------------------------------

export async function listSkillGaps(userId: string): Promise<SkillGapEntry[]> {
  const store = await getStore();
  const rows = await store.list('skill_gaps', { user_id: userId });
  return rows
    .map((row) => ({
      id: str(row.id),
      userId: str(row.user_id),
      label: str(row.label),
      skillId: nullableStr(row.skill_id),
      occurrences: num(row.occurrences, 1),
      status: str(row.status, 'todo') as SkillGapEntry['status'],
      pathId: nullableStr(row.path_id),
      updatedAt: str(row.updated_at),
    }))
    .sort((a, b) => b.occurrences - a.occurrences || a.label.localeCompare(b.label, 'fr'));
}

export async function replaceSkillGaps(
  userId: string,
  entries: SkillGapEntry[],
): Promise<void> {
  const store = await getStore();
  for (const entry of entries) {
    await store.upsert(
      'skill_gaps',
      {
        user_id: userId,
        label: entry.label,
        skill_id: entry.skillId,
        occurrences: entry.occurrences,
        status: entry.status,
        path_id: entry.pathId,
      },
      ['user_id', 'label'],
    );
  }
}

export async function setSkillGapStatus(
  userId: string,
  label: string,
  status: SkillGapEntry['status'],
): Promise<void> {
  const store = await getStore();
  await store.update('skill_gaps', { user_id: userId, label }, { status });
}

// ---------------------------------------------------------------------------
// Job-readiness workspaces
// ---------------------------------------------------------------------------

export async function getValueProposition(userId: string): Promise<ValueProposition | null> {
  const store = await getStore();
  const row = await store.getOne('value_propositions', { user_id: userId });
  if (!row) return null;
  return {
    id: str(row.id),
    userId: str(row.user_id),
    input: json<ValuePropositionInput>(row.input, {
      problem: '',
      skills: '',
      results: '',
      proof: '',
      approach: '',
      motivation: '',
    }),
    output: json<ValuePropositionOutput>(row.output, {
      pitch: '',
      cvSummary: '',
      tellMeAboutYou: '',
      whyHireYou: '',
      roleStatement: '',
      source: 'rules',
    }),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

export async function saveValueProposition(
  userId: string,
  input: ValuePropositionInput,
  output: ValuePropositionOutput,
): Promise<void> {
  const store = await getStore();
  const existed = await store.getOne('value_propositions', { user_id: userId });
  await store.upsert(
    'value_propositions',
    { user_id: userId, input, output, engine: output.source },
    ['user_id'],
  );
  if (!existed) await recordMetric('value_prop_created');
}

export async function listInterviewAnswers(userId: string): Promise<InterviewAnswer[]> {
  const store = await getStore();
  const rows = await store.list('interview_practice_answers', { user_id: userId });
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    questionId: str(row.question_id),
    body: str(row.body),
    updatedAt: str(row.updated_at),
  }));
}

export async function saveInterviewAnswer(
  userId: string,
  questionId: string,
  body: string,
): Promise<void> {
  const store = await getStore();
  if (body.trim().length === 0) {
    await store.remove('interview_practice_answers', { user_id: userId, question_id: questionId });
    return;
  }
  await store.upsert(
    'interview_practice_answers',
    { user_id: userId, question_id: questionId, body },
    ['user_id', 'question_id'],
  );
  await recordMetric('interview_answer_saved');
}

export async function listStarExamples(userId: string): Promise<StarExample[]> {
  const store = await getStore();
  const rows = await store.list(
    'star_examples',
    { user_id: userId },
    { orderBy: { column: 'created_at', ascending: true } },
  );
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    label: str(row.label),
    situation: str(row.situation),
    task: str(row.task),
    action: str(row.action),
    result: str(row.result),
    updatedAt: str(row.updated_at),
  }));
}

export async function saveStarExample(
  userId: string,
  example: Omit<StarExample, 'userId' | 'updatedAt'>,
): Promise<void> {
  const store = await getStore();
  const payload: Row = {
    user_id: userId,
    label: example.label,
    situation: example.situation,
    task: example.task,
    action: example.action,
    result: example.result,
  };
  if (example.id) {
    const updated = await store.update('star_examples', { id: example.id, user_id: userId }, payload);
    if (updated.length > 0) return;
  }
  await store.insert('star_examples', payload);
}

export async function deleteStarExample(userId: string, id: string): Promise<void> {
  const store = await getStore();
  await store.remove('star_examples', { id, user_id: userId });
}

export async function getConfidenceWork(userId: string): Promise<ConfidenceWork | null> {
  const store = await getStore();
  const row = await store.getOne('confidence_work', { user_id: userId });
  if (!row) return null;
  return {
    id: str(row.id),
    userId: str(row.user_id),
    fearedQuestion: str(row.feared_question),
    preparedAnswer: str(row.prepared_answer),
    evidence: str(row.evidence),
    updatedAt: str(row.updated_at),
  };
}

export async function saveConfidenceWork(
  userId: string,
  patch: { fearedQuestion: string; preparedAnswer: string; evidence: string },
): Promise<void> {
  const store = await getStore();
  await store.upsert(
    'confidence_work',
    {
      user_id: userId,
      feared_question: patch.fearedQuestion,
      prepared_answer: patch.preparedAnswer,
      evidence: patch.evidence,
    },
    ['user_id'],
  );
}

export async function getCvProfile(userId: string): Promise<CvProfile | null> {
  const store = await getStore();
  const row = await store.getOne('cv_profiles', { user_id: userId });
  if (!row) return null;
  return {
    id: str(row.id),
    userId: str(row.user_id),
    fullName: str(row.full_name),
    headline: str(row.headline),
    summary: str(row.summary),
    phone: str(row.phone),
    city: str(row.city),
    experiences: json<CvProfile['experiences']>(row.experiences, []),
    education: json<CvProfile['education']>(row.education, []),
    languages: json<CvProfile['languages']>(row.languages, []),
    skills: json<string[]>(row.skills, []),
    tools: json<string[]>(row.tools, []),
    projects: json<string[]>(row.projects, []),
    extras: str(row.extras),
    updatedAt: str(row.updated_at),
  };
}

export async function saveCvProfile(
  userId: string,
  cv: Omit<CvProfile, 'id' | 'userId' | 'updatedAt'>,
): Promise<void> {
  const store = await getStore();
  await store.upsert(
    'cv_profiles',
    {
      user_id: userId,
      full_name: cv.fullName,
      headline: cv.headline,
      summary: cv.summary,
      phone: cv.phone,
      city: cv.city,
      experiences: cv.experiences,
      education: cv.education,
      languages: cv.languages,
      skills: cv.skills,
      tools: cv.tools,
      projects: cv.projects,
      extras: cv.extras,
    },
    ['user_id'],
  );
}

export async function listChecklistStates(userId: string): Promise<ChecklistState[]> {
  const store = await getStore();
  const rows = await store.list('checklist_states', { user_id: userId });
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    checklistId: str(row.checklist_id),
    doneItemIds: json<string[]>(row.done_item_ids, []),
    updatedAt: str(row.updated_at),
  }));
}

export async function saveChecklistState(
  userId: string,
  checklistId: string,
  doneItemIds: string[],
): Promise<void> {
  const store = await getStore();
  await store.upsert(
    'checklist_states',
    { user_id: userId, checklist_id: checklistId, done_item_ids: doneItemIds },
    ['user_id', 'checklist_id'],
  );
}

export async function listEmployerResearch(userId: string): Promise<EmployerResearch[]> {
  const store = await getStore();
  const rows = await store.list(
    'employer_research',
    { user_id: userId },
    { orderBy: { column: 'updated_at', ascending: false } },
  );
  return rows.map((row) => ({
    id: str(row.id),
    userId: str(row.user_id),
    company: str(row.company),
    notes: str(row.notes),
    doneItemIds: json<string[]>(row.done_item_ids, []),
    updatedAt: str(row.updated_at),
  }));
}

export async function saveEmployerResearch(
  userId: string,
  company: string,
  patch: { notes: string; doneItemIds: string[] },
): Promise<void> {
  const store = await getStore();
  await store.upsert(
    'employer_research',
    {
      user_id: userId,
      company: company.trim() || 'Entreprise',
      notes: patch.notes,
      done_item_ids: patch.doneItemIds,
    },
    ['user_id', 'company'],
  );
}

// ---------------------------------------------------------------------------
// Feedback & metrics
// ---------------------------------------------------------------------------

export async function createFeedback(
  type: Feedback['type'],
  message: string,
  email: string | null,
): Promise<void> {
  const store = await getStore();
  await store.insert('feedback', { type, message, email });
}

export async function listFeedback(limit = 100): Promise<Feedback[]> {
  const store = await getStore();
  const rows = await store.list(
    'feedback',
    {},
    { orderBy: { column: 'created_at', ascending: false }, limit },
  );
  return rows.map((row) => ({
    id: str(row.id),
    type: str(row.type, 'autre') as Feedback['type'],
    message: str(row.message),
    email: nullableStr(row.email),
    createdAt: str(row.created_at),
  }));
}

/**
 * Increments an aggregate counter. Never throws into the caller: a metric is
 * never worth failing a user action for.
 */
export async function recordMetric(event: MetricEvent): Promise<void> {
  try {
    const store = await getStore();
    await store.incrementCounter(event);
  } catch {
    // Intentionally swallowed.
  }
}

export async function listMetrics(): Promise<Record<string, number>> {
  const store = await getStore();
  const rows = await store.list('metric_counters');
  const result: Record<string, number> = {};
  for (const row of rows) result[str(row.event)] = num(row.count);
  return result;
}

// ---------------------------------------------------------------------------
// Account lifecycle
// ---------------------------------------------------------------------------

export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [
    profile,
    preferences,
    onboarding,
    roadmaps,
    progress,
    notes,
    saved,
    projects,
    analyses,
    gaps,
    valueProposition,
    interviewAnswers,
    starExamples,
    confidence,
    cv,
    checklists,
    employers,
  ] = await Promise.all([
    getProfile(userId),
    getPreferences(userId),
    getOnboarding(userId),
    listRoadmaps(userId),
    listProgress(userId),
    listNotes(userId),
    listSavedResources(userId),
    listUserProjects(userId),
    listAnalyses(userId),
    listSkillGaps(userId),
    getValueProposition(userId),
    listInterviewAnswers(userId),
    listStarExamples(userId),
    getConfidenceWork(userId),
    getCvProfile(userId),
    listChecklistStates(userId),
    listEmployerResearch(userId),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    notice:
      'Export complet de vos donnees. Ce fichier contient tout ce que la plateforme conserve a votre sujet.',
    profile,
    preferences,
    onboarding,
    roadmaps,
    progress,
    notes,
    savedResources: saved,
    projects,
    jobAnalyses: analyses,
    skillGaps: gaps,
    valueProposition,
    interviewAnswers,
    starExamples,
    confidenceWork: confidence,
    cv,
    checklists,
    employerResearch: employers,
  };
}

export async function deleteAccount(userId: string): Promise<void> {
  if (dataConfig.driver === 'supabase') {
    const client = await createRequestClient();
    const { error } = await client.rpc('delete_account', { target: userId });
    if (error) throw new Error(error.message);
    await client.auth.signOut();
    return;
  }
  await localStore().deleteAccount(userId);
}
