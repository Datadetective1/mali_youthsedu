import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listProgress } from '@/lib/db/repository';
import { careerPaths, totalItems } from '@/content/paths';
import { computePathProgress } from '@/lib/engine/progress';
import { PageHeader, PageShell } from '@/components/layout/page';
import { PathCard } from '@/components/path-card';
import { ButtonLink } from '@/components/ui/button';
import { Notice } from '@/components/ui';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.explore.metaTitle, description: t.explore.intro };
}

export default async function ExplorePage() {
  const t = await getDictionary();
  const session = await getSession();
  const progress = session ? await listProgress(session.userId) : [];

  return (
    <PageShell width="wide">
      <PageHeader title={t.explore.title} description={t.explore.intro} />

      {!session ? (
        <Notice tone="info" className="mb-6">
          <p>{t.explore.guestNotice}</p>
          <ButtonLink href="/bienvenue" size="sm" className="mt-3">
            {t.explore.guestCta}
          </ButtonLink>
        </Notice>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careerPaths.map((path) => {
          const total = totalItems(path);
          const done = session ? computePathProgress(path, progress).done : 0;

          return (
            <li key={path.id}>
              <PathCard
                path={path}
                stagesLabel={t.explore.stagesLabel(path.stages.length)}
                progress={session && done > 0 ? { done, total } : undefined}
              />
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
