'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { SkillGapEntry } from '@/lib/types';
import { Badge, Card, CardBody } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { setSkillGapStatusAction } from '@/app/actions/jobs';

type Gap = SkillGapEntry & { pathName: string | null };
type Status = SkillGapEntry['status'];

export function SkillGapList({
  gaps,
  labels,
}: {
  gaps: Gap[];
  labels: {
    frequency: (n: number) => string;
    statusTodo: string;
    statusLearning: string;
    statusAddressed: string;
    linkedPath: string;
    actionLearn: string;
  };
}) {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(gaps.map((gap) => [gap.label, gap.status])),
  );
  const [, startTransition] = useTransition();

  const options: { value: Status; label: string }[] = [
    { value: 'todo', label: labels.statusTodo },
    { value: 'learning', label: labels.statusLearning },
    { value: 'addressed', label: labels.statusAddressed },
  ];

  function setStatus(label: string, status: Status) {
    setStatuses((current) => ({ ...current, [label]: status }));
    startTransition(() => void setSkillGapStatusAction(label, status));
  }

  return (
    <ul className="space-y-3">
      {gaps.map((gap) => {
        const status = statuses[gap.label] ?? 'todo';
        return (
          <li key={gap.id}>
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{gap.label}</h3>
                    {/* Frequency is the whole point: one advert is noise, three
                        is a priority. */}
                    <p className="mt-0.5 text-sm text-sand-600">
                      {labels.frequency(gap.occurrences)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      status === 'addressed' ? 'success' : status === 'learning' ? 'accent' : 'warning'
                    }
                  >
                    {options.find((option) => option.value === status)?.label}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={status === option.value ? 'primary' : 'quiet'}
                      onClick={() => setStatus(gap.label, option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {gap.pathId && gap.pathName ? (
                  <p className="mt-3 text-sm">
                    <span className="text-sand-500">{labels.linkedPath} : </span>
                    <Link
                      href={`/parcours/${gap.pathId}`}
                      className="font-medium text-brand-700 underline underline-offset-2"
                    >
                      {gap.pathName}
                    </Link>
                  </p>
                ) : null}
              </CardBody>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
