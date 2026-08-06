/**
 * Locale configuration.
 *
 * French is the product language and the only complete dictionary. English and
 * Bambara exist as real (partial) dictionaries so the plumbing is exercised
 * from day one rather than retrofitted: any missing key falls back to French,
 * which is always safe because French is the language users already see.
 */

export const locales = ['fr', 'en', 'bm'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; htmlLang: string; enabled: boolean }
> = {
  fr: { label: 'Français', nativeLabel: 'Français', htmlLang: 'fr-ML', enabled: true },
  // Not yet complete — hidden from the switcher, but selectable via cookie for
  // translator review. Flip `enabled` once coverage is acceptable.
  en: { label: 'Anglais', nativeLabel: 'English', htmlLang: 'en', enabled: false },
  bm: { label: 'Bambara', nativeLabel: 'Bamanankan', htmlLang: 'bm', enabled: false },
};

export const LOCALE_COOKIE = 'myp_locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function parseLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Locales offered in the UI switcher. */
export function enabledLocales(): Locale[] {
  return locales.filter((locale) => localeMeta[locale].enabled);
}
