'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePlanAction } from '@/app/actions/learning';

export function GeneratePlanButton({
  pathId,
  labels,
}: {
  pathId: string;
  labels: { generate: string; working: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await generatePlanAction(pathId);
          router.refresh();
        })
      }
    >
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : <CalendarPlus aria-hidden />}
      {pending ? labels.working : labels.generate}
    </Button>
  );
}
