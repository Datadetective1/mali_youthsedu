import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { requireSession } from '@/lib/auth';
import { listNotes, listSavedResources } from '@/lib/db/repository';
import { resourceById } from '@/content/resources';
import { pathById } from '@/content/paths';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, EmptyState, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { ResourceCard } from '@/components/resources/resource-card';
import { OfflineContentPanel } from '@/components/offline/offline-content-panel';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.saved.metaTitle, robots: { index: false } };
}

export default async function SavedPage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await requireSession('/enregistre');

  const [saved, notes] = await Promise.all([
    listSavedResources(session.userId),
    listNotes(session.userId),
  ]);

  const savedResources = saved
    .map((entry) => resourceById.get(entry.resourceId))
    .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource));

  return (
    <PageShell width="wide">
      <PageHeader title={t.saved.title} description={t.saved.intro} />

      <Section title={t.saved.tabOffline} description={t.saved.offlineIntro}>
        <OfflineContentPanel
          labels={{
            empty: t.saved.offlineEmpty,
            clear: t.saved.clearOffline,
            clearConfirm: t.saved.clearOfflineConfirm,
            cancel: t.actions.cancel,
            confirm: t.actions.confirm,
          }}
        />
      </Section>

      <Section title={t.saved.tabResources} className="mt-12">
        {savedResources.length === 0 ? (
          <EmptyState
            title={t.resources.savedEmpty}
            action={<ButtonLink href="/ressources">{t.nav.resources}</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedResources.map((resource) => (
              <li key={resource.id}>
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.saved.tabNotes} className="mt-12">
        {notes.length === 0 ? (
          <EmptyState title={t.saved.notesEmpty} />
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => {
              // Notes are keyed by stage id, whose prefix is the path slug.
              const pathId = note.refId.split('-s')[0] ?? '';
              const path = pathById.get(pathId);
              const stage = path?.stages.find((candidate) => candidate.id === note.refId);

              return (
                <li key={note.id}>
                  <Card>
                    <CardBody>
                      <p className="text-sm text-sand-500">
                        {path && stage ? (
                          <Link href="/mon-parcours" className="hover:text-brand-800">
                            {path.name} · {stage.name}
                          </Link>
                        ) : (
                          note.refId
                        )}
                        {' · '}
                        {formatDate(note.updatedAt, locale)}
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sand-800">{note.body}</p>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </PageShell>
  );
}
