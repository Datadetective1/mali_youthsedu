'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import type { QueuedOperation, SyncOperation } from '@/lib/types';
import { enqueue, flushQueue, queueLength, type FlushResult } from './queue';

/**
 * Client-side offline plumbing.
 *
 * Everything here subscribes to an external system — the network, the queue in
 * localStorage, the service worker — so it is built on `useSyncExternalStore`
 * rather than `useEffect` + `setState`. That is not stylistic: reading external
 * state in an effect produces a render with the wrong value first, which is how
 * an "offline" banner flashes at someone who is perfectly online.
 *
 * Everything degrades: with no service worker the app still works online, and
 * with no network the queue simply grows until connectivity returns.
 */

const QUEUE_CHANGED_EVENT = 'myp:queue-changed';

// ---------------------------------------------------------------------------
// Network status
// ---------------------------------------------------------------------------

function subscribeToNetwork(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeToNetwork,
    () => navigator.onLine,
    // Server snapshot: assume online. Rendering an offline banner to someone
    // who is connected is worse than the reverse.
    () => true,
  );
}

/** True once hydrated. Lets components branch on browser-only capabilities. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------------

export type SyncState = 'idle' | 'pending' | 'syncing' | 'error';

export function notifyQueueChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(QUEUE_CHANGED_EVENT));
  }
}

/** Queue an operation and tell every subscriber the count changed. */
export function queueOperation(operation: SyncOperation): void {
  enqueue(operation);
  notifyQueueChanged();
}

function subscribeToQueue(onChange: () => void): () => void {
  window.addEventListener(QUEUE_CHANGED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(QUEUE_CHANGED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function usePendingCount(): number {
  return useSyncExternalStore(
    subscribeToQueue,
    () => queueLength(),
    () => 0,
  );
}

async function sendQueue(operations: QueuedOperation[]): Promise<{ applied: string[] }> {
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
  const pending = usePendingCount();
  const [syncing, setSyncing] = useState(false);
  const [failed, setFailed] = useState(false);

  const sync = useCallback(async () => {
    if (queueLength() === 0) return null;

    setSyncing(true);
    const result = await flushQueue(sendQueue);
    setSyncing(false);
    setFailed(result.remaining > 0);
    notifyQueueChanged();
    return result;
  }, []);

  const state: SyncState = syncing
    ? 'syncing'
    : failed && pending > 0
      ? 'error'
      : pending > 0
        ? 'pending'
        : 'idle';

  return { pending, state, sync };
}

/**
 * Replays the queue whenever connectivity returns.
 *
 * Mounted once, in the offline banner, so the retry does not depend on the user
 * noticing a button — which is the entire point of queueing in the first place.
 */
export function useAutoSync(): void {
  const online = useOnlineStatus();
  const pending = usePendingCount();
  const { sync } = useSyncQueue();

  const shouldSync = online && pending > 0;

  // Subscribing to "we are online and have work" and firing an external
  // action, rather than mirroring it into state first.
  useSyncExternalStore(
    useCallback(
      (onChange: () => void) => {
        if (shouldSync) {
          const timer = setTimeout(() => {
            void sync().then(onChange);
          }, 500);
          return () => clearTimeout(timer);
        }
        return () => {};
      },
      [shouldSync, sync],
    ),
    () => shouldSync,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Explicit offline saving, via the service worker
// ---------------------------------------------------------------------------

export type OfflineSaveState = 'unknown' | 'unsupported' | 'saved' | 'not-saved' | 'saving';

export function serviceWorkerAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

function postToServiceWorker(message: Record<string, unknown>): void {
  if (!serviceWorkerAvailable()) return;
  void navigator.serviceWorker.ready
    .then((registration) => registration.active?.postMessage(message))
    .catch(() => {
      /* worker not controlling this page yet; nothing to do */
    });
}

/**
 * Subscribes to the list of pages currently stored for offline use.
 *
 * The service worker is the source of truth — we ask it what it actually holds
 * rather than trusting our own record of what we think we saved.
 */
export function useOfflineUrls(): string[] | null {
  const isClient = useIsClient();
  const [urls, setUrls] = useState<string[] | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = useCallback((onChange: () => void) => {
    if (!serviceWorkerAvailable()) {
      setUrls([]);
      return () => {};
    }

    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; urls?: string[] } | null;
      if (!data?.type) return;
      if (data.type === 'OFFLINE_STATUS') setUrls(data.urls ?? []);
      if (data.type === 'OFFLINE_SAVED' || data.type === 'OFFLINE_REMOVED') {
        postToServiceWorker({ type: 'OFFLINE_STATUS' });
      }
      if (data.type === 'OFFLINE_CLEARED') setUrls([]);
      onChange();
    }

    navigator.serviceWorker.addEventListener('message', onMessage);
    postToServiceWorker({ type: 'OFFLINE_STATUS' });

    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);

  useSyncExternalStore(subscribe, () => subscribed, () => false);

  // `subscribed` exists only to give the store a stable snapshot; flipping it
  // once keeps the subscription alive without re-reading the worker on every
  // render.
  if (isClient && !subscribed) setSubscribed(true);

  return urls;
}

export function useOfflineSave(urls: string[]): {
  state: OfflineSaveState;
  save: () => void;
  remove: () => void;
} {
  const stored = useOfflineUrls();
  const isClient = useIsClient();
  const [optimistic, setOptimistic] = useState<OfflineSaveState | null>(null);

  const save = useCallback(() => {
    setOptimistic('saving');
    postToServiceWorker({ type: 'SAVE_OFFLINE', urls, key: urls.join('|') });
  }, [urls]);

  const remove = useCallback(() => {
    setOptimistic(null);
    postToServiceWorker({ type: 'REMOVE_OFFLINE', urls, key: urls.join('|') });
  }, [urls]);

  let state: OfflineSaveState = 'unknown';
  if (!isClient) state = 'unknown';
  else if (!serviceWorkerAvailable()) state = 'unsupported';
  else if (stored === null) state = 'unknown';
  else if (urls.every((url) => stored.includes(url))) state = 'saved';
  else if (optimistic === 'saving') state = 'saving';
  else state = 'not-saved';

  return { state, save, remove };
}

export function clearOfflineContent(): void {
  postToServiceWorker({ type: 'CLEAR_OFFLINE' });
}
