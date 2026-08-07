import type { Metadata } from 'next';
import { isAiEnabled } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getValueProposition } from '@/lib/db/repository';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { ValuePropositionBuilder } from '@/components/jobs/value-proposition-builder';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.valueProp.metaTitle, description: t.valueProp.intro };
}

export default async function ValuePropositionPage() {
  const t = await getDictionary();
  const session = await getSession();
  const existing = session ? await getValueProposition(session.userId) : null;

  return (
    <PageShell width="wide">
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.valueProp.title },
        ]}
      />

      <PageHeader title={t.valueProp.title} description={t.valueProp.intro} />

      <ValuePropositionBuilder
        t={t}
        initialInput={existing?.input ?? null}
        initialOutput={existing?.output ?? null}
        aiAvailable={isAiEnabled()}
        isSignedIn={Boolean(session)}
      />
    </PageShell>
  );
}
