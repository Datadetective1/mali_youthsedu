import { CheckCircle2, FileCheck2, ListTodo, Lock, Target, Wrench } from 'lucide-react';
import type { RoadmapStage } from '@/lib/types';
import { skillById } from '@/content/skills';
import { Badge } from '@/components/ui';
import { accentFor } from '@/components/visual/accent';
import { cn, formatMinutes } from '@/lib/utils';

/**
 * The visible face of a stage.
 *
 * Stages used to render as a collapsed row showing only a title and a
 * duration. Users scrolled a pathway, saw "Étape 1, Étape 2, Étape 3…" and
 * concluded the pathway was empty — the objective, the tasks, the resources and
 * the practical exercise were all real, and all hidden behind a chevron that
 * did not read as tappable.
 *
 * So the summary now carries actual content: what the stage is for, which
 * skills it builds, how much work it is, and what you walk away with. Expanding
 * adds the detail; it is no longer the only way to see that detail exists.
 */
export function StagePreview({
  stage,
  pathId,
  resourceCount,
  progress,
  locked = false,
}: {
  stage: RoadmapStage;
  pathId: string;
  resourceCount: number;
  progress?: { done: number; total: number };
  locked?: boolean;
}) {
  const accent = accentFor(pathId);
  const complete = progress ? progress.done >= progress.total && progress.total > 0 : false;
  const started = progress ? progress.done > 0 : false;

  return (
    <div className="w-full text-left">
      <div className="flex items-start gap-3">
        {/* Large, unmistakable stage number — the strongest visual anchor on
            the page, and what makes a long pathway feel navigable. */}
        <span
          aria-hidden
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl text-lg font-black',
            complete ? 'bg-success-600 text-white' : locked ? 'bg-sand-200 text-sand-500' : accent.tile,
          )}
        >
          {complete ? <CheckCircle2 className="size-6" /> : locked ? <Lock className="size-5" /> : stage.order}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold uppercase tracking-wide text-sand-500">
            Étape {stage.order}
            {complete ? ' · terminée' : started ? ' · en cours' : ''}
          </span>
          <span className="mt-0.5 block text-base font-bold leading-snug text-sand-900">
            {stage.name}
          </span>

          {/* The objective, visible without expanding. This single line is what
              tells someone whether the stage is worth their evening. */}
          <span className="mt-1.5 flex gap-1.5 text-sm text-sand-600">
            <Target aria-hidden className="mt-0.5 size-4 shrink-0 text-sand-400" />
            <span className="min-w-0">{stage.objective}</span>
          </span>
        </span>
      </div>

      {/* Skills built here. */}
      {stage.skillIds.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {stage.skillIds.slice(0, 4).map((skillId) => (
            <li key={skillId}>
              <Badge tone="neutral">{skillById.get(skillId)?.name ?? skillId}</Badge>
            </li>
          ))}
          {stage.skillIds.length > 4 ? (
            <li>
              <Badge tone="neutral">+{stage.skillIds.length - 4}</Badge>
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* What is actually inside — the counts that prove the stage is not empty. */}
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-sand-600">
        <div className="flex items-center gap-1.5">
          <ListTodo aria-hidden className="size-4 text-sand-400" />
          <dt className="sr-only">Tâches</dt>
          <dd>
            {progress ? `${progress.done}/${progress.total}` : stage.items.length} tâches
          </dd>
        </div>

        {resourceCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <FileCheck2 aria-hidden className="size-4 text-sand-400" />
            <dt className="sr-only">Ressources</dt>
            <dd>{resourceCount} ressources</dd>
          </div>
        ) : null}

        <div className="flex items-center gap-1.5">
          <Wrench aria-hidden className="size-4 text-sand-400" />
          <dt className="sr-only">Exercice</dt>
          <dd>1 exercice pratique</dd>
        </div>

        <div className="flex items-center gap-1.5">
          <span aria-hidden className="text-sand-400">
            ⏱
          </span>
          <dt className="sr-only">Durée</dt>
          <dd>{formatMinutes(stage.estimatedMinutes)}</dd>
        </div>
      </dl>

      {/* The evidence produced — the reason to do the stage at all. */}
      <p className={cn('mt-3 rounded-lg p-2.5 text-sm', accent.wash)}>
        <span className="font-semibold">Vous produirez : </span>
        <span className="text-sand-700">{stage.evidence}</span>
      </p>

      {progress && progress.total > 0 ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
          <div
            className={cn('h-full rounded-full', complete ? 'bg-success-600' : accent.bar)}
            style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
