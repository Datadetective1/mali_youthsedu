'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/actions/account';

export function SignOutButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={() => startTransition(() => void signOutAction())}
    >
      <LogOut aria-hidden />
      {label}
    </Button>
  );
}
