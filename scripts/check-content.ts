/**
 * Pre-publication content report.
 *
 * Prints what still needs a human before this can go in front of users —
 * principally which links nobody has opened yet. Exits non-zero when
 * `--strict` is passed, so it can gate a public launch in CI without blocking
 * ordinary development builds.
 *
 * Usage:
 *   npm run content:check
 *   npm run content:check -- --strict
 */
import { careerPaths } from '../src/content/paths';
import { practicalProjects } from '../src/content/projects';
import { resources } from '../src/content/resources';
import { interviewQuestions } from '../src/content/interview-questions';
import { fr } from '../src/lib/i18n/dictionaries/fr';
import { en } from '../src/lib/i18n/dictionaries/en';
import { bm } from '../src/lib/i18n/dictionaries/bm';

function countStrings(value: unknown): number {
  if (typeof value === 'string') return 1;
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return 0;
  return Object.values(value).reduce<number>((sum, child) => sum + countStrings(child), 0);
}

function main() {
  const strict = process.argv.includes('--strict');
  let blocking = 0;

  console.log('=== Rapport de contenu ===\n');

  // --- Link verification --------------------------------------------------
  const pending = resources.filter((r) => r.verification === 'pending' && !r.archived);
  const broken = resources.filter((r) => r.verification === 'broken' && !r.archived);
  const verified = resources.filter((r) => r.verification === 'verified' && !r.archived);

  console.log('Liens externes');
  console.log(`  verifies manuellement : ${verified.length}`);
  console.log(`  a verifier            : ${pending.length}`);
  console.log(`  signales inaccessibles: ${broken.length}`);

  if (pending.length > 0) {
    blocking += pending.length;
    console.log('\n  A VERIFIER AVANT PUBLICATION :');
    for (const resource of pending) {
      console.log(`    - [${resource.id}] ${resource.provider} — ${resource.url}`);
    }
  }

  // A resource claiming verification with no date is a data-integrity problem,
  // not a to-do.
  const undated = resources.filter((r) => r.verification === 'verified' && !r.lastReviewed);
  if (undated.length > 0) {
    blocking += undated.length;
    console.log('\n  INCOHERENT : verifie sans date de verification');
    for (const resource of undated) console.log(`    - ${resource.id}`);
  }

  // --- Translation coverage ----------------------------------------------
  const total = countStrings(fr);
  console.log('\nCouverture des traductions');
  console.log(`  fr : ${total} chaines (reference)`);
  console.log(
    `  en : ${countStrings(en)} chaines (${Math.round((countStrings(en) / total) * 100)} %)`,
  );
  console.log(
    `  bm : ${countStrings(bm)} chaines (${Math.round((countStrings(bm) / total) * 100)} %)`,
  );
  console.log('  Les cles absentes retombent sur le francais — aucune chaine vide n’est affichee.');

  // --- Volume -------------------------------------------------------------
  const stages = careerPaths.reduce((sum, path) => sum + path.stages.length, 0);
  const items = careerPaths.reduce(
    (sum, path) => sum + path.stages.reduce((inner, stage) => inner + stage.items.length, 0),
    0,
  );

  console.log('\nVolume');
  console.log(`  parcours : ${careerPaths.length}`);
  console.log(`  etapes   : ${stages}`);
  console.log(`  taches   : ${items}`);
  console.log(`  projets  : ${practicalProjects.length}`);
  console.log(`  questions: ${interviewQuestions.length}`);

  // --- Regulatory notices -------------------------------------------------
  /*
   * A caution is required on paths *about* a regulated sector, identified by
   * their primary sector — not on every path that happens to teach some of its
   * vocabulary. The English path covers mining terminology; it does not claim
   * to prepare anyone for a regulated mining role, and warning about
   * certification there would be noise that trains people to ignore the notice
   * where it actually matters.
   */
  const regulated = careerPaths.filter((path) => path.sectorIds[0] === 'mines');
  const missingCaution = regulated.filter((path) => !path.caution);
  console.log('\nAvertissements reglementaires');
  if (missingCaution.length === 0) {
    console.log(
      `  OK : les ${regulated.length} parcours dont le secteur principal est reglemente portent un avertissement.`,
    );
  } else {
    blocking += missingCaution.length;
    for (const path of missingCaution) {
      console.log(`  MANQUANT : ${path.slug} n’a pas d’avertissement.`);
    }
  }

  console.log('');
  if (blocking > 0) {
    console.log(`${blocking} point(s) a traiter avant une mise en ligne publique.`);
    if (strict) process.exit(1);
  } else {
    console.log('Aucun point bloquant.');
  }
}

main();
