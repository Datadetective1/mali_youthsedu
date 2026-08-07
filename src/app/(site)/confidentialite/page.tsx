import type { Metadata } from 'next';
import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { PageHeader, PageShell, Prose } from '@/components/layout/page';
import { BulletList, Notice } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.legal.privacy.metaTitle };
}

export default async function PrivacyPage() {
  const t = await getDictionary();
  const s = t.legal.privacy.sections;

  return (
    <PageShell width="narrow">
      <PageHeader title={t.legal.privacy.title} />

      {/* The brief asked for a draft, and shipping a draft as if a lawyer had
          reviewed it would be exactly the kind of overclaim this product is
          built to avoid. */}
      <Notice tone="warning" className="mb-6">
        {t.legal.privacy.draftNotice}
      </Notice>

      <Prose>
        <h2>{s.summaryTitle}</h2>
        <BulletList marker="check" items={s.summary} />

        <h2>{s.collectedTitle}</h2>
        <BulletList items={s.collected} />

        <h2>{s.notCollectedTitle}</h2>
        <BulletList items={s.notCollected} />

        <h2>{s.purposeTitle}</h2>
        <p>{s.purpose}</p>

        <h2>{s.aiTitle}</h2>
        <p>{s.ai}</p>

        <h2>{s.storageTitle}</h2>
        <p>{s.storage}</p>

        <h2>{s.rightsTitle}</h2>
        <BulletList items={s.rights} />

        <h2>{s.cookiesTitle}</h2>
        <p>{s.cookies}</p>

        <h2>{s.contactTitle}</h2>
        <p>
          <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
        </p>
      </Prose>
    </PageShell>
  );
}
