import type { CareerPath } from '@/lib/types';
import { litteratieNumerique } from './litteratie-numerique';
import { anglaisEmploi } from './anglais-emploi';
import { commercialVente } from './commercial-vente';
import { minesSupport } from './mines-support';
import { preparationEmploi } from './preparation-emploi';
import { entrepreneuriat } from './entrepreneuriat';
import { freelanceDistance } from './freelance-distance';
import { savoirEtre } from './savoir-etre';

export const careerPaths: CareerPath[] = [
  litteratieNumerique,
  anglaisEmploi,
  commercialVente,
  minesSupport,
  preparationEmploi,
  entrepreneuriat,
  freelanceDistance,
  savoirEtre,
].sort((a, b) => a.order - b.order);

export const pathById = new Map(careerPaths.map((path) => [path.id, path]));

export function pathBySlug(slug: string): CareerPath | undefined {
  return careerPaths.find((path) => path.slug === slug);
}

export function pathName(id: string): string {
  return pathById.get(id)?.name ?? id;
}

/** Total number of trackable items across a path — the denominator for progress. */
export function totalItems(path: CareerPath): number {
  return path.stages.reduce((sum, stage) => sum + stage.items.length, 0);
}

export function findStage(pathId: string, stageId: string) {
  return pathById.get(pathId)?.stages.find((stage) => stage.id === stageId);
}

export function findItem(pathId: string, stageId: string, itemId: string) {
  return findStage(pathId, stageId)?.items.find((item) => item.id === itemId);
}
