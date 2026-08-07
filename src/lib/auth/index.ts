import 'server-only';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { adminConfig, authConfig, dataConfig, isProduction } from '@/config';
import { localStore } from '@/lib/db/local-store';
import { createRequestClient } from '@/lib/db/supabase-store';
import { createSessionToken, hashPassword, readSessionToken, verifyPassword } from './local-auth';

/**
 * Authentication, unified across both drivers.
 *
 * The rest of the application only ever calls `getSession()` and never learns
 * which driver is active.
 *
 * There is deliberately no `requireSession()` helper here. Pages and layouts
 * call `getSession()` and then `redirect()` themselves, because `redirect()`
 * interrupts control flow reliably when called directly inside a page or
 * layout, and did not when the throw had to propagate out of a shared async
 * helper in this Next 16 / Turbopack setup — which turned every signed-out
 * visit to a protected page into a 500 instead of a redirect. Two lines at the
 * call site is a small price for a guard that actually guards.
 */

export interface Session {
  userId: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
}

export type AuthResult = { ok: true; session: Session } | { ok: false; code: AuthErrorCode };

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'email-taken'
  | 'weak-password'
  | 'invalid-email'
  | 'unavailable'
  | 'unknown';

function isAdminEmail(email: string): boolean {
  return adminConfig.emails.includes(email.trim().toLowerCase());
}

// ---------------------------------------------------------------------------
// Reading the current session
// ---------------------------------------------------------------------------

export async function getSession(): Promise<Session | null> {
  if (dataConfig.driver === 'supabase') return getSupabaseSession();
  return getLocalSession();
}

async function getSupabaseSession(): Promise<Session | null> {
  try {
    const client = await createRequestClient();
    // getUser() revalidates the token with the auth server; getSession() would
    // trust whatever is in the cookie.
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;

    const { data: profile } = await client
      .from('profiles')
      .select('display_name, is_admin, email')
      .eq('id', data.user.id)
      .maybeSingle();

    const email = (profile?.email as string) ?? data.user.email ?? '';
    return {
      userId: data.user.id,
      email,
      displayName: (profile?.display_name as string) || email.split('@')[0] || '',
      // The database flag is authoritative; the allowlist is a bootstrap path.
      isAdmin: Boolean(profile?.is_admin) || isAdminEmail(email),
    };
  } catch {
    return null;
  }
}

async function getLocalSession(): Promise<Session | null> {
  const store = await cookies();
  const payload = readSessionToken(store.get(authConfig.sessionCookie)?.value);
  if (!payload) return null;

  // Confirm the account still exists — a deleted account must not keep working
  // just because the cookie is still valid.
  const account = await localStore().findAccountByUserId(payload.userId);
  if (!account) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    displayName: payload.displayName,
    isAdmin: isAdminEmail(payload.email),
  };
}


// ---------------------------------------------------------------------------
// Sign up / sign in / sign out
// ---------------------------------------------------------------------------

export function validateCredentials(email: string, password: string): AuthErrorCode | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return 'invalid-email';
  if (password.length < 8) return 'weak-password';
  return null;
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResult> {
  const problem = validateCredentials(email, password);
  if (problem) return { ok: false, code: problem };

  return dataConfig.driver === 'supabase'
    ? signUpSupabase(email, password, displayName)
    : signUpLocal(email, password, displayName);
}

async function signUpSupabase(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResult> {
  const client = await createRequestClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    const code: AuthErrorCode = /already registered|already exists/i.test(error.message)
      ? 'email-taken'
      : 'unknown';
    return { ok: false, code };
  }
  if (!data.user) return { ok: false, code: 'unknown' };

  return {
    ok: true,
    session: {
      userId: data.user.id,
      email,
      displayName,
      isAdmin: isAdminEmail(email),
    },
  };
}

async function signUpLocal(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResult> {
  const store = localStore();
  const normalized = email.trim().toLowerCase();

  if (await store.findAccountByEmail(normalized)) {
    return { ok: false, code: 'email-taken' };
  }

  const userId = randomUUID();
  const { hash, salt } = await hashPassword(password);

  try {
    await store.createAccount({
      userId,
      email: normalized,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_TAKEN') {
      return { ok: false, code: 'email-taken' };
    }
    throw error;
  }

  const name = displayName.trim() || normalized.split('@')[0] || 'Utilisateur';
  await store.upsert(
    'profiles',
    {
      id: userId,
      email: normalized,
      display_name: name,
      locale: 'fr',
      is_admin: isAdminEmail(normalized),
    },
    ['id'],
  );
  await store.upsert('user_preferences', { user_id: userId }, ['user_id']);

  const session: Session = {
    userId,
    email: normalized,
    displayName: name,
    isAdmin: isAdminEmail(normalized),
  };
  await writeLocalSessionCookie(session);
  return { ok: true, session };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (dataConfig.driver === 'supabase') {
    const client = await createRequestClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { ok: false, code: 'invalid-credentials' };
    return {
      ok: true,
      session: {
        userId: data.user.id,
        email: data.user.email ?? email,
        displayName: (data.user.user_metadata?.display_name as string) ?? '',
        isAdmin: isAdminEmail(data.user.email ?? email),
      },
    };
  }

  const store = localStore();
  const account = await store.findAccountByEmail(email);
  if (!account) {
    // Hash anyway so a missing account and a wrong password take the same time.
    await hashPassword(password);
    return { ok: false, code: 'invalid-credentials' };
  }

  const valid = await verifyPassword(password, account.passwordHash, account.salt);
  if (!valid) return { ok: false, code: 'invalid-credentials' };

  const profile = await store.getOne('profiles', { id: account.userId });
  const session: Session = {
    userId: account.userId,
    email: account.email,
    displayName: (profile?.display_name as string) || account.email.split('@')[0] || '',
    isAdmin: isAdminEmail(account.email),
  };
  await writeLocalSessionCookie(session);
  return { ok: true, session };
}

/**
 * Passwordless sign-in. Supabase only — implementing email delivery for the
 * local driver would mean shipping an SMTP dependency for a development
 * fallback, so it reports itself unavailable instead of pretending.
 */
export async function requestMagicLink(email: string, redirectTo: string): Promise<AuthResult> {
  if (dataConfig.driver !== 'supabase') return { ok: false, code: 'unavailable' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return { ok: false, code: 'invalid-email' };

  const client = await createRequestClient();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return { ok: false, code: 'unknown' };

  // Deliberately does not reveal whether the address exists.
  return { ok: false, code: 'unavailable' };
}

export async function signOut(): Promise<void> {
  if (dataConfig.driver === 'supabase') {
    const client = await createRequestClient();
    await client.auth.signOut();
    return;
  }
  const store = await cookies();
  store.delete(authConfig.sessionCookie);
}

async function writeLocalSessionCookie(session: Session): Promise<void> {
  const store = await cookies();
  store.set(authConfig.sessionCookie, createSessionToken(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: authConfig.sessionMaxAgeSeconds,
  });
}

export { isAdminEmail };
