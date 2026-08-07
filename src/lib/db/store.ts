/**
 * Storage primitive shared by both drivers.
 *
 * The domain repository is written once against this interface, so the Supabase
 * driver and the local development driver cannot drift apart in behaviour —
 * which is exactly how a "dev fallback" normally turns into a liability.
 *
 * Column names are the PostgreSQL ones (snake_case). Mapping to domain types
 * happens in `repository.ts`, in one place.
 */

export type TableName =
  | 'profiles'
  | 'user_preferences'
  | 'onboarding_responses'
  | 'profile_skill_assessments'
  | 'user_roadmaps'
  | 'user_progress'
  | 'user_notes'
  | 'saved_resources'
  | 'weekly_plans'
  | 'weekly_tasks'
  | 'user_projects'
  | 'portfolio_entries'
  | 'job_descriptions'
  | 'job_requirements'
  | 'job_analyses'
  | 'skill_gaps'
  | 'value_propositions'
  | 'interview_practice_answers'
  | 'star_examples'
  | 'confidence_work'
  | 'cv_profiles'
  | 'checklist_states'
  | 'employer_research'
  | 'feedback'
  | 'metric_counters'
  | 'content_overrides'
  | 'content_reviews';

export type Row = Record<string, unknown>;

/** Equality filter. `null` matches SQL `IS NULL`. */
export type Filter = Record<string, string | number | boolean | null | undefined>;

export interface ListOptions {
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export interface Store {
  readonly name: 'local' | 'supabase';
  list(table: TableName, filter?: Filter, options?: ListOptions): Promise<Row[]>;
  getOne(table: TableName, filter: Filter): Promise<Row | null>;
  insert(table: TableName, row: Row): Promise<Row>;
  /** Insert or replace, matched on the given columns. */
  upsert(table: TableName, row: Row, onConflict: string[]): Promise<Row>;
  update(table: TableName, filter: Filter, patch: Row): Promise<Row[]>;
  remove(table: TableName, filter: Filter): Promise<number>;
  /** Atomically add one to a counter row. */
  incrementCounter(event: string): Promise<void>;
}

/** True when every defined key in `filter` equals the row's value. */
export function matchesFilter(row: Row, filter: Filter | undefined): boolean {
  if (!filter) return true;
  for (const [column, expected] of Object.entries(filter)) {
    if (expected === undefined) continue;
    const actual = row[column] ?? null;
    if (expected === null) {
      if (actual !== null) return false;
    } else if (actual !== expected) {
      return false;
    }
  }
  return true;
}

export function sortRows(rows: Row[], options: ListOptions | undefined): Row[] {
  if (!options?.orderBy) return rows;
  const { column, ascending = true } = options.orderBy;
  const direction = ascending ? 1 : -1;

  return rows.slice().sort((a, b) => {
    const left = a[column];
    const right = b[column];
    if (left === right) return 0;
    // Nulls last regardless of direction — an unfinished item should not jump
    // to the top of a "most recently completed" list.
    if (left === null || left === undefined) return 1;
    if (right === null || right === undefined) return -1;
    return (left < right ? -1 : 1) * direction;
  });
}
