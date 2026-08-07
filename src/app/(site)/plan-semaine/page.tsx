import type { Metadata } from 'next';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { requireSession } from '@/lib/auth';
import { getPreferences, getPrimaryRoadmap, getWeeklyPlan } from '@/lib/db/repository';
import { pathById } from '@/content/paths';
import { PageHeader, PageShell } from '@/components/layout/page';
import { EmptyState, Notice } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { WeeklyBoard } from '@/components/weekly/weekly-board';
import { GeneratePlanButton } from '@/components/weekly/generate-plan-button';
import { SaveOfflineButton } from '@/components/offline/save-offline-button';
import { startOfIsoWeek } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.weekly.metaTitle, robots: { index: false } };
}

export default async function WeeklyPlanPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await requireSession('/plan-semaine');
  const weekStart = startOfIsoWeek(new Date());

  const [roadmap, preferences, plan] = await Promise.all([
    getPrimaryRoadmap(session.userId),
    getPreferences(session.userId),
    getWeeklyPlan(session.userId, weekStart),
  ]);

  if (!roadmap) {
    return (
      <PageShell>
        <PageHeader title={t.weekly.title} />
        <EmptyState
          title={t.weekly.emptyTitle}
          description={t.weekly.emptyBody}
          action={<ButtonLink href="/parcours">{t.nav.explore}</ButtonLink>}
        />
      </PageShell>
    );
  }

  const path = pathById.get(roadmap.pathId);

  return (
    <PageShell>
      <PageHeader
        title={t.weekly.title}
        description={t.weekly.weekOf(
          formatDate(weekStart, locale, { day: 'numeric', month: 'long', year: 'numeric' }),
        )}
        actions={
          <SaveOfflineButton
            urls={['/plan-semaine']}
            labels={{
              save: t.offline.saveForOffline,
              saved: t.offline.savedForOffline,
              saving: t.offline.savingForOffline,
              remove: t.offline.removeFromOffline,
              unsupported: '',
            }}
          />
        }
      />

      {/* Visible only when printed — the printed sheet needs its own title. */}
      <div data-print="block" className="hidden">
        <h2 className="text-lg font-bold">{t.weekly.printTitle}</h2>
      </div>

      {plan && plan.tasks.length > 0 ? (
        <>
          <Notice tone="info" className="mb-6">
            <strong className="font-semibold">{t.weekly.objective} : </strong>
            {plan.objective}
          </Notice>

          <WeeklyBoard
            plan={plan}
            hoursPerWeek={preferences.hoursPerWeek}
            labels={{
              dayLabels: t.weekly.dayLabels,
              tasks: t.weekly.tasks,
              totalTime: t.weekly.totalTime,
              doneCount: t.weekly.doneCount,
              weekComplete: t.weekly.weekComplete,
              regenerate: t.weekly.regenerate,
              regenerateWarning: t.weekly.regenerateWarning,
              lighter: t.weekly.lighter,
              heavier: t.weekly.heavier,
              downloadPdf: t.weekly.downloadPdf,
              downloadHint: t.weekly.downloadHint,
              moveTo: t.weekly.moveTo,
              working: t.actions.loading,
              offlineQueued: t.offline.pendingChanges(1),
              kinds: {
                lecture: 'Lecture',
                pratique: 'Pratique',
                reflexion: 'Réflexion',
                evaluation: 'Évaluation',
                projet: 'Projet',
              },
            }}
          />

          <p data-print="block" className="mt-8 hidden text-sm text-sand-500">
            {t.weekly.printFooter}
          </p>
        </>
      ) : (
        <EmptyState
          title={t.weekly.emptyTitle}
          description={path ? path.name : t.weekly.emptyBody}
          action={
            <GeneratePlanButton
              pathId={roadmap.pathId}
              labels={{ generate: t.weekly.generate, working: t.actions.loading }}
            />
          }
        />
      )}
    </PageShell>
  );
}
