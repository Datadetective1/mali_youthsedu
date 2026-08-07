import type { CareerPath, LearningResource } from '@/lib/types';
import { resources as seedResources } from '@/content/resources';
import { careerPaths as seedPaths } from '@/content/paths';
import { getStore } from '@/lib/db/repository';

/**
 * Applies admin edits on top of the seeded content.
 *
 * Content lives in typed modules (fast, bundled, offline-cacheable). Admin
 * edits live in `content_overrides` and are merged at read time. The seed is
 * never mutated, so "rétablir le contenu d'origine" is always available and an
 * accidental edit can never destroy curriculum.
 */

interface Override {
  kind: string;
  refId: string;
  payload: Record<string, unknown>;
}

async function loadOverrides(kind: string): Promise<Map<string, Record<string, unknown>>> {
  try {
    const store = await getStore();
    const rows = await store.list('content_overrides', { kind });
    return new Map(
      rows.map((row) => [
        String(row.ref_id),
        (typeof row.payload === 'string'
          ? JSON.parse(row.payload)
          : (row.payload ?? {})) as Record<string, unknown>,
      ]),
    );
  } catch {
    // Overrides are an enhancement. If the store is unreachable the seeded
    // content must still render — a failed admin lookup is not a reason to
    // show a user an empty resource library.
    return new Map();
  }
}

export async function resourcesWithOverrides(): Promise<LearningResource[]> {
  const overrides = await loadOverrides('resource');
  if (overrides.size === 0) return seedResources;

  return seedResources.map((resource) => {
    const override = overrides.get(resource.id);
    return override ? ({ ...resource, ...override } as LearningResource) : resource;
  });
}

export async function pathsWithOverrides(): Promise<CareerPath[]> {
  const overrides = await loadOverrides('path');
  if (overrides.size === 0) return seedPaths;

  return seedPaths
    .map((path) => {
      const override = overrides.get(path.id);
      return override ? ({ ...path, ...override } as CareerPath) : path;
    })
    .filter((path) => path.published !== false);
}

export async function overrideFor(
  kind: 'resource' | 'path',
  refId: string,
): Promise<Record<string, unknown> | null> {
  const overrides = await loadOverrides(kind);
  return overrides.get(refId) ?? null;
}

export type { Override };
