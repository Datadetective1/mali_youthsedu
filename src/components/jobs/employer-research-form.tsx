'use client';

import { useState, useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { Checklist } from '@/lib/types';
import { Card, CardBody, Notice, ProgressBar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { CheckboxRow, TextAreaField, TextField } from '@/components/ui/form';
import { saveEmployerResearchAction } from '@/app/actions/jobs';

export function EmployerResearchForm({
  checklist,
  initial,
  isSignedIn,
  labels,
}: {
  checklist: Checklist;
  initial: { company: string; notes: string; doneItemIds: string[] };
  isSignedIn: boolean;
  labels: {
    companyLabel: string;
    checklistTitle: string;
    notesLabel: string;
    notesPlaceholder: string;
    save: string;
    saving: string;
    saved: string;
    signIn: string;
  };
}) {
  const [company, setCompany] = useState(initial.company);
  const [notes, setNotes] = useState(initial.notes);
  const [done, setDone] = useState(initial.doneItemIds);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <CardBody className="space-y-4">
        <TextField
          label={labels.companyLabel}
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          maxLength={200}
        />

        <div>
          <h3 className="font-semibold">{labels.checklistTitle}</h3>
          <ProgressBar
            className="mt-2"
            value={done.length}
            total={checklist.items.length}
            label={labels.checklistTitle}
            showValue={false}
          />
          <div className="mt-2">
            {checklist.items.map((item) => (
              <CheckboxRow
                key={item.id}
                label={item.label}
                hint={item.help}
                checked={done.includes(item.id)}
                onChange={(checked) =>
                  setDone((current) =>
                    checked
                      ? [...new Set([...current, item.id])]
                      : current.filter((id) => id !== item.id),
                  )
                }
              />
            ))}
          </div>
        </div>

        <TextAreaField
          label={labels.notesLabel}
          placeholder={labels.notesPlaceholder}
          rows={8}
          maxLength={10000}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {isSignedIn ? (
          <div className="flex items-center gap-3">
            <Button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await saveEmployerResearchAction({ company, notes, doneItemIds: done });
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
          <Notice tone="info">{labels.signIn}</Notice>
        )}
      </CardBody>
    </Card>
  );
}
