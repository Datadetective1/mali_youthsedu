'use client';

import { useState, useTransition } from 'react';
import type { Checklist } from '@/lib/types';
import { Card, CardBody, ProgressBar } from '@/components/ui';
import { CheckboxRow } from '@/components/ui/form';
import { saveChecklistAction } from '@/app/actions/jobs';

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
  countLabel,
}: {
  checklist: Checklist;
  initialDone: string[];
  isSignedIn: boolean;
  countLabel: (done: number, total: number) => string;
}) {
  const [done, setDone] = useState<string[]>(initialDone);
  const [, startTransition] = useTransition();

  function toggle(itemId: string, checked: boolean) {
    const next = checked ? [...new Set([...done, itemId])] : done.filter((id) => id !== itemId);
    setDone(next);
    if (isSignedIn) {
      startTransition(() => void saveChecklistAction(checklist.id, next));
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
          label={countLabel(done.length, checklist.items.length)}
          showValue={false}
        />

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
