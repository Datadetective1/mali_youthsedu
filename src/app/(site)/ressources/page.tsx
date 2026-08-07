import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listSavedResources } from '@/lib/db/repository';
import { resources } from '@/content/resources';
import { PageHeader, PageShell } from '@/components/layout/page';
import { ResourceLibrary } from '@/components/resources/resource-library';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.resources.metaTitle, description: t.resources.intro };
}

export default async function ResourcesPage() {
  const t = await getDictionary();
  const session = await getSession();
  const saved = session ? await listSavedResources(session.userId) : [];

  return (
    <PageShell width="wide">
      <PageHeader title={t.resources.title} description={t.resources.intro} />

      <ResourceLibrary
        resources={resources.filter((resource) => !resource.archived)}
        savedIds={saved.map((entry) => entry.resourceId)}
        isSignedIn={Boolean(session)}
        labels={{
          searchPlaceholder: t.resources.searchPlaceholder,
          filters: t.resources.filters,
          reset: t.actions.reset,
          countTemplate: t.resources.countLabel,
          noResults: t.states.noResults,
          noResultsHint: t.states.noResultsHint,
          save: t.resources.saveResource,
          saved: t.resources.unsaveResource,
          filterLanguage: t.resources.filterLanguage,
          filterFormat: t.resources.filterFormat,
          filterLevel: t.resources.filterDifficulty,
          filterConnectivity: t.resources.filterConnectivity,
          filterCost: t.resources.filterCost,
          filterAll: t.resources.filterAll,
          guestNotice: t.explore.guestNotice,
          verificationHelp: t.resources.verificationPendingHelp,
        }}
      />
    </PageShell>
  );
}
