import type { CareerPath, KnowledgeCheck, RoadmapItem, RoadmapStage } from '@/lib/types';

/**
 * Small builders that derive stable ids from the path slug and the stage order.
 *
 * Hand-writing `id: 'anglais-emploi-s3-i2'` forty times is how content drifts
 * out of sync with progress records. Deriving them means a stage can never
 * collide with another, and a reordering is a compile-time visible change.
 */

type ItemSeed = Omit<RoadmapItem, 'id'>;
type CheckSeed = Omit<KnowledgeCheck, 'id'>;

type StageSeed = Omit<RoadmapStage, 'id' | 'order' | 'items' | 'knowledgeCheck'> & {
  items: ItemSeed[];
  knowledgeCheck?: CheckSeed[];
};

export function buildStages(pathId: string, seeds: StageSeed[]): RoadmapStage[] {
  return seeds.map((seed, index) => {
    const order = index + 1;
    const stageId = `${pathId}-s${order}`;
    return {
      ...seed,
      id: stageId,
      order,
      items: seed.items.map((item, itemIndex) => ({
        ...item,
        id: `${stageId}-i${itemIndex + 1}`,
      })),
      knowledgeCheck: seed.knowledgeCheck?.map((check, checkIndex) => ({
        ...check,
        id: `${stageId}-q${checkIndex + 1}`,
      })),
    };
  });
}

type PathSeed = Omit<CareerPath, 'id' | 'stages' | 'estimatedHours' | 'published'> & {
  stages: StageSeed[];
  published?: boolean;
};

export function buildPath(seed: PathSeed): CareerPath {
  const stages = buildStages(seed.slug, seed.stages);
  const totalMinutes = stages.reduce((sum, stage) => sum + stage.estimatedMinutes, 0);
  return {
    ...seed,
    id: seed.slug,
    stages,
    estimatedHours: Math.round(totalMinutes / 60),
    published: seed.published ?? true,
  };
}
