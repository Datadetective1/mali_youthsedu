import { cookies } from 'next/headers';
import { fr } from './dictionaries/fr';
import { en } from './dictionaries/en';
import { bm } from './dictionaries/bm';
import { LOCALE_COOKIE, defaultLocale, parseLocale, type Locale } from './config';
import type { Dictionary, PartialDictionary } from './types';

export type { Dictionary, PartialDictionary };
export * from './config';

const overlays: Record<Locale, PartialDictionary> = { fr: {}, en, bm };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Overlay a partial dictionary on top of the French reference.
 * Arrays and functions are replaced wholesale — see `DeepPartial` for why.
 */
function mergeDeep<T>(base: T, overlay: unknown): T {
  if (overlay === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(overlay)) return overlay as T;

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue;
    result[key] = mergeDeep((base as Record<string, unknown>)[key], value);
  }
  return result as T;
}

const cache = new Map<Locale, Dictionary>();

/** Fully-resolved dictionary for a locale, with French filling every gap. */
export function dictionaryFor(locale: Locale): Dictionary {
  const cached = cache.get(locale);
  if (cached) return cached;

  const resolved = locale === defaultLocale ? fr : mergeDeep(fr, overlays[locale]);
  cache.set(locale, resolved);
  return resolved;
}

/**
 * Active locale for the current request.
 *
 * Only the cookie is consulted. `Accept-Language` is deliberately ignored:
 * many devices in the target market report `en-US` regardless of what the
 * person actually reads, and silently switching them out of French would be
 * worse than the default.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return parseLocale(store.get(LOCALE_COOKIE)?.value);
  } catch {
    // Called outside a request scope (e.g. in a unit test).
    return defaultLocale;
  }
}

/**
 * Dictionary for the current request.
 *
 * Server components call this directly — the strings never reach the client
 * bundle. Client components receive the specific strings they need as props.
 * See docs/ARCHITECTURE.md ("Localization").
 */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaryFor(await getLocale());
}

/** Locale-aware date formatting. Defaults to the Bamako-relevant French form. */
export function formatDate(
  isoDate: string,
  locale: Locale = defaultLocale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  const date = isoDate.length === 10 ? new Date(`${isoDate}T12:00:00Z`) : new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const tag = locale === 'fr' ? 'fr-ML' : locale === 'en' ? 'en-GB' : 'fr-ML';
  return new Intl.DateTimeFormat(tag, { ...options, timeZone: 'UTC' }).format(date);
}

export function formatNumber(value: number, locale: Locale = defaultLocale): string {
  const tag = locale === 'en' ? 'en-GB' : 'fr-ML';
  return new Intl.NumberFormat(tag).format(value);
}
