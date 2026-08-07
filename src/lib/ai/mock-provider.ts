import type { AiProvider, StructuredRequest } from './provider';
import { AiError } from './provider';

/**
 * Mock provider.
 *
 * Used by the test suite and by `AI_PROVIDER=mock` in development so the AI
 * code paths — including the disclosure UI, the timeout handling and the
 * fabrication guard — are exercised without a key or a network call.
 *
 * It returns deterministic, obviously-synthetic French so that a mock response
 * reaching a real screen is immediately recognisable rather than plausible.
 * `productionConfigIssues()` refuses to let `mock` pass silently into a
 * production build.
 */
export class MockAiProvider implements AiProvider {
  readonly name = 'mock';

  async generateStructured<T>(request: StructuredRequest<T>): Promise<T> {
    if (request.signal?.aborted) {
      throw new AiError('timeout', 'Requete annulee.');
    }

    const shaped = shapeFromSchema(request);
    const parsed = request.schema.safeParse(shaped);
    if (!parsed.success) {
      throw new AiError(
        'invalid-output',
        `Le fournisseur simule ne sait pas produire la structure demandee pour "${request.task}".`,
      );
    }
    return parsed.data;
  }
}

/**
 * Produces a plausible-shaped object for the known tasks. Unknown tasks fail
 * loudly rather than returning something the caller might ship.
 */
function shapeFromSchema<T>(request: StructuredRequest<T>): unknown {
  switch (request.task) {
    case 'value-proposition':
      return {
        pitch: '[Réponse simulée] Reformulation de votre présentation courte.',
        cvSummary: '[Réponse simulée] Reformulation de votre accroche de CV.',
        tellMeAboutYou: '[Réponse simulée] Reformulation de votre réponse « Parlez-moi de vous ».',
        whyHireYou: '[Réponse simulée] Reformulation de votre réponse « Pourquoi vous recruter ? ».',
        roleStatement: '[Réponse simulée] Reformulation de votre phrase de valeur.',
      };

    case 'job-extraction':
      return {
        responsibilities: [],
        additionalSkills: [],
        interviewThemes: [
          '[Réponse simulée] Une question sur votre compréhension des missions',
          '[Réponse simulée] Une mise en situation liée au poste',
        ],
        summary: '[Réponse simulée] Résumé de l’offre analysée.',
      };

    case 'answer-feedback':
      return {
        strengths: ['[Réponse simulée] Votre réponse contient un exemple concret.'],
        improvements: ['[Réponse simulée] Ajoutez un résultat mesurable à la fin.'],
        structureRespected: true,
      };

    default:
      return null;
  }
}
