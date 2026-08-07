'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { deleteAccountAction, type FormState } from '@/app/actions/account';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/form';
import { Notice } from '@/components/ui';

const initialState: FormState = { status: 'idle' };

/**
 * Account deletion.
 *
 * The brief promises irreversible deletion, so this is a hard delete with a
 * typed confirmation rather than a soft-delete flag. Requiring the word to be
 * typed is the only guard that reliably stops a mis-tap on a phone.
 */
export function DangerZone({
  labels,
}: {
  labels: {
    title: string;
    body: string;
    action: string;
    confirmTitle: string;
    confirmBody: string;
    confirmWord: string;
    placeholder: string;
    cancel: string;
    working: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(deleteAccountAction, initialState);

  return (
    <div className="rounded-[--radius-card] border-2 border-danger-600/30 bg-danger-50 p-4 sm:p-5">
      <h3 className="flex items-center gap-2 font-bold text-danger-700">
        <AlertTriangle aria-hidden className="size-5" />
        {labels.title}
      </h3>
      <p className="mt-2 text-sm text-danger-700">{labels.body}</p>

      {!open ? (
        <Button variant="danger" className="mt-4" onClick={() => setOpen(true)}>
          {labels.action}
        </Button>
      ) : (
        <form action={action} className="mt-4 space-y-3">
          <p className="font-semibold text-danger-700">{labels.confirmTitle}</p>
          <p className="text-sm text-danger-700">{labels.confirmBody}</p>

          {state.status === 'error' ? (
            <Notice tone="danger" role="alert">
              {state.message}
            </Notice>
          ) : null}

          <TextField
            name="confirmation"
            label={labels.confirmWord}
            placeholder={labels.placeholder}
            autoComplete="off"
            required
          />

          <div className="flex flex-wrap gap-2">
            <DeleteButton action={labels.action} working={labels.working} />
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {labels.cancel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function DeleteButton({ action, working }: { action: string; working: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" disabled={pending}>
      {pending ? working : action}
    </Button>
  );
}
