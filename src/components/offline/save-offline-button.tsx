'use client';

import { Check, CloudDownload, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOfflineSave } from '@/lib/offline/client';

/**
 * Explicit "save this page for offline".
 *
 * Personal pages are never cached automatically (see public/sw.js), so this
 * button is the only path by which a user's own roadmap or weekly plan ends up
 * stored on the device — a deliberate choice, because these phones are shared.
 */
export function SaveOfflineButton({
  urls,
  labels,
  size = 'sm',
}: {
  urls: string[];
  labels: {
    save: string;
    saved: string;
    saving: string;
    remove: string;
    unsupported: string;
  };
  size?: 'sm' | 'md';
}) {
  const { state, save, remove } = useOfflineSave(urls);

  if (state === 'unsupported') {
    return <p className="text-sm text-sand-500">{labels.unsupported}</p>;
  }

  if (state === 'saving') {
    return (
      <Button size={size} variant="quiet" disabled>
        <Loader2 aria-hidden className="animate-spin" />
        {labels.saving}
      </Button>
    );
  }

  if (state === 'saved') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success-600/20 bg-success-50 px-3 py-1.5 text-sm font-medium text-success-700">
          <Check aria-hidden className="size-4" />
          {labels.saved}
        </span>
        <Button size="sm" variant="ghost" onClick={remove}>
          <Trash2 aria-hidden />
          {labels.remove}
        </Button>
      </div>
    );
  }

  return (
    <Button size={size} variant="secondary" onClick={save}>
      <CloudDownload aria-hidden />
      {labels.save}
    </Button>
  );
}
