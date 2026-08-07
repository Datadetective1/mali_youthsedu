'use client';

import { useEffect, useState } from 'react';
import { CloudOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus, useSyncQueue } from '@/lib/offline/client';

/**
 * Connection state banner.
 *
 * Sits above the header so it is never missed, and disappears entirely when
 * everything is fine — a permanent status bar on a 320px screen is a permanent
 * tax on the content.
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
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (online && pending > 0) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    }
    setShowReconnected(false);
    return undefined;
  }, [online, pending]);

  if (online && !showReconnected) return null;

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
