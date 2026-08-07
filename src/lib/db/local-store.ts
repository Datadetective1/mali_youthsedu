import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dataConfig } from '@/config';
import {
  matchesFilter,
  sortRows,
  type Filter,
  type ListOptions,
  type Row,
  type Store,
  type TableName,
} from './store';

/**
 * Development-only JSON-file store.
 *
 * WHY THIS EXISTS: Supabase credentials are an external dependency. Without
 * this, a developer cloning the repository cannot run, test, or demonstrate the
 * application at all. With it, `npm run dev` works immediately and the whole
 * Playwright suite runs in CI with no secrets.
 *
 * WHAT IT IS NOT: a production database. There is no concurrency control beyond
 * an in-process lock, no durability guarantee beyond an atomic rename, and no
 * row-level security — the process has full access to the file. `productionConfigIssues()`
 * in `src/config` refuses to let it pass silently into a production build, and
 * the UI shows a development banner while it is active.
 */

interface LocalAccount {
  userId: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

interface LocalDatabase {
  version: number;
  accounts: LocalAccount[];
  tables: Partial<Record<TableName, Row[]>>;
}

const EMPTY_DATABASE: LocalDatabase = { version: 1, accounts: [], tables: {} };

function filePath(): string {
  return path.resolve(process.cwd(), dataConfig.localDir, 'db.json');
}

/**
 * Serialises all reads and writes within this process. Node is single-threaded
 * per worker, but `await` between read and write would otherwise interleave two
 * mutations and lose one.
 */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = queue.then(operation, operation);
  // Keep the chain alive even if an operation rejects.
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function readDatabase(): Promise<LocalDatabase> {
  try {
    const contents = await fs.readFile(filePath(), 'utf8');
    const parsed = JSON.parse(contents) as LocalDatabase;
    return { ...EMPTY_DATABASE, ...parsed, tables: parsed.tables ?? {} };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return structuredClone(EMPTY_DATABASE);
    }
    throw error;
  }
}

async function writeDatabase(database: LocalDatabase): Promise<void> {
  const target = filePath();
  await fs.mkdir(path.dirname(target), { recursive: true });
  // Write-then-rename: a crash mid-write leaves the previous file intact
  // rather than a truncated one.
  const temporary = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(database, null, 2), 'utf8');
  await fs.rename(temporary, target);
}

function timestamps(row: Row, isInsert: boolean): Row {
  const now = new Date().toISOString();
  const next: Row = { ...row };
  if (isInsert && next.created_at === undefined) next.created_at = now;
  next.updated_at = now;
  return next;
}

export class LocalStore implements Store {
  readonly name = 'local' as const;

  async list(table: TableName, filter?: Filter, options?: ListOptions): Promise<Row[]> {
    const database = await withLock(readDatabase);
    const rows = (database.tables[table] ?? []).filter((row) => matchesFilter(row, filter));
    const sorted = sortRows(rows, options);
    return options?.limit ? sorted.slice(0, options.limit) : sorted;
  }

  async getOne(table: TableName, filter: Filter): Promise<Row | null> {
    const rows = await this.list(table, filter, { limit: 1 });
    return rows[0] ?? null;
  }

  async insert(table: TableName, row: Row): Promise<Row> {
    return withLock(async () => {
      const database = await readDatabase();
      const rows = database.tables[table] ?? [];
      const inserted = timestamps({ id: randomUUID(), ...row }, true);
      rows.push(inserted);
      database.tables[table] = rows;
      await writeDatabase(database);
      return inserted;
    });
  }

  async upsert(table: TableName, row: Row, onConflict: string[]): Promise<Row> {
    return withLock(async () => {
      const database = await readDatabase();
      const rows = database.tables[table] ?? [];

      const conflictFilter: Filter = {};
      for (const column of onConflict) {
        conflictFilter[column] = row[column] as Filter[string];
      }

      const index = rows.findIndex((candidate) => matchesFilter(candidate, conflictFilter));
      let result: Row;
      if (index >= 0) {
        const existing = rows[index] ?? {};
        result = timestamps({ ...existing, ...row, id: existing.id }, false);
        rows[index] = result;
      } else {
        result = timestamps({ id: randomUUID(), ...row }, true);
        rows.push(result);
      }

      database.tables[table] = rows;
      await writeDatabase(database);
      return result;
    });
  }

  async update(table: TableName, filter: Filter, patch: Row): Promise<Row[]> {
    return withLock(async () => {
      const database = await readDatabase();
      const rows = database.tables[table] ?? [];
      const updated: Row[] = [];

      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        if (!row || !matchesFilter(row, filter)) continue;
        const next = timestamps({ ...row, ...patch, id: row.id }, false);
        rows[index] = next;
        updated.push(next);
      }

      database.tables[table] = rows;
      await writeDatabase(database);
      return updated;
    });
  }

  async remove(table: TableName, filter: Filter): Promise<number> {
    return withLock(async () => {
      const database = await readDatabase();
      const rows = database.tables[table] ?? [];
      const kept = rows.filter((row) => !matchesFilter(row, filter));
      const removed = rows.length - kept.length;
      database.tables[table] = kept;
      await writeDatabase(database);
      return removed;
    });
  }

  async incrementCounter(event: string): Promise<void> {
    await withLock(async () => {
      const database = await readDatabase();
      const rows = database.tables.metric_counters ?? [];
      const existing = rows.find((row) => row.event === event);
      if (existing) {
        existing.count = Number(existing.count ?? 0) + 1;
        existing.updated_at = new Date().toISOString();
      } else {
        rows.push({ event, count: 1, updated_at: new Date().toISOString() });
      }
      database.tables.metric_counters = rows;
      await writeDatabase(database);
    });
  }

  // ---------------------------------------------------------------------------
  // Local-only account handling. Supabase provides this natively; here we must.
  // ---------------------------------------------------------------------------

  async findAccountByEmail(email: string): Promise<LocalAccount | null> {
    const database = await withLock(readDatabase);
    const normalized = email.trim().toLowerCase();
    return database.accounts.find((account) => account.email === normalized) ?? null;
  }

  async findAccountByUserId(userId: string): Promise<LocalAccount | null> {
    const database = await withLock(readDatabase);
    return database.accounts.find((account) => account.userId === userId) ?? null;
  }

  async createAccount(account: LocalAccount): Promise<void> {
    await withLock(async () => {
      const database = await readDatabase();
      if (database.accounts.some((candidate) => candidate.email === account.email)) {
        throw new Error('EMAIL_TAKEN');
      }
      database.accounts.push(account);
      await writeDatabase(database);
    });
  }

  async deleteAccount(userId: string): Promise<void> {
    await withLock(async () => {
      const database = await readDatabase();
      database.accounts = database.accounts.filter((account) => account.userId !== userId);

      // Cascade by hand — there are no foreign keys in a JSON file.
      for (const [table, rows] of Object.entries(database.tables)) {
        database.tables[table as TableName] = (rows ?? []).filter(
          (row) => row.user_id !== userId && row.id !== userId,
        );
      }

      await writeDatabase(database);
    });
  }

  /** Used by `npm run db:reset`. */
  async reset(): Promise<void> {
    await withLock(async () => {
      await writeDatabase(structuredClone(EMPTY_DATABASE));
    });
  }
}

let instance: LocalStore | null = null;

export function localStore(): LocalStore {
  instance ??= new LocalStore();
  return instance;
}
