import { describe, expect, it } from 'vitest';
import { dictionaryFor, formatDate, formatNumber } from './index';
import { locales } from './config';
import { fr } from './dictionaries/fr';

function collectStringKeys(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return [prefix];
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) =>
    collectStringKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('dictionaries', () => {
  it('resolves every locale to a complete dictionary', () => {
    const reference = collectStringKeys(fr).sort();
    for (const locale of locales) {
      const resolved = collectStringKeys(dictionaryFor(locale)).sort();
      expect(resolved, `locale ${locale} lost or gained keys`).toEqual(reference);
    }
  });

  it('prefers the localized string when one exists', () => {
    expect(dictionaryFor('en').nav.home).toBe('Home');
    expect(dictionaryFor('bm').actions.start).toBe('A daminɛ');
  });

  it('falls back to French for untranslated keys', () => {
    // Bambara has no dashboard strings yet.
    expect(dictionaryFor('bm').dashboard.currentRoadmap).toBe(fr.dashboard.currentRoadmap);
    expect(dictionaryFor('en').interview.title).toBe(fr.interview.title);
  });

  it('keeps formatter functions callable after merging', () => {
    expect(dictionaryFor('en').explore.stagesLabel(3)).toBe('3 étapes');
    expect(dictionaryFor('fr').a11y.progressOf(2, 5)).toBe('2 sur 5 terminé');
  });

  it('never mutates the French reference', () => {
    dictionaryFor('en');
    dictionaryFor('bm');
    expect(fr.nav.home).toBe('Accueil');
  });

  it('uses real French accents rather than stripped ASCII', () => {
    // Guards against a regression we care about: badly-encoded or
    // accent-stripped French reads as machine translation to native speakers.
    expect(fr.center.title).toBe('Préparation à l’emploi');
    expect(fr.nav.jobPrep).toContain('’');
  });
});

describe('formatting', () => {
  it('formats dates in French by default', () => {
    expect(formatDate('2026-03-09')).toMatch(/mars/);
  });

  it('formats dates in English when asked', () => {
    expect(formatDate('2026-03-09', 'en')).toMatch(/March/);
  });

  it('returns the raw value for an unparseable date', () => {
    expect(formatDate('pas-une-date')).toBe('pas-une-date');
  });

  it('formats numbers with locale separators', () => {
    expect(formatNumber(12345)).toMatch(/12.345/);
  });
});
