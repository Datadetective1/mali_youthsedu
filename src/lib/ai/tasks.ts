import 'server-only';
import { z } from 'zod';
import type { JobExtraction, ValuePropositionInput, ValuePropositionOutput } from '@/lib/types';
import { aiOutputIntroducesFacts } from '@/lib/engine/value-proposition';
import { enhance, type EnhanceResult } from './index';

/**
 * The concrete AI tasks.
 *
 * Each one takes a deterministic result and returns an improved version, or the
 * original. None of them can produce a result on its own — there is no code
 * path where AI output is the only source of what a user sees.
 */

// ---------------------------------------------------------------------------
// Value proposition rewording
// ---------------------------------------------------------------------------

const valuePropositionSchema = z.object({
  pitch: z.string().min(1).max(1200),
  cvSummary: z.string().min(1).max(900),
  tellMeAboutYou: z.string().min(1).max(1500),
  whyHireYou: z.string().min(1).max(1200),
  roleStatement: z.string().min(1).max(600),
});

export async function refineValueProposition(
  input: ValuePropositionInput,
  deterministic: ValuePropositionOutput,
  rateLimitKey: string,
): Promise<EnhanceResult<ValuePropositionOutput>> {
  return enhance<ValuePropositionOutput>({
    fallback: deterministic,
    rateLimitKey,
    run: async (provider) => {
      const result = await provider.generateStructured({
        task: 'value-proposition',
        system: `Tu ameliores la formulation de textes professionnels deja rediges a partir des reponses d'une personne.
Tu peux : reformuler pour plus de clarte, corriger la grammaire, raccourcir, rendre le ton plus naturel.
Tu ne peux pas : ajouter un fait, un chiffre, une duree, un employeur, un diplome ou une competence qui n'apparait pas dans les reponses fournies.
Conserve exactement les memes faits. Si un texte est deja bon, renvoie-le tel quel.`,
        prompt: buildValuePropositionPrompt(input, deterministic),
        schema: valuePropositionSchema,
        maxTokens: 1600,
      });

      return { ...result, source: 'rules+ai' as const };
    },
    // Belt-and-braces on top of the prompt: reject anything that introduced a
    // number or a credential the user never wrote.
    reject: (candidate) =>
      [
        candidate.pitch,
        candidate.cvSummary,
        candidate.tellMeAboutYou,
        candidate.whyHireYou,
        candidate.roleStatement,
      ].some((text) => aiOutputIntroducesFacts(input, text)),
  });
}

function buildValuePropositionPrompt(
  input: ValuePropositionInput,
  deterministic: ValuePropositionOutput,
): string {
  return `Reponses fournies par la personne (source unique de verite) :
- Probleme qu'elle sait aider a resoudre : ${input.problem || '(vide)'}
- Competences mobilisees : ${input.skills || '(vide)'}
- Resultats deja obtenus : ${input.results || '(vide)'}
- Ce qui le demontre : ${input.proof || '(vide)'}
- Sa facon de travailler : ${input.approach || '(vide)'}
- Motivation : ${input.motivation || '(vide)'}
- Poste vise : ${input.targetRole || '(non precise)'}

Textes actuels a ameliorer :
1. Presentation courte : ${deterministic.pitch}
2. Accroche de CV : ${deterministic.cvSummary}
3. « Parlez-moi de vous » : ${deterministic.tellMeAboutYou}
4. « Pourquoi vous recruter ? » : ${deterministic.whyHireYou}
5. Phrase de valeur : ${deterministic.roleStatement}

Ameliore uniquement la formulation.`;
}

// ---------------------------------------------------------------------------
// Job extraction refinement
// ---------------------------------------------------------------------------

const extractionRefinementSchema = z.object({
  responsibilities: z.array(z.string().min(3).max(300)).max(12),
  interviewThemes: z.array(z.string().min(5).max(200)).max(8),
  summary: z.string().max(600),
});

export async function refineJobExtraction(
  rawText: string,
  deterministic: JobExtraction,
  rateLimitKey: string,
): Promise<EnhanceResult<JobExtraction>> {
  return enhance<JobExtraction>({
    fallback: deterministic,
    rateLimitKey,
    run: async (provider) => {
      const result = await provider.generateStructured({
        task: 'job-extraction',
        system: `Tu aides a lire une offre d'emploi. Une premiere analyse automatique a deja extrait les exigences.
Ta tache : reformuler clairement les missions principales et proposer les themes probables d'entretien.
Tu ne dois rien inventer qui ne figure pas dans l'annonce. Si l'annonce ne precise pas les missions, renvoie une liste vide.`,
        prompt: `Annonce :
"""
${rawText.slice(0, 8000)}
"""

Missions deja detectees : ${deterministic.responsibilities.join(' | ') || '(aucune)'}
Competences exigees detectees : ${deterministic.requiredSkills.map((r) => r.label).join(', ') || '(aucune)'}

Reformule les missions et propose les themes d'entretien.`,
        schema: extractionRefinementSchema,
        maxTokens: 1200,
      });

      return {
        ...deterministic,
        // The deterministic extraction stays authoritative for anything that
        // feeds the readiness score; AI only touches presentation.
        responsibilities:
          result.responsibilities.length > 0
            ? result.responsibilities
            : deterministic.responsibilities,
        interviewThemes:
          result.interviewThemes.length > 0
            ? result.interviewThemes
            : deterministic.interviewThemes,
        source: 'rules+ai' as const,
      };
    },
  });
}

// ---------------------------------------------------------------------------
// Feedback on a written interview answer
// ---------------------------------------------------------------------------

const answerFeedbackSchema = z.object({
  strengths: z.array(z.string().min(5).max(300)).max(4),
  improvements: z.array(z.string().min(5).max(300)).max(4),
  structureRespected: z.boolean(),
});

export type AnswerFeedback = z.infer<typeof answerFeedbackSchema>;

export async function reviewInterviewAnswer(
  question: string,
  expectedStructure: string[],
  answer: string,
  rateLimitKey: string,
): Promise<EnhanceResult<AnswerFeedback | null>> {
  return enhance<AnswerFeedback | null>({
    // Without AI there is no automated feedback — the checklists and the
    // question guidance already cover this deterministically, so the honest
    // fallback is "no feedback", not invented feedback.
    fallback: null,
    rateLimitKey,
    run: async (provider) =>
      provider.generateStructured({
        task: 'answer-feedback',
        system: `Tu donnes un retour bienveillant et concret sur une reponse d'entretien ecrite.
Sois precis et utile, jamais blessant. Ne note pas la personne, ne donne pas de score.
Base-toi uniquement sur le texte fourni : n'imagine pas ce que la personne aurait pu vouloir dire.`,
        prompt: `Question posee : ${question}
Structure attendue : ${expectedStructure.join(' → ')}

Reponse de la personne :
"""
${answer.slice(0, 4000)}
"""

Donne 1 a 3 points forts et 1 a 3 ameliorations concretes.`,
        schema: answerFeedbackSchema,
        maxTokens: 900,
      }),
  });
}
