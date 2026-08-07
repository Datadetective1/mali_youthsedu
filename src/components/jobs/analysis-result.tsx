'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, CircleDot, Save } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { JobComparison, JobExtraction, RequirementMatch, SixQuestionKey } from '@/lib/types';
import { Badge, BulletList, Card, CardBody, Disclosure, Notice, ProgressBar, Section } from '@/components/ui';
import { Button, ButtonLink } from '@/components/ui/button';
import { TextAreaField } from '@/components/ui/form';
import { groupMatches } from '@/lib/engine/matching';
import { saveAnalysisAnswersAction } from '@/app/actions/jobs';
import { format } from '@/lib/i18n/format';

/**
 * Renders the analysis.
 *
 * Order matters: what the advert demands, then how the profile compares, then
 * the readiness index — and the index carries its disclaimer and its full
 * weighting inline, because a bare number invites the reader to treat it as a
 * probability of being hired.
 */
export function AnalysisResult({
  t,
  extraction,
  comparison,
  hasProfile,
  analysisId,
  isSignedIn,
}: {
  t: Dictionary;
  extraction: JobExtraction;
  comparison: JobComparison | null;
  hasProfile: boolean;
  analysisId: string | null;
  isSignedIn: boolean;
}) {
  const e = t.analyzer.extracted;
  const grouped = comparison ? groupMatches(comparison.matches) : null;

  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------- What it demands */}
      <Section title={e.title} description={extraction.jobTitle}>
        <div className="grid gap-4 sm:grid-cols-2">
          <RequirementList title={e.responsibilities} items={extraction.responsibilities} empty={e.emptySection} />
          <RequirementList
            title={e.requiredSkills}
            items={extraction.requiredSkills.map((item) => item.label)}
            empty={e.emptySection}
            tone="brand"
          />
          <RequirementList
            title={e.preferredSkills}
            items={extraction.preferredSkills.map((item) => item.label)}
            empty={e.emptySection}
          />
          <RequirementList
            title={e.languages}
            items={extraction.languages.map((item) => item.label)}
            empty={e.emptySection}
          />
          <RequirementList
            title={e.tools}
            items={extraction.tools.map((item) => item.label)}
            empty={e.emptySection}
          />
          <RequirementList
            title={e.behavioral}
            items={extraction.behavioral.map((item) => item.label)}
            empty={e.emptySection}
          />
          <RequirementList
            title={e.education}
            items={extraction.education.map((item) => item.label)}
            empty={e.emptySection}
          />
          <RequirementList
            title={e.experience}
            items={extraction.experience.map((item) => item.label)}
            empty={e.emptySection}
          />
        </div>

        {extraction.keywords.length > 0 ? (
          <Card>
            <CardBody>
              <h3 className="font-semibold">{e.keywords}</h3>
              <p className="mt-1 text-sm text-sand-500">{e.keywordsHint}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {extraction.keywords.map((keyword) => (
                  <li key={keyword}>
                    <Badge tone="neutral">{keyword}</Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ) : null}

        {extraction.interviewThemes.length > 0 ? (
          <Card>
            <CardBody>
              <h3 className="font-semibold">{e.interviewThemes}</h3>
              <BulletList className="mt-2 text-sand-700" items={extraction.interviewThemes} />
            </CardBody>
          </Card>
        ) : null}
      </Section>

      {/* --------------------------------------------------------- Comparison */}
      {!hasProfile || !comparison || !grouped ? (
        <Notice tone="info" title={t.analyzer.comparison.noProfileTitle}>
          <p>{t.analyzer.comparison.noProfileBody}</p>
          <ButtonLink href="/bienvenue" size="sm" className="mt-3">
            {t.analyzer.comparison.noProfileCta}
          </ButtonLink>
        </Notice>
      ) : (
        <>
          <Section title={t.analyzer.comparison.title}>
            <MatchGroup
              title={t.analyzer.comparison.strong}
              hint={t.analyzer.comparison.strongHint}
              matches={grouped.strong}
              tone="success"
            />
            <MatchGroup
              title={t.analyzer.comparison.partial}
              hint={t.analyzer.comparison.partialHint}
              matches={grouped.partial}
              tone="warning"
            />
            <MatchGroup
              title={t.analyzer.comparison.missing}
              hint={t.analyzer.comparison.missingHint}
              matches={grouped.missing}
              tone="danger"
            />

            {comparison.experienceGap ? (
              <Notice tone="warning" title={t.analyzer.comparison.experienceGap}>
                {comparison.experienceGap}
              </Notice>
            ) : null}

            {comparison.transferable.length > 0 ? (
              <Card>
                <CardBody>
                  <h3 className="font-semibold">{t.analyzer.comparison.transferable}</h3>
                  <p className="mt-1 text-sm text-sand-500">
                    {t.analyzer.comparison.transferableHint}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {comparison.transferable.map((item) => (
                      <li key={item.label}>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-sand-600">{item.rationale}</p>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ) : null}
          </Section>

          <ReadinessPanel t={t} comparison={comparison} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardBody>
                <h3 className="font-semibold">{t.analyzer.comparison.recommendedActions}</h3>
                <ul className="mt-3 space-y-2">
                  {comparison.recommendedActions.map((action, index) => (
                    <li key={`${action.label}-${index}`} className="flex items-start gap-2">
                      <CircleDot aria-hidden className="mt-1 size-4 shrink-0 text-brand-600" />
                      <span>
                        {action.label}
                        {action.pathId ? (
                          <>
                            {' — '}
                            <Link
                              href={`/parcours/${action.pathId}`}
                              className="text-brand-700 underline underline-offset-2"
                            >
                              {t.explore.viewPath}
                            </Link>
                          </>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold">{t.analyzer.comparison.questionsToResearch}</h3>
                <BulletList className="mt-3 text-sand-700" items={comparison.questionsToResearch} />
                <h3 className="mt-5 font-semibold">{t.analyzer.comparison.examplesToPrepare}</h3>
                <BulletList className="mt-3 text-sand-700" items={comparison.examplesToPrepare} />
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* ---------------------------------------------------- Six key questions */}
      <SixQuestions t={t} analysisId={analysisId} isSignedIn={isSignedIn} />
    </div>
  );
}

// ---------------------------------------------------------------------------

function RequirementList({
  title,
  items,
  empty,
  tone = 'neutral',
}: {
  title: string;
  items: string[];
  empty: string;
  tone?: 'neutral' | 'brand';
}) {
  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold">{title}</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-sand-500">{empty}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {items.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Badge tone={tone}>{item}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

function MatchGroup({
  title,
  hint,
  matches,
  tone,
}: {
  title: string;
  hint: string;
  matches: RequirementMatch[];
  tone: 'success' | 'warning' | 'danger';
}) {
  if (matches.length === 0) return null;

  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warning' ? CircleDot : AlertCircle;
  const colour =
    tone === 'success'
      ? 'text-success-600'
      : tone === 'warning'
        ? 'text-warning-600'
        : 'text-danger-600';

  return (
    <Card>
      <CardBody>
        <h3 className="flex items-center gap-2 font-semibold">
          <Icon aria-hidden className={`size-5 ${colour}`} />
          {title}
          <Badge tone={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : 'success'}>
            {matches.length}
          </Badge>
        </h3>
        <p className="mt-1 text-sm text-sand-500">{hint}</p>

        <ul className="mt-3 space-y-3">
          {matches.map((match) => (
            <li key={match.requirementId} className="border-l-2 border-sand-200 pl-3">
              <p className="font-medium text-sand-900">{match.label}</p>
              <p className="mt-0.5 text-sm text-sand-600">{match.rationale}</p>
              {match.pathId ? (
                <Link
                  href={`/parcours/${match.pathId}`}
                  className="mt-1 inline-block text-sm text-brand-700 underline underline-offset-2"
                >
                  {match.suggestion}
                </Link>
              ) : match.suggestion ? (
                <p className="mt-1 text-sm text-sand-500">{match.suggestion}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function ReadinessPanel({ t, comparison }: { t: Dictionary; comparison: JobComparison }) {
  const { readiness } = comparison;
  const band = t.analyzer.readiness.bands;
  const bandTitle =
    readiness.band === 'low' ? band.low : readiness.band === 'medium' ? band.medium : band.high;
  const bandBody =
    readiness.band === 'low'
      ? band.lowBody
      : readiness.band === 'medium'
        ? band.mediumBody
        : band.highBody;

  return (
    <Card>
      <CardBody>
        <h2 className="text-lg font-bold">{t.analyzer.readiness.title}</h2>

        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-4xl font-bold tabular-nums text-brand-800">{readiness.score}</p>
          <p className="text-sand-600">
            {format(t.analyzer.readiness.scoreOf, { score: readiness.score })}
          </p>
          <Badge
            tone={
              readiness.band === 'high' ? 'success' : readiness.band === 'medium' ? 'accent' : 'warning'
            }
          >
            {bandTitle}
          </Badge>
        </div>

        <p className="mt-3 text-sand-700">{bandBody}</p>

        {/* Non-negotiable: the number never appears without this sentence. */}
        <Notice tone="warning" className="mt-4">
          {t.analyzer.readiness.disclaimer}
        </Notice>

        <Disclosure className="mt-4" summary={t.analyzer.readiness.breakdown}>
          <ul className="space-y-4">
            {readiness.components.map((component) => (
              <li key={component.key}>
                <ProgressBar
                  value={component.score}
                  total={100}
                  label={`${component.label} (${t.analyzer.readiness.weight} : ${component.weight})`}
                />
                <p className="mt-1 text-sm text-sand-600">{component.detail}</p>
              </li>
            ))}
          </ul>
        </Disclosure>
      </CardBody>
    </Card>
  );
}

const QUESTION_KEYS: SixQuestionKey[] = [
  'whyRole',
  'whyCompany',
  'whyMe',
  'myGaps',
  'howCompensate',
  'whatValue',
];

function SixQuestions({
  t,
  analysisId,
  isSignedIn,
}: {
  t: Dictionary;
  analysisId: string | null;
  isSignedIn: boolean;
}) {
  const q = t.analyzer.sixQuestions;
  const [answers, setAnswers] = useState<Partial<Record<SixQuestionKey, string>>>({});
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const prompts: Record<SixQuestionKey, { label: string; hint: string }> = {
    whyRole: { label: q.whyRole, hint: q.whyRoleHint },
    whyCompany: { label: q.whyCompany, hint: q.whyCompanyHint },
    whyMe: { label: q.whyMe, hint: q.whyMeHint },
    myGaps: { label: q.myGaps, hint: q.myGapsHint },
    howCompensate: { label: q.howCompensate, hint: q.howCompensateHint },
    whatValue: { label: q.whatValue, hint: q.whatValueHint },
  };

  return (
    <Section title={t.analyzer.sixQuestionsTitle}>
      <div className="space-y-4">
        {QUESTION_KEYS.map((key) => (
          <TextAreaField
            key={key}
            label={prompts[key].label}
            hint={prompts[key].hint}
            rows={3}
            maxLength={4000}
            value={answers[key] ?? ''}
            onChange={(event) =>
              setAnswers((current) => ({ ...current, [key]: event.target.value }))
            }
          />
        ))}
      </div>

      {isSignedIn && analysisId ? (
        <div className="flex items-center gap-3">
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await saveAnalysisAnswersAction({ analysisId, answers });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              })
            }
          >
            <Save aria-hidden />
            {pending ? t.actions.saving : q.saveAnswers}
          </Button>
          {saved ? (
            <span role="status" className="text-sm font-medium text-success-700">
              {q.answersSaved}
            </span>
          ) : null}
        </div>
      ) : (
        <Notice tone="info">{t.recommendation.guestSaveNotice}</Notice>
      )}
    </Section>
  );
}
