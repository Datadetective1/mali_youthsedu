import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, ListChecks, Target } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { careerPaths, pathBySlug } from '@/content/paths';
import { projectsForPath } from '@/content/projects';
import { resourcesByIds } from '@/content/resources';
import { skillById } from '@/content/skills';
import { PageHeader, PageShell, Breadcrumb } from '@/components/layout/page';
import { ButtonLink } from '@/components/ui/button';
import {
  Badge,
  BulletList,
  Card,
  CardBody,
  DefinitionList,
  Disclosure,
  Notice,
  Section,
} from '@/components/ui';
import { StartPathButton } from '@/components/roadmap/start-path-button';
import { formatMinutes } from '@/lib/utils';
import { PathIcon } from '@/components/path-card';

export function generateStaticParams() {
  return careerPaths.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = pathBySlug(slug);
  if (!path) return { title: 'Parcours introuvable' };
  return { title: path.name, description: path.summary };
}

export default async function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = pathBySlug(slug);
  if (!path) notFound();

  const t = await getDictionary();
  const session = await getSession();
  const projects = projectsForPath(path.id);

  return (
    <PageShell>
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[
          { href: '/', label: t.nav.home },
          { href: '/parcours', label: t.nav.explore },
          { label: path.name },
        ]}
      />

      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <PathIcon name={path.icon} className="size-4" />
            {t.nav.myPath}
          </span>
        }
        title={path.name}
        description={path.description}
        actions={
          <StartPathButton
            pathId={path.id}
            isSignedIn={Boolean(session)}
            labels={{
              start: t.explore.startPath,
              signInFirst: t.nav.signUp,
              working: t.actions.loading,
            }}
          />
        }
      />

      {path.caution ? (
        <Notice tone="warning" title={t.labels.important} className="mb-6">
          {path.caution}
        </Notice>
      ) : null}

      <DefinitionList
        className="mb-8"
        items={[
          {
            term: t.explore.totalTime,
            description: `${path.estimatedHours} h · ${t.explore.stagesLabel(path.stages.length)}`,
          },
          { term: t.labels.level, description: t.levels[path.level] },
          {
            term: t.nav.projects,
            description: t.explore.projectsLabel(projects.length),
          },
          {
            term: t.explore.prerequisites,
            description:
              path.prerequisites.length > 0
                ? path.prerequisites.join(' · ')
                : t.explore.noPrerequisites,
          },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title={t.explore.whoIsItFor}>
          <BulletList marker="check" items={path.audience} />
        </Section>
        <Section title={t.explore.outcomes}>
          <BulletList marker="check" items={path.outcomes} />
        </Section>
      </div>

      <Section title={t.roadmap.stagesTitle} className="mt-10">
        <ol className="space-y-3">
          {path.stages.map((stage) => {
            const stageResources = resourcesByIds(stage.resourceIds);
            return (
              <li key={stage.id}>
                <Disclosure
                  summary={
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-brand-700">
                        {t.roadmap.stageLabel(stage.order)}
                      </span>
                      <span>{stage.name}</span>
                      <span className="text-sm font-normal text-sand-500">
                        {formatMinutes(stage.estimatedMinutes)}
                      </span>
                    </span>
                  }
                >
                  <div className="space-y-4">
                    <p className="flex gap-2 text-sand-700">
                      <Target aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" />
                      <span>
                        <strong className="font-semibold">{t.roadmap.objective} : </strong>
                        {stage.objective}
                      </span>
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                        {t.roadmap.skillsDeveloped}
                      </h4>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {stage.skillIds.map((skillId) => (
                          <li key={skillId}>
                            <Badge tone="brand">{skillById.get(skillId)?.name ?? skillId}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sand-500">
                        <ListChecks aria-hidden className="size-4" />
                        {t.roadmap.practicalExercise}
                      </h4>
                      <p className="mt-1 font-medium">{stage.practicalExercise.title}</p>
                      <p className="mt-1 text-sand-600">
                        <strong className="font-semibold">{t.roadmap.evidence} : </strong>
                        {stage.evidence}
                      </p>
                    </div>

                    {stageResources.length > 0 ? (
                      <p className="flex items-center gap-2 text-sand-600">
                        <Clock aria-hidden className="size-4" />
                        {t.resources.countLabel(stageResources.length)}
                      </p>
                    ) : null}
                  </div>
                </Disclosure>
              </li>
            );
          })}
        </ol>
      </Section>

      {projects.length > 0 ? (
        <Section title={t.nav.projects} description={t.projects.intro} className="mt-10">
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Card>
                  <CardBody>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="accent">{t.projects.difficulty[project.difficulty]}</Badge>
                      {project.simulated ? (
                        <Badge tone="warning">{t.projects.simulatedBadge}</Badge>
                      ) : null}
                      <Badge tone="neutral">{formatMinutes(project.estimatedMinutes)}</Badge>
                    </div>
                    <h3 className="mt-3 font-semibold">{project.title}</h3>
                    <p className="mt-1.5 text-sm text-sand-600">{project.objective}</p>
                    <ButtonLink
                      href={`/projets/${project.slug}`}
                      variant="link"
                      size="sm"
                      className="mt-2 px-0"
                    >
                      {t.explore.viewPath}
                    </ButtonLink>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className="mt-10 rounded-[--radius-card] border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-brand-900">{t.landing.finalCtaTitle}</p>
        <p className="mt-1 text-sm text-brand-800">
          {session ? t.roadmap.changeWarning : t.explore.guestNotice}
        </p>
        <div className="mt-4">
          <StartPathButton
            pathId={path.id}
            isSignedIn={Boolean(session)}
            labels={{
              start: t.explore.startPath,
              signInFirst: t.nav.signUp,
              working: t.actions.loading,
            }}
          />
        </div>
      </div>

      <p className="mt-8 text-sm text-sand-500">{t.legal.terms.sections.noGuarantee}</p>
    </PageShell>
  );
}
