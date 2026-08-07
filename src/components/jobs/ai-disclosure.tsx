'use client';

import { Info, Sparkles } from 'lucide-react';
import { Notice } from '@/components/ui';
import { CheckboxRow } from '@/components/ui/form';

export interface AiDisclosureLabels {
  optIn: string;
  deterministic: string;
  ai: string;
  neverInvents: string;
  unavailable: string;
}

/**
 * AI disclosure and opt-in.
 *
 * The opt-in is opt-*in*, unchecked by default, and states plainly that the
 * pasted text leaves the device before the user can enable it. Someone about to
 * paste a job advert deserves to know that, in the same sentence, not in a
 * privacy policy three clicks away.
 */
export function AiDisclosure({
  available,
  enabled,
  onChange,
  labels,
}: {
  available: boolean;
  enabled: boolean;
  onChange: (value: boolean) => void;
  labels: AiDisclosureLabels;
}) {
  if (!available) {
    return (
      <Notice tone="info">
        <p className="flex items-start gap-2">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>{labels.deterministic}</span>
        </p>
      </Notice>
    );
  }

  return (
    <div className="rounded-lg border border-sand-200 bg-sand-50 p-3">
      <CheckboxRow
        label={
          <span className="flex items-center gap-2 font-medium">
            <Sparkles aria-hidden className="size-4 text-accent-600" />
            {labels.optIn}
          </span>
        }
        hint={enabled ? labels.ai : labels.deterministic}
        checked={enabled}
        onChange={onChange}
      />
      <p className="mt-1 px-2 text-sm text-sand-500">{labels.neverInvents}</p>
    </div>
  );
}
