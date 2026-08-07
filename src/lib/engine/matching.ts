import type {
  ExtractedRequirement,
  JobComparison,
  JobExtraction,
  MatchStrength,
  RequirementMatch,
} from '@/lib/types';
import { careerPaths } from '@/content/paths';
import { skillById } from '@/content/skills';
import { normalizeText, unique } from '@/lib/utils';
import { skillEvidence, type ProfileSnapshot } from './profile-snapshot';
import { computeReadiness } from './readiness';

/**
 * Profile-to-job comparison.
 *
 * Answers the six questions the Job Readiness Center is built around, and does
 * so honestly: a gap is named as a gap. Telling someone they are a great fit
 * when they are not wastes the one application they get.
 */

const LANGUAGE_LEVEL_RANK: Record<string, number> = {
  aucun: 0,
  debutant: 1,
  intermediaire: 2,
  avance: 3,
  base: 1,
  courant: 2,
};

/** Minimum self-assessed level we treat as meeting a stated language requirement. */
const LANGUAGE_BAR = 2;

function evidenceToStrength(evidence: ReturnType<typeof skillEvidence>): MatchStrength {
  switch (evidence) {
    case 'proven':
    case 'declared':
      return 'strong';
    case 'learning':
    case 'related':
      return 'partial';
    default:
      return 'missing';
  }
}

function rationaleFor(
  evidence: ReturnType<typeof skillEvidence>,
  label: string,
): string {
  switch (evidence) {
    case 'proven':
      return `Vous avez terminé un travail qui démontre : ${label.toLowerCase()}. Préparez l’exemple précis.`;
    case 'declared':
      return `Vous avez indiqué cette compétence dans votre CV. Assurez-vous de pouvoir la démontrer si on vous interroge.`;
    case 'learning':
      return `Vous êtes en cours d’apprentissage sur ce point. Dites où vous en êtes plutôt que de le taire.`;
    case 'related':
      return `Vous maîtrisez une compétence voisine. Expliquez explicitement le lien : le recruteur ne le fera pas à votre place.`;
    default:
      return `Rien dans votre profil ne couvre ce point pour le moment.`;
  }
}

/** The path whose curriculum covers a given skill, preferring foundational ones. */
function pathTeaching(skillId: string): string | undefined {
  const candidates = careerPaths.filter(
    (path) =>
      path.skillIds.includes(skillId) ||
      path.stages.some((stage) => stage.skillIds.includes(skillId)),
  );
  return candidates.sort((a, b) => a.order - b.order)[0]?.id;
}

function matchSkillRequirement(
  requirement: ExtractedRequirement,
  profile: ProfileSnapshot,
): RequirementMatch {
  const skillId = requirement.skillId;
  const evidence = skillId ? skillEvidence(profile, skillId) : 'none';
  const strength = evidenceToStrength(evidence);

  const match: RequirementMatch = {
    requirementId: requirement.id,
    label: requirement.label,
    kind: requirement.kind,
    strength,
    rationale: rationaleFor(evidence, requirement.label),
  };

  if (strength !== 'strong' && skillId) {
    const pathId = pathTeaching(skillId);
    if (pathId) {
      match.pathId = pathId;
      match.suggestion = `Travaillez ce point dans le parcours correspondant.`;
    }
  }
  if (strength === 'strong') {
    match.suggestion = 'Préparez un exemple concret, chiffré si possible.';
  }

  return match;
}

