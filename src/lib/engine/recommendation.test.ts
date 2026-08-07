import { describe, expect, it } from 'vitest';
import { estimateWeeks, recommendPaths } from './recommendation';
import { careerPaths, pathById } from '@/content/paths';
import type { OnboardingAnswers } from '@/lib/types';

const baseAnswers: OnboardingAnswers = {
  educationLevel: 'lycee',
  status: 'diplome',
  locationType: 'urbain',
  frenchLevel: 'courant',
  englishLevel: 'debutant',
  digitalLevel: 'intermediaire',
  goal: 'trouver-emploi',
  interests: ['commerce'],
  hoursPerWeek: 5,
  connectivity: 'correcte',
  device: 'smartphone',
  experience: 'aucune',
  learningStyle: 'pratique',
};

function answers(overrides: Partial<OnboardingAnswers> = {}): OnboardingAnswers {
  return { ...baseAnswers, ...overrides };
}

describe('recommendPaths', () => {
  it('always returns a path that exists in the content', () => {
    const result = recommendPaths(answers());
    expect(pathById.has(result.primaryPathId)).toBe(true);
  });

  it('scores every path so the ranking is complete', () => {
    const result = recommendPaths(answers());
    expect(result.scores).toHaveLength(careerPaths.length);
  });

  it('is deterministic: identical answers give identical results', () => {
    const first = recommendPaths(answers());
    const second = recommendPaths(answers());
    expect(second.primaryPathId).toBe(first.primaryPathId);
    expect(second.supportingPathId).toBe(first.supportingPathId);
    expect(second.scores.map((s) => s.pathId)).toEqual(first.scores.map((s) => s.pathId));
  });

  it('recommends entrepreneurship when the goal is to create an activity', () => {
    const result = recommendPaths(answers({ goal: 'creer-activite', interests: ['entrepreneuriat'] }));
    expect(result.primaryPathId).toBe('entrepreneuriat');
  });

  it('recommends freelancing when the goal is freelancing and digital skills are strong', () => {
    const result = recommendPaths(
      answers({ goal: 'freelance', digitalLevel: 'avance', englishLevel: 'avance', interests: ['numerique'] }),
    );
    expect(result.primaryPathId).toBe('freelance-distance');
  });

  it('puts digital literacy first for a complete beginner, whatever the stated goal', () => {
    const result = recommendPaths(
      answers({
        goal: 'trouver-emploi',
        digitalLevel: 'debutant',
        educationLevel: 'primaire',
        interests: ['administration'],
      }),
    );
    expect([result.primaryPathId, result.supportingPathId]).toContain('litteratie-numerique');
  });

  it('does not recommend freelancing to someone with a rare connection', () => {
    const result = recommendPaths(
      answers({ goal: 'freelance', connectivity: 'rare', digitalLevel: 'debutant' }),
    );
    expect(result.primaryPathId).not.toBe('freelance-distance');
  });

  it('surfaces English when the mining sector is the target and English is weak', () => {
    const result = recommendPaths(
      answers({ goal: 'secteur', interests: ['mines'], englishLevel: 'aucun' }),
    );
    expect([result.primaryPathId, result.supportingPathId]).toContain('anglais-emploi');
  });

  it('does not push the English path on someone already fluent', () => {
    const fluent = recommendPaths(answers({ englishLevel: 'avance', interests: ['langues'] }));
    const englishScore = fluent.scores.find((s) => s.pathId === 'anglais-emploi')?.score ?? 0;
    const weak = recommendPaths(answers({ englishLevel: 'aucun', interests: ['langues'] }));
    const weakScore = weak.scores.find((s) => s.pathId === 'anglais-emploi')?.score ?? 0;
    expect(englishScore).toBeLessThan(weakScore);
  });

  it('never returns the primary path as its own supporting path', () => {
    const goals: OnboardingAnswers['goal'][] = [
      'trouver-emploi',
      'premier-emploi',
      'changer-metier',
      'travail-distance',
      'freelance',
      'creer-activite',
      'competences',
      'secteur',
    ];
    for (const goal of goals) {
      const result = recommendPaths(answers({ goal }));
      expect(result.supportingPathId).not.toBe(result.primaryPathId);
    }
  });

  it('explains its choice in French with at least one reason', () => {
    const result = recommendPaths(answers());
    expect(result.reasons.length).toBeGreaterThan(0);
    for (const reason of result.reasons) {
      expect(reason.explanation.length).toBeGreaterThan(10);
      expect(reason.points).toBeGreaterThan(0);
    }
  });

  it('produces a sensible answer for every combination of goal and digital level', () => {
    const goals: OnboardingAnswers['goal'][] = [
      'trouver-emploi',
      'premier-emploi',
      'changer-metier',
      'travail-distance',
      'freelance',
      'creer-activite',
      'competences',
      'secteur',
    ];
    const levels: OnboardingAnswers['digitalLevel'][] = ['debutant', 'intermediaire', 'avance'];

    for (const goal of goals) {
      for (const digitalLevel of levels) {
        const result = recommendPaths(answers({ goal, digitalLevel }));
        expect(pathById.has(result.primaryPathId)).toBe(true);
        expect(result.estimatedWeeks).toBeGreaterThan(0);
      }
    }
  });

  it('favours entrepreneurship for a rural user with a poor connection', () => {
    const result = recommendPaths(
      answers({
        locationType: 'rural',
        connectivity: 'rare',
        goal: 'creer-activite',
        interests: ['agriculture', 'entrepreneuriat'],
      }),
    );
    expect(result.primaryPathId).toBe('entrepreneuriat');
  });
});

describe('estimateWeeks', () => {
  it('divides total hours by the weekly pace', () => {
    expect(estimateWeeks(40, 5)).toBe(8);
    expect(estimateWeeks(41, 5)).toBe(9);
  });

  it('never returns zero or a negative number of weeks', () => {
    expect(estimateWeeks(1, 20)).toBe(1);
    expect(estimateWeeks(10, 0)).toBeGreaterThan(0);
    expect(estimateWeeks(10, -5)).toBeGreaterThan(0);
  });
});
