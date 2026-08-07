import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { listUserProjects } from '@/lib/db/repository';
import { practicalProjects } from '@/content/projects';
import { pathById } from '@/content/paths';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Badge, Card, CardBody, Notice, ProgressBar, Section } from '@/components/ui';
import { formatMinutes } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.projects.metaTitle, description: t.projects.intro };
}

export default async function ProjectsPage() {
  const t = await getDictionary();
  const session = await getSession();
  const userProjects = session ? await listUserProjects(session.userId) : [];
  const byProjectId = new Map(userProjects.map((entry) => [entry.projectId, entry]));
  const completed = userProjects.filter((entry) => entry.completedAt);

  return (
    <PageShell width="wide">
      <PageHeader title={t.projects.title} description={t.projects.intro} />

      {session && completed.length > 0 ? (
        <Section title={t.projects.portfolioTitle} description={t.projects.portfolioIntro} className="mb-10">
          <ProgressBar
            value={completed.length}
            total={practicalProjects.length}
            label={t.projects.savedProjects}
          />
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {completed.map((entry) => {
              const project = practicalProjects.find((item) => item.id === entry.projectId);
              if (!project) return null;
              return (
                <li key={entry.id}>
                  <Card>
                    <CardBody>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="success">{t.projects.done}</Badge>
                        {project.simulated ? (
                          <Badge tone="warning">{t.projects.simulatedBadge}</Badge>
                        ) : null}
                      </div>
                      <h3 className="mt-2 font-semibold">
                        <Link href={`/projets/${project.slug}`} className="hover:text-brand-800">
                          {project.title}
                        </Link>
                      </h3>
                    </CardBody>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      <Notice tone="info" className="mb-6">
        {t.projects.portfolioDescriptionHint}
      </Notice>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {practicalProjects.map((project) => {
          const path = pathById.get(project.pathId);
          const state = byProjectId.get(project.id);

          return (
            <li key={project.id}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="accent">{t.projects.difficulty[project.difficulty]}</Badge>
                    <Badge tone="neutral">{formatMinutes(project.estimatedMinutes)}</Badge>
                    {project.simulated ? (
                      <Badge tone="warning">{t.projects.simulatedBadge}</Badge>
                    ) : null}
                    {state?.completedAt ? <Badge tone="success">{t.projects.done}</Badge> : null}
                  </div>

                  <h3 className="mt-3 font-semibold">
                    <Link href={`/projets/${project.slug}`} className="hover:text-brand-800">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-sand-600">{project.objective}</p>

                  {path ? (
                    <p className="mt-3 text-xs text-sand-500">
                      {t.projects.filterByPath} : {path.name}
                    </p>
                  ) : null}
                </CardBody>
              </Card>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
