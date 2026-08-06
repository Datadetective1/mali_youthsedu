/**
 * Central configuration.
 *
 * Anything that might change between environments — or when the product is
 * finally branded — is read here rather than hard-coded across the codebase.
 *
 * Only `NEXT_PUBLIC_*` values may be referenced from client components.
 */

export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Mali Youth Project',
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || 'MYP',
  /** Kept in French: it is the product's core promise, shown on the landing page. */
  tagline: 'Le talent est universel. Les opportunités ne le sont pas.',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.org',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
} as const;

export type DataDriverName = 'supabase' | 'local';

function resolveDataDriver(): DataDriverName {
  const explicit = process.env.DATA_DRIVER?.trim().toLowerCase();
  if (explicit === 'supabase' || explicit === 'local') return explicit;
  return isSupabaseConfigured() ? 'supabase' : 'local';
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Server-only. Never import this into a client component. */
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  dbUrl: process.env.SUPABASE_DB_URL ?? '',
} as const;

export const dataConfig = {
  driver: resolveDataDriver(),
  localDir: process.env.LOCAL_DATA_DIR || '.data',
} as const;

export const authConfig = {
  /**
   * Used to sign local-driver session cookies. Required when the local driver
   * runs outside development — `assertProductionConfig()` enforces that.
   */
  secret: process.env.AUTH_SECRET ?? '',
  sessionCookie: 'myp_session',
  sessionMaxAgeSeconds: 60 * 60 * 24 * 30,
} as const;

export const adminConfig = {
  emails: (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean),
} as const;

export type AiProviderName = 'mock' | 'anthropic' | 'none';

function resolveAiProvider(): AiProviderName {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (raw === 'anthropic' || raw === 'mock' || raw === 'none') return raw;
  return 'none';
}

export const aiConfig = {
  provider: resolveAiProvider(),
  apiKey: process.env.AI_API_KEY ?? '',
  model: process.env.AI_MODEL || 'claude-sonnet-4-5',
  baseUrl: process.env.AI_BASE_URL || '',
  timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 20_000),
  rateLimitPerHour: Number(process.env.AI_RATE_LIMIT_PER_HOUR ?? 20),
} as const;

/**
 * True when AI enhancement can actually run. Every AI-backed feature has a
 * deterministic fallback, so a `false` here degrades quality, never function.
 */
export function isAiEnabled(): boolean {
  if (aiConfig.provider === 'none') return false;
  if (aiConfig.provider === 'mock') return true;
  return Boolean(aiConfig.apiKey);
}

export const analyticsConfig = {
  provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none') as 'none' | 'plausible',
  domain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ?? '',
  scriptUrl: process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? '',
} as const;

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

/**
 * Configuration problems that must not reach real users.
 * Returns human-readable messages rather than throwing, so callers can decide
 * whether to warn (build time) or refuse to boot.
 */
export function productionConfigIssues(): string[] {
  const issues: string[] = [];
  if (!isProduction) return issues;

  if (dataConfig.driver === 'local') {
    issues.push(
      'DATA_DRIVER=local est un magasin de developpement base sur des fichiers. ' +
        'Configurez Supabase avant toute mise en production.',
    );
  }
  if (dataConfig.driver === 'local' && authConfig.secret.length < 32) {
    issues.push('AUTH_SECRET doit contenir au moins 32 caracteres.');
  }
  if (dataConfig.driver === 'supabase' && !isSupabaseConfigured()) {
    issues.push('DATA_DRIVER=supabase mais NEXT_PUBLIC_SUPABASE_URL/ANON_KEY sont absents.');
  }
  if (aiConfig.provider === 'mock') {
    issues.push(
      "AI_PROVIDER=mock renvoie des reponses simulees. Utilisez 'none' ou un vrai fournisseur en production.",
    );
  }
  if (adminConfig.emails.length === 0) {
    issues.push("ADMIN_EMAILS est vide : personne ne pourra acceder a l'administration.");
  }
  return issues;
}
