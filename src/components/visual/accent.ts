/**
 * Per-pathway colour identity.
 *
 * Eight pathways rendered in one green made the explore page a wall of
 * identical cards — users could not tell them apart at a glance, which is the
 * whole job of a card grid. A distinct hue per pathway makes the set scannable
 * and gives each pathway a consistent identity across the app.
 *
 * These are Tailwind class strings rather than CSS variables because Tailwind
 * needs to see the literal class names to emit them.
 */

export type AccentName = 'green' | 'blue' | 'amber' | 'plum' | 'teal' | 'rust' | 'indigo' | 'olive';

export interface Accent {
  /** Large icon tile. */
  tile: string;
  /** Thin bar at the top of a card. */
  bar: string;
  /** Subtle page-level wash. */
  wash: string;
  /** Text colour for the eyebrow label. */
  text: string;
  /** Ring used by progress indicators. */
  ring: string;
}

const ACCENTS: Record<AccentName, Accent> = {
  green: {
    tile: 'bg-brand-700 text-white',
    bar: 'bg-brand-600',
    wash: 'bg-brand-50',
    text: 'text-brand-700',
    ring: 'stroke-brand-600',
  },
  blue: {
    tile: 'bg-[#1f5aa5] text-white',
    bar: 'bg-[#1f5aa5]',
    wash: 'bg-[#eaf2fb]',
    text: 'text-[#194a89]',
    ring: 'stroke-[#1f5aa5]',
  },
  amber: {
    tile: 'bg-accent-600 text-white',
    bar: 'bg-accent-500',
    wash: 'bg-accent-50',
    text: 'text-accent-700',
    ring: 'stroke-accent-500',
  },
  plum: {
    tile: 'bg-[#7b3560] text-white',
    bar: 'bg-[#7b3560]',
    wash: 'bg-[#f8edf4]',
    text: 'text-[#6a2c53]',
    ring: 'stroke-[#7b3560]',
  },
  teal: {
    tile: 'bg-[#0f6b6b] text-white',
    bar: 'bg-[#0f6b6b]',
    wash: 'bg-[#e6f3f3]',
    text: 'text-[#0b5555]',
    ring: 'stroke-[#0f6b6b]',
  },
  rust: {
    tile: 'bg-[#a33d1f] text-white',
    bar: 'bg-[#a33d1f]',
    wash: 'bg-[#fbeee9]',
    text: 'text-[#8a331a]',
    ring: 'stroke-[#a33d1f]',
  },
  indigo: {
    tile: 'bg-[#3f3d8f] text-white',
    bar: 'bg-[#3f3d8f]',
    wash: 'bg-[#eeeefa]',
    text: 'text-[#333177]',
    ring: 'stroke-[#3f3d8f]',
  },
  olive: {
    tile: 'bg-[#5a6b1f] text-white',
    bar: 'bg-[#5a6b1f]',
    wash: 'bg-[#f2f5e6]',
    text: 'text-[#48561a]',
    ring: 'stroke-[#5a6b1f]',
  },
};

/** Stable colour per pathway id. Assigned deliberately, not hashed. */
const BY_PATH: Record<string, AccentName> = {
  'litteratie-numerique': 'blue',
  'anglais-emploi': 'plum',
  'commercial-vente': 'amber',
  'mines-support': 'rust',
  'preparation-emploi': 'green',
  entrepreneuriat: 'olive',
  'freelance-distance': 'teal',
  'savoir-etre': 'indigo',
};

export function accentFor(pathId: string): Accent {
  return ACCENTS[BY_PATH[pathId] ?? 'green'];
}

export function accentNameFor(pathId: string): AccentName {
  return BY_PATH[pathId] ?? 'green';
}