function matchLanguageRequirement(
  requirement: ExtractedRequirement,
  profile: ProfileSnapshot,
): RequirementMatch {
  const label = normalizeText(requirement.label);
  const onboarding = profile.onboarding;

  let strength: MatchStrength = 'missing';
  let rationale = 'Votre niveau dans cette langue n’est pas renseigné.';

  if (label.includes('anglais') || label.includes('english')) {
    const level = onboarding ? (LANGUAGE_LEVEL_RANK[onboarding.englishLevel] ?? 0) : -1;
    if (level < 0) {
      rationale = 'Renseignez votre niveau d’anglais pour obtenir cette comparaison.';
    } else if (level >= LANGUAGE_BAR) {
      strength = 'strong';
      rationale = 'Votre niveau d’anglais déclaré répond à cette exigence.';
    } else if (level === 1) {
      strength = 'partial';
      rationale =
        'Vous avez des bases en anglais mais pas le niveau professionnel demandé. Préparez au moins une présentation de deux minutes en anglais.';
    } else {
      rationale =
        'L’anglais est demandé et vous partez de zéro. C’est un écart réel : ne l’ignorez pas dans votre candidature.';
    }
  } else if (label.includes('francais') || label.includes('french')) {
    const level = onboarding ? (LANGUAGE_LEVEL_RANK[onboarding.frenchLevel] ?? 0) : -1;
    if (level < 0) {
      rationale = 'Renseignez votre niveau de français pour obtenir cette comparaison.';
    } else if (level >= LANGUAGE_BAR) {
      strength = 'strong';
      rationale = 'Votre niveau de français répond à cette exigence.';
    } else {
      strength = 'partial';
      rationale =
        'L’offre demande un français assuré, en particulier à l’écrit. Faites relire vos documents avant envoi.';
    }
  } else if (label.includes('bambara') || label.includes('langue nationale') || label.includes('locale')) {
    // We do not ask about national languages in onboarding, so we must not
    // guess either way — an unverified "strong" is worse than an honest unknown.
    strength = 'partial';
    rationale =
      'L’offre valorise une langue nationale. Si vous la parlez, indiquez-le explicitement dans votre CV : c’est un vrai avantage sur le terrain.';
  }

  const match: RequirementMatch = {
    requirementId: requirement.id,
    label: requirement.label,
    kind: requirement.kind,
    strength,
    rationale,
  };
  if (strength !== 'strong' && (label.includes('anglais') || label.includes('english'))) {
    match.pathId = 'anglais-emploi';
    match.suggestion = 'Le parcours « Anglais pour l’emploi » traite exactement ce besoin.';
  }
  return match;
}

/** Tools map onto skills; where they do not, fall back to declared CV tools. */
const TOOL_TO_SKILL: { test: RegExp; skillId: string }[] = [
  { test: /excel|tableur|sheets/, skillId: 'tableur' },
  { test: /word|traitement de texte/, skillId: 'traitement-texte' },
  { test: /powerpoint|diaporama/, skillId: 'presentation-outil' },
  { test: /office|bureautique/, skillId: 'traitement-texte' },
  { test: /outlook|gmail|messagerie/, skillId: 'email-pro' },
  { test: /crm|salesforce|hubspot/, skillId: 'crm' },
  { test: /erp|sap|sage|odoo|gestion/, skillId: 'gestion-administrative' },
  { test: /comptabilite|quickbooks/, skillId: 'comptabilite-base' },
  { test: /teams|zoom|meet|visio/, skillId: 'visio' },
  { test: /drive|workspace|docs|partage/, skillId: 'cloud-docs' },
];

function matchToolRequirement(
  requirement: ExtractedRequirement,
  profile: ProfileSnapshot,
): RequirementMatch {
  const normalized = normalizeText(requirement.label);
  const mapped = TOOL_TO_SKILL.find((entry) => entry.test.test(normalized))?.skillId;

  const evidence = mapped ? skillEvidence(profile, mapped) : 'none';
  const declared = profile.declaredTools.some((tool) =>
    normalizeText(tool).includes(normalized.split(' ')[0] ?? ''),
  );

  const strength: MatchStrength = declared ? 'strong' : evidenceToStrength(evidence);

  const match: RequirementMatch = {
    requirementId: requirement.id,
    label: requirement.label,
    kind: requirement.kind,
    strength,
    rationale: declared
      ? 'Vous avez déclaré cet outil. Vous devez pouvoir en démontrer l’usage concrètement.'
      : rationaleFor(evidence, requirement.label),
  };

  if (strength !== 'strong' && mapped) {
    const pathId = pathTeaching(mapped);
    if (pathId) {
      match.pathId = pathId;
      match.suggestion = 'Cet outil est traité dans un parcours de la plateforme.';
    }
  }
  return match;
}

