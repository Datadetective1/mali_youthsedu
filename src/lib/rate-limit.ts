/**
 * In-process rate limiter.
 *
 * Honest about what it is: a per-instance, in-memory counter. On a single
 * server or a warm serverless instance it stops the obvious abuse — a script
 * hammering the AI endpoint, a runaway retry loop. Across many cold serverless
 * instances it is best-effort, and the limits below are therefore per-instance
 * ceilings rather than a guarantee.
 *
 * For a hard guarantee this needs a shared counter (Postgres row, Upstash,
 * Vercel KV). That is documented as the next step in docs/SECURITY.md rather
 * than pretended away here.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Keeps the map from growing without bound in a long-lived process. */
function sweep(now: number): void {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export async function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Test seam. */
export function resetRateLimits(): void {
  buckets.clear();
}
