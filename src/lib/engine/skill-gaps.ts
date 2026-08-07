import type { JobAnalysis, SkillGapEntry } from '@/lib/types';
import { careerPaths } from '@/content/paths';
import { newId } from '@/lib/utils';

/**
 * Aggregates the unmet requirements across every job the user has analysed.
 *
 * One missing requirement in one advert is noise. The same requirement missing
 * in three adverts is a priority — that is the signal this surface exists to
 * expose.
 */

function pathTeaching(skillId: string | null): string | null {
  if (!skillId) return null;
  const path = careerPaths
    .filter(
      (candidate) =>
        candidate.skillIds.includes(skillId) ||
        candidate.stages.some((stage) => stage.skillIds.includes(skillId)),
    )
    .sort((a, b) => a.order - b.order)[0];
  return path?.id ?? null;
}

export function aggregateSkillGaps(
  analyses: JobAnalysis[],
  existing: SkillGapEntry[] = [],
): SkillGapEntry[] {
  const byLabel = new Map<string, SkillGapEntry>();

  // Preserve any status the user has already set ("en cours", "traité").
  for (const entry of existing) {
    byLabel.set(entry.label.toLowerCase(), { ...entry, occurrences: 0 });
  }

  for (const analysis of analyses) {
    const comparison = analysis.comparison;
    if (!comparison) continue;

    const seenInThisAnalysis = new Set<string>();
    for (const match of comparison.matches) {
      if (match.strength !== 'missing') continue;

      const key = match.label.toLowerCase();
      // Count adverts, not mentions: a term repeated in one advert is still one.
      if (seenInThisAnalysis.has(key)) continue;
      seenInThisAnalysis.add(key);

      const requirement = [
        ...analysis.extraction.requiredSkills,
        ...analysis.extraction.preferredSkills,
        ...analysis.extraction.behavioral,
      ].find((item) => item.id === match.requirementId);

      const existingEntry = byLabel.get(key);
      if (existingEntry) {
        existingEntry.occurrences += 1;
        existingEntry.pathId = existingEntry.pathId ?? match.pathId ?? null;
        continue;
      }

      const skillId = requirement?.skillId ?? null;
      byLabel.set(key, {
        id: newId(),
        userId: analysis.userId ?? '',
        label: match.label,
        skillId,
        occurrences: 1,
        status: 'todo',
        pathId: match.pathId ?? pathTeaching(skillId),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return Array.from(byLabel.values())
    .filter((entry) => entry.occurrences > 0 || entry.status !== 'todo')
    .sort(
      (a, b) =>
        b.occurrences - a.occurrences ||
        statusRank(a.status) - statusRank(b.status) ||
        a.label.localeCompare(b.label, 'fr'),
    );
}

function statusRank(status: SkillGapEntry['status']): number {
  return status === 'todo' ? 0 : status === 'learning' ? 1 : 2;
}
