'use client';

import { useState, useTransition } from 'react';
import type { Checklist } from '@/lib/types';
import { Card, CardBody, ProgressBar } from '@/components/ui';
import { CheckboxRow } from '@/components/ui/form';
import { saveChecklistAction } from '@/app/actions/jobs';
import { format } from '@/lib/i18n/format';

/**
 * A persisted checklist.
 *
 * Ticks save immediately with no explicit save button: a checklist that loses
 * state when you navigate away is worse than a paper one.
 */
export function ChecklistCard({
  checklist,
  initialDone,
  isSignedIn,
  countLabelTemplate,
}: {
  checklist: Checklist;
  initialDone: string[];
  isSignedIn: boolean;
  countLabelTemplate: string;
}) {
  const [done, setDone] = useState<string[]>(initialDone);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function toggle(itemId: string, checked: boolean) {
    const next = checked ? [...new Set([...done, itemId])] : done.filter((id) => id !== itemId);
    setDone(next);
    setSaved(false);

    if (isSignedIn) {
      startTransition(async () => {
        await saveChecklistAction(checklist.id, next);
        setSaved(true);
      });
    }
  }

  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold">{checklist.title}</h3>
        {checklist.intro ? (
          <p className="mt-1 text-sm text-sand-600">{checklist.intro}</p>
        ) : null}

        <ProgressBar
          className="mt-3"
          value={done.length}
          total={checklist.items.length}
          label={format(countLabelTemplate, { done: done.length, total: checklist.items.length })}
          showValue={false}
        />

        {/* There is no save button by design — ticks persist immediately — so
            this is the only confirmation that the tick was stored. Without it
            a screen-reader user gets no feedback at all. */}
        <p role="status" aria-live="polite" className="mt-1 h-5 text-sm text-success-700">
          {saved ? 'Enregistré' : ''}
        </p>

        <div className="mt-3">
          {checklist.items.map((item) => (
            <CheckboxRow
              key={item.id}
              label={item.label}
              hint={item.help}
              checked={done.includes(item.id)}
              onChange={(checked) => toggle(item.id, checked)}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
