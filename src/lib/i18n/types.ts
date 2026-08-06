import type { Dictionary } from './dictionaries/fr';

export type { Dictionary };

type AnyFunction = (...args: never[]) => unknown;

/**
 * Deep-partial that leaves functions and arrays intact.
 *
 * Formatter functions (`(n: number) => string`) must be overridden wholesale —
 * a partial function makes no sense. Arrays are likewise replaced rather than
 * merged element by element, because a half-translated list would render as a
 * mix of two languages.
 */
export type DeepPartial<T> = T extends AnyFunction
  ? T
  : T extends readonly (infer _U)[]
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type PartialDictionary = DeepPartial<Dictionary>;
