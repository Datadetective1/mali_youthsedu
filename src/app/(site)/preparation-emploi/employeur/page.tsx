import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listChecklistStates, listEmployerResearch } from '@/lib/db/repository';
import { checklistById } from '@/content/checklists';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { BulletList, Card, CardBody, Notice, Section } from '@/components/ui';
import { EmployerResearchForm } from '@/components/jobs/employer-research-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.employer.metaTitle, description: t.employer.intro };
}

export default async function EmployerPage() {
  const t = await getDictionary();
  const session = await getSession();

  const [entries, states] = session
    ? await Promise.all([listEmployerResearch(session.userId), listChecklistStates(session.userId)])
    : [[], []];

  const checklist = checklistById.get('chk-employer-research');
  const latest = entries[0] ?? null;

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.employer.title },
        ]}
      />

      <PageHeader title={t.employer.title} description={t.employer.intro} />

      <Notice tone="info" className="mb-6">
        {t.employer.offlineNotice}
      </Notice>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {checklist ? (
            <EmployerResearchForm
              checklist={checklist}
              initial={{
                company: latest?.company ?? '',
                notes: latest?.notes ?? '',
                doneItemIds:
                  latest?.doneItemIds ??
                  states.find((state) => state.checklistId === checklist.id)?.doneItemIds ??
                  [],
              }}
              isSignedIn={Boolean(session)}
              labels={{
                companyLabel: t.employer.companyLabel,
                checklistTitle: t.employer.checklistTitle,
                notesLabel: t.employer.notesLabel,
                notesPlaceholder: t.employer.notesPlaceholder,
                save: t.actions.save,
                saving: t.actions.saving,
                saved: t.actions.saved,
                signIn: t.recommendation.guestSaveNotice,
              }}
            />
          ) : null}
        </div>

        <Section title={t.employer.whereToLookTitle}>
          <Card>
            <CardBody>
              <BulletList marker="check" items={t.employer.whereToLook} />
            </CardBody>
          </Card>

          {entries.length > 1 ? (
            <Card>
              <CardBody>
                <h3 className="font-semibold">Entreprises étudiées</h3>
                <ul className="mt-2 space-y-1 text-sand-700">
                  {entries.map((entry) => (
                    <li key={entry.id}>{entry.company}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}
        </Section>
      </div>
    </PageShell>
  );
}
