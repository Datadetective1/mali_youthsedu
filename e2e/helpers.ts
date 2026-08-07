import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Shared E2E helpers.
 *
 * Accounts are created once by `auth.setup.ts` and reused through Playwright's
 * storage state. Signing in inside every test would trip the application's own
 * sign-in rate limit and produce failures that look like product bugs.
 */

export const JOURNEY_STATE = 'e2e/.auth/journey.json';
export const OFFLINE_STATE = 'e2e/.auth/offline.json';
export const ADMIN_STATE = 'e2e/.auth/admin.json';

/** Must match ADMIN_EMAILS in the Playwright web server environment. */
export const ADMIN_EMAIL = 'admin@example.org';

export const PASSWORD = 'MotDePasseTest123';

export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}@example.org`;
}

export async function signUp(page: Page, email = uniqueEmail(), name = 'Awa'): Promise<string> {
  await page.goto('/inscription');
  await page.getByLabel(/Prénom ou surnom/i).fill(name);
  await page.getByLabel(/Adresse e-mail/i).fill(email);
  await page.getByLabel(/Mot de passe/i).fill(PASSWORD);
  await page.getByRole('button', { name: /Créer mon compte/i }).click();
  await page.waitForURL(/\/(bienvenue|tableau-de-bord)/);
  return email;
}

/**
 * Signs up, or signs in when the address already exists.
 *
 * Detects the "compte existe déjà" message rather than waiting for a
 * navigation that will never happen — otherwise the fallback only fires after
 * the whole test has timed out, which is no fallback at all.
 */
export async function signUpOrSignIn(page: Page, email: string, name: string): Promise<void> {
  await page.goto('/inscription');
  await page.getByLabel(/Prénom ou surnom/i).fill(name);
  await page.getByLabel(/Adresse e-mail/i).fill(email);
  await page.getByLabel(/Mot de passe/i).fill(PASSWORD);
  await page.getByRole('button', { name: /Créer mon compte/i }).click();

  const alreadyExists = page.getByText(/Un compte existe déjà/i);

  await Promise.race([
    page.waitForURL(/\/(bienvenue|tableau-de-bord)/, { timeout: 15_000 }).catch(() => null),
    alreadyExists.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => null),
  ]);

  if (await alreadyExists.isVisible().catch(() => false)) {
    await signIn(page, email);
  }
}

export async function signIn(page: Page, email: string): Promise<void> {
  await page.goto('/connexion');
  await page.getByLabel(/Adresse e-mail/i).fill(email);
  await page.getByLabel(/Mot de passe/i).fill(PASSWORD);
  await page.getByRole('button', { name: /^Se connecter$/i }).click();
  await page.waitForURL(/\/tableau-de-bord/);
}

/**
 * Walks the onboarding questionnaire, choosing the first option on each step.
 *
 * Answers before advancing: clicking "finish" without choosing leaves the
 * wizard on a validation error, which is correct behaviour and not something
 * the helper should stumble into.
 */
export async function completeOnboarding(page: Page): Promise<void> {
  await page.goto('/bienvenue');
  await expect(page.getByRole('heading', { name: /questions pour vous orienter/i })).toBeVisible();

  for (let step = 0; step < 20; step += 1) {
    const firstChoice = page.locator('input[type="radio"], input[type="checkbox"]').first();
    if (await firstChoice.isVisible().catch(() => false)) {
      await firstChoice.check();
    }

    const finish = page.getByRole('button', { name: /Voir ma recommandation/i });
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
      break;
    }

    const next = page.getByRole('button', { name: /^Suivant$/i });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    } else {
      break;
    }
  }

  await page.waitForURL(/\/recommandation/, { timeout: 20_000 });
}

/**
 * Expands a `<details>` only when it is closed.
 *
 * The current stage renders already open, so an unconditional click on the
 * summary would collapse it and hide everything the test is looking for.
 */
export async function ensureOpen(details: Locator): Promise<void> {
  const isOpen = await details.evaluate((node) => (node as HTMLDetailsElement).open);
  if (!isOpen) await details.locator('summary').click();
}

/** The mining example is the richest advert — it exercises every extractor. */
export async function pasteExampleJob(page: Page): Promise<void> {
  await page.goto('/preparation-emploi/analyser');
  await page.getByRole('button', { name: /Support minier/i }).click();
  await page.getByRole('button', { name: /Analyser cette offre/i }).click();
}

/** Ensures the account has a started roadmap, so plan/progress pages have data. */
export async function ensureRoadmapStarted(page: Page): Promise<void> {
  await page.goto('/tableau-de-bord');
  const noRoadmap = page.getByRole('link', { name: /Découvrir mon parcours/i });
  if (await noRoadmap.isVisible().catch(() => false)) {
    await completeOnboarding(page);
    await page.getByRole('button', { name: /Commencer ce parcours/i }).click();
    await page.waitForURL(/\/tableau-de-bord/, { timeout: 20_000 });
  }
}
