import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getAnalysis } from '@/lib/db/repository';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { AnalysisResult } from '@/components/jobs/analysis-result';
import { DeleteAnalysisButton } from '@/components/jobs/delete-analysis-button';

export const metadata: Metadata = { robots: { index: false } };

export default async function SavedAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await getSession();
  if (!session) {
    redirect(`/connexion?suivant=${encodeURIComponent(`/preparation-emploi/analyser/${id}`)}`);
  }

  const analysis = await getAnalysis(session.userId, id);
  if (!analysis) notFound();

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { href: '/preparation-emploi/analyser', label: t.analyzer.title },
          { label: analysis.jobTitle },
        ]}
      />

      <PageHeader
        title={analysis.jobTitle}
        description={`${analysis.company ?? ''} · ${t.analyzer.analyzedOn} ${formatDate(analysis.createdAt, locale)}`}
        actions={
          <DeleteAnalysisButton
            analysisId={analysis.id}
            label={t.analyzer.deleteAnalysis}
            confirmLabel={t.actions.confirm}
          />
        }
      />

      <AnalysisResult
        t={t}
        extraction={analysis.extraction}
        comparison={analysis.comparison}
        hasProfile={Boolean(analysis.comparison)}
        analysisId={analysis.id}
        isSignedIn
      />
    </PageShell>
  );
}
