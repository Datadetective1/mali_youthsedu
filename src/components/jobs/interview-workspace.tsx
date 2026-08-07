'use client';

import { useMemo, useState, useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { Checklist, ConfidenceWork, InterviewQuestion, StarExample } from '@/lib/types';
import { Badge, BulletList, Card, CardBody, Disclosure, Notice, Section } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { TextAreaField, TextField } from '@/components/ui/form';
import { ChecklistCard } from './checklist-card';
import {
  saveConfidenceWorkAction,
  saveInterviewAnswerAction,
  saveStarExampleAction,
} from '@/app/actions/jobs';

type Tab = 'checklist' | 'questions' | 'star' | 'confidence' | 'askThem' | 'followUp';

export function InterviewWorkspace({
  t,
  questions,
  answers,
  checklists,
  checklistStates,
  starExamples,
  confidence,
  isSignedIn,
}: {
  t: Dictionary;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  checklists: Checklist[];
  checklistStates: Record<string, string[]>;
  starExamples: StarExample[];
  confidence: ConfidenceWork | null;
  isSignedIn: boolean;
}) {
  const [tab, setTab] = useState<Tab>('checklist');
  const i = t.interview;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'checklist', label: i.tabs.checklist },
    { key: 'questions', label: i.tabs.questions },
    { key: 'star', label: i.tabs.star },
    { key: 'confidence', label: i.tabs.confidence },
    { key: 'askThem', label: i.tabs.askThem },
    { key: 'followUp', label: i.tabs.followUp },
  ];

  return (
    <div>
      {/* Button-based tabs with proper roles: a native <select> would hide the
          sections, and a link-based nav would reload the whole page. */}
      <div role="tablist" aria-label={i.title} className="mb-6 flex flex-wrap gap-2">
        {tabs.map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            id={`onglet-${entry.key}`}
            aria-selected={tab === entry.key}
            aria-controls={`panneau-${entry.key}`}
            onClick={() => setTab(entry.key)}
            className={
              tab === entry.key
                ? 'min-h-11 rounded-lg bg-brand-700 px-3 text-sm font-semibold text-white'
                : 'min-h-11 rounded-lg bg-sand-100 px-3 text-sm font-medium text-sand-700 hover:bg-sand-200'
            }
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panneau-${tab}`} aria-labelledby={`onglet-${tab}`}>
        {tab === 'checklist' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {checklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                initialDone={checklistStates[checklist.id] ?? []}
                isSignedIn={isSignedIn}
                countLabel={i.checklists.itemsDone}
              />
            ))}
          </div>
        ) : null}

        {tab === 'questions' ? (
          <QuestionBank t={t} questions={questions} answers={answers} isSignedIn={isSignedIn} />
        ) : null}

        {tab === 'star' ? (
          <StarSection t={t} examples={starExamples} isSignedIn={isSignedIn} />
        ) : null}

        {tab === 'confidence' ? (
          <ConfidenceSection t={t} initial={confidence} isSignedIn={isSignedIn} />
        ) : null}

        {tab === 'askThem' ? (
          <Section title={i.askThem.title} description={i.askThem.intro}>
            {checklists
              .filter((checklist) => checklist.id === 'chk-questions-to-ask')
              .map((checklist) => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  initialDone={checklistStates[checklist.id] ?? []}
                  isSignedIn={isSignedIn}
                  countLabel={i.checklists.itemsDone}
                />
              ))}
            <Notice tone="warning" title={i.askThem.avoid}>
              <BulletList items={i.askThem.avoidItems} />
            </Notice>
          </Section>
        ) : null}

        {tab === 'followUp' ? (
          <Section title={i.followUp.title} description={i.followUp.intro}>
            <Card>
              <CardBody>
                <h3 className="font-semibold">{i.followUp.rejectionTitle}</h3>
                <p className="mt-2 text-sand-700">{i.followUp.rejectionBody}</p>
                <BulletList className="mt-3 text-sand-700" items={i.followUp.rejectionQuestions} />
              </CardBody>
            </Card>
            <Notice tone="info">{i.followUp.templateHint}</Notice>
          </Section>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function QuestionBank({
  t,
  questions,
  answers,
  isSignedIn,
}: {
  t: Dictionary;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  isSignedIn: boolean;
}) {
  const q = t.interview.questions;
  const [category, setCategory] = useState<string>('');

  const categories = useMemo(
    () => Array.from(new Set(questions.map((question) => question.category))),
    [questions],
  );
  const filtered = category
    ? questions.filter((question) => question.category === category)
    : questions;

  const answered = Object.values(answers).filter((value) => value.trim().length > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold">
          {q.filterCategory}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="ml-2 min-h-11 rounded-lg border-2 border-sand-300 bg-white px-2 text-base focus:border-brand-600 focus:outline-none"
          >
            <option value="">{q.filterAll}</option>
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {q.categories[entry as keyof typeof q.categories] ?? entry}
              </option>
            ))}
          </select>
        </label>
        <Badge tone="brand">{q.answeredCount(answered)}</Badge>
      </div>

      <Notice tone="info">{q.noAudioNotice}</Notice>
      <p className="text-sm text-sand-600">{q.practiceHint}</p>

      <ul className="space-y-3">
        {filtered.map((question) => (
          <li key={question.id}>
            <Disclosure summary={question.question}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                    {q.whyAsked}
                  </h4>
                  <p className="mt-1 text-sand-700">{question.whyAsked}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                    {q.whatTheyListenFor}
                  </h4>
                  <BulletList className="mt-1 text-sand-700" items={question.whatTheyListenFor} />
                </div>
                <Notice tone="warning" title={q.trap}>
                  {question.trap}
                </Notice>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                    {q.structure}
                  </h4>
                  <BulletList marker="decimal" className="mt-1 text-sand-700" items={question.structure} />
                </div>

                <AnswerEditor
                  questionId={question.id}
                  initial={answers[question.id] ?? ''}
                  isSignedIn={isSignedIn}
                  labels={{
                    label: q.myAnswer,
                    placeholder: q.myAnswerPlaceholder,
                    save: t.actions.save,
                    saving: t.actions.saving,
                    saved: q.answerSaved,
                    signIn: t.recommendation.guestSaveNotice,
                  }}
                />
              </div>
            </Disclosure>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnswerEditor({
  questionId,
  initial,
  isSignedIn,
  labels,
}: {
  questionId: string;
  initial: string;
  isSignedIn: boolean;
  labels: {
    label: string;
    placeholder: string;
    save: string;
    saving: string;
    saved: string;
    signIn: string;
  };
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <TextAreaField
        label={labels.label}
        placeholder={labels.placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={6}
        maxLength={10000}
      />
      {isSignedIn ? (
        <div className="mt-2 flex items-center gap-3">
          <Button
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await saveInterviewAnswerAction(questionId, value);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              })
            }
          >
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
            {pending ? labels.saving : labels.save}
          </Button>
          {saved ? (
            <span role="status" className="text-sm font-medium text-success-700">
              {labels.saved}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-sm text-sand-500">{labels.signIn}</p>
      )}
    </div>
  );
}

function StarSection({
  t,
  examples,
  isSignedIn,
}: {
  t: Dictionary;
  examples: StarExample[];
  isSignedIn: boolean;
}) {
  const s = t.interview.star;
  const [draft, setDraft] = useState({
    label: '',
    situation: '',
    task: '',
    action: '',
    result: '',
  });
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Section title={s.title} description={s.intro}>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {s.steps.map((step) => (
          <li key={step.letter} className="rounded-[--radius-card] border border-sand-200 bg-white p-4">
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-lg bg-brand-700 text-lg font-bold text-white"
            >
              {step.letter}
            </span>
            <h3 className="mt-3 font-semibold">{step.name}</h3>
            <p className="mt-1 text-sm text-sand-600">{step.body}</p>
            <p className="mt-2 rounded-lg bg-sand-50 p-2 text-sm italic text-sand-700">
              {step.example}
            </p>
          </li>
        ))}
      </ol>

      <Notice tone="warning" title={s.commonMistakes}>
        <BulletList items={s.mistakes} />
      </Notice>

      <Card>
        <CardBody className="space-y-4">
          <div>
            <h3 className="font-semibold">{s.builderTitle}</h3>
            <p className="mt-1 text-sm text-sand-600">{s.builderIntro}</p>
          </div>

          <TextField
            label="Titre de l’exemple"
            value={draft.label}
            onChange={(event) => setDraft({ ...draft, label: event.target.value })}
            maxLength={200}
          />
          {(['situation', 'task', 'action', 'result'] as const).map((key, index) => (
            <TextAreaField
              key={key}
              label={`${s.steps[index]?.letter} — ${s.steps[index]?.name}`}
              hint={s.steps[index]?.body}
              rows={3}
              maxLength={3000}
              value={draft[key]}
              onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
            />
          ))}

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await saveStarExampleAction(draft);
                    setDraft({ label: '', situation: '', task: '', action: '', result: '' });
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                  })
                }
              >
                {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
                {t.actions.save}
              </Button>
              {saved ? (
                <span role="status" className="text-sm font-medium text-success-700">
                  {s.builderSaved}
                </span>
              ) : null}
            </div>
          ) : (
            <Notice tone="info">{t.recommendation.guestSaveNotice}</Notice>
          )}
        </CardBody>
      </Card>

      {examples.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {examples.map((example) => (
            <li key={example.id}>
              <Card>
                <CardBody>
                  <h4 className="font-semibold">{example.label || 'Exemple'}</h4>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div>
                      <dt className="font-semibold text-sand-500">S</dt>
                      <dd className="text-sand-700">{example.situation}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-sand-500">T</dt>
                      <dd className="text-sand-700">{example.task}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-sand-500">A</dt>
                      <dd className="text-sand-700">{example.action}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-sand-500">R</dt>
                      <dd className="text-sand-700">{example.result}</dd>
                    </div>
                  </dl>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}

function ConfidenceSection({
  t,
  initial,
  isSignedIn,
}: {
  t: Dictionary;
  initial: ConfidenceWork | null;
  isSignedIn: boolean;
}) {
  const c = t.interview.confidence;
  const [state, setState] = useState({
    fearedQuestion: initial?.fearedQuestion ?? '',
    preparedAnswer: initial?.preparedAnswer ?? '',
    evidence: initial?.evidence ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Section title={c.title} description={c.intro} id="confiance">
      {/* Confidence exercises can shade into territory this product has no
          business in. Saying so plainly is part of the design. */}
      <Notice tone="info">{c.notTherapy}</Notice>

      <div className="grid gap-3 sm:grid-cols-2">
        {c.exercises.map((exercise) => (
          <Card key={exercise.title}>
            <CardBody>
              <h3 className="font-semibold">{exercise.title}</h3>
              <p className="mt-1.5 text-sm text-sand-600">{exercise.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-4">
          <TextField
            label={c.fearedQuestionLabel}
            value={state.fearedQuestion}
            onChange={(event) => setState({ ...state, fearedQuestion: event.target.value })}
            maxLength={2000}
          />
          <TextAreaField
            label={c.fearedAnswerLabel}
            rows={4}
            maxLength={5000}
            value={state.preparedAnswer}
            onChange={(event) => setState({ ...state, preparedAnswer: event.target.value })}
          />
          <TextAreaField
            label={c.evidenceLabel}
            placeholder={c.evidencePlaceholder}
            rows={6}
            maxLength={5000}
            value={state.evidence}
            onChange={(event) => setState({ ...state, evidence: event.target.value })}
          />

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await saveConfidenceWorkAction(state);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                  })
                }
              >
                {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
                {t.actions.save}
              </Button>
              {saved ? (
                <span role="status" className="text-sm font-medium text-success-700">
                  {t.actions.saved}
                </span>
              ) : null}
            </div>
          ) : (
            <Notice tone="info">{t.recommendation.guestSaveNotice}</Notice>
          )}
        </CardBody>
      </Card>
    </Section>
  );
}
