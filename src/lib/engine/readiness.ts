import type {
  JobExtraction,
  ReadinessComponent,
  ReadinessScore,
  RequirementMatch,
} from '@/lib/types';
import type { ProfileSnapshot } from './profile-snapshot';
import { clamp, percent } from '@/lib/utils';

/**
 * Readiness scoring.
 *
 * WHAT THIS IS: a measure of how well-prepared this application is.
 * WHAT THIS IS NOT: a probability of being hired. Nothing here models employer
 * behaviour, competition, timing, or the hundred human factors that decide a
 * recruitment. The UI states this next to every score, and the weights below
 * are shown to the user so the number is auditable rather than magical.
 */

const WEIGHTS = {
  skills: 30,
  languages: 15,
  tools: 15,
  experience: 15,
  education: 10,
  preparation: 15,
} as const;

const EDUCATION_RANK: Record<string, number> = {
  none: 0,
  primaire: 1,
  college: 2,
  lycee: 3,
  technique: 3,
  licence: 4,
  master: 5,
};

/** Approximate level demanded by an extracted education requirement. */
function requiredEducationRank(labels: string[]): number {
  const joined = labels.join(' ').toLowerCase();
  if (joined.includes('master')) return 5;
  if (joined.includes('bac +3') || joined.includes('licence')) return 4;
  if (joined.includes('bac +2') || joined.includes('bts') || joined.includes('dut')) return 4;
  if (joined.includes('bac')) return 3;
  if (joined.includes('cap') || joined.includes('bep')) return 2;
  if (joined.includes('formation')) return 3;
  return 0;
}

const EXPERIENCE_RANK: Record<string, number> = {
  aucune: 0,
  'scolaire-benevole': 1,
  stage: 2,
  'moins-2ans': 3,
  'plus-2ans': 4,
};

function requiredExperienceRank(labels: string[]): number {
  const joined = labels.join(' ').toLowerCase();
  if (joined.includes('junior') || joined.includes('débutant')) return 1;
  const years = /(\d+)\s*(?:à\s*\d+\s*)?an/.exec(joined);
  const value = years?.[1] ? Number(years[1]) : null;
  if (value === null) return joined.includes('similaire') ? 3 : 0;
  if (value >= 5) return 4;
  if (value >= 2) return 3;
  if (value >= 1) return 2;
  return 1;
}

function ratioOf(matches: RequirementMatch[]): number {
  if (matches.length === 0) return -1; // "not assessed"
  const weighted = matches.reduce((sum, match) => {
    if (match.strength === 'strong') return sum + 1;
    if (match.strength === 'partial') return sum + 0.5;
    return sum;
  }, 0);
  return weighted / matches.length;
}

function preparationRatio(profile: ProfileSnapshot): number {
  const signals = [
    profile.preparation.hasCv,
    profile.preparation.analyses > 0,
    profile.preparation.hasValueProposition,
    profile.preparation.interviewAnswers >= 5,
    profile.preparation.starExamples >= 3,
    profile.preparation.employerResearch,
    profile.preparation.projectsCompleted > 0,
  ];
  return signals.filter(Boolean).length / signals.length;
}

