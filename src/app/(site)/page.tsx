import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CircleDollarSign,
  HandHeart,
  Lightbulb,
  MessageSquare,
  Send,
  ShieldCheck,
  Signpost,
  Target,
  Wrench,
  WifiOff,
} from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { careerPaths } from '@/content/paths';
import { ButtonLink } from '@/components/ui/button';
import { Badge, BulletList, Card, CardBody, Section } from '@/components/ui';
import { PageShell } from '@/components/layout/page';
import { PathCard } from '@/components/path-card';
import { JourneyIllustration } from '@/components/visual/journey-illustration';
import { plural } from '@/lib/i18n/format';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.landing.metaTitle, description: t.landing.metaDescription };
}

const JOURNEY_ICONS = [Signpost, Lightbulb, Wrench, Target, Send, CircleDollarSign, HandHeart];

const DIMENSION_ICONS = [Wrench, HandHeart, Brain, MessageSquare];

export default async function LandingPage() {
  const t = await getDictionary();
  const session = await getSession();

  const dimensions = [
    {
      title: 'Savoir-faire',
      body: 'La capacité technique et pratique : les gestes du métier, les outils, les procédures.',
    },
    {
      title: 'Savoir-être',
      body: 'La conduite professionnelle : fiabilité, ponctualité, travail en équipe, attitude, confiance.',
    },
    {
      title: 'Capacité de réflexion',
      body: 'Analyser, prendre une initiative, s’adapter, résoudre un problème que l’on n’a jamais vu.',
    },
    {
      title: 'Savoir communiquer',
      body: 'S’exprimer clairement à l’écrit et à l’oral, écouter réellement, en français et en anglais.',
    },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="border-b border-sand-200 bg-white">
        <PageShell width="wide" className="py-10 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                {t.landing.heroEyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
                {t.landing.heroTitle}
              </h1>
              <p className="mt-4 text-lg text-sand-700">{t.landing.heroBody}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={session ? '/tableau-de-bord' : '/bienvenue'} size="lg">
                  {t.landing.heroPrimaryCta}
                  <ArrowRight aria-hidden />
                </ButtonLink>
                <ButtonLink href="/parcours" size="lg" variant="secondary">
                  {t.landing.heroSecondaryCta}
                </ButtonLink>
              </div>
              <p className="mt-3 text-sm text-sand-500">{t.landing.heroNoAccount}</p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {t.landing.heroPoints.map((point) => (
                  <li key={point}>
                    <Badge tone="brand">{point}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inline SVG, ~2 KB. A photograph here would cost 100–400 KB on a
                connection where that is real money. */}
            <JourneyIllustration className="hidden h-auto w-full sm:block" />
          </div>
        </PageShell>
      </section>

      <PageShell width="wide" className="space-y-14 sm:space-y-20">
        {/* ------------------------------------------------------------ Problem */}
        <Section id="probleme" title={t.landing.problemTitle} description={t.landing.problemBody}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.landing.problemItems.map((item) => (
              <Card key={item.title}>
                <CardBody>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-sand-600">{item.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Section>

        {/* --------------------------------------------------------- How it works */}
        <Section id="fonctionnement" title={t.landing.howTitle} description={t.landing.howBody}>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.landing.howSteps.map((step, index) => {
              const Icon = JOURNEY_ICONS[index] ?? Signpost;
              return (
                <li
                  key={step.title}
                  className="rounded-[--radius-card] border border-sand-200 bg-white p-4"
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-lg bg-accent-50 text-accent-700"
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-sand-400">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-sand-600">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* ------------------------------------------------------------- Pathways */}
        <Section
          id="parcours"
          title={t.landing.pathsTitle}
          description={t.landing.pathsBody}
          action={
            <ButtonLink href="/parcours" variant="secondary">
              {t.landing.pathsCta}
            </ButtonLink>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careerPaths.slice(0, 6).map((path) => (
              <PathCard
                key={path.id}
                path={path}
                stagesLabel={plural(t.explore.stagesLabel, path.stages.length)}
              />
            ))}
          </div>
        </Section>

        {/* ----------------------------------------------------------- Dimensions */}
        <Section
          id="dimensions"
          title={t.landing.dimensionsTitle}
          description={t.landing.dimensionsBody}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dimensions.map((dimension, index) => {
              const Icon = DIMENSION_ICONS[index] ?? Wrench;
              return (
                <Card key={dimension.title}>
                  <CardBody>
                    <Icon aria-hidden className="size-6 text-brand-700" />
                    <h3 className="mt-3 font-semibold">{dimension.title}</h3>
                    <p className="mt-1.5 text-sm text-sand-600">{dimension.body}</p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Section>

        {/* -------------------------------------------------------------- Offline */}
        <Section id="hors-ligne" title={t.landing.offlineTitle} description={t.landing.offlineBody}>
          <Card>
            <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <span
                aria-hidden
                className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
              >
                <WifiOff className="size-7" />
              </span>
              <BulletList marker="check" items={t.landing.offlinePoints} className="flex-1" />
            </CardBody>
          </Card>
        </Section>

        {/* -------------------------------------------------------------- Privacy */}
        <Section id="engagements" title={t.landing.privacyTitle}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.landing.privacyPoints.map((point) => (
              <Card key={point.title}>
                <CardBody>
                  <ShieldCheck aria-hidden className="size-6 text-brand-700" />
                  <h3 className="mt-3 font-semibold">{point.title}</h3>
                  <p className="mt-1.5 text-sm text-sand-600">{point.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <p className="text-sm text-sand-500">
            <Link href="/confidentialite" className="underline underline-offset-4 hover:text-brand-800">
              {t.footer.privacy}
            </Link>
            {' · '}
            <Link href="/conditions" className="underline underline-offset-4 hover:text-brand-800">
              {t.footer.terms}
            </Link>
          </p>
        </Section>

        {/* ------------------------------------------------------------ Final CTA */}
        <section className="rounded-[--radius-card] border border-brand-200 bg-brand-50 p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-brand-900">{t.landing.finalCtaTitle}</h2>
          <p className="mt-2 max-w-2xl text-brand-800">{t.landing.finalCtaBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={session ? '/tableau-de-bord' : '/bienvenue'} size="lg">
              {t.landing.heroPrimaryCta}
              <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink href="/parcours" size="lg" variant="secondary">
              {t.landing.heroSecondaryCta}
            </ButtonLink>
          </div>
        </section>
      </PageShell>
    </>
  );
}
