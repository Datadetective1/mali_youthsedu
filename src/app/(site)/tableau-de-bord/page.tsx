import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Briefcase,
  CalendarDays,
  FolderCheck,
  Sparkles,
} from 'lucide-react';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import {
  getPrimaryRoadmap,
  getWeeklyPlan,
  listAnalyses,
  listChecklistStates,
  listInterviewAnswers,
  listProgress,
  listSavedResources,
  listStarExamples,
  listUserProjects,
  getCvProfile,
  getValueProposition,
  listEmployerResearch,
} from '@/lib/db/repository';
import { computePathProgress, jobReadinessProgress } from '@/lib/engine/progress';
import { planCompletion } from '@/lib/engine/weekly-plan';
import { pathById } from '@/content/paths';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Badge, Card, CardBody, EmptyState, Notice, ProgressBar, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { InstallPrompt } from '@/components/offline/install-prompt';
import { createRng, startOfIsoWeek } from '@/lib/utils';
import { format } from '@/lib/i18n/format';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.dashboard.metaTitle, robots: { index: false } };
}

export default async function DashboardPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await getSession();
  if (!session) redirect(`/connexion?suivant=${encodeURIComponent('/tableau-de-bord')}`);
  const weekStart = startOfIsoWeek(new Date());

  const [
    roadmap,
    progress,
    plan,
    savedResources,
    projects,
    analyses,
    interviewAnswers,
    starExamples,
    checklists,
    cv,
    valueProp,
    employers,
  ] = await Promise.all([
    getPrimaryRoadmap(session.userId),
    listProgress(session.userId),
    getWeeklyPlan(session.userId, weekStart),
    listSavedResources(session.userId),
    listUserProjects(session.userId),
    listAnalyses(session.userId),
    listInterviewAnswers(session.userId),
    listStarExamples(session.userId),
    listChecklistStates(session.userId),
    getCvProfile(session.userId),
    getValueProposition(session.userId),
    listEmployerResearch(session.userId),
  ]);

  const path = roadmap ? pathById.get(roadmap.pathId) : null;
  const pathProgress = path ? computePathProgress(path, progress) : null;
  const completedProjects = projects.filter((project) => project.completedAt);

  const readiness = jobReadinessProgress({
    hasCv: Boolean(cv && cv.headline.trim().length > 0),
    cvLinesMastered: checklists.some(
      (state) => state.checklistId === 'chk-cv-mastery' && state.doneItemIds.length >= 6,
    ),
    analysesRun: analyses.length,
    hasValueProposition: Boolean(valueProp),
    interviewAnswersWritten: interviewAnswers.length,
    starExamples: starExamples.length,
    employerResearchDone: employers.some((entry) => entry.notes.trim().length > 0),
    checklistsCompleted: checklists.filter((state) => state.doneItemIds.length > 0).length,
    projectsCompleted: completedProjects.length,
  });

  // Rotates weekly rather than on every load: an encouragement that changes on
  // each refresh reads as noise, and one that never changes stops being read.
  const encouragement =
    t.dashboard.encouragements[
      Math.floor(createRng(`${session.userId}:${weekStart}`)() * t.dashboard.encouragements.length)
    ] ?? t.dashboard.encouragements[0];

  const nextStage = pathProgress?.nextStageId
    ? path?.stages.find((stage) => stage.id === pathProgress.nextStageId)
    : null;
  const nextItem = nextStage?.items.find((item) => item.id === pathProgress?.nextItemId);

  return (
    <PageShell width="wide">
      <PageHeader
        title={format(t.dashboard.greeting, { name: session.displayName || '' })}
        description={t.dashboard.subtitle}
      />

      {!path ? (
        <EmptyState
          icon={<Sparkles className="size-10" />}
          title={t.dashboard.noRoadmapTitle}
          description={t.dashboard.noRoadmapBody}
          action={<ButtonLink href="/bienvenue">{t.dashboard.noRoadmapCta}</ButtonLink>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          {/* ------------------------------------------------------- Main column */}
          <div className="space-y-6">
            <Card>
              <CardBody>
                <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                  {t.dashboard.currentRoadmap}
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  <Link href="/mon-parcours" className="hover:text-brand-800">
                    {path.name}
                  </Link>
                </h2>

                {pathProgress ? (
                  <ProgressBar
                    className="mt-4"
                    value={pathProgress.done}
                    total={pathProgress.total}
                    label={t.dashboard.overallProgress}
                  />
                ) : null}

                {nextItem && nextStage ? (
                  <div className="mt-5 rounded-lg bg-brand-50 p-4">
                    <p className="text-sm font-semibold text-brand-800">
                      {t.dashboard.nextAction}
                    </p>
                    <p className="mt-1 font-medium text-brand-900">{nextItem.title}</p>
                    <p className="mt-0.5 text-sm text-brand-800">
                      {format(t.roadmap.stageLabel, { n: nextStage.order })} · {nextStage.name}
                    </p>
                    <ButtonLink href="/mon-parcours" size="sm" className="mt-3">
                      {t.dashboard.resumeAction}
                      <ArrowRight aria-hidden />
                    </ButtonLink>
                  </div>
                ) : (
                  <Notice tone="success" className="mt-5">
                    {t.dashboard.nextActionEmpty}
                  </Notice>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                      {t.dashboard.weeklyObjective}
                    </p>
                    <p className="mt-1 font-medium text-sand-900">
                      {plan?.objective ?? t.weekly.emptyBody}
                    </p>
                  </div>
                  <Badge tone="neutral">
                    <CalendarDays aria-hidden className="size-3" />
                    {format(t.weekly.weekOf, {
                      date: formatDate(weekStart, locale, { day: 'numeric', month: 'long' }),
                    })}
                  </Badge>
                </div>

                {plan ? (
                  <>
                    <ProgressBar
                      className="mt-4"
                      tone="accent"
                      value={planCompletion(plan).done}
                      total={planCompletion(plan).total}
                      label={t.weekly.tasks}
                    />
                    <ButtonLink href="/plan-semaine" variant="secondary" size="sm" className="mt-4">
                      {t.nav.weeklyPlan}
                    </ButtonLink>
                  </>
                ) : (
                  <ButtonLink href="/plan-semaine" size="sm" className="mt-4">
                    {t.weekly.generate}
                  </ButtonLink>
                )}
              </CardBody>
            </Card>

            <Section title={t.dashboard.statsTitle}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile
                  icon={<BookOpen aria-hidden className="size-5" />}
                  label={t.dashboard.statTasksDone}
                  value={progress.length}
                />
                <StatTile
                  icon={<FolderCheck aria-hidden className="size-5" />}
                  label={t.dashboard.statProjectsDone}
                  value={completedProjects.length}
                />
                <StatTile
                  icon={<Briefcase aria-hidden className="size-5" />}
                  label={t.dashboard.statAnalyses}
                  value={analyses.length}
                />
                <StatTile
                  icon={<Bookmark aria-hidden className="size-5" />}
                  label={t.dashboard.savedResources}
                  value={savedResources.length}
                />
              </div>
            </Section>
          </div>

          {/* ------------------------------------------------------ Side column */}
          <div className="space-y-6">
            <InstallPrompt
              title={t.offline.installTitle}
              body={t.offline.installBody}
              action={t.offline.installAction}
              later={t.offline.installLater}
              iosHint={t.offline.installIosHint}
            />

            <Card>
              <CardBody>
                <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                  {t.dashboard.jobReadiness}
                </p>
                <ProgressBar
                  className="mt-3"
                  value={readiness.components.filter((component) => component.done).length}
                  total={readiness.components.length}
                  label={t.center.progressTitle}
                />
                <p className="mt-2 text-sm text-sand-500">{t.center.progressHint}</p>

                <ul className="mt-4 space-y-1.5 text-sm">
                  {readiness.components.slice(0, 5).map((component) => (
                    <li key={component.key} className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={
                          component.done
                            ? 'size-2 shrink-0 rounded-full bg-success-600'
                            : 'size-2 shrink-0 rounded-full bg-sand-300'
                        }
                      />
                      <span className={component.done ? 'text-sand-500' : 'text-sand-800'}>
                        {component.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <ButtonLink href="/preparation-emploi" size="sm" className="mt-4" block>
                  {readiness.percent === 0
                    ? t.dashboard.jobReadinessCta
                    : t.center.title}
                </ButtonLink>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                  {t.dashboard.encouragementTitle}
                </p>
                <p className="mt-2 text-sand-700">{encouragement}</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                  {t.dashboard.quickLinks}
                </p>
                <ul className="mt-3 space-y-1">
                  {[
                    { href: '/projets', label: t.nav.projects },
                    { href: '/ressources', label: t.nav.resources },
                    { href: '/enregistre', label: t.nav.saved },
                    { href: '/preparation-emploi/analyser', label: t.analyzer.title },
                    { href: '/profil', label: t.nav.profile },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center justify-between rounded-lg px-2 text-sand-700 hover:bg-sand-50"
                      >
                        {link.label}
                        <ArrowRight aria-hidden className="size-4 text-sand-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[--radius-card] border border-sand-200 bg-white p-3">
      <span className="text-brand-700">{icon}</span>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-sand-600">{label}</p>
    </div>
  );
}
