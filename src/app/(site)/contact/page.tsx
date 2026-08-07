import type { Metadata } from 'next';
import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, Notice } from '@/components/ui';
import { FeedbackForm } from '@/components/feedback-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.legal.contact.metaTitle, description: t.legal.contact.intro };
}

export default async function ContactPage() {
  const t = await getDictionary();
  const c = t.legal.contact;

  return (
    <PageShell width="narrow">
      <PageHeader title={c.title} description={c.intro} />

      <Card>
        <CardBody>
          <h2 className="text-lg font-bold">{c.formTitle}</h2>
          <FeedbackForm
            labels={{
              typeLabel: c.typeLabel,
              types: c.types,
              messageLabel: c.messageLabel,
              messagePlaceholder: c.messagePlaceholder,
              emailLabel: c.emailLabel,
              emailHint: c.emailHint,
              send: c.sendAction,
              sending: t.actions.saving,
            }}
          />
        </CardBody>
      </Card>

      <Notice tone="info" className="mt-6">
        {c.privacyNote}
      </Notice>

      <div className="mt-6">
        <h2 className="font-semibold">{c.directTitle}</h2>
        <p className="mt-1">
          <a
            href={`mailto:${brand.contactEmail}`}
            className="text-brand-700 underline underline-offset-4"
          >
            {brand.contactEmail}
          </a>
        </p>
      </div>
    </PageShell>
  );
}
