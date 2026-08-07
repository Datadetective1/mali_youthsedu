import type { QueuedOperation, SyncOperation } from '@/lib/types';

/**
 * Offline operation queue.
 *
 * When the connection drops mid-session, actions still have to land. They are
 * appended here, survive a reload, and are replayed when the network returns.
 *
 * Two design decisions worth stating:
 *
 *  1. `localStorage`, not IndexedDB. The payload is a handful of small records,
 *     and localStorage is synchronous, universally available, and survives the
 *     aggressive storage eviction that low-end Android devices apply. IndexedDB
 *     would be the right call for cached content; it is overkill for a queue.
 *
 *  2. Operations are coalesced before sending. Ticking a task, unticking it and
 *     ticking it again should replay as one operation, not three — otherwise a
 *     week offline produces a burst of pointless writes on a metered connection.
 */

const STORAGE_KEY = 'myp_sync_queue_v1';
const MAX_ATTEMPTS = 5;
const MAX_QUEUE_LENGTH = 500;

export interface QueueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** In-memory fallback for SSR, tests, and browsers with storage disabled. */
export function createMemoryStorage(): QueueStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
}

let fallbackStorage: QueueStorage | null = null;

export function defaultStorage(): QueueStorage {
  if (typeof window !== 'undefined') {
    try {
      // Touch it: Safari in private mode throws on write rather than on access.
      window.localStorage.setItem('__myp_probe', '1');
      window.localStorage.removeItem('__myp_probe');
      return window.localStorage;
    } catch {
      // Storage unavailable — degrade to memory rather than crashing the page.
    }
  }
  fallbackStorage ??= createMemoryStorage();
  return fallbackStorage;
}

function read(storage: QueueStorage): QueuedOperation[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedOperation[]) : [];
  } catch {
    return [];
  }
}

function write(storage: QueueStorage, operations: QueuedOperation[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(operations.slice(-MAX_QUEUE_LENGTH)));
  } catch {
    // Quota exceeded. Losing a queued tick is bad; crashing the page is worse.
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `op-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Identity of the *thing* an operation acts on. Two operations sharing a key
 * target the same record, so only the last one matters.
 */
export function operationKey(operation: SyncOperation): string {
  switch (operation.type) {
    case 'complete-item':
    case 'uncomplete-item':
      return `item:${operation.itemId}`;
    case 'complete-task':
    case 'uncomplete-task':
      return `task:${operation.taskId}`;
    case 'move-task':
      return `task-day:${operation.taskId}`;
    case 'save-note':
      return `note:${operation.scope}:${operation.refId}`;
  }
}

/**
 * Collapse the queue to the last operation per target, preserving order.
 *
 * Completing then uncompleting a task offline must replay as "uncompleted",
 * once — replaying both would be wasteful and, if the order were ever lost,
 * wrong.
 */
export function coalesce(operations: QueuedOperation[]): QueuedOperation[] {
  const lastByKey = new Map<string, QueuedOperation>();
  for (const entry of operations) {
    lastByKey.set(operationKey(entry.operation), entry);
  }
  // Preserve original ordering so a note saved before a completion still
  // arrives first.
  return operations.filter((entry) => lastByKey.get(operationKey(entry.operation)) === entry);
}

export function listQueue(storage: QueueStorage = defaultStorage()): QueuedOperation[] {
  return read(storage);
}

export function queueLength(storage: QueueStorage = defaultStorage()): number {
  return coalesce(read(storage)).length;
}

export function enqueue(
  operation: SyncOperation,
  storage: QueueStorage = defaultStorage(),
): QueuedOperation {
  const entry: QueuedOperation = {
    id: newId(),
    operation,
    queuedAt: new Date().toISOString(),
    attempts: 0,
  };
  write(storage, [...read(storage), entry]);
  return entry;
}

export function removeOperations(ids: string[], storage: QueueStorage = defaultStorage()): void {
  const remove = new Set(ids);
  write(
    storage,
    read(storage).filter((entry) => !remove.has(entry.id)),
  );
}

export function clearQueue(storage: QueueStorage = defaultStorage()): void {
  storage.removeItem(STORAGE_KEY);
}

export interface FlushResult {
  sent: number;
  applied: number;
  failed: number;
  dropped: number;
  remaining: number;
}

/**
 * Replay the queue.
 *
 * `send` should return the ids it successfully applied. Anything not returned
 * stays queued with an incremented attempt count; once an operation has failed
 * `MAX_ATTEMPTS` times it is dropped, because a permanently poisoned entry
 * would otherwise block the queue forever.
 */
export async function flushQueue(
  send: (operations: QueuedOperation[]) => Promise<{ applied: string[] }>,
  storage: QueueStorage = defaultStorage(),
): Promise<FlushResult> {
  const pending = coalesce(read(storage));
  if (pending.length === 0) {
    // Superseded operations may still be sitting in storage; drop them.
    write(storage, []);
    return { sent: 0, applied: 0, failed: 0, dropped: 0, remaining: 0 };
  }

  let applied: string[] = [];
  try {
    const response = await send(pending);
    applied = response.applied;
  } catch {
    applied = [];
  }

  const appliedSet = new Set(applied);
  let dropped = 0;

  const remaining: QueuedOperation[] = [];
  for (const entry of pending) {
    if (appliedSet.has(entry.id)) continue;
    const attempts = entry.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      dropped += 1;
      continue;
    }
    remaining.push({ ...entry, attempts });
  }

  write(storage, remaining);

  return {
    sent: pending.length,
    applied: appliedSet.size,
    failed: pending.length - appliedSet.size,
    dropped,
    remaining: remaining.length,
  };
}

export { MAX_ATTEMPTS, STORAGE_KEY };
