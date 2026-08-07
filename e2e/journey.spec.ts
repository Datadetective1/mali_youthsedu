import { expect, test } from '@playwright/test';
import { JOURNEY_STATE, completeOnboarding, ensureOpen, pasteExampleJob } from './helpers';

/**
 * Flows 2-12 — the full authenticated journey.
 *
 * Serial, because these steps genuinely depend on each other: you cannot
 * complete a task before starting a roadmap. The account is created once by
 * `auth.setup.ts`; every test here reuses its session.
 */
test.describe.configure({ mode: 'serial' });
test.use({ storageState: JOURNEY_STATE });

test.describe('Authenticated journey', () => {
  test('2 — the account exists and the app recognises the session', async ({ page }) => {
    await page.goto('/tableau-de-bord');
    await expect(page.getByRole('heading', { name: /Bonjour/i })).toBeVisible();
  });

  test('3 & 4 — completes onboarding and receives an explained recommendation', async ({ page }) => {
    await completeOnboarding(page);

    await expect(
      page.getByRole('heading', { name: /parcours que nous vous recommandons/i }),
    ).toBeVisible();

    // The recommendation must explain itself — that is the point of using
    // transparent rules rather than a model.
    await expect(page.getByRole('heading', { name: /Pourquoi ce parcours/i })).toBeVisible();
  });

  test('5 — starts the recommended roadmap', async ({ page }) => {
    await page.goto('/recommandation');
    await page.getByRole('button', { name: /Commencer ce parcours/i }).click();

    await page.waitForURL(/\/tableau-de-bord/, { timeout: 20_000 });
    await expect(page.getByText(/Parcours en cours/i)).toBeVisible();
  });

  test('6 — completes a task, and it survives a reload', async ({ page }) => {
    await page.goto('/mon-parcours');

    const firstStage = page.locator('details').first();
    await ensureOpen(firstStage);

    const checkbox = firstStage
      .locator('section[aria-label="Tâches de l’étape"] input[type="checkbox"]')
      .first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await page.reload();
    await ensureOpen(page.locator('details').first());
    await expect(
      page
        .locator('details')
        .first()
        .locator('section[aria-label="Tâches de l’étape"] input[type="checkbox"]')
        .first(),
    ).toBeChecked();
  });

  test('7 — views a weekly plan with a realistic workload', async ({ page }) => {
    await page.goto('/plan-semaine');

    await expect(page.getByRole('heading', { name: /Plan de la semaine/i })).toBeVisible();
    await expect(page.getByText(/Objectif de la semaine/i)).toBeVisible();

    const tasks = page.locator('section[aria-labelledby^="jour-"] li');
    expect(await tasks.count()).toBeGreaterThanOrEqual(3);
  });

  test('7b — a weekly task can be ticked and moved to another day', async ({ page }) => {
    await page.goto('/plan-semaine');

    const firstTask = page.locator('section[aria-labelledby^="jour-"] li').first();
    await firstTask.getByRole('button', { name: /Terminer/i }).click();
    await expect(firstTask.getByRole('button', { name: /Annuler/i })).toBeVisible();

    await firstTask.locator('select').selectOption('3');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Jeudi' })).toBeVisible();
  });

  test('8 & 9 — pastes a job description and receives an analysis', async ({ page }) => {
    await pasteExampleJob(page);

    await expect(page.getByRole('heading', { name: /Ce que demande l’offre/i })).toBeVisible();
    await expect(page.getByText('Microsoft Excel').first()).toBeVisible();
    await expect(page.getByText('Anglais').first()).toBeVisible();

    // The readiness index must never appear without its disclaimer.
    await expect(page.getByRole('heading', { name: /Indice de préparation/i })).toBeVisible();
    await expect(page.getByText(/ne prédit pas et ne garantit pas un recrutement/i)).toBeVisible();
  });

  test('9b — the analysis separates matches from real gaps', async ({ page }) => {
    await pasteExampleJob(page);

    await expect(page.getByRole('heading', { name: /Votre profil face à l’offre/i })).toBeVisible();
    await expect(
      page.getByText(/Exigences non couvertes|Correspondances partielles/i).first(),
    ).toBeVisible();
  });

  test('9c — gaps are aggregated across analyses', async ({ page }) => {
    await page.goto('/preparation-emploi/ecarts');
    await expect(page.getByRole('heading', { name: /Mes écarts de compétences/i })).toBeVisible();
  });

  test('10 — builds a value proposition from the user’s own words only', async ({ page }) => {
    await page.goto('/preparation-emploi/valeur');

    await page
      .getByLabel(/Quel problème savez-vous aider à résoudre/i)
      .fill('aider un commerce à retrouver ses anciens clients');
    await page
      .getByLabel(/Quelles compétences mobilisez-vous/i)
      .fill('la prospection et le suivi client');
    await page.getByLabel(/Qu’est-ce qui le démontre/i).fill('la boutique de mon oncle');

    await page.getByRole('button', { name: /Générer mes formulations/i }).click();

    await expect(page.getByRole('heading', { name: /Vos formulations/i })).toBeVisible();
    await expect(page.getByText(/prospection/i).first()).toBeVisible();

    // Nothing invented: no figure the user never supplied.
    const pitch = await page.locator('main').innerText();
    expect(pitch).not.toMatch(/\b\d+\s*ans d’expérience/);
  });

  test('11 — saves work on a practical project', async ({ page }) => {
    await page.goto('/projets/tableau-suivi-depenses');

    await page.getByLabel(/Mon travail/i).fill('J’ai construit le tableau avec 32 mouvements réels.');
    await page.getByRole('button', { name: /^Enregistrer$/i }).first().click();

    // Wait for the save to be acknowledged before reloading, otherwise the
    // reload can race the in-flight request.
    await expect(page.getByRole('status').filter({ hasText: /Enregistré/i })).toBeVisible();

    await page.reload();
    await expect(page.getByLabel(/Mon travail/i)).toHaveValue(/32 mouvements/);
  });

  test('11b — a project cannot be completed before its checklist is done', async ({ page }) => {
    await page.goto('/projets/tableau-suivi-depenses');

    const markDone = page.getByRole('button', { name: /Marquer ce projet comme terminé/i });
    await expect(markDone).toBeDisabled();

    const boxes = page.locator('input[type="checkbox"]');
    const count = await boxes.count();
    for (let index = 0; index < count; index += 1) {
      await boxes.nth(index).check();
    }
    await expect(markDone).toBeEnabled();
  });

  test('12 — saved content lists the resources the user kept', async ({ page }) => {
    await page.goto('/ressources');
    await page.getByRole('button', { name: /^Enregistrer$/i }).first().click();

    await page.goto('/enregistre');
    await expect(page.getByRole('heading', { name: /Contenu enregistré/i })).toBeVisible();
  });

  test('interview answers persist', async ({ page }) => {
    await page.goto('/preparation-emploi/entretien');

    await page.getByRole('tab', { name: 'Questions', exact: true }).click();
    const firstQuestion = page.locator('details').first();
    await ensureOpen(firstQuestion);

    await firstQuestion
      .getByLabel(/Ma réponse/i)
      .fill('Je suis assistant commercial depuis deux ans.');
    await firstQuestion.getByRole('button', { name: /^Enregistrer$/i }).click();

    await page.reload();
    await page.getByRole('tab', { name: 'Questions', exact: true }).click();
    await ensureOpen(page.locator('details').first());
    await expect(page.locator('details').first().getByLabel(/Ma réponse/i)).toHaveValue(
      /assistant commercial/,
    );
  });

  test('the application checklist survives a reload', async ({ page }) => {
    await page.goto('/preparation-emploi/checklist');

    await page.locator('input[type="checkbox"]').first().check();

    // Wait for the save confirmation before reloading; the checklist persists
    // silently, so without this the reload can outrun the request.
    await expect(page.getByRole('status').filter({ hasText: 'Enregistré' })).toBeVisible();

    await page.reload();
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
  });

  test('the user can export their own data', async ({ page }) => {
    await page.goto('/profil');

    /*
     * Exercised through the real download link rather than `page.request`.
     * The session cookie is `Secure` (correct in production), and Playwright's
     * API request context does not apply the browser's localhost exception for
     * Secure cookies — so a direct API call would 401 and report a bug that
     * does not exist. Clicking the link is also what a user actually does.
     */
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: /Télécharger mes données/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^mes-donnees-\d{4}-\d{2}-\d{2}\.json$/);

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

    expect(body).toHaveProperty('profile');
    expect(body).toHaveProperty('progress');
    expect(body).toHaveProperty('jobAnalyses');
    // The export must be complete enough to be worth calling an export.
    expect(Object.keys(body).length).toBeGreaterThan(10);
  });
});
