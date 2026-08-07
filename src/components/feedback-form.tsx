'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { sendFeedbackAction, type FormState } from '@/app/actions/account';
import { Button } from '@/components/ui/button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/form';
import { Notice } from '@/components/ui';

export interface FeedbackLabels {
  typeLabel: string;
  types: Record<string, string>;
  messageLabel: string;
  messagePlaceholder: string;
  emailLabel: string;
  emailHint: string;
  send: string;
  sending: string;
}

const initialState: FormState = { status: 'idle' };

export function FeedbackForm({ labels }: { labels: FeedbackLabels }) {
  const [state, action] = useActionState(sendFeedbackAction, initialState);

  if (state.status === 'ok') {
    return (
      <Notice tone="success" role="status" className="mt-4">
        {state.message}
      </Notice>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      {state.status === 'error' ? (
        <Notice tone="danger" role="alert">
          {state.message}
        </Notice>
      ) : null}

      <SelectField
        name="type"
        label={labels.typeLabel}
        defaultValue="idee"
        options={Object.entries(labels.types).map(([value, label]) => ({ value, label }))}
      />

      <TextAreaField
        name="message"
        label={labels.messageLabel}
        placeholder={labels.messagePlaceholder}
        required
        minLength={10}
        maxLength={5000}
        rows={6}
      />

      <TextField
        name="email"
        type="email"
        label={labels.emailLabel}
        hint={labels.emailHint}
        optional
        maxLength={254}
      />

      <SubmitButton send={labels.send} sending={labels.sending} />
    </form>
  );
}

function SubmitButton({ send, sending }: { send: string; sending: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Send aria-hidden />
      {pending ? sending : send}
    </Button>
  );
}
