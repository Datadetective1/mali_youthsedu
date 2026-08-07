import { z } from 'zod';
import { aiConfig } from '@/config';
import { AiError, SAFETY_PREAMBLE, type AiProvider, type StructuredRequest } from './provider';

/**
 * Anthropic Messages API provider.
 *
 * Structured output is obtained by forcing a single tool call whose input
 * schema is derived from the caller's Zod schema. That is more reliable than
 * asking for JSON in prose and parsing it, and it means the schema is declared
 * exactly once.
 *
 * The API key is read from server-only configuration and never leaves this
 * module. Nothing here is importable from a client component.
 */

const TOOL_NAME = 'repondre';

const responseSchema = z.object({
  content: z.array(
    z.union([
      z.object({ type: z.literal('text'), text: z.string() }),
      z.object({ type: z.literal('tool_use'), name: z.string(), input: z.unknown() }),
      z.object({ type: z.string() }).passthrough(),
    ]),
  ),
});

export class AnthropicProvider implements AiProvider {
  readonly name = 'anthropic';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
  ) {}

  async generateStructured<T>(request: StructuredRequest<T>): Promise<T> {
    if (!this.apiKey) throw new AiError('not-configured', 'AI_API_KEY absent.');

    // Zod 4 converts natively; `io: 'input'` produces the schema the model
    // should fill, not the parsed output shape.
    const jsonSchema = z.toJSONSchema(request.schema, { io: 'input' });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), aiConfig.timeoutMs);
    const signal = request.signal
      ? AbortSignal.any([request.signal, controller.signal])
      : controller.signal;

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        signal,
        body: JSON.stringify({
          model: this.model,
          max_tokens: request.maxTokens ?? 1500,
          system: `${SAFETY_PREAMBLE}\n\n${request.system}`,
          tools: [
            {
              name: TOOL_NAME,
              description: 'Renvoie la reponse structuree demandee.',
              input_schema: jsonSchema,
            },
          ],
          tool_choice: { type: 'tool', name: TOOL_NAME },
          messages: [{ role: 'user', content: request.prompt }],
        }),
      });

      if (response.status === 429) {
        throw new AiError('rate-limited', 'Le fournisseur IA a limite les requetes.');
      }
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        // Never log the prompt itself: it contains the user's own words about
        // their situation. Status and a truncated provider message are enough.
        throw new AiError(
          'provider-error',
          `Reponse ${response.status} du fournisseur IA. ${detail.slice(0, 200)}`,
        );
      }

      const body = responseSchema.safeParse(await response.json());
      if (!body.success) {
        throw new AiError('invalid-output', 'Reponse du fournisseur IA illisible.');
      }

      const toolUse = body.data.content.find(
        (block): block is { type: 'tool_use'; name: string; input: unknown } =>
          'type' in block && block.type === 'tool_use',
      );
      if (!toolUse) {
        throw new AiError('invalid-output', 'Le fournisseur IA n’a pas renvoye de structure.');
      }

      const parsed = request.schema.safeParse(toolUse.input);
      if (!parsed.success) {
        throw new AiError('invalid-output', 'La structure renvoyee ne correspond pas au schema.');
      }
      return parsed.data;
    } catch (error) {
      if (error instanceof AiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AiError('timeout', `Delai depasse (${aiConfig.timeoutMs} ms).`);
      }
      throw new AiError('provider-error', error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      clearTimeout(timeout);
    }
  }
}
