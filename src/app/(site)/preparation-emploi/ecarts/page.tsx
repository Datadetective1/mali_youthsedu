import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { requireSession } from '@/lib/auth';
import { listAnalyses, listSkillGaps } from '@/lib/db/repository';
import { pathById } from '@/content/paths';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { EmptyState } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { SkillGapList } from '@/components/jobs/skill-gap-list';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.gaps.metaTitle, robots: { index: false } };
}

export default async function SkillGapsPage() {
  const t = await getDictionary();
  const session = await requireSession('/preparation-emploi/ecarts');

  const [gaps, analyses] = await Promise.all([
    listSkillGaps(session.userId),
    listAnalyses(session.userId),
  ]);

  return (
    <PageShell width="narrow">
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.gaps.title },
        ]}
      />

      <PageHeader
        title={t.gaps.title}
        description={t.gaps.intro}
        eyebrow={analyses.length > 0 ? t.gaps.fromAnalyses(analyses.length) : undefined}
      />

      {gaps.length === 0 ? (
        <EmptyState
          title={t.gaps.empty}
          action={
            <ButtonLink href="/preparation-emploi/analyser">{t.analyzer.analyzeAction}</ButtonLink>
          }
        />
      ) : (
        <SkillGapList
          gaps={gaps.map((gap) => ({
            ...gap,
            pathName: gap.pathId ? (pathById.get(gap.pathId)?.name ?? null) : null,
          }))}
          labels={{
            frequency: t.gaps.frequency,
            statusTodo: t.gaps.statusTodo,
            statusLearning: t.gaps.statusLearning,
            statusAddressed: t.gaps.statusAddressed,
            linkedPath: t.gaps.linkedPath,
            actionLearn: t.gaps.actionLearn,
          }}
        />
      )}
    </PageShell>
  );
}
