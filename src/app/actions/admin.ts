'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { getStore } from '@/lib/db/repository';
import { resourceById } from '@/content/resources';
import { pathById } from '@/content/paths';

/**
 * Admin actions.
 *
 * Every one re-checks `session.isAdmin` server-side. The admin routes are also
 * guarded by `requireAdmin()` and, under Supabase, by RLS — three independent
 * layers, because "the UI does not show the button" is not access control.
 *
 * Edits are stored as overrides rather than mutating seed content, so the
 * original is always recoverable and an accidental edit is never destructive.
 */

export type AdminResult = { ok: true } | { ok: false; error: string };

const FORBIDDEN: AdminResult = { ok: false, error: 'Action reservee aux administrateurs.' };

async function requireAdminUser(): Promise<string | null> {
  const session = await getSession();
  if (!session?.isAdmin) return null;
  return session.userId;
}

const resourceOverrideSchema = z.object({
  resourceId: z.string().min(1).max(120),
  title: z.string().max(300).optional(),
  provider: z.string().max(200).optional(),
  url: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  qualityNotes: z.string().max(2000).optional(),
  verification: z.enum(['verified', 'pending', 'broken']).optional(),
  archived: z.boolean().optional(),
});

export async function saveResourceOverrideAction(
  input: z.input<typeof resourceOverrideSchema>,
): Promise<AdminResult> {
  const adminId = await requireAdminUser();
  if (!adminId) return FORBIDDEN;

  const parsed = resourceOverrideSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Donnees invalides.' };
  if (!resourceById.has(parsed.data.resourceId)) {
    return { ok: false, error: 'Ressource inconnue.' };
  }
  if (parsed.data.url && !/^https:\/\//.test(parsed.data.url)) {
    return { ok: false, error: 'Le lien doit commencer par https://' };
  }

  const store = await getStore();
  const { resourceId, ...payload } = parsed.data;

  // Marking a link verified stamps the date automatically: a verification with
  // no date is indistinguishable from a guess six months later.
  const withDate =
    payload.verification === 'verified'
      ? { ...payload, lastReviewed: new Date().toISOString().slice(0, 10) }
      : payload.verification === 'pending'
        ? { ...payload, lastReviewed: null }
        : payload;

  await store.upsert(
    'content_overrides',
    { kind: 'resource', ref_id: resourceId, payload: withDate, updated_by: adminId },
    ['kind', 'ref_id'],
  );

  // Audit trail: who checked what, and when.
  if (payload.verification) {
    await store.insert('content_reviews', {
      kind: 'resource',
      ref_id: resourceId,
      reviewer_id: adminId,
      outcome: payload.verification === 'broken' ? 'broken' : payload.verification,
      notes: payload.qualityNotes ?? '',
    });
  }

  revalidatePath('/admin/ressources');
  revalidatePath('/ressources');
  return { ok: true };
}

const pathOverrideSchema = z.object({
  pathId: z.string().min(1).max(120),
  name: z.string().max(200).optional(),
  summary: z.string().max(500).optional(),
  description: z.string().max(3000).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function savePathOverrideAction(
  input: z.input<typeof pathOverrideSchema>,
): Promise<AdminResult> {
  const adminId = await requireAdminUser();
  if (!adminId) return FORBIDDEN;

  const parsed = pathOverrideSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Donnees invalides.' };
  if (!pathById.has(parsed.data.pathId)) return { ok: false, error: 'Parcours inconnu.' };

  const store = await getStore();
  const { pathId, ...payload } = parsed.data;

  await store.upsert(
    'content_overrides',
    { kind: 'path', ref_id: pathId, payload, updated_by: adminId },
    ['kind', 'ref_id'],
  );

  revalidatePath('/admin/parcours');
  revalidatePath('/parcours');
  return { ok: true };
}

export async function resetOverrideAction(
  kind: 'resource' | 'path',
  refId: string,
): Promise<AdminResult> {
  const adminId = await requireAdminUser();
  if (!adminId) return FORBIDDEN;

  const store = await getStore();
  await store.remove('content_overrides', { kind, ref_id: refId });

  await store.insert('content_reviews', {
    kind,
    ref_id: refId,
    reviewer_id: adminId,
    outcome: 'updated',
    notes: 'Contenu d’origine retabli.',
  });

  revalidatePath('/admin');
  revalidatePath(kind === 'resource' ? '/ressources' : '/parcours');
  return { ok: true };
}
