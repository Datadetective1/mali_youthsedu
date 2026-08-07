import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { listMetrics } from '@/lib/db/repository';
import { PageHeader } from '@/components/layout/page';
import { Card, CardBody, EmptyState, Notice, Section } from '@/components/ui';

export const metadata: Metadata = { title: 'Statistiques', robots: { index: false } };

export default async function AdminMetricsPage() {
  const t = await getDictionary();
  const metrics = await listMetrics();
  const m = t.admin.metrics;

  const productMetrics: { event: string; label: string }[] = [
    { event: 'onboarding_completed', label: m.onboardingCompleted },
    { event: 'roadmap_started', label: m.roadmapsStarted },
    { event: 'task_completed', label: m.tasksCompleted },
    { event: 'project_completed', label: m.projectsCompleted },
    { event: 'job_analysis_run', label: m.analysesRun },
    { event: 'value_prop_created', label: m.valuePropsCreated },
    { event: 'interview_answer_saved', label: m.interviewAnswers },
    { event: 'weekly_plan_generated', label: t.nav.weeklyPlan },
  ];

  const selfReported: { event: string; label: string }[] = [
    { event: 'self_reported_application', label: m.applications },
    { event: 'self_reported_interview', label: m.interviews },
    { event: 'self_reported_offer', label: m.offers },
  ];

  const hasAny = Object.keys(metrics).length > 0;

  return (
    <>
      <PageHeader title={m.title} />

      {/* The privacy claim on the landing page has to be true here too: these
          are counters with no user id attached, so no individual journey can be
          reconstructed from this screen. */}
      <Notice tone="info" className="mb-8">
        {m.privacyNotice}
      </Notice>

      {!hasAny ? (
        <EmptyState title={m.noData} />
      ) : (
        <>
          <Section title={t.admin.tabs.metrics}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {productMetrics.map((metric) => (
                <MetricTile
                  key={metric.event}
                  label={metric.label}
                  value={metrics[metric.event] ?? 0}
                />
              ))}
            </div>
          </Section>

          <Section title={m.selfReportedTitle} className="mt-10">
            {/* Self-reported outcomes are never presented as verified. */}
            <Notice tone="warning">{m.selfReportedNotice}</Notice>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selfReported.map((metric) => (
                <MetricTile
                  key={metric.event}
                  label={metric.label}
                  value={metrics[metric.event] ?? 0}
                />
              ))}
            </div>
          </Section>
        </>
      )}
    </>
  );
}

function MetricTile({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardBody>
        <p className="text-3xl font-bold tabular-nums text-sand-900">{value}</p>
        <p className="mt-1 text-sm text-sand-600">{label}</p>
      </CardBody>
    </Card>
  );
}
