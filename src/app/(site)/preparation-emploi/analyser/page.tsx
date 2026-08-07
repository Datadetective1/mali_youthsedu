import type { Metadata } from 'next';
import Link from 'next/link';
import { isAiEnabled } from '@/config';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listAnalyses } from '@/lib/db/repository';
import { jobExamples } from '@/content/job-examples';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { Badge, Card, CardBody, Section } from '@/components/ui';
import { AnalyzerWorkspace } from '@/components/jobs/analyzer-workspace';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.analyzer.metaTitle, description: t.analyzer.intro };
}

export default async function AnalyzerPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await getSession();
  const analyses = session ? await listAnalyses(session.userId) : [];

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.analyzer.title },
        ]}
      />

      <PageHeader title={t.analyzer.title} description={t.analyzer.intro} />

      <AnalyzerWorkspace
        t={t}
        aiAvailable={isAiEnabled()}
        isSignedIn={Boolean(session)}
        examples={jobExamples.map((example) => ({
          id: example.id,
          label: example.label,
          text: example.text,
          title: example.title,
          company: example.company,
        }))}
      />

      {session && analyses.length > 0 ? (
        <Section title={t.analyzer.savedTitle} className="mt-12">
          <ul className="grid gap-3 sm:grid-cols-2">
            {analyses.slice(0, 10).map((analysis) => (
              <li key={analysis.id}>
                <Card>
                  <CardBody>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">
                        <Link
                          href={`/preparation-emploi/analyser/${analysis.id}`}
                          className="hover:text-brand-800"
                        >
                          {analysis.jobTitle}
                        </Link>
                      </h3>
                      {analysis.comparison ? (
                        <Badge
                          tone={
                            analysis.comparison.readiness.band === 'high'
                              ? 'success'
                              : analysis.comparison.readiness.band === 'medium'
                                ? 'accent'
                                : 'warning'
                          }
                        >
                          {analysis.comparison.readiness.score}/100
                        </Badge>
                      ) : null}
                    </div>
                    {analysis.company ? (
                      <p className="mt-0.5 text-sm text-sand-500">{analysis.company}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-sand-500">
                      {t.analyzer.analyzedOn} {formatDate(analysis.createdAt, locale)}
                    </p>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </PageShell>
  );
}
