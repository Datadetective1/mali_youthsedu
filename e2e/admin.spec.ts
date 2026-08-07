import { expect, test } from '@playwright/test';
import { ADMIN_STATE, JOURNEY_STATE, ensureOpen } from './helpers';

/**
 * Flows 13 & 14 — admin content editing, and the guarantee that nobody else can
 * reach any of it.
 *
 * `ADMIN_EMAILS=admin@example.org` is set by the Playwright web server config,
 * so that address is an administrator and every other address is not.
 */

test.describe('Admin access control', () => {
  test.describe('anonymous visitor', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('14 — is sent to sign in, never into the admin area', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForURL(/\/connexion/);
      await expect(page).toHaveURL(/suivant=%2Fadmin/);
    });

    test('14 — cannot reach an admin sub-page either', async ({ page }) => {
      await page.goto('/admin/ressources');
      await page.waitForURL(/\/connexion/);
    });
  });

  test.describe('signed-in non-admin', () => {
    test.use({ storageState: JOURNEY_STATE });

    test('14b — is refused', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForURL(/\/acces-refuse/);
      await expect(page.getByText(/réservée aux administrateurs/i)).toBeVisible();
    });

    test('14c — is refused on every admin sub-page', async ({ page }) => {
      for (const route of ['/admin/ressources', '/admin/parcours', '/admin/statistiques']) {
        await page.goto(route);
        await page.waitForURL(/\/acces-refuse/);
      }
    });

    test('14d — public content is unaffected by the refusal', async ({ page }) => {
      await page.goto('/ressources');
      await expect(page.getByText(/À vérifier avant publication/i).first()).toBeVisible();
    });
  });
});

test.describe('Admin content management', () => {
  test.describe.configure({ mode: 'serial' });
  test.use({ storageState: ADMIN_STATE });

  test('13 — an admin can open the admin area', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Administration', level: 1 })).toBeVisible();
    await expect(page.getByText(/Qualité des liens/i)).toBeVisible();
  });

  test('13b — an admin can edit a resource, and the original stays recoverable', async ({
    page,
  }) => {
    await page.goto('/admin/ressources');

    const firstResource = page.locator('details').first();
    await ensureOpen(firstResource);

    await firstResource
      .getByLabel(/Remarques qualité/i)
      .fill('Contrôlé pendant le test automatisé.');
    await firstResource.getByRole('button', { name: /^Enregistrer$/i }).click();

    await expect(firstResource.getByText(/Ressource mise à jour/i)).toBeVisible();

    // Edits are an overlay, never a destructive write.
    await expect(
      firstResource.getByRole('button', { name: /Rétablir le contenu d’origine/i }),
    ).toBeVisible();
  });

  test('13c — an admin can edit a pathway', async ({ page }) => {
    await page.goto('/admin/parcours');

    const firstPath = page.locator('details').first();
    await ensureOpen(firstPath);
    await firstPath.getByLabel(/^Résumé$/i).fill('Résumé modifié par le test.');
    await firstPath.getByRole('button', { name: /^Enregistrer$/i }).click();

    await expect(firstPath.getByText(/Parcours mis à jour/i)).toBeVisible();
  });

  test('the metrics page exposes counters only, never individual users', async ({ page }) => {
    await page.goto('/admin/statistiques');

    await expect(page.getByText(/Uniquement des compteurs agrégés/i)).toBeVisible();
    // No email address may appear anywhere on this page.
    await expect(page.locator('main').getByText(/@example\.org/)).toHaveCount(0);
  });

  test('feedback is readable by an admin and carries a privacy notice', async ({ page }) => {
    await page.goto('/admin/retours');
    await expect(page.getByRole('heading', { name: /Retours des utilisateurs/i })).toBeVisible();
    await expect(page.getByText(/Nous ne conservons que votre message/i)).toBeVisible();
  });
});
