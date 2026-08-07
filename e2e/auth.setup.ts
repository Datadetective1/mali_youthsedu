import { test as setup } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  ADMIN_EMAIL,
  ADMIN_STATE,
  JOURNEY_STATE,
  OFFLINE_STATE,
  signUp,
  signUpOrSignIn,
  uniqueEmail,
} from './helpers';

/**
 * Creates the accounts the suite needs and saves their signed-in state once.
 *
 * Every later test reuses the stored cookie instead of signing in again. That
 * is faster, but the real reason is correctness: the app rate-limits sign-in to
 * ten attempts per address per ten minutes, and a suite that logs in before
 * every assertion trips that limit and reports a product bug that is not one.
 */

async function persist(email: string, file: string) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file.replace(/\.json$/, '.email.txt'), email, 'utf8');
}

setup('create the journey account', async ({ page }) => {
  const email = uniqueEmail('journey');
  await signUp(page, email, 'Awa');
  await page.context().storageState({ path: JOURNEY_STATE });
  await persist(email, JOURNEY_STATE);
});

setup('create the offline account', async ({ page }) => {
  const email = uniqueEmail('offline');
  await signUp(page, email, 'Ibrahim');
  await page.context().storageState({ path: OFFLINE_STATE });
  await persist(email, OFFLINE_STATE);
});

setup('create or reuse the administrator account', async ({ page }) => {
  // Matches ADMIN_EMAILS in the Playwright web server environment.
  //
  // The address is fixed rather than random, so it survives in the local data
  // store between runs. Falling back to sign-in keeps the suite re-runnable
  // without wiping .data first — a suite that only passes on a clean database
  // is a suite people stop running.
  await signUpOrSignIn(page, ADMIN_EMAIL, 'Admin');

  await page.context().storageState({ path: ADMIN_STATE });
  await persist(ADMIN_EMAIL, ADMIN_STATE);
});
