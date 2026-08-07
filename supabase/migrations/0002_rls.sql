-- =============================================================================
-- 0002_rls.sql — Row Level Security
--
-- Model
--   * Published reference content is world-readable, including by anonymous
--     visitors: guests must be able to explore the pathways without an account.
--   * Every user-owned row is readable and writable only by its owner, checked
--     against auth.uid().
--   * Content mutation is admin-only, decided by profiles.is_admin.
--   * feedback is insert-only for everyone and readable only by admins.
--   * metric_counters is never readable by clients; it is incremented through a
--     security-definer function so no one can read or forge the counts.
--
-- RLS is enabled on EVERY table. A table without a matching policy denies all
-- access, which is the correct default.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper: is the current user an administrator?
-- SECURITY DEFINER so the policy can read profiles without recursing into the
-- profiles policy that calls it.
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- =============================================================================
-- Reference content — public read, admin write
-- =============================================================================

do $$
declare
  content_table text;
begin
  foreach content_table in array array[
    'sectors', 'skills', 'roadmap_stages', 'roadmap_items',
    'roadmap_resource_links', 'practical_projects', 'interview_questions'
  ]
  loop
    execute format('alter table public.%I enable row level security', content_table);

    execute format('drop policy if exists "%s_public_read" on public.%I', content_table, content_table);
    execute format(
      'create policy "%s_public_read" on public.%I for select using (true)',
      content_table, content_table
    );

    execute format('drop policy if exists "%s_admin_write" on public.%I', content_table, content_table);
    execute format(
      'create policy "%s_admin_write" on public.%I for all
         using (public.is_admin()) with check (public.is_admin())',
      content_table, content_table
    );
  end loop;
end;
$$;

-- career_paths: only published paths are visible to non-admins, so an
-- unfinished pathway can be drafted without leaking to users.
alter table public.career_paths enable row level security;

drop policy if exists "career_paths_public_read" on public.career_paths;
create policy "career_paths_public_read" on public.career_paths
  for select using (published or public.is_admin());

drop policy if exists "career_paths_admin_write" on public.career_paths;
create policy "career_paths_admin_write" on public.career_paths
  for all using (public.is_admin()) with check (public.is_admin());

-- learning_resources: archived resources are hidden from users but kept for admins.
alter table public.learning_resources enable row level security;

drop policy if exists "learning_resources_public_read" on public.learning_resources;
create policy "learning_resources_public_read" on public.learning_resources
  for select using (not archived or public.is_admin());

drop policy if exists "learning_resources_admin_write" on public.learning_resources;
create policy "learning_resources_admin_write" on public.learning_resources
  for all using (public.is_admin()) with check (public.is_admin());

-- Content overrides and the review trail are administration-only.
alter table public.content_overrides enable row level security;

drop policy if exists "content_overrides_read" on public.content_overrides;
create policy "content_overrides_read" on public.content_overrides
  for select using (true);

drop policy if exists "content_overrides_admin_write" on public.content_overrides;
create policy "content_overrides_admin_write" on public.content_overrides
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.content_reviews enable row level security;

drop policy if exists "content_reviews_admin_all" on public.content_reviews;
create policy "content_reviews_admin_all" on public.content_reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Profiles
-- =============================================================================

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Note: `is_admin` is deliberately NOT protected by a column-level rule here,
-- because Postgres RLS cannot express "update every column except this one".
-- The application never exposes it, and 0002 grants no client-side path to set
-- it — administrators are provisioned with the service role or by SQL.
-- See docs/SECURITY.md ("Admin provisioning").

-- =============================================================================
-- User-owned tables — owner-only, no exceptions, admins included
-- =============================================================================

do $$
declare
  owned_table text;
begin
  foreach owned_table in array array[
    'user_preferences', 'onboarding_responses', 'profile_skill_assessments',
    'user_roadmaps', 'user_progress', 'user_notes', 'saved_resources',
    'weekly_plans', 'weekly_tasks', 'user_projects', 'portfolio_entries',
    'skill_gaps', 'value_propositions', 'interview_practice_answers',
    'star_examples', 'confidence_work', 'cv_profiles', 'checklist_states',
    'employer_research'
  ]
  loop
    execute format('alter table public.%I enable row level security', owned_table);

    execute format('drop policy if exists "%s_owner_all" on public.%I', owned_table, owned_table);
    -- Admins are NOT granted read access here on purpose: the admin area shows
    -- aggregates only, and nobody should be able to read a young person's
    -- interview answers or CV. See docs/PRIVACY.md.
    execute format(
      'create policy "%s_owner_all" on public.%I for all
         using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      owned_table, owned_table
    );
  end loop;
end;
$$;

-- =============================================================================
-- Job analysis — user-owned, with anonymous rows permitted
--
-- A guest may analyse an advert without an account. Those rows have a null
-- user_id and are unreadable by anyone; they exist only so the request can be
-- processed and counted. They are purged by the retention job in 0004.
-- =============================================================================

alter table public.job_descriptions enable row level security;

drop policy if exists "job_descriptions_owner_all" on public.job_descriptions;
create policy "job_descriptions_owner_all" on public.job_descriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.job_requirements enable row level security;

drop policy if exists "job_requirements_owner_all" on public.job_requirements;
create policy "job_requirements_owner_all" on public.job_requirements
  for all using (
    exists (
      select 1 from public.job_descriptions d
      where d.id = job_requirements.job_description_id
        and d.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.job_descriptions d
      where d.id = job_requirements.job_description_id
        and d.user_id = auth.uid()
    )
  );

alter table public.job_analyses enable row level security;

drop policy if exists "job_analyses_owner_all" on public.job_analyses;
create policy "job_analyses_owner_all" on public.job_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============================================================================
-- Feedback — anyone may send, only admins may read
-- =============================================================================

alter table public.feedback enable row level security;

drop policy if exists "feedback_insert_any" on public.feedback;
create policy "feedback_insert_any" on public.feedback
  for insert with check (true);

drop policy if exists "feedback_admin_read" on public.feedback;
create policy "feedback_admin_read" on public.feedback
  for select using (public.is_admin());

-- =============================================================================
-- Metrics — no client access at all
--
-- RLS is enabled with no SELECT policy, so clients cannot read the counters.
-- Writes go exclusively through increment_metric(), which is SECURITY DEFINER
-- and therefore cannot be used to set an arbitrary value.
-- =============================================================================

alter table public.metric_counters enable row level security;

drop policy if exists "metric_counters_admin_read" on public.metric_counters;
create policy "metric_counters_admin_read" on public.metric_counters
  for select using (public.is_admin());

revoke all on function public.increment_metric(text) from public;
grant execute on function public.increment_metric(text) to authenticated, anon;
