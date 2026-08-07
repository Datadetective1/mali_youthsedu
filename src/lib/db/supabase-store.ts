import { createServerClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseConfig } from '@/config';
import type { Filter, ListOptions, Row, Store, TableName } from './store';

/**
 * Supabase-backed store.
 *
 * Every query goes through the request-scoped client carrying the user's
 * session cookie, so Row Level Security is the authority on what can be read
 * or written. The application never adds its own `where user_id = …` as the
 * primary defence — that is belt-and-braces on top of RLS, never instead of it.
 *
 * The service-role client is used only by scripts (migrations, seeding) and
 * never from a request path.
 */

export async function createRequestClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh happens in middleware, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses RLS entirely.
 * Scripts only — importing this into a request path would defeat the whole
 * security model.
 */
export function createServiceClient(): SupabaseClient {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY est requis pour cette operation (migration ou seed).',
    );
  }
  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function applyFilter<T extends { eq: (c: string, v: never) => T; is: (c: string, v: null) => T }>(
  query: T,
  filter: Filter | undefined,
): T {
  if (!filter) return query;
  let next = query;
  for (const [column, value] of Object.entries(filter)) {
    if (value === undefined) continue;
    next = value === null ? next.is(column, null) : next.eq(column, value as never);
  }
  return next;
}

export class SupabaseStore implements Store {
  readonly name = 'supabase' as const;

  constructor(private readonly client: SupabaseClient) {}

  async list(table: TableName, filter?: Filter, options?: ListOptions): Promise<Row[]> {
    let query = this.client.from(table).select('*');
    query = applyFilter(query, filter);

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
        nullsFirst: false,
      });
    }
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) throw new StoreError(table, 'list', error.message);
    return (data ?? []) as Row[];
  }

  async getOne(table: TableName, filter: Filter): Promise<Row | null> {
    const rows = await this.list(table, filter, { limit: 1 });
    return rows[0] ?? null;
  }

  async insert(table: TableName, row: Row): Promise<Row> {
    const { data, error } = await this.client.from(table).insert(row).select().single();
    if (error) throw new StoreError(table, 'insert', error.message);
    return data as Row;
  }

  async upsert(table: TableName, row: Row, onConflict: string[]): Promise<Row> {
    const { data, error } = await this.client
      .from(table)
      .upsert(row, { onConflict: onConflict.join(',') })
      .select()
      .single();
    if (error) throw new StoreError(table, 'upsert', error.message);
    return data as Row;
  }

  async update(table: TableName, filter: Filter, patch: Row): Promise<Row[]> {
    let query = this.client.from(table).update(patch);
    query = applyFilter(query, filter);
    const { data, error } = await query.select();
    if (error) throw new StoreError(table, 'update', error.message);
    return (data ?? []) as Row[];
  }

  async remove(table: TableName, filter: Filter): Promise<number> {
    let query = this.client.from(table).delete();
    query = applyFilter(query, filter);
    const { data, error } = await query.select();
    if (error) throw new StoreError(table, 'remove', error.message);
    return (data ?? []).length;
  }

  async incrementCounter(event: string): Promise<void> {
    // Goes through the SECURITY DEFINER function so clients can count without
    // being able to read or forge the totals.
    const { error } = await this.client.rpc('increment_metric', { metric_event: event });
    if (error) throw new StoreError('metric_counters', 'increment', error.message);
  }

  /** Escape hatch for the few RPCs the repository needs. */
  raw(): SupabaseClient {
    return this.client;
  }
}

export class StoreError extends Error {
  constructor(
    public readonly table: string,
    public readonly operation: string,
    message: string,
  ) {
    super(`[${table}.${operation}] ${message}`);
    this.name = 'StoreError';
  }
}
