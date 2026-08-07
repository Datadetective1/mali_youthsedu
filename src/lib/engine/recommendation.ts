import type {
  OnboardingAnswers,
  PathScore,
  Recommendation,
  RecommendationReason,
} from '@/lib/types';
import { careerPaths, pathById } from '@/content/paths';

/**
 * Deterministic path recommendation.
 *
 * No model, no opacity: a fixed set of weighted rules, each of which returns a
 * French sentence explaining its own contribution. The user sees exactly why a
 * path was suggested, and can override it at any time. AI may later rephrase
 * these explanations, but it never chooses the path.
 *
 * Scores are unbounded positive integers; only their ordering matters.
 */

const FOUNDATIONAL_PATHS = [
  'litteratie-numerique',
  'anglais-emploi',
  'preparation-emploi',
  'savoir-etre',
] as const;

/** Paths that assume regular connectivity to be worth starting. */
const CONNECTIVITY_HUNGRY = new Set(['freelance-distance']);

/** Paths whose core practice needs a real computer, not a phone. */
const COMPUTER_HEAVY = new Set(['litteratie-numerique', 'mines-support']);

const GOAL_AFFINITY: Record<OnboardingAnswers['goal'], Record<string, number>> = {
  'trouver-emploi': {
    'preparation-emploi': 40,
    'commercial-vente': 22,
    'mines-support': 16,
    'savoir-etre': 14,
  },
  'premier-emploi': {
    'preparation-emploi': 38,
    'savoir-etre': 24,
    'commercial-vente': 18,
    'litteratie-numerique': 14,
  },
  'changer-metier': {
    'preparation-emploi': 30,
    'commercial-vente': 22,
    'mines-support': 22,
    'litteratie-numerique': 14,
  },
  'travail-distance': {
    'freelance-distance': 38,
    'anglais-emploi': 24,
    'litteratie-numerique': 20,
  },
  freelance: {
    'freelance-distance': 42,
    entrepreneuriat: 20,
    'litteratie-numerique': 14,
  },
  'creer-activite': {
    entrepreneuriat: 42,
    'commercial-vente': 20,
    'freelance-distance': 10,
  },
  competences: {
    'litteratie-numerique': 26,
    'anglais-emploi': 22,
    'savoir-etre': 20,
    'commercial-vente': 12,
  },
  secteur: {
    'mines-support': 30,
    'commercial-vente': 24,
    'anglais-emploi': 18,
    'preparation-emploi': 14,
  },
};

interface ScoreAccumulator {
  score: number;
  reasons: RecommendationReason[];
}

function addReason(
  accumulator: Map<string, ScoreAccumulator>,
  pathId: string,
  factor: string,
  explanation: string,
  points: number,
): void {
  if (points === 0) return;
  const entry = accumulator.get(pathId);
  if (!entry) return;
  entry.score += points;
  entry.reasons.push({ factor, explanation, points });
}

/** Number of weeks to finish a path at the declared pace, floored at 1. */
export function estimateWeeks(estimatedHours: number, hoursPerWeek: number): number {
  const pace = Math.max(1, hoursPerWeek);
  return Math.max(1, Math.ceil(estimatedHours / pace));
}