function matchExperience(
  extraction: JobExtraction,
  profile: ProfileSnapshot,
): { matches: RequirementMatch[]; gap: string | null } {
  if (extraction.experience.length === 0) return { matches: [], gap: null };

  const has = profile.experience;
  const matches: RequirementMatch[] = extraction.experience.map((requirement) => {
    const openToJuniors = /junior|débutant/i.test(requirement.label);
    let strength: MatchStrength = 'partial';
    let rationale = '';

    if (openToJuniors) {
      strength = 'strong';
      rationale = 'L’offre est explicitement ouverte aux profils juniors. Postulez.';
    } else if (!has || has === 'aucune') {
      strength = 'missing';
      rationale =
        'Vous n’avez pas encore d’expérience salariée. Compensez avec vos projets pratiques, votre bénévolat et vos travaux scolaires, décrits précisément.';
    } else if (has === 'plus-2ans') {
      strength = 'strong';
      rationale = 'Votre expérience couvre vraisemblablement cette exigence.';
    } else {
      strength = 'partial';
      rationale =
        'Votre expérience est partielle au regard de la demande. Décrivez ce que vous avez réellement fait plutôt que la durée.';
    }

    return {
      requirementId: requirement.id,
      label: requirement.label,
      kind: requirement.kind,
      strength,
      rationale,
    };
  });

  const worst = matches.find((match) => match.strength === 'missing');
  return {
    matches,
    gap: worst
      ? 'L’offre demande une expérience que vous n’avez pas encore. Ce n’est pas rédhibitoire si vous apportez des preuves de travail concrètes — c’est exactement à quoi servent les projets pratiques.'
      : null,
  };
}

function matchEducation(
  extraction: JobExtraction,
  profile: ProfileSnapshot,
): RequirementMatch[] {
  const rank: Record<string, number> = {
    none: 0,
    primaire: 1,
    college: 2,
    lycee: 3,
    technique: 3,
    licence: 4,
    master: 5,
  };
  const have = profile.education ? (rank[profile.education] ?? 0) : -1;

  return extraction.education.map((requirement) => {
    const label = requirement.label.toLowerCase();
    const needed = label.includes('master')
      ? 5
      : label.includes('licence') || label.includes('bac +3')
        ? 4
        : label.includes('bac +2') || label.includes('bts') || label.includes('dut')
          ? 4
          : label.includes('bac')
            ? 3
            : 2;

    const strength: MatchStrength =
      have < 0 ? 'missing' : have >= needed ? 'strong' : have === needed - 1 ? 'partial' : 'missing';

    return {
      requirementId: requirement.id,
      label: requirement.label,
      kind: requirement.kind,
      strength,
      rationale:
        have < 0
          ? 'Renseignez votre niveau d’études pour obtenir cette comparaison.'
          : strength === 'strong'
            ? 'Votre niveau d’études correspond à la demande.'
            : strength === 'partial'
              ? 'Vous êtes juste en dessous du niveau demandé. Beaucoup d’employeurs acceptent un écart d’un niveau si l’expérience compense — mettez-la en avant.'
              : 'Le diplôme demandé est nettement au-dessus du vôtre. Candidatez si le reste correspond, mais préparez-vous à en parler.',
    };
  });
}

function matchBehavioural(
  extraction: JobExtraction,
  profile: ProfileSnapshot,
): RequirementMatch[] {
  return extraction.behavioral.map((requirement) => {
    const evidence = requirement.skillId ? skillEvidence(profile, requirement.skillId) : 'none';
    const strength = evidence === 'proven' ? 'strong' : evidence === 'none' ? 'partial' : 'partial';
    return {
      requirementId: requirement.id,
      label: requirement.label,
      kind: requirement.kind,
      strength: strength as MatchStrength,
      rationale:
        evidence === 'proven'
          ? 'Vous avez un travail terminé qui démontre ce comportement. Utilisez-le comme exemple STAR.'
          : 'Une qualité ne se déclare pas, elle se démontre. Préparez une situation réelle qui l’illustre.',
      ...(requirement.skillId ? { pathId: 'savoir-etre' } : {}),
    };
  });
}

// ---------------------------------------------------------------------------

