import type { ExtractedRequirement, JobExtraction, RequirementKind } from '@/lib/types';
import { skills } from '@/content/skills';
import { sectors } from '@/content/sectors';
import { newId, normalizeText, truncate, unique } from '@/lib/utils';

/**
 * Deterministic job-description analyzer.
 *
 * This is the primary implementation, not a fallback: it runs on every analysis
 * and produces the complete result. Optional AI refinement (see `src/lib/ai`)
 * may improve wording afterwards, but the user with no AI key, no connection to
 * a provider, or a provider outage gets exactly the same structural analysis.
 *
 * The approach is section-aware keyword matching over the skill vocabulary in
 * `src/content/skills.ts`. Every extracted requirement carries the sentence it
 * came from, so the user can check the machine rather than trust it.
 */

const MIN_LENGTH = 80;
const MAX_LENGTH = 20_000;

export type SectionKind =
  | 'intro'
  | 'responsibilities'
  | 'required'
  | 'preferred'
  | 'behavioral'
  | 'conditions';

interface Line {
  raw: string;
  normalized: string;
  section: SectionKind;
  isBullet: boolean;
}

const SECTION_HEADINGS: { section: SectionKind; patterns: string[] }[] = [
  {
    section: 'responsibilities',
    patterns: [
      'missions',
      'mission principale',
      'vos missions',
      'responsabilites',
      'activites',
      'taches',
      'attributions',
      'description du poste',
      'le poste',
      'principales taches',
      'fonctions',
    ],
  },
  {
    section: 'required',
    patterns: [
      'profil',
      'profil recherche',
      'competences requises',
      'competences',
      'exigences',
      'qualifications',
      'compétences techniques',
      'formation et experience',
      'nous recherchons',
      'pre requis',
      'prerequis',
      'conditions requises',
    ],
  },
  {
    section: 'preferred',
    patterns: ['atouts', 'seraient un plus', 'competences appreciees', 'un plus', 'souhaitable'],
  },
  {
    section: 'behavioral',
    patterns: [
      'qualites',
      'qualites attendues',
      'qualites recherchees',
      'savoir etre',
      'aptitudes',
      'aptitudes personnelles',
      'qualites indispensables',
      'comportement',
      'soft skills',
    ],
  },
  {
    section: 'conditions',
    patterns: [
      'conditions',
      'nous offrons',
      'avantages',
      'remuneration',
      'salaire',
      'candidature',
      'comment postuler',
      'depot des dossiers',
      'contact',
    ],
  },
];

/** Phrases that downgrade a requirement from mandatory to nice-to-have. */
const PREFERRED_MARKERS = [
  'souhaite',
  'souhaitee',
  'apprecie',
  'appreciee',
  'un atout',
  'atout',
  'un plus',
  'serait un plus',
  'de preference',
  'idealement',
  'notions',
  'bonus',
  'optionnel',
  'facultatif',
];

/** Phrases that mark a requirement as non-negotiable. */
const REQUIRED_MARKERS = [
  'indispensable',
  'obligatoire',
  'exige',
  'exigee',
  'requis',
  'requise',
  'imperatif',
  'imperative',
  'maitrise',
  'necessaire',
  'irreprochable',
  'absolue',
];

