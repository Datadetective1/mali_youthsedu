import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { authConfig, isProduction } from '@/config';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

/**
 * Password hashing and session signing for the local development driver.
 *
 * When Supabase is configured, none of this runs — Supabase Auth handles
 * credentials, and it should, because it does key rotation, rate limiting and
 * email verification properly. This exists so the application is runnable and
 * testable without an external account, and it is written to be correct rather
 * than convenient: scrypt with a per-user salt, constant-time comparison, and
 * HMAC-signed session cookies with an expiry inside the signed payload.
 */

const KEY_LENGTH = 64;

function secret(): string {
  if (authConfig.secret.length >= 32) return authConfig.secret;

  if (isProduction) {
    // Refuse rather than silently signing sessions with a guessable key.
    throw new Error(
      'AUTH_SECRET doit contenir au moins 32 caracteres lorsque le driver local est actif en production.',
    );
  }
  // Development only, and stable across restarts so sessions survive a reload.
  return 'development-only-insecure-secret-do-not-use-in-production';
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return { hash: derived.toString('hex'), salt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  const derived = await scrypt(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

export interface SessionPayload {
  userId: string;
  email: string;
  displayName: string;
  /** Unix seconds. */
  exp: number;
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const full: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + authConfig.sessionMaxAgeSeconds,
  };
  const body = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  return `${body}.${sign(body)}`;
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expected = sign(body);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    // The expiry is inside the signed payload, so it cannot be extended by
    // editing the cookie's own Max-Age.
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.userId !== 'string' || payload.userId.length === 0) return null;
    return payload;
  } catch {
    return null;
  }
}
