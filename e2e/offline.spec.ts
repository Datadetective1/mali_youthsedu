import { expect, test } from '@playwright/test';
import { OFFLINE_STATE, ensureOpen, ensureRoadmapStarted } from './helpers';

/**
 * Flow 12 — offline behaviour.
 *
 * `context.setOffline` cuts the network at the browser level, so these tests
 * exercise the real code path rather than a mocked flag.
 */
test.describe.configure({ mode: 'serial' });
test.use({ storageState: OFFLINE_STATE });

test.describe('Offline behaviour', () => {
  test('sets up a roadmap for the offline account', async ({ page }) => {
    await ensureRoadmapStarted(page);
    await expect(page.getByText(/Parcours en cours/i)).toBeVisible();
  });

  test('shows an offline banner when the connection drops', async ({ page, context }) => {
    await page.goto('/mon-parcours');

    await context.setOffline(true);
    // The banner listens to the browser's own online/offline events.
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    await expect(page.getByText(/Vous êtes hors ligne/i)).toBeVisible();

    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
  });

  test('queues a completion made offline and replays it on reconnect', async ({
    page,
    context,
  }) => {
    await page.goto('/mon-parcours');

    const stage = page.locator('details').first();
    await ensureOpen(stage);

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // Target a real roadmap task: the stage self-check list also renders
    // checkboxes, but those are local-only and never call the server.
    const checkbox = stage
      .locator('section[aria-label="Tâches de l’étape"] input[type="checkbox"]')
      .last();
    await checkbox.check();

    // Optimistic: the tick lands immediately even with no network.
    await expect(checkbox).toBeChecked();

    // And it is durably queued rather than lost.
    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('myp_sync_queue_v1')), {
        timeout: 10_000,
      })
      .toBeTruthy();

    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));

    // The banner drives auto-sync; the queue should drain on its own.
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const raw = window.localStorage.getItem('myp_sync_queue_v1');
            return raw ? (JSON.parse(raw) as unknown[]).length : 0;
          }),
        { timeout: 20_000 },
      )
      .toBe(0);
  });

  test('the offline fallback page renders without any data access', async ({ page }) => {
    await page.goto('/hors-ligne');
    await expect(page.getByText(/Vous êtes hors ligne/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /contenu hors ligne/i })).toBeVisible();
  });

  test('the manifest is served and describes an installable app', async ({ page }) => {
    const response = await page.request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    expect(manifest.start_url).toBeTruthy();
  });

  test('the service worker is served and never cached by intermediaries', async ({ page }) => {
    const response = await page.request.get('/sw.js');
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('must-revalidate');
  });

  test('saved content page reports what is stored on the device', async ({ page }) => {
    await page.goto('/enregistre');
    await expect(page.getByRole('heading', { name: /Contenu enregistré/i })).toBeVisible();
  });
});
