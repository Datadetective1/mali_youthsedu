import type { Metadata } from 'next';
import { CheckCircle2, Lock } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { requireSession } from '@/lib/auth';
import { listNotes, listProgress, listRoadmaps } from '@/lib/db/repository';
import { computePathProgress } from '@/lib/engine/progress';
import { pathById } from '@/content/paths';
import { resourcesByIds } from '@/content/resources';
import { skillById } from '@/content/skills';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Badge, Disclosure, EmptyState, Notice, ProgressBar, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { StagePanel } from '@/components/roadmap/stage-panel';
import { SaveOfflineButton } from '@/components/offline/save-offline-button';
import { formatMinutes } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.roadmap.metaTitle, robots: { index: false } };
}

export default async function MyPathPage({
  searchParams,
}: {
  searchParams: Promise<{ parcours?: string }>;
}) {
  const t = await getDictionary();
  const session = await requireSession('/mon-parcours');
  const { parcours } = await searchParams;

  const [roadmaps, progress, notes] = await Promise.all([
    listRoadmaps(session.userId),
    listProgress(session.userId),
    listNotes(session.userId),
  ]);

  if (roadmaps.length === 0) {
    return (
      <PageShell>
        <PageHeader title={t.roadmap.title} />
        <EmptyState
          title={t.roadmap.noneTitle}
          description={t.roadmap.noneBody}
          action={<ButtonLink href="/parcours">{t.nav.explore}</ButtonLink>}
        />
      </PageShell>
    );
  }

  const selected =
    roadmaps.find((roadmap) => roadmap.pathId === parcours) ??
    roadmaps.find((roadmap) => roadmap.isPrimary) ??
    roadmaps[0]!;
  const path = pathById.get(selected.pathId);

  if (!path) {
    return (
      <PageShell>
        <PageHeader title={t.roadmap.title} />
        <Notice tone="danger">{t.errors.notFoundBody}</Notice>
      </PageShell>
    );
  }

  const pathProgress = computePathProgress(path, progress);
  const notesByStage = new Map(
    notes.filter((note) => note.scope === 'stage').map((note) => [note.refId, note.body]),
  );

  const stageLabels = {
    stageLabel: t.roadmap.stageLabel(1),
    objective: t.roadmap.objective,
    skills: t.roadmap.skillsDeveloped,
    resources: t.roadmap.resources,
    practicalExercise: t.roadmap.practicalExercise,
    checklist: t.roadmap.checklist,
    reflection: t.roadmap.reflection,
    reflectionHint: t.roadmap.reflectionHint,
    evidence: t.roadmap.evidence,
    evidenceHint: t.roadmap.evidenceHint,
    knowledgeCheck: t.roadmap.knowledgeCheck,
    knowledgeCheckHint: t.roadmap.knowledgeCheckHint,
    checkAnswer: t.roadmap.checkAnswer,
    correct: t.roadmap.correct,
    incorrect: t.roadmap.incorrect,
    explanation: t.roadmap.explanation,
    myNotes: t.roadmap.myNotes,
    notesPlaceholder: t.roadmap.notesPlaceholder,
    notesSaved: t.roadmap.notesSaved,
    save: t.actions.save,
    saving: t.actions.saving,
    locked: t.roadmap.stageLocked,
    unlockAnyway: t.roadmap.unlockAnyway,
    progressLabel: t.labels.progress,
    deliverable: t.projects.deliverable,
    offlineQueued: t.offline.pendingChanges(1),
  };

  return (
    <PageShell>
      <PageHeader
        title={path.name}
        description={path.summary}
        actions={
          <SaveOfflineButton
            urls={['/mon-parcours', '/plan-semaine']}
            labels={{
              save: t.offline.saveForOffline,
              saved: t.offline.savedForOffline,
              saving: t.offline.savingForOffline,
              remove: t.offline.removeFromOffline,
              unsupported: t.legal.accessibility.limits[0] ?? '',
            }}
          />
        }
      />

      {path.caution ? (
        <Notice tone="warning" title={t.labels.important} className="mb-6">
          {path.caution}
        </Notice>
      ) : null}

      <ProgressBar
        className="mb-6"
        value={pathProgress.done}
        total={pathProgress.total}
        label={t.dashboard.overallProgress}
      />

      {roadmaps.length > 1 ? (
        <nav aria-label={t.roadmap.changeRoadmap} className="mb-6 flex flex-wrap gap-2">
          {roadmaps.map((roadmap) => {
            const candidate = pathById.get(roadmap.pathId);
            if (!candidate) return null;
            const active = roadmap.pathId === selected.pathId;
            return (
              <ButtonLink
                key={roadmap.id}
                href={`/mon-parcours?parcours=${roadmap.pathId}`}
                size="sm"
                variant={active ? 'primary' : 'quiet'}
              >
                {candidate.name}
              </ButtonLink>
            );
          })}
        </nav>
      ) : null}

      {pathProgress.status === 'completed' ? (
        <Notice tone="success" title={t.roadmap.allStagesDoneTitle} className="mb-6">
          <p>{t.roadmap.allStagesDoneBody}</p>
          <ButtonLink href="/projets" size="sm" className="mt-3">
            {t.roadmap.viewPortfolio}
          </ButtonLink>
        </Notice>
      ) : null}

      <Section title={t.roadmap.stagesTitle}>
        <ol className="space-y-3">
          {path.stages.map((stage) => {
            const stageState = pathProgress.stages.find((entry) => entry.stageId === stage.id);
            const complete = stageState?.status === 'completed';
            const isNext = pathProgress.nextStageId === stage.id;

            return (
              <li key={stage.id}>
                <Disclosure
                  defaultOpen={isNext}
                  summary={
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {complete ? (
                        <CheckCircle2 aria-hidden className="size-5 text-success-600" />
                      ) : stageState?.locked ? (
                        <Lock aria-hidden className="size-4 text-sand-400" />
                      ) : null}
                      <span className="text-sm font-semibold text-brand-700">
                        {t.roadmap.stageLabel(stage.order)}
                      </span>
                      <span>{stage.name}</span>
                      <span className="text-sm font-normal text-sand-500">
                        {stageState ? `${stageState.done}/${stageState.total}` : ''} ·{' '}
                        {formatMinutes(stage.estimatedMinutes)}
                      </span>
                      {isNext ? (
                        <Badge tone="accent" className="ml-1">
                          {t.roadmap.resumeHere}
                        </Badge>
                      ) : null}
                    </span>
                  }
                >
                  <StagePanel
                    stage={stage}
                    pathId={path.id}
                    resources={resourcesByIds(stage.resourceIds)}
                    completedItemIds={progress
                      .filter((entry) => entry.stageId === stage.id)
                      .map((entry) => entry.itemId)}
                    initialNote={notesByStage.get(stage.id) ?? ''}
                    locked={Boolean(stageState?.locked)}
                    skillNames={stage.skillIds.map(
                      (skillId) => skillById.get(skillId)?.name ?? skillId,
                    )}
                    labels={stageLabels}
                  />
                </Disclosure>
              </li>
            );
          })}
        </ol>
      </Section>

      <div className="mt-8">
        <ButtonLink href="/parcours" variant="ghost">
          {t.roadmap.changeRoadmap}
        </ButtonLink>
      </div>
    </PageShell>
  );
}
