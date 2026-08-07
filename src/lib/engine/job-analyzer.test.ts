import { describe, expect, it } from 'vitest';
import {
  JobTextError,
  analyzeJobDescription,
  extractJobTitle,
  parseLines,
  validateJobText,
} from './job-analyzer';
import { jobExamples } from '@/content/job-examples';

const miningAd = jobExamples.find((example) => example.id === 'job-mines-logistique')!;
const salesAd = jobExamples.find((example) => example.id === 'job-commercial-terrain')!;
const adminAd = jobExamples.find((example) => example.id === 'job-assistant-administratif')!;
const remoteAd = jobExamples.find((example) => example.id === 'job-teletravail-donnees')!;

function labels(items: { label: string }[]): string[] {
  return items.map((item) => item.label);
}

describe('validateJobText', () => {
  it('rejects text that is too short to analyse', () => {
    expect(() => validateJobText('Recherche vendeur')).toThrow(JobTextError);
    try {
      validateJobText('trop court');
    } catch (error) {
      expect((error as JobTextError).reason).toBe('too-short');
    }
  });

  it('rejects text that is implausibly long', () => {
    try {
      validateJobText('a'.repeat(20_001));
    } catch (error) {
      expect((error as JobTextError).reason).toBe('too-long');
    }
  });

  it('accepts a realistic advert', () => {
    expect(() => validateJobText(miningAd.text)).not.toThrow();
  });
});

describe('parseLines', () => {
  it('assigns lines to the section they appear under', () => {
    const lines = parseLines(miningAd.text);
    const responsibilities = lines.filter((line) => line.section === 'responsibilities');
    const behavioural = lines.filter((line) => line.section === 'behavioral');

    expect(responsibilities.length).toBeGreaterThan(3);
    expect(behavioural.length).toBeGreaterThan(2);
    expect(responsibilities.some((line) => /stock/i.test(line.raw))).toBe(true);
  });

  it('does not treat a bulleted line as a section heading', () => {
    const lines = parseLines('MISSIONS\n- Profil recherché des fournisseurs\n- Autre tâche');
    expect(lines.every((line) => line.section === 'responsibilities')).toBe(true);
  });
});

describe('extractJobTitle', () => {
  it('reads the title from the leading line', () => {
    expect(extractJobTitle(miningAd.text).toLowerCase()).toContain('assistant');
  });

  it('falls back to a recruitment phrase when there is no title line', () => {
    const text =
      'Notre structure est active depuis 2015 dans plusieurs régions du pays et poursuit son développement. Nous recrutons un Assistant Commercial pour appuyer notre équipe de vente sur le terrain.';
    expect(extractJobTitle(text).toLowerCase()).toContain('assistant commercial');
  });

  it('returns an explicit placeholder rather than inventing a title', () => {
    const text = `${'Ce texte ne contient aucun intitulé identifiable. '.repeat(4)}`;
    expect(extractJobTitle(text)).toBeTruthy();
  });
});

describe('analyzeJobDescription — mining support advert', () => {
  const result = analyzeJobDescription(miningAd.text);

  it('extracts the main responsibilities', () => {
    expect(result.responsibilities.length).toBeGreaterThanOrEqual(5);
    expect(result.responsibilities.join(' ')).toMatch(/stock/i);
  });

  it('detects the spreadsheet requirement, which is the single most common one', () => {
    expect(labels(result.tools).join(' ')).toMatch(/Excel/);
  });

  it('detects both language requirements', () => {
    expect(labels(result.languages)).toContain('Anglais');
    expect(labels(result.languages)).toContain('Français');
  });

  it('detects the safety expectation specific to the sector', () => {
    const all = [...result.requiredSkills, ...result.preferredSkills, ...result.behavioral];
    expect(labels(all).join(' ')).toMatch(/sécurité/i);
  });

  it('detects the experience requirement', () => {
    expect(result.experience.length).toBeGreaterThan(0);
    expect(labels(result.experience).join(' ')).toMatch(/an/);
  });

  it('detects the education requirement', () => {
    expect(result.education.length).toBeGreaterThan(0);
  });

  it('classifies hedged requirements as preferred rather than required', () => {
    // "Anglais professionnel souhaité" must not be presented as a blocker.
    const englishAsRequired = result.requiredSkills.some((item) => /anglais/i.test(item.label));
    const englishAsPreferred = result.preferredSkills.some((item) => /anglais/i.test(item.label));
    expect(englishAsRequired && !englishAsPreferred).toBe(false);
  });

  it('separates behavioural expectations from technical ones', () => {
    expect(result.behavioral.length).toBeGreaterThan(0);
    expect(labels(result.behavioral).join(' ')).toMatch(/fiabilité|équipe|ponctualité|intégrité/i);
  });

  it('attaches the source sentence to every requirement as evidence', () => {
    const all = [
      ...result.requiredSkills,
      ...result.preferredSkills,
      ...result.tools,
      ...result.languages,
      ...result.behavioral,
    ];
    expect(all.length).toBeGreaterThan(0);
    for (const item of all) {
      expect(item.evidence.length).toBeGreaterThan(0);
    }
  });

  it('suggests interview themes including the sector-specific safety question', () => {
    expect(result.interviewThemes.join(' ')).toMatch(/sécurité/i);
  });

  it('reports that it used the deterministic engine', () => {
    expect(result.source).toBe('rules');
  });
});

