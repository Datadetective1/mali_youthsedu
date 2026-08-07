import { describe, expect, it } from 'vitest';
import {
  aiOutputIntroducesFacts,
  buildValueProposition,
  isValuePropositionComplete,
} from './value-proposition';
import type { ValuePropositionInput } from '@/lib/types';

const filled: ValuePropositionInput = {
  problem: 'aider un commerce à retrouver les clients qui ne reviennent plus',
  skills: 'la prospection, le suivi client et la tenue d’un fichier de suivi',
  results: '8 clients sur 15 sont revenus le mois suivant',
  proof: 'la boutique de mon oncle, où j’ai tenu le fichier pendant six mois',
  approach: 'de la rigueur dans le suivi et de la constance dans les relances',
  motivation: 'je veux travailler dans la distribution, où le contact client est quotidien',
  targetRole: 'assistant commercial',
};

const empty: ValuePropositionInput = {
  problem: '',
  skills: '',
  results: '',
  proof: '',
  approach: '',
  motivation: '',
};

describe('buildValueProposition', () => {
  it('produces all five formulations', () => {
    const output = buildValueProposition(filled);
    expect(output.pitch).toBeTruthy();
    expect(output.cvSummary).toBeTruthy();
    expect(output.tellMeAboutYou).toBeTruthy();
    expect(output.whyHireYou).toBeTruthy();
    expect(output.roleStatement).toBeTruthy();
    expect(output.source).toBe('rules');
  });

  it('only reuses words the user supplied', () => {
    const output = buildValueProposition(filled);
    expect(output.pitch).toContain('prospection');
    expect(output.pitch).toContain('8 clients sur 15');
    expect(output.roleStatement).toContain('assistant commercial');
  });

  it('never invents a figure that the user did not provide', () => {
    const noNumbers: ValuePropositionInput = { ...filled, results: 'des clients sont revenus' };
    const output = buildValueProposition(noNumbers);
    const combined = Object.values(output).join(' ');
    expect(combined).not.toMatch(/\d/);
  });

  it('drops a clause entirely rather than filling an empty answer', () => {
    const partial: ValuePropositionInput = {
      ...empty,
      skills: 'la saisie de données',
      problem: 'fiabiliser un fichier client',
      proof: 'un projet scolaire',
    };
    const output = buildValueProposition(partial);
    expect(output.pitch).toContain('saisie de données');
    // No motivation was given, so nothing about motivation may appear.
    expect(output.pitch).not.toMatch(/m’intéresse aujourd’hui/);
  });

  it('returns an explicit notice instead of inventing text when nothing is filled', () => {
    const output = buildValueProposition(empty);
    expect(output.pitch).toMatch(/Répondez aux questions/);
    expect(output.whyHireYou).toMatch(/Répondez aux questions/);
  });

  it('formats a comma-separated skills list into readable French', () => {
    const output = buildValueProposition({ ...filled, skills: 'Excel, la rédaction, le classement' });
    expect(output.pitch).toMatch(/excel, la rédaction et le classement/i);
  });

  it('is deterministic', () => {
    expect(buildValueProposition(filled)).toEqual(buildValueProposition(filled));
  });

  it('handles a single skill without adding a stray conjunction', () => {
    const output = buildValueProposition({ ...filled, skills: 'la vente' });
    expect(output.pitch).toContain('la vente');
    expect(output.pitch).not.toMatch(/la vente et\b/);
  });

  it('works without an optional target role', () => {
    const { targetRole: _targetRole, ...rest } = filled;
    const output = buildValueProposition(rest as ValuePropositionInput);
    expect(output.roleStatement).toBeTruthy();
    expect(output.roleStatement).not.toContain('undefined');
  });
});

describe('isValuePropositionComplete', () => {
  it('requires a problem, skills and proof', () => {
    expect(isValuePropositionComplete(filled)).toBe(true);
    expect(isValuePropositionComplete({ ...filled, proof: '' })).toBe(false);
    expect(isValuePropositionComplete(empty)).toBe(false);
  });
});

describe('aiOutputIntroducesFacts', () => {
  it('flags a number that appears nowhere in the user input', () => {
    expect(aiOutputIntroducesFacts(filled, 'Avec 5 ans d’expérience en vente…')).toBe(true);
  });

  it('accepts numbers the user actually gave', () => {
    expect(aiOutputIntroducesFacts(filled, 'J’ai fait revenir 8 clients sur 15.')).toBe(false);
  });

  it('flags an invented qualification', () => {
    expect(aiOutputIntroducesFacts(filled, 'Titulaire d’une licence en commerce…')).toBe(true);
  });

  it('accepts a pure rewording', () => {
    expect(
      aiOutputIntroducesFacts(filled, 'Je sais prospecter et assurer le suivi des clients.'),
    ).toBe(false);
  });
});
