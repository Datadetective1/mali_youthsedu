import { expect, test } from '@playwright/test';

/**
 * Flow 1 — a guest explores without an account.
 *
 * The brief is explicit that exploration must not require signing up, so these
 * tests deliberately never authenticate.
 */

test.describe('Guest exploration', () => {
  test('landing page states the mission and offers both calls to action', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Le talent est universel/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Découvrir mon parcours/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Explorer les parcours/i }).first()).toBeVisible();
  });

  test('landing page carries the no-guarantee commitment', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/ne garantit ni emploi/i)).toBeVisible();
  });

  test('guest can browse every pathway and open one', async ({ page }) => {
    await page.goto('/parcours');
    await expect(page.getByRole('heading', { name: 'Explorer les parcours' })).toBeVisible();

    const cards = page.locator('main ul > li article');
    await expect(cards).toHaveCount(8);

    await page.getByRole('link', { name: 'Commercial et vente' }).first().click();
    await page.waitForURL(/\/parcours\/commercial-vente/);
    await expect(page.getByRole('heading', { name: 'Commercial et vente', level: 1 })).toBeVisible();
    await expect(page.getByText(/Étapes/i).first()).toBeVisible();
  });

  test('mining pathway shows its regulatory warning', async ({ page }) => {
    await page.goto('/parcours/mines-support');
    await expect(page.getByText(/habilitations officielles|certifications/i).first()).toBeVisible();
  });

  test('resource library is browsable and labels unverified links', async ({ page }) => {
    await page.goto('/ressources');
    await expect(page.getByRole('heading', { name: /Bibliothèque de ressources/i })).toBeVisible();
    await expect(page.getByText(/À vérifier avant publication/i).first()).toBeVisible();
  });

  test('resource filters narrow the list', async ({ page }) => {
    await page.goto('/ressources');
    const before = await page.getByRole('status').first().textContent();

    await page.getByRole('button', { name: /Filtrer|Filtres/i }).click();
    await page.getByLabel('Langue').selectOption('fr');

    await expect(page.getByRole('status').first()).not.toHaveText(before ?? '');
  });

  test('guest sees an invitation to create an account, not a wall', async ({ page }) => {
    await page.goto('/parcours');
    await expect(page.getByText(/Vous explorez sans compte/i)).toBeVisible();
  });

  test('legal pages are reachable and honest about being drafts', async ({ page }) => {
    await page.goto('/confidentialite');
    await expect(page.getByText(/relu par un juriste/i)).toBeVisible();

    await page.goto('/conditions');
    await expect(page.getByText(/ne garantissons ni emploi/i)).toBeVisible();

    await page.goto('/accessibilite');
    await expect(page.getByRole('heading', { name: /Limites connues/i })).toBeVisible();
  });

  test('unknown routes render the not-found page', async ({ page }) => {
    const response = await page.goto('/cette-page-nexiste-pas');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/Page introuvable/i)).toBeVisible();
  });
});
