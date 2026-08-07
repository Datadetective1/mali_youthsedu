import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_ATTEMPTS,
  clearQueue,
  coalesce,
  createMemoryStorage,
  enqueue,
  flushQueue,
  listQueue,
  operationKey,
  queueLength,
  removeOperations,
  type QueueStorage,
} from './queue';
import type { QueuedOperation, SyncOperation } from '@/lib/types';

let storage: QueueStorage;

const completeItem = (itemId: string): SyncOperation => ({
  type: 'complete-item',
  pathId: 'litteratie-numerique',
  stageId: 'litteratie-numerique-s1',
  itemId,
  at: '2026-03-02T10:00:00.000Z',
});

const uncompleteItem = (itemId: string): SyncOperation => ({
  type: 'uncomplete-item',
  pathId: 'litteratie-numerique',
  stageId: 'litteratie-numerique-s1',
  itemId,
  at: '2026-03-02T10:05:00.000Z',
});

beforeEach(() => {
  storage = createMemoryStorage();
});

describe('enqueue / listQueue', () => {
  it('stores an operation and survives a fresh read', () => {
    enqueue(completeItem('item-1'), storage);
    expect(listQueue(storage)).toHaveLength(1);
    expect(listQueue(storage)[0]?.operation.type).toBe('complete-item');
  });

  it('gives every entry a distinct id', () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(completeItem('item-2'), storage);
    const ids = listQueue(storage).map((entry) => entry.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('starts every entry at zero attempts', () => {
    enqueue(completeItem('item-1'), storage);
    expect(listQueue(storage)[0]?.attempts).toBe(0);
  });

  it('survives corrupted storage without throwing', () => {
    storage.setItem('myp_sync_queue_v1', 'ceci-nest-pas-du-json');
    expect(listQueue(storage)).toEqual([]);
    expect(() => enqueue(completeItem('item-1'), storage)).not.toThrow();
  });
});

describe('operationKey', () => {
  it('gives complete and uncomplete of the same item the same key', () => {
    expect(operationKey(completeItem('x'))).toBe(operationKey(uncompleteItem('x')));
  });

  it('separates different items', () => {
    expect(operationKey(completeItem('a'))).not.toBe(operationKey(completeItem('b')));
  });

  it('separates a task completion from a task move', () => {
    const complete: SyncOperation = { type: 'complete-task', taskId: 't1', at: '2026-03-02' };
    const move: SyncOperation = { type: 'move-task', taskId: 't1', day: 3, at: '2026-03-02' };
    expect(operationKey(complete)).not.toBe(operationKey(move));
  });
});

describe('coalesce', () => {
  it('keeps only the last operation for a given target', () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(uncompleteItem('item-1'), storage);
    enqueue(completeItem('item-1'), storage);

    const collapsed = coalesce(listQueue(storage));
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0]?.operation.type).toBe('complete-item');
  });

  it('resolves to the final state even when that state is "undone"', () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(uncompleteItem('item-1'), storage);

    const collapsed = coalesce(listQueue(storage));
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0]?.operation.type).toBe('uncomplete-item');
  });

  it('does not collapse operations on different targets', () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(completeItem('item-2'), storage);
    expect(coalesce(listQueue(storage))).toHaveLength(2);
  });

  it('preserves the original ordering of surviving operations', () => {
    enqueue({ type: 'save-note', scope: 'stage', refId: 's1', body: 'a', at: '2026-03-02' }, storage);
    enqueue(completeItem('item-1'), storage);
    enqueue({ type: 'save-note', scope: 'stage', refId: 's1', body: 'b', at: '2026-03-03' }, storage);

    const collapsed = coalesce(listQueue(storage));
    expect(collapsed).toHaveLength(2);
    expect(collapsed[0]?.operation.type).toBe('complete-item');
    expect(collapsed[1]?.operation.type).toBe('save-note');
  });

  it('reports the coalesced length to the user, not the raw one', () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(uncompleteItem('item-1'), storage);
    enqueue(completeItem('item-1'), storage);
    expect(listQueue(storage)).toHaveLength(3);
    expect(queueLength(storage)).toBe(1);
  });
});

describe('flushQueue', () => {
  it('empties the queue when everything is applied', async () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(completeItem('item-2'), storage);

    const send = vi.fn(async (operations: QueuedOperation[]) => ({
      applied: operations.map((operation) => operation.id),
    }));
    const result = await flushQueue(send, storage);

    expect(result.applied).toBe(2);
    expect(result.remaining).toBe(0);
    expect(listQueue(storage)).toHaveLength(0);
  });

  it('sends the coalesced operations, not every raw one', async () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(uncompleteItem('item-1'), storage);

    const sent: QueuedOperation[][] = [];
    const send = vi.fn(async (operations: QueuedOperation[]) => {
      sent.push(operations);
      return { applied: [] as string[] };
    });
    await flushQueue(send, storage);

    expect(send).toHaveBeenCalledTimes(1);
    expect(sent[0]).toHaveLength(1);
  });

  it('keeps unapplied operations queued and counts the attempt', async () => {
    enqueue(completeItem('item-1'), storage);
    const send = vi.fn(async () => ({ applied: [] as string[] }));

    const result = await flushQueue(send, storage);
    expect(result.failed).toBe(1);
    expect(result.remaining).toBe(1);
    expect(listQueue(storage)[0]?.attempts).toBe(1);
  });

  it('keeps the queue intact when the request throws entirely', async () => {
    enqueue(completeItem('item-1'), storage);
    const send = vi.fn(async () => {
      throw new Error('network down');
    });

    const result = await flushQueue(send, storage);
    expect(result.applied).toBe(0);
    expect(listQueue(storage)).toHaveLength(1);
  });

  it('applies partial success correctly', async () => {
    enqueue(completeItem('item-1'), storage);
    enqueue(completeItem('item-2'), storage);
    const queued = listQueue(storage);

    const send = vi.fn(async () => ({ applied: [queued[0]!.id] }));
    const result = await flushQueue(send, storage);

    expect(result.applied).toBe(1);
    expect(result.remaining).toBe(1);
    expect(listQueue(storage)[0]?.operation).toMatchObject({ itemId: 'item-2' });
  });

  it('drops an operation that has failed too many times rather than blocking forever', async () => {
    enqueue(completeItem('poison'), storage);
    const send = vi.fn(async () => ({ applied: [] as string[] }));

    for (let attempt = 0; attempt < MAX_ATTEMPTS - 1; attempt += 1) {
      await flushQueue(send, storage);
      expect(listQueue(storage)).toHaveLength(1);
    }

    const final = await flushQueue(send, storage);
    expect(final.dropped).toBe(1);
    expect(listQueue(storage)).toHaveLength(0);
  });

  it('does nothing and reports zero when the queue is empty', async () => {
    const send = vi.fn(async () => ({ applied: [] as string[] }));
    const result = await flushQueue(send, storage);
    expect(send).not.toHaveBeenCalled();
    expect(result).toEqual({ sent: 0, applied: 0, failed: 0, dropped: 0, remaining: 0 });
  });
});

describe('queue maintenance', () => {
  it('removes specific operations', () => {
    const first = enqueue(completeItem('item-1'), storage);
    enqueue(completeItem('item-2'), storage);
    removeOperations([first.id], storage);
    expect(listQueue(storage)).toHaveLength(1);
  });

  it('clears everything', () => {
    enqueue(completeItem('item-1'), storage);
    clearQueue(storage);
    expect(listQueue(storage)).toHaveLength(0);
  });
});
