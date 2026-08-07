import type { Metadata } from 'next';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { listFeedback } from '@/lib/db/repository';
import { PageHeader } from '@/components/layout/page';
import { Badge, Card, CardBody, EmptyState, Notice } from '@/components/ui';

export const metadata: Metadata = { title: 'Retours', robots: { index: false } };

export default async function AdminFeedbackPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const feedback = await listFeedback(200);

  return (
    <>
      <PageHeader title={t.admin.feedback.title} description={t.admin.feedback.intro} />

      {/* Feedback can carry an email only when the sender asked for a reply.
          Nothing else identifies them, and no user id is stored. */}
      <Notice tone="info" className="mb-6">
        {t.legal.contact.privacyNote}
      </Notice>

      {feedback.length === 0 ? (
        <EmptyState title={t.admin.feedback.empty} />
      ) : (
        <ul className="space-y-3">
          {feedback.map((entry) => (
            <li key={entry.id}>
              <Card>
                <CardBody>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">
                      {t.legal.contact.types[entry.type] ?? entry.type}
                    </Badge>
                    <span className="text-sm text-sand-500">
                      {t.admin.feedback.receivedOn} {formatDate(entry.createdAt, locale)}
                    </span>
                    {entry.email ? (
                      <span className="text-sm text-sand-600">· {entry.email}</span>
                    ) : null}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sand-800">{entry.message}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
