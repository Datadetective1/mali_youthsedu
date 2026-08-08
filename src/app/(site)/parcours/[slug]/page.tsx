import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, ListChecks, Wrench } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { careerPaths, pathBySlug } from '@/content/paths';
import { projectsForPath } from '@/content/projects';
import { resourcesByIds } from '@/content/resources';
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
import { StagePreview } from '@/components/roadmap/stage-preview';
import { formatMinutes } from '@/lib/utils';
import { PathIcon } from '@/components/path-card';
import { plural } from '@/lib/i18n/format';

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
            description: `${path.estimatedHours} h · ${plural(t.explore.stagesLabel, path.stages.length)}`,
          },
          { term: t.labels.level, description: t.levels[path.level] },
          {
            term: t.nav.projects,
            description: plural(t.explore.projectsLabel, projects.length),
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

      <Section
        title={t.roadmap.stagesTitle}
        description={`${path.stages.length} étapes · ${path.estimatedHours} h au total. Chaque étape produit une preuve que vous pourrez montrer à un employeur.`}
        className="mt-10"
      >
        <ol className="space-y-3">
          {path.stages.map((stage) => {
            const stageResources = resourcesByIds(stage.resourceIds);
            return (
              <li key={stage.id}>
                <Disclosure
                  summary={
                    <StagePreview
                      stage={stage}
                      pathId={path.id}
                      resourceCount={stageResources.length}
                    />
                  }
                  summaryClassName="items-start"
                  expandLabel="Voir le détail de l’étape"
                >
                  {/* The preview above already carries the objective, the
                      skills and the evidence. Expanding must therefore reveal
                      something new — the actual work — rather than repeat what
                      the user just read. */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sand-500">
                        <ListChecks aria-hidden className="size-4" />
                        Ce que vous ferez
                      </h4>
                      <ol className="mt-2 space-y-2">
                        {stage.items.map((item, index) => (
                          <li key={item.id} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sand-100 text-xs font-bold text-sand-600"
                            >
                              {index + 1}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium text-sand-900">{item.title}</span>
                              {item.description ? (
                                <span className="mt-0.5 block text-sand-600">
                                  {item.description}
                                </span>
                              ) : null}
                              <span className="mt-0.5 block text-xs text-sand-500">
                                {formatMinutes(item.minutes)}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-sand-200 p-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sand-500">
                        <Wrench aria-hidden className="size-4" />
                        {t.roadmap.practicalExercise}
                      </h4>
                      <p className="mt-1 font-medium">{stage.practicalExercise.title}</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sand-700">
                        {stage.practicalExercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                      <p className="mt-3 rounded-lg bg-brand-50 p-2.5 text-brand-900">
                        <strong className="font-semibold">{t.projects.deliverable} : </strong>
                        {stage.practicalExercise.deliverable}
                      </p>
                    </div>

                    {stageResources.length > 0 ? (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sand-500">
                          <Clock aria-hidden className="size-4" />
                          {plural(t.resources.countLabel, stageResources.length)}
                        </h4>
                        <ul className="mt-2 space-y-1">
                          {stageResources.map((resource) => (
                            <li key={resource.id} className="text-sand-700">
                              <span className="font-medium">{resource.title}</span>
                              <span className="text-sand-500"> — {resource.provider}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
