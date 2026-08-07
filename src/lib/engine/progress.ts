import type { CareerPath, ProgressEntry, ProgressStatus, RoadmapStage } from '@/lib/types';
import { percent } from '@/lib/utils';

/**
 * Progress calculation.
 *
 * A single source of truth: a roadmap item is complete if and only if a
 * `ProgressEntry` exists for it. Nothing is derived from timestamps or ordering,
 * which keeps the offline queue simple — replaying an "item completed" event is
 * idempotent.
 */

export interface StageProgress {
  stageId: string;
  done: number;
  total: number;
  percent: number;
  status: ProgressStatus;
  /** True when the previous stage is unfinished. Advisory: the user may override. */
  locked: boolean;
}

export interface PathProgress {
  pathId: string;
  done: number;
  total: number;
  percent: number;
  status: ProgressStatus;
  stages: StageProgress[];
  /** Where "Reprendre" should send the user. */
  nextStageId: string | null;
  nextItemId: string | null;
}

export function completedItemIds(entries: ProgressEntry[], pathId: string): Set<string> {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (entry.pathId === pathId) ids.add(entry.itemId);
  }
  return ids;
}

function statusOf(done: number, total: number): ProgressStatus {
  if (total === 0 || done === 0) return done === 0 ? 'not-started' : 'in-progress';
  if (done >= total) return 'completed';
  return 'in-progress';
}

export function stageProgress(stage: RoadmapStage, completed: Set<string>): Omit<StageProgress, 'locked'> {
  const total = stage.items.length;
  const done = stage.items.filter((item) => completed.has(item.id)).length;
  return {
    stageId: stage.id,
    done,
    total,
    percent: percent(done, total),
    status: statusOf(done, total),
  };
}

export function computePathProgress(path: CareerPath, entries: ProgressEntry[]): PathProgress {
  const completed = completedItemIds(entries, path.id);

  let previousComplete = true;
  const stages: StageProgress[] = path.stages.map((stage) => {
    const base = stageProgress(stage, completed);
    const locked = !previousComplete && base.done === 0;
    previousComplete = base.status === 'completed';
    return { ...base, locked };
  });

  const total = stages.reduce((sum, stage) => sum + stage.total, 0);
  const done = stages.reduce((sum, stage) => sum + stage.done, 0);

  // Next action = first incomplete item in document order. Deterministic, so
  // "Reprendre" always lands in the same place until something changes.
  let nextStageId: string | null = null;
  let nextItemId: string | null = null;
  outer: for (const stage of path.stages) {
    for (const item of stage.items) {
      if (!completed.has(item.id)) {
        nextStageId = stage.id;
        nextItemId = item.id;
        break outer;
      }
    }
  }

  return {
    pathId: path.id,
    done,
    total,
    percent: percent(done, total),
    status: statusOf(done, total),
    stages,
    nextStageId,
    nextItemId,
  };
}

/**
 * Job-readiness progress.
 *
 * Deliberately measures preparation work done, never predicted hiring odds.
 * Each component is a simple "have you done this at all" signal, because a
 * finer-grained score would imply a precision we do not have.
 */
export interface ReadinessProgressInput {
  hasCv: boolean;
  cvLinesMastered: boolean;
  analysesRun: number;
  hasValueProposition: boolean;
  interviewAnswersWritten: number;
  starExamples: number;
  employerResearchDone: boolean;
  checklistsCompleted: number;
  projectsCompleted: number;
}

export interface ReadinessProgressComponent {
  key: keyof ReadinessProgressInput;
  label: string;
  done: boolean;
  hint: string;
}

export function jobReadinessProgress(input: ReadinessProgressInput): {
  percent: number;
  components: ReadinessProgressComponent[];
} {
  const components: ReadinessProgressComponent[] = [
    {
      key: 'hasCv',
      label: 'CV rédigé',
      done: input.hasCv,
      hint: 'Un CV d’une page, exportable en PDF.',
    },
    {
      key: 'cvLinesMastered',
      label: 'CV maîtrisé',
      done: input.cvLinesMastered,
      hint: 'Vous pouvez défendre chaque ligne de votre CV.',
    },
    {
      key: 'analysesRun',
      label: 'Offre analysée',
      done: input.analysesRun > 0,
      hint: 'Au moins une offre décortiquée exigence par exigence.',
    },
    {
      key: 'hasValueProposition',
      label: 'Proposition de valeur',
      done: input.hasValueProposition,
      hint: 'Vous savez expliquer ce que vous apportez.',
    },
    {
      key: 'interviewAnswersWritten',
      label: 'Réponses d’entretien préparées',
      done: input.interviewAnswersWritten >= 5,
      hint: 'Au moins cinq réponses rédigées.',
    },
    {
      key: 'starExamples',
      label: 'Exemples STAR',
      done: input.starExamples >= 3,
      hint: 'Trois exemples réutilisables : réussite, difficulté, équipe.',
    },
    {
      key: 'employerResearchDone',
      label: 'Employeur étudié',
      done: input.employerResearchDone,
      hint: 'Vous savez ce que fait l’entreprise et pourquoi elle vous intéresse.',
    },
    {
      key: 'checklistsCompleted',
      label: 'Check-lists parcourues',
      done: input.checklistsCompleted >= 2,
      hint: 'Préparation générale et maîtrise du CV.',
    },
    {
      key: 'projectsCompleted',
      label: 'Preuve de travail',
      done: input.projectsCompleted > 0,
      hint: 'Au moins un projet pratique terminé et montrable.',
    },
  ];

  const done = components.filter((component) => component.done).length;
  return { percent: percent(done, components.length), components };
}
