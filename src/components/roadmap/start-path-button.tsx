'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { startPathAction } from '@/app/actions/learning';

export function StartPathButton({
  pathId,
  isSignedIn,
  labels,
  variant = 'primary',
}: {
  pathId: string;
  isSignedIn: boolean;
  labels: { start: string; signInFirst: string; working: string };
  variant?: 'primary' | 'secondary';
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // A guest can browse everything; the account is only needed to persist a
  // choice, so the prompt appears at the moment it actually matters.
  if (!isSignedIn) {
    return (
      <ButtonLink href={`/inscription?suivant=${encodeURIComponent('/parcours')}`} variant={variant}>
        {labels.signInFirst}
        <ArrowRight aria-hidden />
      </ButtonLink>
    );
  }

  return (
    <Button
      variant={variant}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await startPathAction(pathId);
          router.push('/mon-parcours');
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {pending ? labels.working : labels.start}
    </Button>
  );
}
