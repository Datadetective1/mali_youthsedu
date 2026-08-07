import type { Metadata } from 'next';
import { adminConfig } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { careerPaths } from '@/content/paths';
import { interviewQuestions } from '@/content/interview-questions';
import { practicalProjects } from '@/content/projects';
import { resourcesWithOverrides } from '@/lib/content-overlay';
import { PageHeader } from '@/components/layout/page';
import { Card, CardBody, Notice, Section } from '@/components/ui';

export const metadata: Metadata = { title: 'Administration', robots: { index: false } };

export default async function AdminOverviewPage() {
  const t = await getDictionary();
  const resources = await resourcesWithOverrides();

  const stageCount = careerPaths.reduce((sum, path) => sum + path.stages.length, 0);
  const itemCount = careerPaths.reduce(
    (sum, path) => sum + path.stages.reduce((inner, stage) => inner + stage.items.length, 0),
    0,
  );

  const verified = resources.filter((r) => r.verification === 'verified' && !r.archived).length;
  const pending = resources.filter((r) => r.verification === 'pending' && !r.archived).length;
  const broken = resources.filter((r) => r.verification === 'broken' && !r.archived).length;
  const archived = resources.filter((r) => r.archived).length;

  return (
    <>
      <PageHeader title={t.admin.title} description={t.admin.intro} />

      {adminConfig.emails.length === 0 ? (
        <Notice tone="warning" className="mb-6">
          {t.admin.notConfigured}
        </Notice>
      ) : null}

      <Notice tone="info" className="mb-8">
        {t.admin.overlayNotice}
      </Notice>

      <Section title={t.admin.overview.contentTitle}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Tile label={t.admin.overview.paths} value={careerPaths.length} />
          <Tile label={t.admin.overview.stages} value={stageCount} />
          <Tile label={t.admin.overview.items} value={itemCount} />
          <Tile label={t.admin.overview.resources} value={resources.length} />
          <Tile label={t.admin.overview.projects} value={practicalProjects.length} />
          <Tile label={t.admin.overview.questions} value={interviewQuestions.length} />
        </div>
      </Section>

      <Section title={t.admin.overview.verificationTitle} className="mt-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label={t.admin.overview.verified} value={verified} tone="success" />
          <Tile label={t.admin.overview.pending} value={pending} tone="warning" />
          <Tile label={t.admin.overview.broken} value={broken} tone="danger" />
          <Tile label={t.admin.overview.archived} value={archived} />
        </div>

        {pending > 0 ? (
          <Notice tone="warning">{t.admin.overview.pendingWarning}</Notice>
        ) : null}
      </Section>
    </>
  );
}

function Tile({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const colour =
    tone === 'success'
      ? 'text-success-700'
      : tone === 'warning'
        ? 'text-warning-700'
        : tone === 'danger'
          ? 'text-danger-700'
          : 'text-sand-900';

  return (
    <Card>
      <CardBody>
        <p className={`text-3xl font-bold tabular-nums ${colour}`}>{value}</p>
        <p className="mt-1 text-sm text-sand-600">{label}</p>
      </CardBody>
    </Card>
  );
}