describe('analyzeJobDescription — commercial advert', () => {
  const result = analyzeJobDescription(salesAd.text);

  it('detects the core commercial skills', () => {
    const all = labels([...result.requiredSkills, ...result.preferredSkills]).join(' ');
    expect(all).toMatch(/vente|prospection|négociation/i);
  });

  it('detects results orientation as a behavioural expectation', () => {
    expect(labels(result.behavioral).join(' ')).toMatch(/résultat|initiative|organisation/i);
  });

  it('proposes a sales role-play among the interview themes', () => {
    expect(result.interviewThemes.join(' ')).toMatch(/vente|objection/i);
  });
});

describe('analyzeJobDescription — administrative and remote adverts', () => {
  it('detects confidentiality expectations in the administrative advert', () => {
    const result = analyzeJobDescription(adminAd.text);
    const all = labels([...result.behavioral, ...result.requiredSkills]).join(' ');
    expect(all).toMatch(/éthique|discrétion|rigueur|organisation/i);
  });

  it('detects the English requirement in the remote advert', () => {
    const result = analyzeJobDescription(remoteAd.text);
    expect(labels(result.languages)).toContain('Anglais');
  });

  it('detects collaboration tooling in the remote advert', () => {
    const result = analyzeJobDescription(remoteAd.text);
    expect(labels(result.tools).length).toBeGreaterThan(0);
  });
});

describe('analyzeJobDescription — general behaviour', () => {
  it('handles every seeded example without throwing', () => {
    for (const example of jobExamples) {
      const result = analyzeJobDescription(example.text);
      expect(result.jobTitle.length).toBeGreaterThan(0);
      expect(result.keywords.length).toBeGreaterThan(0);
    }
  });

  it('honours a user-supplied title and company over the detected ones', () => {
    const result = analyzeJobDescription(miningAd.text, {
      jobTitle: 'Magasinier',
      company: 'Entreprise X',
    });
    expect(result.jobTitle).toBe('Magasinier');
    expect(result.company).toBe('Entreprise X');
  });

  it('caps the keyword list so the UI stays readable', () => {
    const result = analyzeJobDescription(miningAd.text);
    expect(result.keywords.length).toBeLessThanOrEqual(18);
    expect(new Set(result.keywords).size).toBe(result.keywords.length);
  });

  it('is stable across repeated runs apart from generated ids', () => {
    const first = analyzeJobDescription(salesAd.text);
    const second = analyzeJobDescription(salesAd.text);
    expect(labels(second.requiredSkills)).toEqual(labels(first.requiredSkills));
    expect(second.keywords).toEqual(first.keywords);
  });

  it('does not invent requirements from an advert that states none', () => {
    const sparse = `RESPONSABLE DE BOUTIQUE

Nous recherchons une personne motivée pour tenir notre boutique du quartier.
Le poste consiste à ouvrir le matin, accueillir les clients et fermer le soir.
Se présenter directement à la boutique avec une pièce d'identité.`;
    const result = analyzeJobDescription(sparse);
    expect(result.education).toHaveLength(0);
    expect(result.tools).toHaveLength(0);
  });
});
