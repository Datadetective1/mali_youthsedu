'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { signInAction, signUpAction, type FormState } from '@/app/actions/account';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/form';
import { Notice } from '@/components/ui';

export interface AuthLabels {
  email: string;
  emailHint: string;
  password: string;
  passwordHint: string;
  displayName: string;
  displayNameHint: string;
  submit: string;
  submitting: string;
  altPrompt: string;
  altHref: string;
  altLabel: string;
  guestPrompt: string;
  guestHref: string;
  guestLabel: string;
  devNotice?: string;
}

const initialState: FormState = { status: 'idle' };

export function AuthForm({
  mode,
  labels,
  next,
}: {
  mode: 'sign-in' | 'sign-up';
  labels: AuthLabels;
  next?: string;
}) {
  const [state, action] = useActionState(
    mode === 'sign-in' ? signInAction : signUpAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        {state.status === 'error' ? (
          <Notice tone="danger" role="alert">
            {state.message}
          </Notice>
        ) : null}

        {next ? <input type="hidden" name="suivant" value={next} /> : null}

        {mode === 'sign-up' ? (
          <TextField
            name="displayName"
            label={labels.displayName}
            hint={labels.displayNameHint}
            autoComplete="given-name"
            maxLength={80}
            optional
          />
        ) : null}

        <TextField
          name="email"
          type="email"
          label={labels.email}
          hint={labels.emailHint}
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
        />

        <TextField
          name="password"
          type="password"
          label={labels.password}
          hint={mode === 'sign-up' ? labels.passwordHint : undefined}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          required
          minLength={8}
          maxLength={200}
        />

        <SubmitButton icon={mode} label={labels.submit} pendingLabel={labels.submitting} />
      </form>

      {labels.devNotice ? <Notice tone="warning">{labels.devNotice}</Notice> : null}

      <div className="space-y-2 border-t border-sand-200 pt-4 text-sm">
        <p className="text-sand-600">
          {labels.altPrompt}{' '}
          <Link href={labels.altHref} className="font-semibold text-brand-700 underline underline-offset-4">
            {labels.altLabel}
          </Link>
        </p>
        <p className="text-sand-600">
          {labels.guestPrompt}{' '}
          <Link href={labels.guestHref} className="font-semibold text-brand-700 underline underline-offset-4">
            {labels.guestLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

function SubmitButton({
  icon,
  label,
  pendingLabel,
}: {
  icon: 'sign-in' | 'sign-up';
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  const Icon = icon === 'sign-in' ? LogIn : UserPlus;

  return (
    <Button type="submit" block size="lg" disabled={pending}>
      <Icon aria-hidden />
      {pending ? pendingLabel : label}
    </Button>
  );
}
