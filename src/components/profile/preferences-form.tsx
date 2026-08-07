'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';
import { savePreferencesAction, type FormState } from '@/app/actions/account';
import { Button } from '@/components/ui/button';
import { SelectField, TextField } from '@/components/ui/form';
import { Notice } from '@/components/ui';

const initialState: FormState = { status: 'idle' };

export function PreferencesForm({
  initial,
  labels,
}: {
  initial: { displayName: string; hoursPerWeek: number; connectivity: string };
  labels: {
    displayName: string;
    hoursPerWeek: string;
    hoursPerWeekHint: string;
    connectivity: string;
    connectivityHint: string;
    connectivityOptions: Record<string, string>;
    hoursOptions: Record<string, string>;
    save: string;
    saving: string;
  };
}) {
  const [state, action] = useActionState(savePreferencesAction, initialState);

  return (
    <form action={action} className="space-y-4">
      {state.status === 'error' ? (
        <Notice tone="danger" role="alert">
          {state.message}
        </Notice>
      ) : null}
      {state.status === 'ok' ? (
        <Notice tone="success" role="status">
          {state.message}
        </Notice>
      ) : null}

      <TextField
        name="displayName"
        label={labels.displayName}
        defaultValue={initial.displayName}
        maxLength={80}
      />

      <SelectField
        name="hoursPerWeek"
        label={labels.hoursPerWeek}
        hint={labels.hoursPerWeekHint}
        defaultValue={String(initial.hoursPerWeek)}
        options={Object.entries(labels.hoursOptions).map(([value, label]) => ({ value, label }))}
      />

      <SelectField
        name="connectivity"
        label={labels.connectivity}
        hint={labels.connectivityHint}
        defaultValue={initial.connectivity}
        options={Object.entries(labels.connectivityOptions).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      <SubmitButton save={labels.save} saving={labels.saving} />
    </form>
  );
}

function SubmitButton({ save, saving }: { save: string; saving: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save aria-hidden />
      {pending ? saving : save}
    </Button>
  );
}