export function recommendPaths(answers: OnboardingAnswers): Recommendation {
  const accumulator = new Map<string, ScoreAccumulator>(
    careerPaths.map((path) => [path.id, { score: 0, reasons: [] }]),
  );

  // --- 1. Main goal — the strongest single signal -------------------------
  const goalAffinity = GOAL_AFFINITY[answers.goal] ?? {};
  for (const [pathId, points] of Object.entries(goalAffinity)) {
    addReason(
      accumulator,
      pathId,
      'Objectif',
      `Ce parcours correspond directement à votre objectif : ${goalLabel(answers.goal)}.`,
      points,
    );
  }

  // --- 2. Declared interests ---------------------------------------------
  for (const path of careerPaths) {
    const matched = path.sectorIds.filter((sectorId) =>
      (answers.interests as string[]).includes(sectorId),
    );
    if (matched.length > 0) {
      addReason(
        accumulator,
        path.id,
        'Centres d’intérêt',
        `Vous avez indiqué un intérêt pour ${matched.map(sectorLabel).join(' et ')}.`,
        Math.min(24, matched.length * 12),
      );
    }
  }

  // --- 3. Current skill levels — fill the foundations first ---------------
  if (answers.digitalLevel === 'debutant') {
    addReason(
      accumulator,
      'litteratie-numerique',
      'Niveau numérique',
      'Presque toutes les offres demandent la bureautique, et vous partez de la base : c’est le levier le plus rapide.',
      30,
    );
    // Paths whose exercises assume a spreadsheet from stage one.
    addReason(
      accumulator,
      'mines-support',
      'Niveau numérique',
      'Ce parcours suppose déjà les bases du tableur.',
      -18,
    );
    addReason(
      accumulator,
      'freelance-distance',
      'Niveau numérique',
      'Le travail à distance suppose une aisance numérique déjà acquise.',
      -20,
    );
  } else if (answers.digitalLevel === 'avance') {
    addReason(
      accumulator,
      'litteratie-numerique',
      'Niveau numérique',
      'Vous maîtrisez déjà ces outils : ce parcours vous apprendrait peu.',
      -22,
    );
    addReason(
      accumulator,
      'freelance-distance',
      'Niveau numérique',
      'Votre aisance numérique rend le travail à distance envisageable.',
      12,
    );
  }

  const weakEnglish = answers.englishLevel === 'aucun' || answers.englishLevel === 'debutant';
  const englishMatters =
    answers.interests.includes('mines') ||
    answers.interests.includes('langues') ||
    answers.goal === 'travail-distance' ||
    answers.goal === 'secteur';

  if (weakEnglish && englishMatters) {
    addReason(
      accumulator,
      'anglais-emploi',
      'Niveau d’anglais',
      'Les secteurs qui vous intéressent exigent souvent l’anglais, et c’est actuellement un point bloquant.',
      28,
    );
    addReason(
      accumulator,
      'mines-support',
      'Niveau d’anglais',
      'Beaucoup de postes support miniers demandent un anglais professionnel.',
      -10,
    );
  } else if (answers.englishLevel === 'avance') {
    addReason(
      accumulator,
      'anglais-emploi',
      'Niveau d’anglais',
      'Votre anglais est déjà solide : ce parcours n’est pas prioritaire.',
      -24,
    );
    addReason(
      accumulator,
      'freelance-distance',
      'Niveau d’anglais',
      'Votre anglais ouvre l’accès aux missions internationales.',
      14,
    );
    addReason(
      accumulator,
      'mines-support',
      'Niveau d’anglais',
      'Votre anglais répond à une exigence fréquente du secteur minier.',
      10,
    );
  }

  if (answers.frenchLevel === 'base') {
    addReason(
      accumulator,
      'savoir-etre',
      'Niveau de français',
      'Ce parcours travaille la communication écrite et orale, utile avant les parcours plus techniques.',
      12,
    );
    addReason(
      accumulator,
      'preparation-emploi',
      'Niveau de français',
      'La rédaction de CV et de lettres demande un français écrit assuré.',
      -8,
    );
  }

  // --- 4. Experience ------------------------------------------------------
  if (answers.experience === 'aucune') {
    addReason(
      accumulator,
      'savoir-etre',
      'Expérience',
      'Sans expérience professionnelle, le savoir-être et les preuves de capacité pèsent davantage.',
      16,
    );
    addReason(
      accumulator,
      'mines-support',
      'Expérience',
      'Ce parcours vise des postes qui demandent souvent une première expérience.',
      -12,
    );
  }
  if (answers.experience === 'plus-2ans' || answers.experience === 'moins-2ans') {
    addReason(
      accumulator,
      'preparation-emploi',
      'Expérience',
      'Votre expérience est un atout réel : il s’agit surtout de savoir la présenter.',
      14,
    );
  }

  // --- 5. Education -------------------------------------------------------
  if (answers.educationLevel === 'none' || answers.educationLevel === 'primaire') {
    addReason(
      accumulator,
      'litteratie-numerique',
      'Parcours scolaire',
      'Ce parcours ne suppose aucun prérequis scolaire.',
      14,
    );
    addReason(
      accumulator,
      'commercial-vente',
      'Parcours scolaire',
      'Le commerce recrute largement sur les résultats plutôt que sur le diplôme.',
      14,
    );
    addReason(
      accumulator,
      'mines-support',
      'Parcours scolaire',
      'Les postes visés demandent généralement au moins le niveau baccalauréat.',
      -16,
    );
  }
  if (answers.educationLevel === 'licence' || answers.educationLevel === 'master') {
    addReason(
      accumulator,
      'mines-support',
      'Parcours scolaire',
      'Votre niveau d’études correspond aux exigences des fonctions support.',
      12,
    );
  }

  // --- 6. Connectivity and device ----------------------------------------
  if (answers.connectivity === 'rare' || answers.connectivity === 'limitee') {
    for (const pathId of CONNECTIVITY_HUNGRY) {
      addReason(
        accumulator,
        pathId,
        'Connexion',
        'Ce parcours suppose une connexion régulière, ce qui n’est pas votre cas actuellement.',
        -22,
      );
    }
    addReason(
      accumulator,
      'entrepreneuriat',
      'Connexion',
      'Ce parcours se travaille largement hors ligne, sur le terrain.',
      12,
    );
    addReason(
      accumulator,
      'commercial-vente',
      'Connexion',
      'La vente s’apprend surtout au contact des clients, pas en ligne.',
      10,
    );
  }

  if (answers.device === 'telephone-simple') {
    for (const pathId of COMPUTER_HEAVY) {
      addReason(
        accumulator,
        pathId,
        'Équipement',
        'Les exercices de ce parcours demandent l’accès à un ordinateur, même partagé.',
        -12,
      );
    }
    addReason(
      accumulator,
      'savoir-etre',
      'Équipement',
      'Ce parcours se suit entièrement depuis un téléphone.',
      10,
    );
    addReason(
      accumulator,
      'anglais-emploi',
      'Équipement',
      'Ce parcours se suit entièrement depuis un téléphone.',
      10,
    );
  }

  // --- 7. Location --------------------------------------------------------
  if (answers.locationType === 'rural') {
    addReason(
      accumulator,
      'entrepreneuriat',
      'Lieu de vie',
      'En zone rurale, créer une activité est souvent la voie la plus accessible vers un revenu.',
      16,
    );
    addReason(
      accumulator,
      'mines-support',
      'Lieu de vie',
      'Les sites miniers recrutent en partie dans les zones rurales environnantes.',
      8,
    );
  }

  // --- 8. Current status --------------------------------------------------
  if (answers.status === 'eleve' || answers.status === 'etudiant') {
    addReason(
      accumulator,
      'savoir-etre',
      'Situation',
      'Vous avez le temps de construire des bases solides avant votre première candidature.',
      10,
    );
    addReason(
      accumulator,
      'litteratie-numerique',
      'Situation',
      'Ces compétences vous serviront pendant vos études comme après.',
      10,
    );
  }
  if (answers.status === 'independant' || answers.status === 'emploi-partiel') {
    addReason(
      accumulator,
      'entrepreneuriat',
      'Situation',
      'Vous avez déjà une activité : ce parcours vise à la rendre plus solide et plus rentable.',
      18,
    );
  }

  // --- Build result -------------------------------------------------------
  const scores: PathScore[] = careerPaths
    .map((path) => {
      const entry = accumulator.get(path.id);
      return {
        pathId: path.id,
        score: entry?.score ?? 0,
        // Most influential factor first, so the UI can show the top three.
        reasons: (entry?.reasons ?? []).slice().sort((a, b) => b.points - a.points),
      };
    })
    .sort((a, b) => b.score - a.score || a.pathId.localeCompare(b.pathId));

  const primary = scores[0];
  // `careerPaths` is never empty (it is a static content array), but the type
  // system cannot know that; fall back rather than assert.
  const primaryPathId = primary?.pathId ?? 'preparation-emploi';

  return {
    primaryPathId,
    supportingPathId: pickSupporting(primaryPathId, answers),
    alternatives: scores.slice(1, 4).map((entry) => entry.pathId),
    reasons: primary?.reasons.filter((reason) => reason.points > 0).slice(0, 4) ?? [],
    hoursPerWeek: answers.hoursPerWeek,
    estimatedWeeks: estimateWeeks(
      pathById.get(primaryPathId)?.estimatedHours ?? 40,
      answers.hoursPerWeek,
    ),
    scores,
  };
}

