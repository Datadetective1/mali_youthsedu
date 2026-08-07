import { describe, expect, it } from 'vitest';
import { computePathProgress, jobReadinessProgress } from './progress';
import { pathById, totalItems } from '@/content/paths';
import type { ProgressEntry } from '@/lib/types';

const path = pathById.get('litteratie-numerique')!;

function entriesFor(itemIds: string[]): ProgressEntry[] {
  return itemIds.map((itemId, index) => ({
    id: `entry-${index}`,
    userId: 'user-1',
    pathId: path.id,
    stageId: path.stages.find((stage) => stage.items.some((item) => item.id === itemId))!.id,
    itemId,
    completedAt: '2026-03-01T10:00:00.000Z',
  }));
}

describe('computePathProgress', () => {
  it('reports zero progress for a fresh start', () => {
    const progress = computePathProgress(path, []);
    expect(progress.done).toBe(0);
    expect(progress.percent).toBe(0);
    expect(progress.status).toBe('not-started');
  });

  it('points at the very first item as the next action', () => {
    const progress = computePathProgress(path, []);
    expect(progress.nextStageId).toBe(path.stages[0]!.id);
    expect(progress.nextItemId).toBe(path.stages[0]!.items[0]!.id);
  });

  it('counts completed items and computes the percentage', () => {
    const firstTwo = path.stages[0]!.items.slice(0, 2).map((item) => item.id);
    const progress = computePathProgress(path, entriesFor(firstTwo));
    expect(progress.done).toBe(2);
    expect(progress.total).toBe(totalItems(path));
    expect(progress.percent).toBe(Math.round((2 / totalItems(path)) * 100));
    expect(progress.status).toBe('in-progress');
  });

  it('reports completion when every item is done', () => {
    const all = path.stages.flatMap((stage) => stage.items.map((item) => item.id));
    const progress = computePathProgress(path, entriesFor(all));
    expect(progress.percent).toBe(100);
    expect(progress.status).toBe('completed');
    expect(progress.nextItemId).toBeNull();
  });

  it('locks a later stage until the previous one is finished', () => {
    const progress = computePathProgress(path, []);
    expect(progress.stages[0]!.locked).toBe(false);
    expect(progress.stages[1]!.locked).toBe(true);
  });

  it('unlocks the next stage once the previous one is complete', () => {
    const firstStageItems = path.stages[0]!.items.map((item) => item.id);
    const progress = computePathProgress(path, entriesFor(firstStageItems));
    expect(progress.stages[0]!.status).toBe('completed');
    expect(progress.stages[1]!.locked).toBe(false);
  });

  it('does not lock a stage the user has already started out of order', () => {
    const secondStageItem = path.stages[1]!.items[0]!.id;
    const progress = computePathProgress(path, entriesFor([secondStageItem]));
    expect(progress.stages[1]!.locked).toBe(false);
  });

  it('ignores progress entries belonging to a different path', () => {
    const foreign: ProgressEntry[] = [
      {
        id: 'foreign',
        userId: 'user-1',
        pathId: 'commercial-vente',
        stageId: 'commercial-vente-s1',
        itemId: 'commercial-vente-s1-i1',
        completedAt: '2026-03-01T10:00:00.000Z',
      },
    ];
    expect(computePathProgress(path, foreign).done).toBe(0);
  });

  it('is idempotent when the same completion is recorded twice', () => {
    const itemId = path.stages[0]!.items[0]!.id;
    const duplicated = [...entriesFor([itemId]), ...entriesFor([itemId])];
    expect(computePathProgress(path, duplicated).done).toBe(1);
  });
});

describe('jobReadinessProgress', () => {
  const nothing = {
    hasCv: false,
    cvLinesMastered: false,
    analysesRun: 0,
    hasValueProposition: false,
    interviewAnswersWritten: 0,
    starExamples: 0,
    employerResearchDone: false,
    checklistsCompleted: 0,
    projectsCompleted: 0,
  };

  it('starts at zero', () => {
    expect(jobReadinessProgress(nothing).percent).toBe(0);
  });

  it('reaches 100 when everything is done', () => {
    const everything = {
      hasCv: true,
      cvLinesMastered: true,
      analysesRun: 2,
      hasValueProposition: true,
      interviewAnswersWritten: 6,
      starExamples: 3,
      employerResearchDone: true,
      checklistsCompleted: 3,
      projectsCompleted: 1,
    };
    expect(jobReadinessProgress(everything).percent).toBe(100);
  });

  it('requires the stated threshold, not merely a non-zero count', () => {
    const partial = { ...nothing, interviewAnswersWritten: 2, starExamples: 1 };
    const result = jobReadinessProgress(partial);
    expect(result.components.find((c) => c.key === 'interviewAnswersWritten')?.done).toBe(false);
    expect(result.components.find((c) => c.key === 'starExamples')?.done).toBe(false);
  });

  it('gives every component a French hint', () => {
    for (const component of jobReadinessProgress(nothing).components) {
      expect(component.hint.length).toBeGreaterThan(5);
      expect(component.label.length).toBeGreaterThan(3);
    }
  });
});
