import type { Metadata } from 'next';
import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { PageHeader, PageShell, Prose } from '@/components/layout/page';
import { BulletList } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.legal.accessibility.metaTitle };
}

export default async function AccessibilityPage() {
  const t = await getDictionary();
  const a = t.legal.accessibility;

  return (
    <PageShell width="narrow">
      <PageHeader title={a.title} description={a.intro} />

      <Prose>
        <h2>{a.commitmentsTitle}</h2>
        <BulletList marker="check" items={a.commitments} />

        {/* Stating the gaps is the point: an accessibility page that only lists
            successes is a marketing page. */}
        <h2>{a.limitsTitle}</h2>
        <BulletList items={a.limits} />

        <h2>{a.reportTitle}</h2>
        <p>{a.reportBody}</p>
        <p>
          <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
        </p>
      </Prose>
    </PageShell>
  );
}
