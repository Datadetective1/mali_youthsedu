'use client';

import { useRef, useState, useTransition } from 'react';
import { CheckCircle2, Circle, Loader2, Lock, Save } from 'lucide-react';
import type { KnowledgeCheck, LearningResource, RoadmapStage } from '@/lib/types';
import { Badge, BulletList, Card, CardBody, Notice, ProgressBar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { CheckboxRow } from '@/components/ui/form';
import { ResourceCard } from '@/components/resources/resource-card';
import { saveNoteAction, setItemCompletionAction } from '@/app/actions/learning';
import { queueOperation } from '@/lib/offline/client';
import { cn, formatMinutes } from '@/lib/utils';

export interface StagePanelLabels {
  stageLabel: string;
  objective: string;
  skills: string;
  resources: string;
  practicalExercise: string;
  stageTasks: string;
  checklist: string;
  reflection: string;
  reflectionHint: string;
  evidence: string;
  evidenceHint: string;
  knowledgeCheck: string;
  knowledgeCheckHint: string;
  checkAnswer: string;
  correct: string;
  incorrect: string;
  explanation: string;
  myNotes: string;
  notesPlaceholder: string;
  notesSaved: string;
  save: string;
  saving: string;
  locked: string;
  unlockAnyway: string;
  progressLabel: string;
  deliverable: string;
  offlineQueued: string;
}

/**
 * One roadmap stage.
 *
 * Completion is optimistic and queued: a tick lands immediately in the UI and
 * is replayed later if the request fails. On an intermittent connection the
 * alternative — a checkbox that silently bounces back — is what makes people
 * stop trusting the app.
 */
export function StagePanel({
  stage,
  pathId,
  resources,
  completedItemIds,
  initialNote,
  locked,
  skillNames,
  labels,
}: {
  stage: RoadmapStage;
  pathId: string;
  resources: LearningResource[];
  completedItemIds: string[];
  initialNote: string;
  locked: boolean;
  skillNames: string[];
  labels: StagePanelLabels;
}) {
  const [completed, setCompleted] = useState(() => new Set(completedItemIds));
  const [unlocked, setUnlocked] = useState(!locked);
  const [queuedOffline, setQueuedOffline] = useState(false);
  const [, startTransition] = useTransition();

  /*
   * Re-sync optimistic state when the server sends different progress.
   *
   * This is React's documented "adjust state when a prop changes" pattern —
   * setState during render, not in an effect. Doing it in an effect would
   * render one frame with stale checkboxes, which on a slow phone is visible
   * as boxes flicking back and forth.
   */
  const serverKey = completedItemIds.join('|');
  const [syncedKey, setSyncedKey] = useState(serverKey);
  if (syncedKey !== serverKey) {
    setSyncedKey(serverKey);
    setCompleted(new Set(completedItemIds));
  }

  function toggleItem(itemId: string, done: boolean) {
    setCompleted((current) => {
      const next = new Set(current);
      if (done) next.add(itemId);
      else next.delete(itemId);
      return next;
    });

    startTransition(async () => {
      /*
       * A server action REJECTS when the network is down — it does not return
       * a failure result. Without this catch the queue never fills and the
       * completion is silently lost, which is the exact failure the offline
       * queue exists to prevent.
       */
      let failed = false;
      try {
        const result = await setItemCompletionAction({
          pathId,
          stageId: stage.id,
          itemId,
          done,
        });
        failed = !result.ok;
      } catch {
        failed = true;
      }

      if (failed) {
        queueOperation({
          type: done ? 'complete-item' : 'uncomplete-item',
          pathId,
          stageId: stage.id,
          itemId,
          at: new Date().toISOString(),
        });
        setQueuedOffline(true);
      }
    });
  }

  const done = stage.items.filter((item) => completed.has(item.id)).length;

  if (!unlocked) {
    return (
      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sand-600">
            <Lock aria-hidden className="size-5" />
            {labels.locked}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setUnlocked(true)}>
            {labels.unlockAnyway}
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <ProgressBar
        value={done}
        total={stage.items.length}
        label={labels.progressLabel}
      />

      {queuedOffline ? (
        <Notice tone="warning" role="status">
          {labels.offlineQueued}
        </Notice>
      ) : null}

      <Card>
        <CardBody>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
            {labels.objective}
          </h3>
          <p className="mt-1 text-sand-800">{stage.objective}</p>

          {skillNames.length > 0 ? (
            <>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-sand-500">
                {labels.skills}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {skillNames.map((name) => (
                  <li key={name}>
                    <Badge tone="brand">{name}</Badge>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------- Tasks */}
      <section aria-label={labels.stageTasks}>
        <ul className="divide-y divide-sand-200 rounded-[--radius-card] border border-sand-200 bg-white">
          {stage.items.map((item) => {
            const isDone = completed.has(item.id);
            return (
              <li key={item.id} className="p-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(event) => toggleItem(item.id, event.target.checked)}
                    className="mt-1 size-5 shrink-0 accent-[--color-brand-700]"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block font-medium',
                        isDone ? 'text-sand-400 line-through' : 'text-sand-900',
                      )}
                    >
                      {item.title}
                    </span>
                    {item.description ? (
                      <span className="mt-1 block text-sm text-sand-600">{item.description}</span>
                    ) : null}
                    <span className="mt-1 block text-xs text-sand-500">
                      {formatMinutes(item.minutes)}
                    </span>
                  </span>
                  {isDone ? (
                    <CheckCircle2 aria-hidden className="size-5 shrink-0 text-success-600" />
                  ) : (
                    <Circle aria-hidden className="size-5 shrink-0 text-sand-300" />
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* --------------------------------------------------------- Resources */}
      {resources.length > 0 ? (
        <section aria-label={labels.resources}>
          <h3 className="mb-2 font-semibold">{labels.resources}</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {resources.map((resource) => (
              <li key={resource.id}>
                <ResourceCard resource={resource} compact />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---------------------------------------------------------- Exercise */}
      <Card>
        <CardBody>
          <h3 className="font-semibold">{labels.practicalExercise}</h3>
          <p className="mt-1 font-medium text-brand-800">{stage.practicalExercise.title}</p>
          <BulletList
            marker="decimal"
            className="mt-3 text-sand-700"
            items={stage.practicalExercise.instructions}
          />
          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
            <strong className="font-semibold">{labels.deliverable} : </strong>
            {stage.practicalExercise.deliverable}
          </p>
        </CardBody>
      </Card>

      {/* --------------------------------------------------------- Checklist */}
      <StageChecklist title={labels.checklist} items={stage.checklist} stageId={stage.id} />

      {/* ---------------------------------------------------------- Evidence */}
      <Card>
        <CardBody>
          <h3 className="font-semibold">{labels.evidence}</h3>
          <p className="mt-1 text-sm text-sand-500">{labels.evidenceHint}</p>
          <p className="mt-2 text-sand-800">{stage.evidence}</p>
        </CardBody>
      </Card>

      {/* -------------------------------------------------- Reflection & note */}
      <NoteEditor
        stageId={stage.id}
        reflection={stage.reflection}
        initialNote={initialNote}
        labels={labels}
      />

      {/* --------------------------------------------------- Knowledge check */}
      {stage.knowledgeCheck && stage.knowledgeCheck.length > 0 ? (
        <section aria-label={labels.knowledgeCheck} className="space-y-3">
          <div>
            <h3 className="font-semibold">{labels.knowledgeCheck}</h3>
            <p className="text-sm text-sand-500">{labels.knowledgeCheckHint}</p>
          </div>
          {stage.knowledgeCheck.map((check) => (
            <KnowledgeCheckCard key={check.id} check={check} labels={labels} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------

/** Purely local: the stage checklist is a thinking aid, not tracked progress. */
function StageChecklist({
  title,
  items,
  stageId,
}: {
  title: string;
  items: string[];
  stageId: string;
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold">{title}</h3>
        <div className="mt-2">
          {items.map((item, index) => (
            <CheckboxRow
              key={`${stageId}-${index}`}
              label={item}
              checked={checked.has(index)}
              onChange={(value) =>
                setChecked((current) => {
                  const next = new Set(current);
                  if (value) next.add(index);
                  else next.delete(index);
                  return next;
                })
              }
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function NoteEditor({
  stageId,
  reflection,
  initialNote,
  labels,
}: {
  stageId: string;
  reflection: string;
  initialNote: string;
  labels: StagePanelLabels;
}) {
  const [value, setValue] = useState(initialNote);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function save() {
    startTransition(async () => {
      const result = await saveNoteAction({ scope: 'stage', refId: stageId, body: value });
      if (!result.ok) {
        queueOperation({
          type: 'save-note',
          scope: 'stage',
          refId: stageId,
          body: value,
          at: new Date().toISOString(),
        });
      }
      setSaved(true);
      // Clear any previous timer so rapid saves do not stack up and hide the
      // confirmation early.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold">{labels.reflection}</h3>
        <p className="mt-1 text-sand-700">{reflection}</p>
        <p className="mt-1 text-sm text-sand-500">{labels.reflectionHint}</p>

        <label htmlFor={`note-${stageId}`} className="mt-4 block text-sm font-semibold">
          {labels.myNotes}
        </label>
        <textarea
          id={`note-${stageId}`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={5}
          placeholder={labels.notesPlaceholder}
          className="mt-1.5 min-h-28 w-full resize-y rounded-lg border-2 border-sand-300 bg-white px-3 py-2 text-base leading-relaxed focus:border-brand-600 focus:outline-none"
        />

        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={save} disabled={pending}>
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Save aria-hidden />}
            {pending ? labels.saving : labels.save}
          </Button>
          {saved ? (
            <span role="status" className="text-sm font-medium text-success-700">
              {labels.notesSaved}
            </span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

function KnowledgeCheckCard({
  check,
  labels,
}: {
  check: KnowledgeCheck;
  labels: StagePanelLabels;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = selected === check.answerIndex;

  return (
    <Card>
      <CardBody>
        <fieldset>
          <legend className="font-medium">{check.question}</legend>
          <div className="mt-3 space-y-2">
            {check.options.map((option, index) => (
              <label
                key={index}
                className={cn(
                  'flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 p-3',
                  selected === index ? 'border-brand-600 bg-brand-50' : 'border-sand-200',
                )}
              >
                <input
                  type="radio"
                  name={check.id}
                  checked={selected === index}
                  onChange={() => {
                    setSelected(index);
                    setRevealed(false);
                  }}
                  className="size-5 accent-[--color-brand-700]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button
          size="sm"
          variant="secondary"
          className="mt-3"
          disabled={selected === null}
          onClick={() => setRevealed(true)}
        >
          {labels.checkAnswer}
        </Button>

        {revealed ? (
          <Notice tone={correct ? 'success' : 'info'} className="mt-3" role="status">
            <p className="font-semibold">{correct ? labels.correct : labels.incorrect}</p>
            <p className="mt-1">
              <strong>{labels.explanation} : </strong>
              {check.explanation}
            </p>
          </Notice>
        ) : null}
      </CardBody>
    </Card>
  );
}
