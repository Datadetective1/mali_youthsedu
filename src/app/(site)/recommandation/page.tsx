import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CalendarClock, Sparkles } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getOnboarding, getPreferences } from '@/lib/db/repository';
import { recommendPaths } from '@/lib/engine/recommendation';
import { pathById } from '@/content/paths';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Badge, BulletList, Card, CardBody, Notice, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { PathCard } from '@/components/path-card';
import { AcceptRecommendation } from '@/components/onboarding/accept-recommendation';
import { format, plural } from '@/lib/i18n/format';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.recommendation.metaTitle, robots: { index: false } };
}

export default async function RecommendationPage() {
  const t = await getDictionary();
  const session = await getSession();
  if (!session) redirect(`/connexion?suivant=${encodeURIComponent('/recommandation')}`);

  const answers = await getOnboarding(session.userId);
  if (!answers) redirect('/bienvenue');

  const preferences = await getPreferences(session.userId);
  const recommendation = recommendPaths(answers);

  const primary = pathById.get(recommendation.primaryPathId);
  const supporting = recommendation.supportingPathId
    ? pathById.get(recommendation.supportingPathId)
    : null;

  if (!primary) redirect('/parcours');

  return (
    <PageShell>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Sparkles aria-hidden className="size-4" />
            {t.recommendation.primaryLabel}
          </span>
        }
        title={t.recommendation.title}
        description={t.recommendation.subtitle}
      />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6">
          <PathCard path={primary} stagesLabel={plural(t.explore.stagesLabel, primary.stages.length)} />

          <Card>
            <CardBody>
              <h2 className="font-bold">{t.recommendation.whyTitle}</h2>
              <ul className="mt-3 space-y-3">
                {recommendation.reasons.map((reason) => (
                  <li key={`${reason.factor}-${reason.explanation}`} className="flex gap-3">
                    <Badge tone="brand" className="mt-0.5 shrink-0">
                      {reason.factor}
                    </Badge>
                    <span className="text-sand-700">{reason.explanation}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {supporting ? (
            <Section title={t.recommendation.supportingLabel} description={t.recommendation.supportingWhy}>
              <PathCard
                path={supporting}
                stagesLabel={plural(t.explore.stagesLabel, supporting.stages.length)}
                compact
              />
            </Section>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="flex items-center gap-2 font-bold">
                <CalendarClock aria-hidden className="size-5 text-brand-700" />
                {t.recommendation.scheduleTitle}
              </h2>
              <p className="mt-2 text-sand-700">
                {format(t.recommendation.scheduleBody, {
                  hours: preferences.hoursPerWeek,
                  weeks: recommendation.estimatedWeeks,
                })}
              </p>

              <div className="mt-5">
                <AcceptRecommendation
                  pathId={primary.id}
                  supportingPathId={supporting?.id ?? null}
                  labels={{
                    accept: t.recommendation.acceptAction,
                    working: t.actions.loading,
                  }}
                />
              </div>

              <ButtonLink href="/parcours" variant="ghost" block className="mt-2">
                {t.recommendation.chooseAnother}
              </ButtonLink>
            </CardBody>
          </Card>

          <Notice tone="info" title={t.recommendation.notRightTitle}>
            {t.recommendation.notRightBody}
          </Notice>
        </div>
      </div>

      {recommendation.alternatives.length > 0 ? (
        <Section title={t.recommendation.alternativesTitle} className="mt-12">
          <ul className="grid gap-4 sm:grid-cols-3">
            {recommendation.alternatives.map((pathId) => {
              const path = pathById.get(pathId);
              if (!path) return null;
              return (
                <li key={pathId}>
                  <PathCard
                    path={path}
                    stagesLabel={plural(t.explore.stagesLabel, path.stages.length)}
                    compact
                  />
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      <Section title={t.explore.outcomes} className="mt-12">
        <BulletList marker="check" items={primary.outcomes} />
      </Section>
    </PageShell>
  );
}