export function compareProfileToJob(
  extraction: JobExtraction,
  profile: ProfileSnapshot,
): JobComparison {
  const skillMatches = [...extraction.requiredSkills, ...extraction.preferredSkills].map(
    (requirement) => matchSkillRequirement(requirement, profile),
  );
  const languageMatches = extraction.languages.map((requirement) =>
    matchLanguageRequirement(requirement, profile),
  );
  const toolMatches = extraction.tools.map((requirement) =>
    matchToolRequirement(requirement, profile),
  );
  const { matches: experienceMatches, gap: experienceGap } = matchExperience(extraction, profile);
  const educationMatches = matchEducation(extraction, profile);
  const behaviouralMatches = matchBehavioural(extraction, profile);

  const matches: RequirementMatch[] = [
    ...skillMatches,
    ...languageMatches,
    ...toolMatches,
    ...experienceMatches,
    ...educationMatches,
    ...behaviouralMatches,
  ];

  // --- Transferable: proven skills the advert did not ask for by name ------
  const requiredSkillIds = new Set(
    [...extraction.requiredSkills, ...extraction.preferredSkills]
      .map((requirement) => requirement.skillId)
      .filter(Boolean) as string[],
  );
  const transferable = profile.provenSkillIds
    .filter((skillId) => !requiredSkillIds.has(skillId))
    .map((skillId) => skillById.get(skillId))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill))
    .slice(0, 6)
    .map((skill) => ({
      label: skill.name,
      rationale: `Non demandé explicitement, mais utile pour ce poste. Mentionnez-le si le contexte s’y prête : ${skill.description.toLowerCase()}`,
    }));

  // --- Recommended actions, one per real gap ------------------------------
  const recommendedActions = unique(
    matches
      .filter((match) => match.strength === 'missing')
      .map((match) => match.label),
  )
    .slice(0, 6)
    .map((label) => {
      const match = matches.find((candidate) => candidate.label === label);
      return match?.pathId
        ? { label: `Travailler : ${label}`, pathId: match.pathId }
        : { label: `Préparer une explication honnête sur : ${label}` };
    });

  if (!profile.preparation.hasValueProposition) {
    recommendedActions.push({
      label: 'Construire votre proposition de valeur pour ce poste',
    });
  }
  if (!profile.preparation.employerResearch) {
    recommendedActions.push({ label: 'Étudier l’employeur avant de postuler' });
  }

  // --- Research questions -------------------------------------------------
  const questionsToResearch = [
    extraction.company
      ? `Que fait exactement ${extraction.company}, et depuis quand ?`
      : 'Que fait exactement cette entreprise, et depuis quand ?',
    'Quelle est sa taille et où est-elle implantée ?',
    'Quelle actualité récente la concerne ?',
    'Pourquoi ce poste est-il ouvert : création ou remplacement ?',
    'Qui sont ses clients, ses concurrents ou ses partenaires ?',
    'Quelqu’un de mon entourage y travaille-t-il ou y a-t-il travaillé ?',
  ];

  // --- Examples to prepare ------------------------------------------------
  const strongLabels = matches
    .filter((match) => match.strength === 'strong')
    .map((match) => match.label)
    .slice(0, 3);

  const examplesToPrepare = [
    ...strongLabels.map(
      (label) => `Une situation réelle où vous avez utilisé : ${label.toLowerCase()}`,
    ),
    'Une difficulté que vous avez surmontée, racontée en méthode STAR',
    'Un travail réalisé en équipe, en précisant ce que vous avez fait vous',
    ...(extraction.responsibilities[0]
      ? [`Comment vous aborderiez concrètement : ${extraction.responsibilities[0].toLowerCase()}`]
      : []),
  ].slice(0, 6);

  return {
    matches,
    transferable,
    experienceGap,
    recommendedActions,
    questionsToResearch,
    examplesToPrepare,
    readiness: computeReadiness(extraction, matches, profile),
  };
}

/** Group matches for display, preserving order within each bucket. */
export function groupMatches(matches: RequirementMatch[]): Record<MatchStrength, RequirementMatch[]> {
  return {
    strong: matches.filter((match) => match.strength === 'strong'),
    partial: matches.filter((match) => match.strength === 'partial'),
    missing: matches.filter((match) => match.strength === 'missing'),
  };
}
