'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  Minus,
  Plus,
  Printer,
  RefreshCw,
} from 'lucide-react';
import type { WeeklyPlan } from '@/lib/types';
import { Badge, Card, CardBody, Notice, ProgressBar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  adjustWorkloadAction,
  generatePlanAction,
  moveTaskAction,
  setTaskCompletionAction,
} from '@/app/actions/learning';
import { queueOperation } from '@/lib/offline/client';
import { cn, formatMinutes } from '@/lib/utils';

export interface WeeklyLabels {
  dayLabels: string[];
  tasks: string;
  totalTime: string;
  doneCount: (done: number, total: number) => string;
  weekComplete: string;
  regenerate: string;
  regenerateWarning: string;
  lighter: string;
  heavier: string;
  downloadPdf: string;
  downloadHint: string;
  moveTo: string;
  working: string;
  offlineQueued: string;
  kinds: Record<string, string>;
}

/**
 * Weekly plan board.
 *
 * Grouped by day rather than shown as one long list: the question a user has on
 * a Tuesday morning is "what do I do today", not "what does my week contain".
 */
export function WeeklyBoard({
  plan,
  labels,
  hoursPerWeek,
}: {
  plan: WeeklyPlan;
  labels: WeeklyLabels;
  hoursPerWeek: number;
}) {
  const router = useRouter();
  const [tasks, setTasks] = useState(plan.tasks);
  const [queued, setQueued] = useState(false);
  const [pending, startTransition] = useTransition();

  const done = tasks.filter((task) => task.completedAt).length;
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0);

  function toggle(taskId: string, complete: boolean) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, completedAt: complete ? new Date().toISOString() : null }
          : task,
      ),
    );

    startTransition(async () => {
      const result = await setTaskCompletionAction(taskId, complete);
      if (!result.ok) {
        queueOperation({
          type: complete ? 'complete-task' : 'uncomplete-task',
          taskId,
          at: new Date().toISOString(),
        });
        setQueued(true);
      }
    });
  }

  function move(taskId: string, day: number) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, day } : task)),
    );
    startTransition(async () => {
      const result = await moveTaskAction(taskId, day);
      if (!result.ok) {
        queueOperation({ type: 'move-task', taskId, day, at: new Date().toISOString() });
        setQueued(true);
      }
    });
  }

  const byDay = labels.dayLabels.map((label, day) => ({
    day,
    label,
    tasks: tasks.filter((task) => task.day === day).sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="space-y-6">
      <div data-print="hide" className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await adjustWorkloadAction('lighter', plan.pathId);
              router.refresh();
            })
          }
        >
          <Minus aria-hidden />
          {labels.lighter}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await adjustWorkloadAction('heavier', plan.pathId);
              router.refresh();
            })
          }
        >
          <Plus aria-hidden />
          {labels.heavier}
        </Button>
        <Button
          variant="quiet"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await generatePlanAction(plan.pathId, plan.weekStart);
              router.refresh();
            })
          }
        >
          {pending ? (
            <Loader2 aria-hidden className="animate-spin" />
          ) : (
            <RefreshCw aria-hidden />
          )}
          {pending ? labels.working : labels.regenerate}
        </Button>
        {/* Printing to PDF is the browser's job. Shipping a PDF library would
            add ~300 KB to a bundle that has to load on a 2G connection. */}
        <Button variant="quiet" size="sm" onClick={() => window.print()}>
          <Printer aria-hidden />
          {labels.downloadPdf}
        </Button>
      </div>

      <p data-print="hide" className="text-sm text-sand-500">
        {labels.downloadHint}
      </p>

      {queued ? (
        <Notice tone="warning" role="status">
          {labels.offlineQueued}
        </Notice>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="print-avoid-break">
          <CardBody>
            <ProgressBar value={done} total={tasks.length} label={labels.tasks} tone="accent" />
            <p className="mt-2 text-sm text-sand-600">{labels.doneCount(done, tasks.length)}</p>
          </CardBody>
        </Card>
        <Card className="print-avoid-break">
          <CardBody>
            <p className="text-sm font-semibold uppercase tracking-wide text-sand-500">
              {labels.totalTime}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatMinutes(totalMinutes)}</p>
            <p className="text-sm text-sand-500">{hoursPerWeek} h/semaine</p>
          </CardBody>
        </Card>
        {done === tasks.length && tasks.length > 0 ? (
          <Notice tone="success" className="sm:col-span-1">
            {labels.weekComplete}
          </Notice>
        ) : null}
      </div>

      <div className="space-y-4">
        {byDay.map(({ day, label, tasks: dayTasks }) => {
          if (dayTasks.length === 0) return null;
          return (
            <section key={day} className="print-avoid-break" aria-labelledby={`jour-${day}`}>
              <h3 id={`jour-${day}`} className="mb-2 font-bold text-sand-900">
                {label}
              </h3>
              <ul className="divide-y divide-sand-200 rounded-[--radius-card] border border-sand-200 bg-white">
                {dayTasks.map((task) => {
                  const complete = Boolean(task.completedAt);
                  return (
                    <li key={task.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggle(task.id, !complete)}
                          aria-pressed={complete}
                          aria-label={
                            complete ? `Annuler : ${task.title}` : `Terminer : ${task.title}`
                          }
                          className="mt-0.5 shrink-0 rounded p-0.5"
                        >
                          {complete ? (
                            <CheckCircle2 aria-hidden className="size-6 text-success-600" />
                          ) : (
                            <Circle aria-hidden className="size-6 text-sand-300" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'font-medium',
                              complete ? 'text-sand-400 line-through' : 'text-sand-900',
                            )}
                          >
                            {task.title}
                          </p>
                          {task.description ? (
                            <p className="mt-0.5 text-sm text-sand-600">{task.description}</p>
                          ) : null}
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <Badge tone="neutral">{formatMinutes(task.minutes)}</Badge>
                            <Badge tone={task.kind === 'projet' ? 'accent' : 'neutral'}>
                              {labels.kinds[task.kind] ?? task.kind}
                            </Badge>
                          </div>
                        </div>

                        <label data-print="hide" className="shrink-0 text-sm">
                          <span className="sr-only">{labels.moveTo}</span>
                          <select
                            value={task.day}
                            onChange={(event) => move(task.id, Number(event.target.value))}
                            className="min-h-11 rounded-lg border-2 border-sand-200 bg-white px-2 text-sm focus:border-brand-600 focus:outline-none"
                          >
                            {labels.dayLabels.map((dayLabel, dayIndex) => (
                              <option key={dayIndex} value={dayIndex}>
                                {dayLabel}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
