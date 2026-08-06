import type { PartialDictionary } from '../types';

/**
 * Bambara (Bamanankan) — starter dictionary.
 *
 * Deliberately small. Bambara translation is not an MVP deliverable and must be
 * done by native speakers, not by machine translation: a badly translated
 * interface is worse than an honest French one for the people it is meant to
 * serve. These few entries prove the pipeline works end to end and give
 * translators a concrete file to extend.
 *
 * Coverage is tracked by `npm run content:check`.
 */
export const bm: PartialDictionary = {
  actions: {
    start: 'A daminɛ',
    continue: 'Ka taa ɲɛ',
    back: 'Ka segin',
    yes: 'Ɔwɔ',
    no: 'Ayi',
  },
  nav: {
    home: 'So',
    profile: 'N ka kunnafoni',
  },
};
