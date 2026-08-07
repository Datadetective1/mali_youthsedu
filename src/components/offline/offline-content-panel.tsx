'use client';

import { useState } from 'react';
import { HardDriveDownload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardBody, EmptyState } from '@/components/ui';
import { clearOfflineContent, useOfflineUrls } from '@/lib/offline/client';

/**
 * Lists what is actually stored on this device, read back from the service
 * worker rather than from a local guess — so the list is the truth, not our
 * record of what we think we saved.
 */
export function OfflineContentPanel({
  labels,
}: {
  labels: {
    empty: string;
    clear: string;
    clearConfirm: string;
    cancel: string;
    confirm: string;
  };
}) {
  const urls = useOfflineUrls();
  const [confirming, setConfirming] = useState(false);

  if (urls === null) {
    return <div className="skeleton h-24 w-full" aria-hidden />;
  }

  if (urls.length === 0) {
    return <EmptyState icon={<HardDriveDownload className="size-8" />} title={labels.empty} />;
  }

  return (
    <Card>
      <CardBody>
        <ul className="space-y-1">
          {urls.map((url) => (
            <li key={url} className="flex items-center gap-2 text-sand-700">
              <HardDriveDownload aria-hidden className="size-4 text-brand-600" />
              <code className="text-sm">{url}</code>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-sand-200 pt-4">
          {confirming ? (
            <div className="space-y-3">
              <p className="text-sm text-sand-700">{labels.clearConfirm}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    clearOfflineContent();
                    setConfirming(false);
                  }}
                >
                  {labels.confirm}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                  {labels.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
              <Trash2 aria-hidden />
              {labels.clear}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
