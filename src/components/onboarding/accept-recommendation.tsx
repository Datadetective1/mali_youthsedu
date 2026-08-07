'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptRecommendationAction } from '@/app/actions/account';

export function AcceptRecommendation({
  pathId,
  supportingPathId,
  labels,
}: {
  pathId: string;
  supportingPathId: string | null;
  labels: { accept: string; working: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      block
      size="lg"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await acceptRecommendationAction(pathId, supportingPathId);
          router.push('/tableau-de-bord');
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {pending ? labels.working : labels.accept}
      {!pending ? <ArrowRight aria-hidden /> : null}
    </Button>
  );
}
