'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAnalysisAction } from '@/app/actions/jobs';

export function DeleteAnalysisButton({
  analysisId,
  label,
  confirmLabel,
}: {
  analysisId: string;
  label: string;
  confirmLabel: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  // Two-step rather than a modal: deleting is reversible only by re-analysing,
  // so it deserves a deliberate second tap but not a blocking dialog.
  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="danger"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await deleteAnalysisAction(analysisId);
            router.push('/preparation-emploi/analyser');
            router.refresh();
          })
        }
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Annuler
      </Button>
    </div>
  );
}
