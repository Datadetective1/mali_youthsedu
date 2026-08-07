import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { PageHeader, PageShell, Prose } from '@/components/layout/page';
import { BulletList, Notice } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.legal.terms.metaTitle };
}

export default async function TermsPage() {
  const t = await getDictionary();
  const s = t.legal.terms.sections;

  return (
    <PageShell width="narrow">
      <PageHeader title={t.legal.terms.title} />

      <Notice tone="warning" className="mb-6">
        {t.legal.terms.draftNotice}
      </Notice>

      <Prose>
        <h2>{s.purposeTitle}</h2>
        <p>{s.purpose}</p>

        <h2>{s.noGuaranteeTitle}</h2>
        <p className="font-medium text-sand-900">{s.noGuarantee}</p>

        <h2>{s.contentTitle}</h2>
        <p>{s.content}</p>

        <h2>{s.credentialsTitle}</h2>
        <p>{s.credentials}</p>

        <h2>{s.conductTitle}</h2>
        <BulletList items={s.conduct} />

        <h2>{s.aiTitle}</h2>
        <p>{s.ai}</p>

        <h2>{s.liabilityTitle}</h2>
        <p>{s.liability}</p>

        <h2>{s.changesTitle}</h2>
        <p>{s.changes}</p>
      </Prose>
    </PageShell>
  );
}
