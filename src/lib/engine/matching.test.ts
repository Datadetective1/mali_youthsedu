import { describe, expect, it } from 'vitest';
import { analyzeJobDescription } from './job-analyzer';
import { compareProfileToJob, groupMatches } from './matching';
import { buildProfileSnapshot, emptyPreparation, type ProfileSnapshot } from './profile-snapshot';
import { jobExamples } from '@/content/job-examples';
import { pathById } from '@/content/paths';
import type { OnboardingAnswers, ProgressEntry } from '@/lib/types';

const miningAd = jobExamples.find((example) => example.id === 'job-mines-logistique')!;
const salesAd = jobExamples.find((example) => example.id === 'job-commercial-terrain')!;

const beginnerAnswers: OnboardingAnswers = {
  educationLevel: 'lycee',
  status: 'diplome',
  locationType: 'urbain',
  frenchLevel: 'courant',
  englishLevel: 'aucun',
  digitalLevel: 'debutant',
  goal: 'trouver-emploi',
  interests: ['mines'],
  hoursPerWeek: 5,
  connectivity: 'correcte',
  device: 'smartphone',
  experience: 'aucune',
  learningStyle: 'pratique',
};

function snapshot(overrides: Partial<ProfileSnapshot> = {}): ProfileSnapshot {
  return {
    onboarding: beginnerAnswers,
    provenSkillIds: [],
    learningSkillIds: [],
    declaredSkills: [],
    declaredTools: [],
    experience: 'aucune',
    education: 'lycee',
    preparation: emptyPreparation,
    ...overrides,
  };
}

/** Every progress entry for a path, i.e. a fully completed curriculum. */
function completeAll(pathId: string): ProgressEntry[] {
  const path = pathById.get(pathId);
  if (!path) return [];
  return path.stages.flatMap((stage) =>
    stage.items.map((item) => ({
      id: `${item.id}-progress`,
      userId: 'user-1',
      pathId,
      stageId: stage.id,
      itemId: item.id,
      completedAt: '2026-03-01T10:00:00.000Z',
    })),
  );
}

