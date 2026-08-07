import type {
  EducationLevel,
  ExperienceLevel,
  OnboardingAnswers,
  ProgressEntry,
  UserProject,
} from '@/lib/types';
import { pathById } from '@/content/paths';
import { projectById } from '@/content/projects';
import { skillById, skills } from '@/content/skills';
import { normalizeText, unique } from '@/lib/utils';

/**
 * A single, flat view of everything we know about a user's capabilities.
 *
 * Built once and passed to the matching and readiness engines, so those stay
 * pure functions that are trivial to test — no database access, no request
 * context, no hidden inputs.
 */
export interface ProfileSnapshot {
  onboarding: OnboardingAnswers | null;
  /** Skills backed by finished work: completed stages and completed projects. */
  provenSkillIds: string[];
  /** Skills currently being learned — started but not finished. */
  learningSkillIds: string[];
  /** Free-text skills and tools the user typed into their CV. */
  declaredSkills: string[];
  declaredTools: string[];
  experience: ExperienceLevel | null;
  education: EducationLevel | null;
  preparation: PreparationSnapshot;
}

export interface PreparationSnapshot {
  analyses: number;
  hasValueProposition: boolean;
  interviewAnswers: number;
  starExamples: number;
  employerResearch: boolean;
  projectsCompleted: number;
  hasCv: boolean;
}

export const emptyPreparation: PreparationSnapshot = {
  analyses: 0,
  hasValueProposition: false,
  interviewAnswers: 0,
  starExamples: 0,
  employerResearch: false,
  projectsCompleted: 0,
  hasCv: false,
};

export interface BuildSnapshotInput {
  onboarding: OnboardingAnswers | null;
  progress: ProgressEntry[];
  activePathIds: string[];
  userProjects: UserProject[];
  declaredSkills?: string[];
  declaredTools?: string[];
  preparation?: Partial<PreparationSnapshot>;
}

/**
 * Skills implied by the onboarding self-assessment.
 *
 * Self-assessment is weaker evidence than finished work, so anything less than
 * a confident "avancé" lands in `learning` rather than `proven` — a partial
 * match the user can explain, not a claim we make on their behalf.
 *
 * Shared by `buildProfileSnapshot` and `skillEvidence` so both agree no matter
 * how a snapshot was assembled.
 */
export function baselineSkillsFromOnboarding(onboarding: OnboardingAnswers | null): {
  proven: string[];
  learning: string[];
} {
  if (!onboarding) return { proven: [], learning: [] };

  const proven: string[] = [];
  const learning: string[] = [];
  const { digitalLevel, englishLevel, frenchLevel } = onboarding;

  if (digitalLevel === 'avance') {
    proven.push('informatique-base', 'tableur', 'traitement-texte', 'email-pro', 'recherche-web');
  } else if (digitalLevel === 'intermediaire') {
    proven.push('informatique-base', 'recherche-web', 'email-pro');
    learning.push('tableur', 'traitement-texte');
  }

  if (englishLevel === 'avance') proven.push('anglais-pro', 'anglais-entretien');
  else if (englishLevel === 'intermediaire') learning.push('anglais-pro', 'anglais-entretien');

  if (frenchLevel === 'avance') proven.push('francais-pro', 'communication-ecrite');
  else if (frenchLevel === 'courant') proven.push('francais-pro');
  else learning.push('francais-pro');

  return { proven, learning };
}

export function buildProfileSnapshot(input: BuildSnapshotInput): ProfileSnapshot {
  const completedItemIds = new Set(input.progress.map((entry) => entry.itemId));
  const proven: string[] = [];
  const learning: string[] = [];

  for (const pathId of input.activePathIds) {
    const path = pathById.get(pathId);
    if (!path) continue;

    for (const stage of path.stages) {
      const done = stage.items.filter((item) => completedItemIds.has(item.id)).length;
      if (done === 0) continue;
      // A stage only proves its skills once it is finished; a stage in flight
      // counts as "learning", which the UI shows as a partial match.
      if (done === stage.items.length) proven.push(...stage.skillIds);
      else learning.push(...stage.skillIds);
    }
  }

  for (const userProject of input.userProjects) {
    if (!userProject.completedAt) continue;
    const project = projectById.get(userProject.projectId);
    if (project) proven.push(...project.skillIds);
  }

  const baseline = baselineSkillsFromOnboarding(input.onboarding);
  proven.push(...baseline.proven);
  learning.push(...baseline.learning);

  const provenSet = new Set(proven);

  return {
    onboarding: input.onboarding,
    provenSkillIds: unique(proven),
    learningSkillIds: unique(learning).filter((skillId) => !provenSet.has(skillId)),
    declaredSkills: input.declaredSkills ?? [],
    declaredTools: input.declaredTools ?? [],
    experience: input.onboarding?.experience ?? null,
    education: input.onboarding?.educationLevel ?? null,
    preparation: { ...emptyPreparation, ...input.preparation },
  };
}

/**
 * Does a free-text CV entry ("Excel avancé", "prospection terrain") correspond
 * to a known skill? Matched against the same keyword vocabulary the job
 * analyzer uses, so both sides speak the same language.
 */
export function declaredMatchesSkill(declared: string[], skillId: string): boolean {
  const skill = skillById.get(skillId);
  if (!skill) return false;
  const haystack = ` ${declared.map(normalizeText).join(' ')} `;
  if (haystack.trim().length === 0) return false;
  return (
    skill.keywords.some((keyword) => haystack.includes(` ${keyword} `)) ||
    haystack.includes(` ${normalizeText(skill.name)} `)
  );
}

export type SkillEvidence = 'proven' | 'learning' | 'declared' | 'related' | 'none';

/** How strongly the profile supports a given skill, and why. */
export function skillEvidence(profile: ProfileSnapshot, skillId: string): SkillEvidence {
  // Consult the onboarding baseline directly rather than relying on the caller
  // having run it through `buildProfileSnapshot`: a hand-assembled snapshot
  // must not silently report "no English" for someone who declared fluency.
  const baseline = baselineSkillsFromOnboarding(profile.onboarding);

  if (profile.provenSkillIds.includes(skillId) || baseline.proven.includes(skillId)) {
    return 'proven';
  }
  if (declaredMatchesSkill([...profile.declaredSkills, ...profile.declaredTools], skillId)) {
    return 'declared';
  }
  if (profile.learningSkillIds.includes(skillId) || baseline.learning.includes(skillId)) {
    return 'learning';
  }

  // A neighbouring skill in the same dimension and sector is genuine partial
  // coverage — this is what "transferable" means in practice.
  const target = skillById.get(skillId);
  if (!target) return 'none';
  const related = skills.filter(
    (skill) =>
      skill.id !== skillId &&
      skill.dimension === target.dimension &&
      (skill.sectorIds ?? []).some((sectorId) => (target.sectorIds ?? []).includes(sectorId)),
  );
  if (related.some((skill) => profile.provenSkillIds.includes(skill.id))) return 'related';

  return 'none';
}
