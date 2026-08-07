import type { z } from 'zod';

/**
 * AI provider interface.
 *
 * Deliberately tiny: one method, structured output only. Every feature that
 * uses AI in this product is "take a deterministic result and improve its
 * wording", so free-form text generation is not part of the contract — a
 * narrower interface is a smaller surface for a model to do something
 * unexpected on.
 */
export interface StructuredRequest<T> {
  /** Role and constraints. Always includes the no-fabrication rule. */
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  /** Name shown in logs and used for rate-limit bucketing. */
  task: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AiProvider {
  readonly name: string;
  /** Returns a value matching `schema`, or throws. Never returns partial data. */
  generateStructured<T>(request: StructuredRequest<T>): Promise<T>;
}

export class AiError extends Error {
  constructor(
    public readonly code:
      | 'not-configured'
      | 'timeout'
      | 'rate-limited'
      | 'invalid-output'
      | 'provider-error',
    message: string,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

/**
 * Shared system preamble.
 *
 * This is the single most important string in the AI layer. Every prompt
 * inherits it, because the failure mode that actually harms a user here is not
 * a clumsy sentence — it is a model that "helpfully" adds a diploma, a job
 * title or a figure they never claimed, which they then have to defend in
 * front of a recruiter.
 */
export const SAFETY_PREAMBLE = `Tu aides des jeunes du Mali a preparer leur insertion professionnelle.

REGLES ABSOLUES, sans exception :
- N'invente JAMAIS une experience, un diplome, une certification, un employeur, une duree ou un chiffre. Utilise uniquement les informations fournies.
- Si une information manque, laisse le champ vide ou omets la phrase. Ne comble jamais un vide par une supposition.
- Ne promets jamais un emploi, un entretien ou un revenu.
- N'emets aucun jugement sur la personne, aucun diagnostic psychologique.
- Ecris en francais clair et simple, sans vocabulaire academique.
- Utilise le vouvoiement.
- Reponds UNIQUEMENT avec la structure demandee.`;
