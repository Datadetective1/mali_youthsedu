import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listChecklistStates } from '@/lib/db/repository';
import { checklistById } from '@/content/checklists';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { Notice } from '@/components/ui';
import { ChecklistCard } from '@/components/jobs/checklist-card';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.checklist.metaTitle, description: t.checklist.intro };
}

export default async function ApplicationChecklistPage() {
  const t = await getDictionary();
  const session = await getSession();
  const states = session ? await listChecklistStates(session.userId) : [];
  const checklist = checklistById.get('chk-application');

  if (!checklist) return null;

  const done = states.find((state) => state.checklistId === checklist.id)?.doneItemIds ?? [];

  return (
    <PageShell width="narrow">
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/preparation-emploi', label: t.center.title },
          { label: t.checklist.title },
        ]}
      />

      <PageHeader title={t.checklist.title} description={t.checklist.intro} />

      <ChecklistCard
        checklist={checklist}
        initialDone={done}
        isSignedIn={Boolean(session)}
        countLabel={t.interview.checklists.itemsDone}
      />

      {done.length === checklist.items.length ? (
        <Notice tone="success" title={t.checklist.completedTitle} className="mt-6">
          {t.checklist.completedBody}
        </Notice>
      ) : null}
    </PageShell>
  );
}
