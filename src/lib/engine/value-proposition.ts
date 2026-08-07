import type { ValuePropositionInput, ValuePropositionOutput } from '@/lib/types';

/**
 * Deterministic value-proposition builder.
 *
 * HARD RULE: every sentence produced here is assembled from words the user
 * typed. No achievement, qualification, figure or quality is ever added. If a
 * field is empty, the corresponding clause is dropped — we never fill a gap
 * with a plausible-sounding invention, because the user will be asked about it
 * in an interview and will have to defend something they never said.
 */

function clean(input: string | undefined): string {
  return (input ?? '').trim().replace(/\s+/g, ' ');
}

/** Strip a leading capital so a fragment can be spliced mid-sentence. */
function lower(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toLowerCase() + input.slice(1);
}

/** Remove a trailing full stop so we control the punctuation ourselves. */
function stripPeriod(input: string): string {
  return input.replace(/\s*[.]+\s*$/, '');
}

function sentence(input: string): string {
  const trimmed = stripPeriod(clean(input));
  if (trimmed.length === 0) return '';
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

function join(parts: string[]): string {
  return parts.filter((part) => part.trim().length > 0).join(' ');
}

/** Split "vente, prospection et suivi client" into a readable list. */
function skillList(raw: string): string {
  const items = clean(raw)
    .split(/[,;]|\bet\b/)
    .map((item) => stripPeriod(item.trim()))
    .filter(Boolean);

  if (items.length === 0) return '';
  if (items.length === 1) return lower(items[0] ?? '');
  const last = items[items.length - 1] ?? '';
  return `${items.slice(0, -1).map(lower).join(', ')} et ${lower(last)}`;
}

export function isValuePropositionComplete(input: ValuePropositionInput): boolean {
  return (
    clean(input.problem).length > 0 &&
    clean(input.skills).length > 0 &&
    clean(input.proof).length > 0
  );
}

export function buildValueProposition(input: ValuePropositionInput): ValuePropositionOutput {
  const problem = stripPeriod(clean(input.problem));
  const skills = skillList(input.skills);
  const results = stripPeriod(clean(input.results));
  const proof = stripPeriod(clean(input.proof));
  const approach = stripPeriod(clean(input.approach));
  const motivation = stripPeriod(clean(input.motivation));
  const targetRole = stripPeriod(clean(input.targetRole ?? ''));

  const roleClause = targetRole ? ` pour un poste de ${lower(targetRole)}` : '';

  // --- 30-second pitch ----------------------------------------------------
  const pitch = join([
    skills ? sentence(`Je sais ${skills}`) : '',
    problem ? sentence(`Concrètement, j’aide à ${lower(problem)}`) : '',
    proof ? sentence(`Je l’ai fait dans le cadre suivant : ${lower(proof)}`) : '',
    results ? sentence(`Résultat : ${lower(results)}`) : '',
    motivation ? sentence(`Ce qui m’intéresse aujourd’hui${roleClause} : ${lower(motivation)}`) : '',
  ]);

  // --- CV summary ---------------------------------------------------------
  const cvSummary = join([
    targetRole ? sentence(`Profil orienté ${lower(targetRole)}`) : '',
    skills ? sentence(`Compétences : ${skills}`) : '',
    proof ? sentence(`Expérience acquise à travers : ${lower(proof)}`) : '',
    results ? sentence(`Résultat obtenu : ${lower(results)}`) : '',
    approach ? sentence(`Ma façon de travailler : ${lower(approach)}`) : '',
  ]);

  // --- "Parlez-moi de vous" ----------------------------------------------
  const tellMeAboutYou = join([
    skills
      ? sentence(`Pour me présenter simplement : je sais ${skills}`)
      : sentence('Pour me présenter simplement'),
    proof ? sentence(`Je l’ai construit à travers ${lower(proof)}`) : '',
    results ? sentence(`Cela m’a permis d’obtenir ce résultat : ${lower(results)}`) : '',
    problem ? sentence(`Ce que je sais faire sert surtout à ${lower(problem)}`) : '',
    motivation
      ? sentence(`Aujourd’hui, je cherche${roleClause ? roleClause : ' un poste'} parce que ${lower(motivation)}`)
      : '',
  ]);

  // --- "Pourquoi devrions-nous vous recruter ?" ---------------------------
  const whyHireYou = join([
    problem
      ? sentence(`Parce que le besoin que vous décrivez rejoint ce que je sais faire : ${lower(problem)}`)
      : '',
    skills ? sentence(`Je mobilise pour cela ${skills}`) : '',
    proof || results
      ? sentence(
          `Ce n’est pas une intention : ${[proof && lower(proof), results && lower(results)]
            .filter(Boolean)
            .join(', ce qui a donné ')}`,
        )
      : '',
    approach ? sentence(`Et j’y ajoute ${lower(approach)}`) : '',
  ]);

  // --- Role-specific statement -------------------------------------------
  const roleStatement = targetRole
    ? join([
        sentence(
          `Pour ce poste de ${lower(targetRole)}, ce que j’apporte tient en une phrase${
            problem ? ` : aider à ${lower(problem)}` : ''
          }`,
        ),
        skills ? sentence(`en m’appuyant sur ${skills}`) : '',
      ])
    : join([
        problem ? sentence(`Ce que j’apporte : aider à ${lower(problem)}`) : '',
        skills ? sentence(`en m’appuyant sur ${skills}`) : '',
      ]);

  return {
    pitch: pitch || fallbackNotice(),
    cvSummary: cvSummary || fallbackNotice(),
    tellMeAboutYou: tellMeAboutYou || fallbackNotice(),
    whyHireYou: whyHireYou || fallbackNotice(),
    roleStatement: roleStatement || fallbackNotice(),
    source: 'rules',
  };
}

function fallbackNotice(): string {
  return 'Répondez aux questions ci-dessus pour obtenir une formulation. Nous n’écrivons rien que vous ne nous ayez dit.';
}

/**
 * Guards the AI-refined output. The model may rephrase, but it must not
 * introduce numbers, employers or credentials that are absent from the input —
 * this catches the failure mode where a model "helpfully" adds "3 ans
 * d'expérience" to make the text sound stronger.
 */
export function aiOutputIntroducesFacts(
  input: ValuePropositionInput,
  candidate: string,
): boolean {
  const sourceText = Object.values(input).join(' ').toLowerCase();
  const sourceNumbers = new Set(sourceText.match(/\d+/g) ?? []);

  const candidateNumbers = candidate.match(/\d+/g) ?? [];
  for (const number of candidateNumbers) {
    if (!sourceNumbers.has(number)) return true;
  }

  // Credential vocabulary the user never used is a fabrication.
  const credentialTerms = [
    'diplôme',
    'diplome',
    'licence',
    'master',
    'certifi',
    'baccalauréat',
    'baccalaureat',
    'bts',
    'attestation',
  ];
  const lowered = candidate.toLowerCase();
  return credentialTerms.some((term) => lowered.includes(term) && !sourceText.includes(term));
}
