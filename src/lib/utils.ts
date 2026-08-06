import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Unicode combining diacritical marks, stripped after NFD normalisation. */
const COMBINING_MARKS = /[̀-ͯ]/g;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable, URL-safe slug. Strips French accents so "Métier" -> "metier". */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Percentage 0-100, rounded, safe when total is 0. */
export function percent(done: number, total: number): number {
  if (total <= 0) return 0;
  return clamp(Math.round((done / total) * 100), 0, 100);
}

/** "1 h 30" / "45 min" — compact durations for small screens. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

/**
 * Deterministic pseudo-random generator.
 * Weekly plans must be reproducible: the same inputs always yield the same
 * plan, so a user who reloads does not see their week shuffled.
 */
export function createRng(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return function next() {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** ISO date (YYYY-MM-DD) for the Monday of the week containing `date`. */
export function startOfIsoWeek(date: Date): string {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() - (day - 1));
  return copy.toISOString().slice(0, 10);
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Crypto-quality UUID, available in Node 20+ and every modern browser. */
export function newId(): string {
  return crypto.randomUUID();
}

/** Remove duplicates while keeping first-seen order. */
export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Split an array into chunks of at most `size`. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Normalise text for keyword matching: lowercase, accent-free, punctuation
 * collapsed to spaces. Used by the job-description analyzer so that
 * "négociation" matches "Negociation".
 */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(input: string, max: number): string {
  return input.length <= max ? input : `${input.slice(0, max - 1).trimEnd()}…`;
}
