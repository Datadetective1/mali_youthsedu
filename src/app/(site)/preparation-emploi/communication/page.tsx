import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { emailTemplates } from '@/content/templates';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { BulletList, Card, CardBody, Disclosure, Notice, Section } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.communication.metaTitle, description: t.communication.intro };
}

export default async function CommunicationPage() {
  const t = await getDictionary();

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.communication.title },
        ]}
      />

      <PageHeader title={t.communication.title} description={t.communication.intro} />

      <Section title={t.communication.rulesTitle}>
        <Card>
          <CardBody>
            <BulletList marker="check" items={t.communication.rules} />
          </CardBody>
        </Card>
      </Section>

      <Section title={t.communication.templatesTitle} className="mt-10">
        <Notice tone="warning">{t.communication.templatesHint}</Notice>

        <ul className="space-y-3">
          {emailTemplates.map((template) => (
            <li key={template.id}>
              <Disclosure summary={template.title}>
                <div className="space-y-4">
                  <p className="text-sm text-sand-600">{template.context}</p>

                  {template.subject ? (
                    <p className="rounded-lg bg-sand-50 p-3 text-sm">
                      <strong className="font-semibold">Objet : </strong>
                      {template.subject}
                    </p>
                  ) : null}

                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-sand-50 p-3 font-sans text-sm text-sand-800">
                    {template.body}
                  </pre>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                      À adapter
                    </h4>
                    <BulletList className="mt-1 text-sm text-sand-700" items={template.adaptations} />
                  </div>
                </div>
              </Disclosure>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.communication.listeningTitle} className="mt-10">
        <Card>
          <CardBody>
            <p className="text-sand-700">{t.communication.listeningBody}</p>
          </CardBody>
        </Card>
      </Section>
    </PageShell>
  );
}
