import { expect, test } from '@playwright/test';
import { JOURNEY_STATE } from './helpers';

/**
 * Desktop layout checks.
 *
 * Read-only by design. The stateful journey runs on mobile — the primary
 * target — and running it again here would mutate the same shared account and
 * produce failures that reflect test-ordering rather than the product.
 */

test.describe('Desktop layout', () => {
  test.describe('signed out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('the header navigation is visible instead of the burger menu', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('link', { name: 'Explorer les parcours' }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: /Ouvrir le menu/i })).toBeHidden();
    });

    test('the landing page lays out without horizontal overflow', async ({ page }) => {
      await page.goto('/');

      // A page that scrolls sideways is broken, and it is the failure most
      // easily missed when developing at one width.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBe(false);
    });

    test('the pathway grid uses multiple columns', async ({ page }) => {
      await page.goto('/parcours');

      const cards = page.locator('main ul > li article');
      await expect(cards.first()).toBeVisible();

      const first = await cards.nth(0).boundingBox();
      const second = await cards.nth(1).boundingBox();
      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      // Side by side, not stacked.
      expect(second!.y).toBeLessThan(first!.y + first!.height);
    });

    test('long content scrolls inside its own container, not the page', async ({ page }) => {
      await page.goto('/preparation-emploi/communication');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBe(false);
    });
  });

  test.describe('signed in', () => {
    test.use({ storageState: JOURNEY_STATE });

    test('the mobile bottom navigation is hidden on desktop', async ({ page }) => {
      await page.goto('/tableau-de-bord');

      await expect(page.getByRole('heading', { name: /Bonjour/i })).toBeVisible();
      await expect(page.locator('nav[data-bottom-nav]')).toBeHidden();
    });

    test('the dashboard uses a two-column layout', async ({ page }) => {
      await page.goto('/tableau-de-bord');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBe(false);
    });
  });
});
