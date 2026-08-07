import { aiConfig, isAiEnabled } from '@/config';
import { checkRateLimit } from '@/lib/rate-limit';
import { AnthropicProvider } from './anthropic-provider';
import { MockAiProvider } from './mock-provider';
import { AiError, type AiProvider, type StructuredRequest } from './provider';

export { AiError, SAFETY_PREAMBLE } from './provider';
export type { AiProvider, StructuredRequest } from './provider';

/**
 * AI entry point.
 *
 * `enhance()` is the only function the rest of the application calls. It takes
 * a deterministic result and an improvement attempt, and returns the
 * deterministic result whenever the improvement is unavailable, slow, rate
 * limited, malformed, or fails a safety check.
 *
 * That inversion is the whole design: a feature is never "AI with a fallback",
 * it is "a working feature that AI may polish".
 */

let cached: AiProvider | null = null;

export function getProvider(): AiProvider | null {
  if (!isAiEnabled()) return null;
  if (cached) return cached;

  cached =
    aiConfig.provider === 'anthropic'
      ? new AnthropicProvider(
          aiConfig.apiKey,
          aiConfig.model,
          aiConfig.baseUrl || 'https://api.anthropic.com',
        )
      : new MockAiProvider();

  return cached;
}

/** Test seam — lets a test swap the provider without touching the environment. */
export function setProviderForTesting(provider: AiProvider | null): void {
  cached = provider;
}

export interface EnhanceResult<T> {
  value: T;
  /** True when the AI output was actually used. */
  usedAi: boolean;
  /** French message to show the user when AI was attempted but not used. */
  notice: string | null;
  providerName: string | null;
}

export interface EnhanceOptions<T> {
  /** Deterministic result. Always valid, always the return value on any failure. */
  fallback: T;
  /** Called when the provider is available. */
  run: (provider: AiProvider) => Promise<T>;
  /** Bucket for rate limiting — normally the user id, or an IP for guests. */
  rateLimitKey: string;
  /**
   * Last line of defence. Return `true` to reject the AI output and keep the
   * deterministic one. Used to catch fabricated facts.
   */
  reject?: (candidate: T, fallback: T) => boolean;
}

export async function enhance<T>(options: EnhanceOptions<T>): Promise<EnhanceResult<T>> {
  const provider = getProvider();
  if (!provider) {
    return { value: options.fallback, usedAi: false, notice: null, providerName: null };
  }

  const limit = await checkRateLimit(`ai:${options.rateLimitKey}`, {
    limit: aiConfig.rateLimitPerHour,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.allowed) {
    return {
      value: options.fallback,
      usedAi: false,
      notice:
        'Vous avez atteint la limite d’utilisation de l’IA pour cette heure. L’analyse par regles reste complete.',
      providerName: provider.name,
    };
  }

  try {
    const candidate = await options.run(provider);

    if (options.reject?.(candidate, options.fallback)) {
      // The model produced something we will not show — most likely a
      // fabricated qualification or figure. Silent fallback, and the user is
      // told the AI improvement did not apply.
      return {
        value: options.fallback,
        usedAi: false,
        notice:
          'L’amelioration par IA a ete ecartee car elle ajoutait des informations que vous n’aviez pas fournies. Le resultat ci-dessous vient uniquement de vos reponses.',
        providerName: provider.name,
      };
    }

    return { value: candidate, usedAi: true, notice: null, providerName: provider.name };
  } catch (error) {
    return {
      value: options.fallback,
      usedAi: false,
      notice: messageFor(error),
      providerName: provider.name,
    };
  }
}

function messageFor(error: unknown): string {
  if (error instanceof AiError) {
    switch (error.code) {
      case 'rate-limited':
        return 'Le service d’IA est momentanement sature. Le resultat par regles est affiche.';
      case 'timeout':
        return 'Le service d’IA a mis trop de temps a repondre. Le resultat par regles est affiche.';
      case 'invalid-output':
        return 'La reponse de l’IA etait inexploitable. Le resultat par regles est affiche.';
      case 'not-configured':
        return 'L’assistance IA n’est pas configuree sur cette installation.';
      default:
        return 'L’assistance IA est indisponible. Le resultat par regles est affiche.';
    }
  }
  return 'L’assistance IA est indisponible. Le resultat par regles est affiche.';
}

/** Convenience re-export so callers do not need to import the request type. */
export type { StructuredRequest as AiStructuredRequest };
export type AiTask = StructuredRequest<unknown>['task'];