/**
 * The supporting track fills the most costly foundational gap, which is rarely
 * the same thing as the second-highest score: someone aiming at mining support
 * with no spreadsheet skills needs digital literacy alongside, not instead.
 */
function pickSupporting(primaryPathId: string, answers: OnboardingAnswers): string | null {
  const candidates: string[] = [];

  if (answers.digitalLevel === 'debutant') candidates.push('litteratie-numerique');
  if (
    (answers.englishLevel === 'aucun' || answers.englishLevel === 'debutant') &&
    (answers.interests.includes('mines') ||
      answers.interests.includes('langues') ||
      answers.goal === 'travail-distance')
  ) {
    candidates.push('anglais-emploi');
  }
  if (answers.experience === 'aucune') candidates.push('savoir-etre');
  if (
    answers.goal === 'trouver-emploi' ||
    answers.goal === 'premier-emploi' ||
    answers.goal === 'changer-metier'
  ) {
    candidates.push('preparation-emploi');
  }
  candidates.push(...FOUNDATIONAL_PATHS);

  return candidates.find((pathId) => pathId !== primaryPathId) ?? null;
}

function goalLabel(goal: OnboardingAnswers['goal']): string {
  const labels: Record<OnboardingAnswers['goal'], string> = {
    'trouver-emploi': 'trouver un emploi',
    'premier-emploi': 'préparer votre premier emploi',
    'changer-metier': 'changer de métier',
    'travail-distance': 'travailler à distance',
    freelance: 'devenir freelance',
    'creer-activite': 'créer une activité',
    competences: 'améliorer vos compétences',
    secteur: 'vous préparer à un secteur précis',
  };
  return labels[goal];
}

function sectorLabel(sectorId: string): string {
  const labels: Record<string, string> = {
    commerce: 'le commerce',
    mines: 'les mines et l’industrie',
    administration: 'l’administration',
    numerique: 'le numérique',
    langues: 'les langues',
    entrepreneuriat: 'l’entrepreneuriat',
    finance: 'la finance',
    logistique: 'la logistique',
    agriculture: 'l’agriculture',
    communication: 'la communication',
  };
  return labels[sectorId] ?? sectorId;
}
