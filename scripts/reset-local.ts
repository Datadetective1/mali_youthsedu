/**
 * Wipes the local development store (`.data/db.json`).
 *
 * Only touches the JSON file used by the local driver — it can never reach a
 * Supabase database, and refuses to run if the Supabase driver is selected.
 */
import { rm } from 'node:fs/promises';
import path from 'node:path';

async function main() {
  if (process.env.DATA_DRIVER === 'supabase') {
    console.error(
      'Refus : DATA_DRIVER=supabase. Ce script ne supprime que le magasin local de developpement.',
    );
    process.exit(1);
  }

  const directory = path.resolve(process.cwd(), process.env.LOCAL_DATA_DIR || '.data');
  await rm(directory, { recursive: true, force: true });
  console.log(`Magasin local supprime : ${directory}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
