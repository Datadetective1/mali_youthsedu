/**
 * Applies the SQL migrations in `supabase/migrations` in filename order.
 *
 * Usage:
 *   SUPABASE_DB_URL="postgresql://…" npm run db:migrate
 *
 * Each file runs inside a transaction and is recorded in `schema_migrations`,
 * so re-running is safe and only new files are applied.
 *
 * If you use the Supabase CLI, `supabase db push` does the same thing; this
 * script exists so the project does not *require* the CLI to be installed.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'supabase/migrations');

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error(
      'SUPABASE_DB_URL est requis.\n' +
        'Tableau de bord Supabase > Project Settings > Database > Connection string > URI',
    );
    process.exit(1);
  }

  const files = (await readdir(MIGRATIONS_DIR)).filter((name) => name.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('Aucune migration trouvee.');
    return;
  }

  const client = new Client({
    connectionString,
    // Supabase requires TLS; its pooler presents a certificate that Node does
    // not chain by default.
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query(`
      create table if not exists public.schema_migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      );
    `);

    const { rows } = await client.query<{ name: string }>('select name from public.schema_migrations');
    const applied = new Set(rows.map((row) => row.name));

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`· ${file} (deja appliquee)`);
        continue;
      }

      const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`→ ${file}`);

      await client.query('begin');
      try {
        await client.query(sql);
        await client.query('insert into public.schema_migrations (name) values ($1)', [file]);
        await client.query('commit');
        count += 1;
      } catch (error) {
        await client.query('rollback');
        console.error(`\nEchec sur ${file} :`);
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
      }
    }

    console.log(`\n${count} migration(s) appliquee(s). Schema a jour.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
