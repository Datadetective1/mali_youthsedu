import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getUserProject } from '@/lib/db/repository';
import { practicalProjects, projectBySlug } from '@/content/projects';
import { pathById } from '@/content/paths';
import { skillById } from '@/content/skills';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { Badge, BulletList, Card, CardBody, Notice, Section } from '@/components/ui';
import { ProjectWorkspace } from '@/components/projects/project-workspace';
import { formatMinutes } from '@/lib/utils';

export function generateStaticParams() {
  return practicalProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: 'Projet introuvable' };
  return { title: project.title, description: project.objective };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const t = await getDictionary();
  const session = await getSession();
  const state = session ? await getUserProject(session.userId, project.id) : null;
  const path = pathById.get(project.pathId);

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/', label: t.nav.home },
          { href: '/projets', label: t.nav.projects },
          { label: project.title },
        ]}
      />

      <PageHeader
        title={project.title}
        description={project.objective}
        eyebrow={path?.name}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone="accent">{t.projects.difficulty[project.difficulty]}</Badge>
        <Badge tone="neutral">{formatMinutes(project.estimatedMinutes)}</Badge>
        {project.offlineFriendly ? (
          <Badge tone="success">{t.connectivity.offline}</Badge>
        ) : (
          <Badge tone="neutral">{t.connectivity.needsInternet}</Badge>
        )}
        {project.simulated ? <Badge tone="warning">{t.projects.simulatedBadge}</Badge> : null}
      </div>

      {/* A simulated assignment must never be presentable as paid client work. */}
      {project.simulated ? (
        <Notice tone="warning" title={t.projects.simulatedBadge} className="mb-6">
          {t.projects.simulatedNotice}
        </Notice>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="font-bold">{t.projects.scenario}</h2>
              <p className="mt-2 text-sand-700">{project.scenario}</p>
            </CardBody>
          </Card>

          <Section title={t.projects.instructions}>
            <BulletList marker="decimal" className="text-sand-700" items={project.instructions} />
          </Section>

          <Card>
            <CardBody>
              <h2 className="font-bold">{t.projects.deliverable}</h2>
              <p className="mt-2 text-sand-700">{project.deliverable}</p>
            </CardBody>
          </Card>

          <Section title={t.projects.skillsDemonstrated}>
            <ul className="flex flex-wrap gap-1.5">
              {project.skillIds.map((skillId) => (
                <li key={skillId}>
                  <Badge tone="brand">{skillById.get(skillId)?.name ?? skillId}</Badge>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">{t.projects.myWork}</h2>
          <ProjectWorkspace
            project={project}
            initial={state}
            isSignedIn={Boolean(session)}
            labels={{
              myWork: t.projects.myWork,
              myWorkPlaceholder: t.projects.myWorkPlaceholder,
              evidenceLink: t.projects.evidenceLink,
              evidenceLinkHint: t.projects.evidenceLinkHint,
              reflectionLabel: t.projects.reflectionLabel,
              evaluationChecklist: t.projects.evaluationChecklist,
              markDone: t.projects.markDone,
              markDoneHint: t.projects.markDoneHint,
              done: t.projects.done,
              save: t.actions.save,
              saving: t.actions.saving,
              saved: t.actions.saved,
              portfolioDescription: t.projects.portfolioDescription,
              portfolioDescriptionHint: t.projects.portfolioDescriptionHint,
              copy: t.actions.copy,
              copied: t.actions.copied,
              addToPortfolio: t.projects.addToPortfolio,
              inPortfolio: t.projects.inPortfolio,
              signInRequired: t.auth.protectedRoute,
            }}
          />
        </div>
      </div>
    </PageShell>
  );
}
