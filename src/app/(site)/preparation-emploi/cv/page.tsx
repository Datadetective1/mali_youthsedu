import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getCvProfile, listUserProjects } from '@/lib/db/repository';
import { projectById } from '@/content/projects';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { CvWorkspace } from '@/components/jobs/cv-workspace';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.cv.metaTitle, description: t.cv.intro };
}

export default async function CvPage() {
  const t = await getDictionary();
  const session = await getSession();

  const [cv, userProjects] = session
    ? await Promise.all([getCvProfile(session.userId), listUserProjects(session.userId)])
    : [null, []];

  const completed = userProjects
    .filter((entry) => entry.completedAt)
    .map((entry) => {
      const project = projectById.get(entry.projectId);
      return project ? { project, entry } : null;
    })
    .filter((value): value is NonNullable<typeof value> => value !== null);

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[{ href: '/preparation-emploi', label: t.center.title }, { label: t.cv.title }]}
      />

      <PageHeader title={t.cv.title} description={t.cv.intro} />

      <CvWorkspace
        t={t}
        initial={cv}
        completedProjects={completed}
        isSignedIn={Boolean(session)}
      />
    </PageShell>
  );
}
