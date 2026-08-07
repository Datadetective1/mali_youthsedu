import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import {
  completeItem,
  moveTask,
  saveNote,
  setTaskCompletion,
  uncompleteItem,
} from '@/lib/db/repository';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Offline queue replay.
 *
 * Applies each operation independently and reports exactly which ones landed.
 * A partial success must stay partial: silently reporting "all applied" would
 * make the client discard work that never reached the database.
 */

const operationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('complete-item'),
    pathId: z.string().min(1).max(120),
    stageId: z.string().min(1).max(160),
    itemId: z.string().min(1).max(200),
    at: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal('uncomplete-item'),
    pathId: z.string().min(1).max(120),
    stageId: z.string().min(1).max(160),
    itemId: z.string().min(1).max(200),
    at: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal('complete-task'),
    taskId: z.string().min(1).max(200),
    at: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal('uncomplete-task'),
    taskId: z.string().min(1).max(200),
    at: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal('move-task'),
    taskId: z.string().min(1).max(200),
    day: z.number().int().min(0).max(6),
    at: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal('save-note'),
    scope: z.enum(['stage', 'project', 'employer', 'reflection']),
    refId: z.string().min(1).max(200),
    body: z.string().max(10_000),
    at: z.string().min(1).max(40),
  }),
]);

const bodySchema = z.object({
  operations: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        operation: operationSchema,
        queuedAt: z.string().max(40).optional(),
        attempts: z.number().int().min(0).max(50).optional(),
      }),
    )
    .max(200),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Connectez-vous pour synchroniser votre progression.' },
      { status: 401 },
    );
  }

  const limit = await checkRateLimit(`sync:${session.userId}`, { limit: 60, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Trop de requetes. Patientez un instant.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requete invalide.' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Operations invalides.' }, { status: 400 });
  }

  const applied: string[] = [];

  for (const entry of parsed.data.operations) {
    try {
      const operation = entry.operation;
      switch (operation.type) {
        case 'complete-item':
          await completeItem(
            session.userId,
            operation.pathId,
            operation.stageId,
            operation.itemId,
            operation.at,
          );
          break;
        case 'uncomplete-item':
          await uncompleteItem(session.userId, operation.itemId);
          break;
        case 'complete-task':
          await setTaskCompletion(session.userId, operation.taskId, true);
          break;
        case 'uncomplete-task':
          await setTaskCompletion(session.userId, operation.taskId, false);
          break;
        case 'move-task':
          await moveTask(session.userId, operation.taskId, operation.day);
          break;
        case 'save-note':
          await saveNote(session.userId, operation.scope, operation.refId, operation.body);
          break;
      }
      applied.push(entry.id);
    } catch {
      // Leave it out of `applied`; the client will retry it.
    }
  }

  return NextResponse.json({ applied });
}