const TOOL_LEXICON: { label: string; keywords: string[] }[] = [
  { label: 'Microsoft Excel', keywords: ['excel', 'microsoft excel', 'tableur'] },
  { label: 'Microsoft Word', keywords: ['word', 'microsoft word', 'traitement de texte'] },
  { label: 'Microsoft PowerPoint', keywords: ['powerpoint', 'diaporama'] },
  { label: 'Pack Office / suite bureautique', keywords: ['pack office', 'suite bureautique', 'ms office', 'microsoft office', 'outils bureautiques', 'bureautique'] },
  { label: 'Messagerie (Outlook, Gmail)', keywords: ['outlook', 'gmail', 'messagerie electronique'] },
  { label: 'Google Sheets', keywords: ['google sheets', 'sheets'] },
  { label: 'Google Workspace / Drive', keywords: ['google drive', 'google workspace', 'google docs'] },
  { label: 'Logiciel CRM', keywords: ['crm', 'salesforce', 'hubspot'] },
  { label: 'ERP / logiciel de gestion', keywords: ['erp', 'sap', 'sage', 'odoo', 'logiciel de gestion'] },
  { label: 'Logiciel de comptabilité', keywords: ['logiciel de comptabilite', 'quickbooks', 'ciel compta'] },
  { label: 'Visioconférence (Teams, Zoom, Meet)', keywords: ['teams', 'zoom', 'google meet', 'visioconference', 'visio'] },
  { label: 'Système d’information interne', keywords: ['systeme d information', 'logiciel metier', 'base de donnees'] },
  { label: 'AutoCAD', keywords: ['autocad'] },
  { label: 'Outils de gestion de projet', keywords: ['trello', 'asana', 'jira', 'gestion de projet'] },
];

const LANGUAGE_LEXICON: { label: string; keywords: string[] }[] = [
  { label: 'Français', keywords: ['francais', 'french'] },
  { label: 'Anglais', keywords: ['anglais', 'english'] },
  { label: 'Bambara', keywords: ['bambara', 'bamanankan'] },
  { label: 'Langue nationale', keywords: ['langue nationale', 'langues nationales', 'langue locale'] },
  { label: 'Arabe', keywords: ['arabe'] },
];

const BEHAVIOURAL_DIMENSIONS = new Set(['savoir-etre', 'reflexion']);

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Word-boundary match tolerant of French plurals and the feminine "e".
 * "vente" matches "ventes"; "commercial" matches "commerciale" and "commerciaux".
 */