describe('compareProfileToJob', () => {
  const extraction = analyzeJobDescription(miningAd.text);

  it('classifies every extracted requirement into exactly one bucket', () => {
    const comparison = compareProfileToJob(extraction, snapshot());
    const grouped = groupMatches(comparison.matches);
    const total = grouped.strong.length + grouped.partial.length + grouped.missing.length;
    expect(total).toBe(comparison.matches.length);
  });

  it('marks English as missing for someone with no English at all', () => {
    const comparison = compareProfileToJob(extraction, snapshot());
    const english = comparison.matches.find((match) => /anglais/i.test(match.label));
    expect(english?.strength).not.toBe('strong');
  });

  it('marks English as strong once the profile declares an advanced level', () => {
    const comparison = compareProfileToJob(
      extraction,
      snapshot({ onboarding: { ...beginnerAnswers, englishLevel: 'avance' } }),
    );
    const english = comparison.matches.find((match) => /anglais/i.test(match.label));
    expect(english?.strength).toBe('strong');
  });

  it('turns finished curriculum work into strong matches', () => {
    const progress = completeAll('mines-support');
    const profile = buildProfileSnapshot({
      onboarding: beginnerAnswers,
      progress,
      activePathIds: ['mines-support'],
      userProjects: [],
    });

    const before = compareProfileToJob(extraction, snapshot());
    const after = compareProfileToJob(extraction, profile);

    expect(groupMatches(after.matches).strong.length).toBeGreaterThan(
      groupMatches(before.matches).strong.length,
    );
  });

  it('raises the readiness score as the profile improves, never lowers it', () => {
    const weak = compareProfileToJob(extraction, snapshot()).readiness.score;
    const strong = compareProfileToJob(
      extraction,
      buildProfileSnapshot({
        onboarding: { ...beginnerAnswers, englishLevel: 'avance', digitalLevel: 'avance', experience: 'plus-2ans' },
        progress: completeAll('mines-support'),
        activePathIds: ['mines-support'],
        userProjects: [],
        preparation: {
          hasCv: true,
          analyses: 3,
          hasValueProposition: true,
          interviewAnswers: 8,
          starExamples: 3,
          employerResearch: true,
          projectsCompleted: 2,
        },
      }),
    ).readiness.score;

    expect(strong).toBeGreaterThan(weak);
  });

  it('keeps the readiness score inside 0-100', () => {
    for (const example of jobExamples) {
      const result = compareProfileToJob(analyzeJobDescription(example.text), snapshot());
      expect(result.readiness.score).toBeGreaterThanOrEqual(0);
      expect(result.readiness.score).toBeLessThanOrEqual(100);
    }
  });

  it('assigns a band consistent with the score', () => {
    for (const example of jobExamples) {
      const { readiness } = compareProfileToJob(analyzeJobDescription(example.text), snapshot());
      const expected =
        readiness.score < 40 ? 'low' : readiness.score < 70 ? 'medium' : 'high';
      expect(readiness.band).toBe(expected);
    }
  });

  it('exposes the weighting so the score can be audited', () => {
    const { readiness } = compareProfileToJob(extraction, snapshot());
    expect(readiness.components.length).toBe(6);
    for (const component of readiness.components) {
      expect(component.weight).toBeGreaterThan(0);
      expect(component.detail.length).toBeGreaterThan(0);
    }
  });

  it('names an experience gap rather than hiding it', () => {
    const comparison = compareProfileToJob(extraction, snapshot({ experience: 'aucune' }));
    expect(comparison.experienceGap).toBeTruthy();
  });

  it('drops the experience gap once the profile has real experience', () => {
    const comparison = compareProfileToJob(
      extraction,
      snapshot({ experience: 'plus-2ans', onboarding: { ...beginnerAnswers, experience: 'plus-2ans' } }),
    );
    expect(comparison.experienceGap).toBeNull();
  });

  it('links each actionable gap to a path that teaches it', () => {
    const comparison = compareProfileToJob(extraction, snapshot());
    const linked = comparison.recommendedActions.filter((action) => action.pathId);
    expect(linked.length).toBeGreaterThan(0);
    for (const action of linked) {
      expect(pathById.has(action.pathId!)).toBe(true);
    }
  });

  it('always gives the user something to research about the employer', () => {
    const comparison = compareProfileToJob(extraction, snapshot());
    expect(comparison.questionsToResearch.length).toBeGreaterThanOrEqual(4);
  });

  it('always proposes examples to prepare', () => {
    const comparison = compareProfileToJob(extraction, snapshot());
    expect(comparison.examplesToPrepare.length).toBeGreaterThan(0);
  });

  it('surfaces transferable skills that the advert did not request', () => {
    const profile = buildProfileSnapshot({
      onboarding: beginnerAnswers,
      progress: completeAll('commercial-vente'),
      activePathIds: ['commercial-vente'],
      userProjects: [],
    });
    const comparison = compareProfileToJob(analyzeJobDescription(miningAd.text), profile);
    expect(comparison.transferable.length).toBeGreaterThan(0);
  });

  it('gives every match a French rationale', () => {
    const comparison = compareProfileToJob(analyzeJobDescription(salesAd.text), snapshot());
    for (const match of comparison.matches) {
      expect(match.rationale.length).toBeGreaterThan(10);
    }
  });
});

describe('buildProfileSnapshot', () => {
  it('counts a stage as proven only when every item in it is done', () => {
    const path = pathById.get('litteratie-numerique')!;
    const firstStage = path.stages[0]!;
    const partial: ProgressEntry[] = [
      {
        id: 'p1',
        userId: 'user-1',
        pathId: path.id,
        stageId: firstStage.id,
        itemId: firstStage.items[0]!.id,
        completedAt: '2026-03-01T10:00:00.000Z',
      },
    ];

    const profile = buildProfileSnapshot({
      onboarding: null,
      progress: partial,
      activePathIds: [path.id],
      userProjects: [],
    });

    for (const skillId of firstStage.skillIds) {
      expect(profile.provenSkillIds).not.toContain(skillId);
      expect(profile.learningSkillIds).toContain(skillId);
    }
  });

  it('promotes a stage to proven once it is finished', () => {
    const path = pathById.get('litteratie-numerique')!;
    const firstStage = path.stages[0]!;
    const progress: ProgressEntry[] = firstStage.items.map((item, index) => ({
      id: `p${index}`,
      userId: 'user-1',
      pathId: path.id,
      stageId: firstStage.id,
      itemId: item.id,
      completedAt: '2026-03-01T10:00:00.000Z',
    }));

    const profile = buildProfileSnapshot({
      onboarding: null,
      progress,
      activePathIds: [path.id],
      userProjects: [],
    });

    for (const skillId of firstStage.skillIds) {
      expect(profile.provenSkillIds).toContain(skillId);
    }
  });

  it('never lists a skill as both proven and still being learned', () => {
    const profile = buildProfileSnapshot({
      onboarding: beginnerAnswers,
      progress: completeAll('litteratie-numerique'),
      activePathIds: ['litteratie-numerique'],
      userProjects: [],
    });
    const overlap = profile.provenSkillIds.filter((id) => profile.learningSkillIds.includes(id));
    expect(overlap).toEqual([]);
  });
});
