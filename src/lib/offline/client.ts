'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SyncOperation } from '@/lib/types';
import { enqueue, flushQueue, queueLength, type FlushResult } from './queue';

/**
 * Client-side offline plumbing.
 *
 * Everything here degrades: with no service worker the app still works online,
 * and with no network the queue simply grows until the connection returns.
 */

export function useOnlineStatus(): boolean {
  // Assume online during SSR and first paint. Rendering an "offline" banner to
  // someone who is online is worse than the reverse.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

export type SyncState = 'idle' | 'pending' | 'syncing' | 'error';

const QUEUE_CHANGED_EVENT = 'myp:queue-changed';

export function notifyQueueChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(QUEUE_CHANGED_EVENT));
  }
}

/** Queue an operation and tell the UI to refresh its pending count. */
export function queueOperation(operation: SyncOperation): void {
  enqueue(operation);
  notifyQueueChanged();
}

async function sendQueue(operations: Parameters<Parameters<typeof flushQueue>[0]>[0]) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operations }),
  });
  if (!response.ok) throw new Error(`sync failed: ${response.status}`);
  return (await response.json()) as { applied: string[] };
}

export function useSyncQueue(): {
  pending: number;
  state: SyncState;
  sync: () => Promise<FlushResult | null>;
} {
  const online = useOnlineStatus();
  const [pending, setPending] = useState(0);
  const [state, setState] = useState<SyncState>('idle');

  const refresh = useCallback(() => setPending(queueLength()), []);

  useEffect(() => {
    refresh();
    window.addEventListener(QUEUE_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(QUEUE_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const sync = useCallback(async () => {
    if (queueLength() === 0) {
      setState('idle');
      return null;
    }
    setState('syncing');
    const result = await flushQueue(sendQueue);
    refresh();
    setState(result.remaining > 0 ? 'error' : 'idle');
    return result;
  }, [refresh]);

  // Replay as soon as the connection returns. This is the whole point of the
  // queue, so it must not depend on the user noticing a button.
  useEffect(() => {
    if (online && pending > 0 && state !== 'syncing') {
      void sync();
    }
    // `state` is intentionally excluded: including it would re-fire the effect
    // on every state transition and loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, pending, sync]);

  useEffect(() => {
    if (state === 'idle' && pending > 0) setState('pending');
  }, [pending, state]);

  return { pending, state, sync };
}

// ---------------------------------------------------------------------------
// Explicit offline saving, via the service worker
// ---------------------------------------------------------------------------

export type OfflineSaveState = 'unknown' | 'unsupported' | 'saved' | 'not-saved' | 'saving';

export function useOfflineSave(urls: string[]): {
  state: OfflineSaveState;
  save: () => void;
  remove: () => void;
} {
  const [state, setState] = useState<OfflineSaveState>('unknown');
  const key = urls.join('|');

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      setState('unsupported');
      return;
    }

    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; urls?: string[] } | null;
      if (!data?.type) return;

      if (data.type === 'OFFLINE_STATUS') {
        const stored = new Set(data.urls ?? []);
        setState(urls.every((url) => stored.has(url)) ? 'saved' : 'not-saved');
      }
      if (data.type === 'OFFLINE_SAVED') setState('saved');
      if (data.type === 'OFFLINE_REMOVED' || data.type === 'OFFLINE_CLEARED') setState('not-saved');
    }

    navigator.serviceWorker.addEventListener('message', onMessage);
    navigator.serviceWorker.ready
      .then((registration) => registration.active?.postMessage({ type: 'OFFLINE_STATUS' }))
      .catch(() => setState('unsupported'));

    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const post = useCallback((message: Record<string, unknown>) => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready
      .then((registration) => registration.active?.postMessage(message))
      .catch(() => setState('unsupported'));
  }, []);

  const save = useCallback(() => {
    setState('saving');
    post({ type: 'SAVE_OFFLINE', urls, key });
  }, [post, urls, key]);

  const remove = useCallback(() => {
    post({ type: 'REMOVE_OFFLINE', urls, key });
  }, [post, urls, key]);

  return { state, save, remove };
}

export function clearOfflineContent(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  void navigator.serviceWorker.ready.then((registration) =>
    registration.active?.postMessage({ type: 'CLEAR_OFFLINE' }),
  );
}
