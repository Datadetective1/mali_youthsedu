'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { OnboardingAnswers } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckboxCardGroup, RadioCardGroup } from '@/components/ui/form';
import { Notice, ProgressBar } from '@/components/ui';
import { saveOnboardingAction } from '@/app/actions/account';
import { format } from '@/lib/i18n/format';

type Answers = Partial<OnboardingAnswers>;

/**
 * Onboarding questionnaire.
 *
 * One question per screen. On a small phone a long scrolling form reads as
 * work; a single question with big targets reads as a conversation, and the
 * abandonment rate reflects that.
 *
 * Sensitive questions are skippable, and nothing is stored until the last step.
 */
export function OnboardingWizard({
  labels,
  initialAnswers,
}: {
  labels: Dictionary['onboarding'];
  initialAnswers: Answers;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const steps = useMemo(() => buildSteps(labels), [labels]);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  function set<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function next() {
    if (!step) return;
    if (!step.optional && !isAnswered(answers, step.key)) {
      setError('Choisissez une réponse pour continuer.');
      return;
    }
    if (isLast) {
      submit();
      return;
    }
    setIndex((value) => value + 1);
    setError(null);
  }

  function submit() {
    startTransition(async () => {
      const result = await saveOnboardingAction(answers);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push('/recommandation');
      router.refresh();
    });
  }

  if (!step) return null;

  return (
    <div className="space-y-6">
      <div>
        <ProgressBar
          value={index + 1}
          total={steps.length}
          label={labels.progressLabel}
          showValue={false}
        />
        <p className="mt-1 text-sm text-sand-600">{format(labels.stepOf, { current: index + 1, total: steps.length })}</p>
      </div>

      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        {labels.sections[step.section]}
      </p>

      {error ? (
        <Notice tone="danger" role="alert">
          {error}
        </Notice>
      ) : null}

      {step.kind === 'single' ? (
        <RadioCardGroup
          legend={step.legend}
          hint={step.hint}
          name={String(step.key)}
          columns={step.options.length > 5 ? 2 : 1}
          options={step.options}
          value={answers[step.key] as string | undefined}
          onChange={(value) => set(step.key, value as never)}
        />
      ) : (
        <CheckboxCardGroup
          legend={step.legend}
          hint={step.hint}
          options={step.options}
          max={3}
          values={(answers.interests as string[]) ?? []}
          onChange={(values) => set('interests', values as OnboardingAnswers['interests'])}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
        <Button
          variant="ghost"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0 || pending}
        >
          <ArrowLeft aria-hidden />
          Précédent
        </Button>

        <div className="flex items-center gap-2">
          {step.optional ? (
            <Button
              variant="quiet"
              onClick={() => (isLast ? submit() : setIndex((value) => value + 1))}
              disabled={pending}
            >
              {labels.skipQuestion}
            </Button>
          ) : null}

          <Button onClick={next} disabled={pending}>
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
            {pending ? labels.savingProfile : isLast ? labels.finishAction : 'Suivant'}
            {!pending && !isLast ? <ArrowRight aria-hidden /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

type StepKey = keyof OnboardingAnswers;

interface Step {
  key: StepKey;
  kind: 'single' | 'multi';
  section: keyof Dictionary['onboarding']['sections'];
  legend: string;
  hint?: string;
  optional?: boolean;
  options: { value: string; label: string }[];
}

function toOptions(record: Record<string, string>): { value: string; label: string }[] {
  return Object.entries(record).map(([value, label]) => ({ value, label }));
}

function buildSteps(labels: Dictionary['onboarding']): Step[] {
  const o = labels.options;
  return [
    {
      key: 'ageRange',
      kind: 'single',
      section: 'about',
      legend: labels.q.ageRange,
      hint: labels.q.ageRangeHint,
      optional: true,
      options: toOptions(o.ageRange),
    },
    {
      key: 'educationLevel',
      kind: 'single',
      section: 'about',
      legend: labels.q.educationLevel,
      options: toOptions(o.education),
    },
    {
      key: 'status',
      kind: 'single',
      section: 'situation',
      legend: labels.q.status,
      options: toOptions(o.status),
    },
    {
      key: 'locationType',
      kind: 'single',
      section: 'situation',
      legend: labels.q.locationType,
      hint: labels.q.locationTypeHint,
      options: toOptions(o.location),
    },
    {
      key: 'frenchLevel',
      kind: 'single',
      section: 'skills',
      legend: labels.q.frenchLevel,
      options: toOptions(o.frenchLevel),
    },
    {
      key: 'englishLevel',
      kind: 'single',
      section: 'skills',
      legend: labels.q.englishLevel,
      options: toOptions(o.englishLevel),
    },
    {
      key: 'digitalLevel',
      kind: 'single',
      section: 'skills',
      legend: labels.q.digitalLevel,
      options: toOptions(o.digitalLevel),
    },
    {
      key: 'goal',
      kind: 'single',
      section: 'goal',
      legend: labels.q.goal,
      options: toOptions(o.goal),
    },
    {
      key: 'interests',
      kind: 'multi',
      section: 'goal',
      legend: labels.q.interests,
      hint: labels.q.interestsHint,
      options: toOptions(o.interests),
    },
    {
      key: 'hoursPerWeek',
      kind: 'single',
      section: 'practical',
      legend: labels.q.hoursPerWeek,
      options: toOptions(o.hours),
    },
    {
      key: 'connectivity',
      kind: 'single',
      section: 'practical',
      legend: labels.q.connectivity,
      options: toOptions(o.connectivity),
    },
    {
      key: 'device',
      kind: 'single',
      section: 'practical',
      legend: labels.q.device,
      options: toOptions(o.device),
    },
    {
      key: 'experience',
      kind: 'single',
      section: 'about',
      legend: labels.q.experience,
      hint: labels.q.experienceHint,
      options: toOptions(o.experience),
    },
    {
      key: 'learningStyle',
      kind: 'single',
      section: 'practical',
      legend: labels.q.learningStyle,
      options: toOptions(o.learningStyle),
    },
  ];
}

function isAnswered(answers: Answers, key: StepKey): boolean {
  const value = answers[key];
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null;
}
