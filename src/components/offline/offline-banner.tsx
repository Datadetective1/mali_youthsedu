'use client';

import { CloudOff, RefreshCw } from 'lucide-react';
import { useAutoSync, useOnlineStatus, useSyncQueue } from '@/lib/offline/client';

/**
 * Connection state banner.
 *
 * Sits above the header so it is never missed, and disappears entirely when
 * everything is fine — a permanent status bar on a 320px screen is a permanent
 * tax on the content.
 *
 * Also the single mount point for auto-sync: it is present on every page, so
 * queued work replays as soon as the connection returns without the user
 * having to find a button.
 */
export function OfflineBanner({
  offlineLabel,
  onlineLabel,
  syncingLabel,
}: {
  offlineLabel: string;
  onlineLabel: string;
  syncingLabel: string;
}) {
  const online = useOnlineStatus();
  const { pending, state } = useSyncQueue();
  useAutoSync();

  // Derived, not stored: the banner shows while offline, or while there is
  // still queued work to flush. No timer, no effect, nothing to get stuck.
  const hasPendingWork = pending > 0;
  if (online && !hasPendingWork) return null;

  const syncing = state === 'syncing';

  return (
    <div
      role="status"
      aria-live="polite"
      data-print="hide"
      className={
        online
          ? 'flex items-center justify-center gap-2 bg-info-50 px-4 py-2 text-sm font-medium text-info-700'
          : 'flex items-center justify-center gap-2 bg-warning-50 px-4 py-2 text-sm font-medium text-warning-700'
      }
    >
      {online ? (
        <RefreshCw aria-hidden className={`size-4 ${syncing ? 'animate-spin' : ''}`} />
      ) : (
        <CloudOff aria-hidden className="size-4" />
      )}
      <span>{online ? (syncing ? syncingLabel : onlineLabel) : offlineLabel}</span>
    </div>
  );
}