function containsKeyword(haystack: string, keyword: string): boolean {
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(keyword)}(e|s|es|x|aux|ne|nes)?([^a-z0-9]|$)`,
  );
  return pattern.test(haystack);
}

function classifyHeading(normalized: string): SectionKind | null {
  const trimmed = normalized.replace(/[:.\-–—]+$/, '').trim();
  if (trimmed.length === 0 || trimmed.length > 70) return null;
  for (const { section, patterns } of SECTION_HEADINGS) {
    if (patterns.some((pattern) => trimmed === pattern || trimmed.startsWith(`${pattern} `))) {
      return section;
    }
  }
  return null;
}

export function parseLines(text: string): Line[] {
  const lines: Line[] = [];
  let section: SectionKind = 'intro';

  for (const rawLine of text.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (trimmed.length === 0) continue;

    const isBullet = /^[-•*–—>]|^\d+[.)]/.test(trimmed);
    const cleaned = trimmed.replace(/^[-•*–—>]+\s*/, '').replace(/^\d+[.)]\s*/, '');
    const normalized = normalizeText(cleaned);

    // A bullet is content, never a heading — some adverts bullet their headings.
    if (!isBullet) {
      const heading = classifyHeading(normalized);
      if (heading) {
        section = heading;
        continue;
      }
    }

    // Long prose lines inside a section get split into sentences so evidence
    // quotes stay short and readable.
    const sentences = cleaned
      .split(/(?<=[.;!?])\s+(?=[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ])/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    for (const sentence of sentences) {
      lines.push({
        raw: sentence,
        normalized: normalizeText(sentence),
        section,
        isBullet,
      });
    }
  }

  return lines;
}

// ---------------------------------------------------------------------------
// Field extraction
// ---------------------------------------------------------------------------

const TITLE_PATTERNS = [
  /(?:recrut(?:e|ons)|recherch(?:e|ons)|embauch(?:e|ons))\s+(?:un|une|des|un\(e\))?\s*([^.,;\n(]{4,70})/i,
  /(?:poste|offre)\s+(?:de|d’|d')\s+([^.,;\n(]{4,70})/i,
  /intitul[ée]\s*(?:du poste)?\s*:\s*([^\n]{4,70})/i,
];

export function extractJobTitle(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // Adverts usually lead with the title as a standalone, often capitalised line.
  const first = lines[0];
  if (first && first.length <= 90 && !/[.]$/.test(first)) {
    const withoutDash = first.split(/\s+[-–—]\s+/)[0]?.trim() ?? first;
    if (withoutDash.length >= 4) return cleanTitle(withoutDash);
  }

  for (const pattern of TITLE_PATTERNS) {
    const match = pattern.exec(text);
    const captured = match?.[1]?.trim();
    if (captured && captured.length >= 4) return cleanTitle(captured);
  }

  return 'Poste non identifié';
}

function cleanTitle(input: string): string {
  const cleaned = input
    .replace(/\s+/g, ' ')
    .replace(/[«»"']/g, '')
    .replace(/\s*[:,;]\s*$/, '')
    .trim();
  // Fully uppercase titles read as shouting; restore sentence case.
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 6) {
    return cleaned.charAt(0) + cleaned.slice(1).toLowerCase();
  }
  return cleaned;
}

export function extractCompany(text: string): string | null {
  const patterns = [
    /(?:soci[ée]t[ée]|entreprise|groupe|cabinet|institution|organisation)\s+([A-ZÉÈÀÇ][\w'’\- ]{2,40})/,
    /chez\s+([A-ZÉÈÀÇ][\w'’\- ]{2,40})/,
  ];
  for (const pattern of patterns) {
    const captured = pattern.exec(text)?.[1]?.trim();
    if (captured && captured.length >= 3) return captured.replace(/[,.;].*$/, '').trim();
  }
  return null;
}

function markerStrength(normalized: string): 'required' | 'preferred' | 'neutral' {
  if (PREFERRED_MARKERS.some((marker) => normalized.includes(marker))) return 'preferred';
  if (REQUIRED_MARKERS.some((marker) => normalized.includes(marker))) return 'required';
  return 'neutral';
}

function requirement(
  kind: RequirementKind,
  label: string,
  evidence: string,
  confidence: number,
  skillId?: string,
): ExtractedRequirement {
  return {
    id: newId(),
    kind,
    label,
    evidence: truncate(evidence, 180),
    confidence: Math.min(1, Math.max(0.1, confidence)),
    ...(skillId ? { skillId } : {}),
  };
}

function extractExperience(lines: Line[]): ExtractedRequirement[] {
  const found: ExtractedRequirement[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (line.section === 'conditions') continue;

    const rangeMatch = /(\d+)\s*(?:a|à|-)\s*(\d+)\s*(?:an|ans|annee|annees)/.exec(line.normalized);
    const singleMatch = /(?:au moins\s*)?(\d+)\s*(?:an|ans|annee|annees)\s*(?:minimum\s*)?(?:d[' ]?experience)?/.exec(
      line.normalized,
    );

    if (rangeMatch && !seen.has('range')) {
      seen.add('range');
      found.push(
        requirement(
          'experience',
          `${rangeMatch[1]} à ${rangeMatch[2]} ans d’expérience`,
          line.raw,
          0.9,
        ),
      );
    } else if (singleMatch && /experience/.test(line.normalized) && !seen.has('single')) {
      seen.add('single');
      found.push(
        requirement('experience', `${singleMatch[1]} an(s) d’expérience minimum`, line.raw, 0.85),
      );
    }

    if (/debutant.{0,20}accept|profils? junior|sans experience|premiere experience/.test(line.normalized)) {
      const key = 'junior';
      if (!seen.has(key)) {
        seen.add(key);
        found.push(
          requirement(
            'experience',
            'Ouvert aux profils juniors ou débutants',
            line.raw,
            0.8,
          ),
        );
      }
    }

    if (/experience.{0,40}(similaire|equivalent|meme poste|poste similaire)/.test(line.normalized)) {
      const key = 'similar';
      if (!seen.has(key)) {
        seen.add(key);
        found.push(
          requirement('experience', 'Expérience sur un poste similaire', line.raw, 0.75),
        );
      }
    }
  }

  return found;
}

const EDUCATION_PATTERNS: { pattern: RegExp; label: (match: RegExpExecArray) => string }[] = [
  { pattern: /bac\s*\+\s*(\d)/, label: (m) => `Bac +${m[1]} minimum` },
  { pattern: /\b(licence)\b/, label: () => 'Licence' },
  { pattern: /\b(master|maitrise)\b/, label: () => 'Master' },
  { pattern: /\b(bts|dut|dts)\b/, label: (m) => (m[1] ?? '').toUpperCase() },
  { pattern: /\b(cap|bep)\b/, label: (m) => (m[1] ?? '').toUpperCase() },
  { pattern: /\bniveau bac\b|\bbaccalaureat\b|\bbac\b/, label: () => 'Niveau baccalauréat' },
  { pattern: /\bdiplome\b.{0,40}(gestion|comptabilite|logistique|commerce|secretariat|administration)/, label: (m) => `Diplôme en ${m[1]}` },
  { pattern: /\bformation\b.{0,30}(technique|professionnelle|qualifiante)/, label: (m) => `Formation ${m[1]}` },
];

function extractEducation(lines: Line[]): ExtractedRequirement[] {
  const found: ExtractedRequirement[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    if (line.section === 'conditions') continue;
    for (const { pattern, label } of EDUCATION_PATTERNS) {
      const match = pattern.exec(line.normalized);
      if (!match) continue;
      const text = label(match);
      if (seen.has(text)) continue;
      seen.add(text);
      found.push(requirement('formation', text, line.raw, 0.8));
      // Stop at the most specific match per line to avoid "Bac +2" and
      // "Niveau baccalauréat" both firing on the same sentence.
      break;
    }
  }

  return found;
}

function extractFromLexicon(
  lines: Line[],
  lexicon: { label: string; keywords: string[] }[],
  kind: RequirementKind,
): ExtractedRequirement[] {
  const found = new Map<string, ExtractedRequirement>();

  for (const line of lines) {
    if (line.section === 'conditions') continue;
    for (const entry of lexicon) {
      if (found.has(entry.label)) continue;
      const matched = entry.keywords.some((keyword) => containsKeyword(line.normalized, keyword));
      if (!matched) continue;

      const strength = markerStrength(line.normalized);
      const confidence = strength === 'required' ? 0.95 : strength === 'preferred' ? 0.6 : 0.8;
      found.set(entry.label, requirement(kind, entry.label, line.raw, confidence));
    }
  }

  return Array.from(found.values());
}

interface SkillHit {
  skillId: string;
  label: string;
  evidence: string;
  section: SectionKind;
  strength: 'required' | 'preferred' | 'neutral';
  dimension: string;
}

function findSkillHits(lines: Line[]): SkillHit[] {
  const hits = new Map<string, SkillHit>();

  for (const line of lines) {
    if (line.section === 'conditions') continue;
    for (const skill of skills) {
      if (hits.has(skill.id)) continue;
      const matched = skill.keywords.some((keyword) => containsKeyword(line.normalized, keyword));
      if (!matched) continue;
      hits.set(skill.id, {
        skillId: skill.id,
        label: skill.name,
        evidence: line.raw,
        section: line.section,
        strength: markerStrength(line.normalized),
        dimension: skill.dimension,
      });
    }
  }

  return Array.from(hits.values());
}

function detectSectors(text: string): string[] {
  const normalized = normalizeText(text);
  return sectors
    .filter((sector) => sector.keywords.some((keyword) => containsKeyword(normalized, keyword)))
    .map((sector) => sector.id);
}

function buildInterviewThemes(
  required: ExtractedRequirement[],
  behavioral: ExtractedRequirement[],
  sectorIds: string[],
  responsibilities: string[],
): string[] {
  // Sector-specific themes lead: they are the least obvious and the most
  // costly to miss. A generic "question technique sur Excel" is something the
  // candidate would have guessed; the eliminatory safety question is not.
  const themes: string[] = [];

  if (sectorIds.includes('mines')) {
    themes.push('La sécurité au travail : attendez-vous à une question éliminatoire sur ce sujet');
  }
  if (sectorIds.includes('commerce')) {
    themes.push('Une mise en situation de vente ou de traitement d’objection');
  }
  if (sectorIds.includes('finance') || sectorIds.includes('administration')) {
    themes.push('Une question sur la confidentialité et la gestion d’une erreur');
  }

  for (const item of required.slice(0, 4)) {
    themes.push(`Une question technique sur : ${item.label.toLowerCase()}`);
  }
  for (const item of behavioral.slice(0, 3)) {
    themes.push(`Un exemple concret démontrant : ${item.label.toLowerCase()}`);
  }
  if (responsibilities.length > 0) {
    themes.push('« Comment aborderiez-vous les missions décrites dans l’offre ? »');
  }
  themes.push('« Pourquoi ce poste et pourquoi notre entreprise ? »');

  return unique(themes).slice(0, 9);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class JobTextError extends Error {
  constructor(public readonly reason: 'too-short' | 'too-long') {
    super(reason);
    this.name = 'JobTextError';
  }
}

export function validateJobText(text: string): void {
  const trimmed = text.trim();
  if (trimmed.length < MIN_LENGTH) throw new JobTextError('too-short');
  if (trimmed.length > MAX_LENGTH) throw new JobTextError('too-long');
}

export function analyzeJobDescription(
  text: string,
  overrides: { jobTitle?: string; company?: string } = {},
): JobExtraction {
  validateJobText(text);

  const lines = parseLines(text);
  const sectorIds = detectSectors(text);

  const responsibilities = lines
    .filter((line) => line.section === 'responsibilities')
    .map((line) => line.raw)
    .filter((line) => line.length > 12)
    .slice(0, 12);

  const skillHits = findSkillHits(lines);

  const requiredSkills: ExtractedRequirement[] = [];
  const preferredSkills: ExtractedRequirement[] = [];
  const behavioral: ExtractedRequirement[] = [];

  for (const hit of skillHits) {
    const isBehavioural =
      BEHAVIOURAL_DIMENSIONS.has(hit.dimension) || hit.section === 'behavioral';

    if (isBehavioural) {
      behavioral.push(
        requirement('comportement', hit.label, hit.evidence, 0.75, hit.skillId),
      );
      continue;
    }

    // A skill named in the "atouts" section, or hedged with "souhaité"/"un plus",
    // is not a blocker — telling the user otherwise makes them self-reject.
    const preferred = hit.section === 'preferred' || hit.strength === 'preferred';
    const confidence = hit.strength === 'required' ? 0.95 : preferred ? 0.6 : 0.8;

    const entry = requirement(
      preferred ? 'competence-appreciee' : 'competence-requise',
      hit.label,
      hit.evidence,
      confidence,
      hit.skillId,
    );
    if (preferred) preferredSkills.push(entry);
    else requiredSkills.push(entry);
  }

  const languages = extractFromLexicon(lines, LANGUAGE_LEXICON, 'langue');
  const tools = extractFromLexicon(lines, TOOL_LEXICON, 'outil');
  const education = extractEducation(lines);
  const experience = extractExperience(lines);

  const keywords = unique([
    ...requiredSkills.map((item) => item.label),
    ...tools.map((item) => item.label),
    ...languages.map((item) => item.label),
    ...preferredSkills.map((item) => item.label),
    ...behavioral.map((item) => item.label),
  ]).slice(0, 18);

  return {
    jobTitle: overrides.jobTitle?.trim() || extractJobTitle(text),
    company: overrides.company?.trim() || extractCompany(text),
    responsibilities,
    requiredSkills: requiredSkills.sort((a, b) => b.confidence - a.confidence),
    preferredSkills,
    languages,
    tools,
    education,
    experience,
    behavioral,
    keywords,
    interviewThemes: buildInterviewThemes(requiredSkills, behavioral, sectorIds, responsibilities),
    source: 'rules',
  };
}

/** Sector ids detected in an advert — used to route learning suggestions. */
export function detectedSectors(text: string): string[] {
  return detectSectors(text);
}