export function computeReadiness(
  extraction: JobExtraction,
  matches: RequirementMatch[],
  profile: ProfileSnapshot,
): ReadinessScore {
  const byKind = (kinds: RequirementMatch['kind'][]) =>
    matches.filter((match) => kinds.includes(match.kind));

  const skillRatio = ratioOf(byKind(['competence-requise', 'competence-appreciee']));
  const languageRatio = ratioOf(byKind(['langue']));
  const toolRatio = ratioOf(byKind(['outil']));

  // Education and experience compare ranks rather than counting matches: a
  // candidate above the bar should not be penalised for "over-matching".
  const educationNeeded = requiredEducationRank(extraction.education.map((item) => item.label));
  const educationHave = profile.education ? (EDUCATION_RANK[profile.education] ?? 0) : -1;
  const educationRatio =
    educationNeeded === 0 || educationHave < 0
      ? -1
      : clamp(educationHave / educationNeeded, 0, 1);

  const experienceNeeded = requiredExperienceRank(extraction.experience.map((item) => item.label));
  const experienceHave = profile.experience ? (EXPERIENCE_RANK[profile.experience] ?? 0) : -1;
  const experienceRatio =
    experienceNeeded === 0
      ? -1
      : experienceHave < 0
        ? 0
        : clamp(experienceHave / experienceNeeded, 0, 1);

  const rawComponents: (ReadinessComponent & { assessed: boolean })[] = [
    {
      key: 'skills',
      label: 'Compétences demandées',
      weight: WEIGHTS.skills,
      score: Math.round(Math.max(0, skillRatio) * 100),
      assessed: skillRatio >= 0,
      detail: describeRatio(skillRatio, byKind(['competence-requise', 'competence-appreciee']).length, 'compétence'),
    },
    {
      key: 'languages',
      label: 'Exigences linguistiques',
      weight: WEIGHTS.languages,
      score: Math.round(Math.max(0, languageRatio) * 100),
      assessed: languageRatio >= 0,
      detail: describeRatio(languageRatio, byKind(['langue']).length, 'langue'),
    },
    {
      key: 'tools',
      label: 'Logiciels et outils',
      weight: WEIGHTS.tools,
      score: Math.round(Math.max(0, toolRatio) * 100),
      assessed: toolRatio >= 0,
      detail: describeRatio(toolRatio, byKind(['outil']).length, 'outil'),
    },
    {
      key: 'experience',
      label: 'Expérience',
      weight: WEIGHTS.experience,
      score: Math.round(Math.max(0, experienceRatio) * 100),
      assessed: experienceRatio >= 0,
      detail:
        experienceNeeded === 0
          ? 'Aucune exigence d’expérience détectée dans l’offre.'
          : experienceHave < 0
            ? 'Votre expérience n’est pas renseignée.'
            : experienceRatio >= 1
              ? 'Votre expérience couvre ce qui est demandé.'
              : 'Votre expérience est en deçà de ce que demande l’offre : préparez une explication.',
    },
    {
      key: 'education',
      label: 'Formation',
      weight: WEIGHTS.education,
      score: Math.round(Math.max(0, educationRatio) * 100),
      assessed: educationRatio >= 0,
      detail:
        educationNeeded === 0
          ? 'Aucune exigence de diplôme détectée dans l’offre.'
          : educationHave < 0
            ? 'Votre niveau d’études n’est pas renseigné.'
            : educationRatio >= 1
              ? 'Votre niveau d’études correspond à la demande.'
              : 'Le diplôme demandé est supérieur au vôtre : mettez en avant votre expérience et vos réalisations.',
    },
    {
      key: 'preparation',
      label: 'Travail de préparation effectué',
      weight: WEIGHTS.preparation,
      score: Math.round(preparationRatio(profile) * 100),
      assessed: true,
      detail:
        'CV, analyse d’offre, proposition de valeur, réponses d’entretien, exemples STAR, recherche employeur et projet terminé.',
    },
  ];

  // Redistribute the weight of anything the advert did not ask about, so a job
  // with no language requirement does not cap everyone at 85.
  const assessed = rawComponents.filter((component) => component.assessed);
  const totalWeight = assessed.reduce((sum, component) => sum + component.weight, 0);

  const score =
    totalWeight === 0
      ? 0
      : clamp(
          Math.round(
            assessed.reduce((sum, component) => sum + component.score * component.weight, 0) /
              totalWeight,
          ),
          0,
          100,
        );

  const components: ReadinessComponent[] = rawComponents.map(({ assessed: _assessed, ...rest }) => rest);

  return {
    score,
    band: score < 40 ? 'low' : score < 70 ? 'medium' : 'high',
    components,
  };
}

function describeRatio(ratio: number, total: number, noun: string): string {
  if (ratio < 0) return `Aucune ${noun} détectée dans cette offre.`;
  const covered = Math.round(ratio * total);
  return `${covered} ${noun}${covered > 1 ? 's' : ''} couverte${covered > 1 ? 's' : ''} sur ${total} détectée${total > 1 ? 's' : ''} (${percent(covered, total)} %).`;
}
