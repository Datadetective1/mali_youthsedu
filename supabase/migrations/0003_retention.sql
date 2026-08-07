-- =============================================================================
-- 0003_retention.sql — data minimisation helpers
--
-- The privacy commitment is not just "we don't sell data"; it is "we don't keep
-- what we don't need". These routines make that operational rather than
-- aspirational.
--
-- They are plain SQL functions rather than pg_cron jobs so they work on any
-- Supabase plan. Schedule them with pg_cron, a Supabase scheduled function, or
-- an external cron — see docs/PRIVACY.md ("Retention").
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Guest job analyses.
--
-- A visitor without an account can paste an advert. That text is personal
-- context we have no reason to keep once the page is done with it.
-- -----------------------------------------------------------------------------

create or replace function public.purge_anonymous_job_data(older_than interval default interval '7 days')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  with deleted as (
    delete from public.job_descriptions
    where user_id is null
      and created_at < now() - older_than
    returning 1
  )
  select count(*) into removed from deleted;

  return removed;
end;
$$;

revoke all on function public.purge_anonymous_job_data(interval) from public;

-- -----------------------------------------------------------------------------
-- Account deletion.
--
-- The UI promises irreversible deletion, so this is a hard delete, not a flag.
-- Deleting the auth user cascades to profiles and from there to every
-- user-owned table.
-- -----------------------------------------------------------------------------

create or replace function public.delete_account(target uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target is null or target <> auth.uid() then
    raise exception 'Un utilisateur ne peut supprimer que son propre compte.';
  end if;

  -- Anonymous-ise rather than delete the analyses that fed aggregate counters,
  -- so the counts stay correct without retaining anything identifying.
  update public.job_descriptions set user_id = null, raw_text = '' where user_id = target;
  update public.job_analyses set user_id = null where user_id = target;

  delete from auth.users where id = target;
end;
$$;

revoke all on function public.delete_account(uuid) from public;
grant execute on function public.delete_account(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- Data export.
--
-- Returns everything we hold about the caller as a single JSON document.
-- -----------------------------------------------------------------------------

create or replace function public.export_my_data()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'preferences', (select to_jsonb(u) from public.user_preferences u where u.user_id = auth.uid()),
    'onboarding', (select to_jsonb(o) from public.onboarding_responses o where o.user_id = auth.uid()),
    'roadmaps', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from public.user_roadmaps r where r.user_id = auth.uid()),
    'progress', (select coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb) from public.user_progress g where g.user_id = auth.uid()),
    'notes', (select coalesce(jsonb_agg(to_jsonb(n)), '[]'::jsonb) from public.user_notes n where n.user_id = auth.uid()),
    'saved_resources', (select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) from public.saved_resources s where s.user_id = auth.uid()),
    'weekly_plans', (select coalesce(jsonb_agg(to_jsonb(w)), '[]'::jsonb) from public.weekly_plans w where w.user_id = auth.uid()),
    'weekly_tasks', (select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) from public.weekly_tasks t where t.user_id = auth.uid()),
    'projects', (select coalesce(jsonb_agg(to_jsonb(pr)), '[]'::jsonb) from public.user_projects pr where pr.user_id = auth.uid()),
    'portfolio', (select coalesce(jsonb_agg(to_jsonb(pe)), '[]'::jsonb) from public.portfolio_entries pe where pe.user_id = auth.uid()),
    'job_analyses', (select coalesce(jsonb_agg(to_jsonb(ja)), '[]'::jsonb) from public.job_analyses ja where ja.user_id = auth.uid()),
    'skill_gaps', (select coalesce(jsonb_agg(to_jsonb(sg)), '[]'::jsonb) from public.skill_gaps sg where sg.user_id = auth.uid()),
    'value_proposition', (select to_jsonb(vp) from public.value_propositions vp where vp.user_id = auth.uid()),
    'interview_answers', (select coalesce(jsonb_agg(to_jsonb(ia)), '[]'::jsonb) from public.interview_practice_answers ia where ia.user_id = auth.uid()),
    'star_examples', (select coalesce(jsonb_agg(to_jsonb(se)), '[]'::jsonb) from public.star_examples se where se.user_id = auth.uid()),
    'confidence_work', (select to_jsonb(cw) from public.confidence_work cw where cw.user_id = auth.uid()),
    'cv', (select to_jsonb(cv) from public.cv_profiles cv where cv.user_id = auth.uid()),
    'checklists', (select coalesce(jsonb_agg(to_jsonb(cs)), '[]'::jsonb) from public.checklist_states cs where cs.user_id = auth.uid()),
    'employer_research', (select coalesce(jsonb_agg(to_jsonb(er)), '[]'::jsonb) from public.employer_research er where er.user_id = auth.uid())
  );
$$;

revoke all on function public.export_my_data() from public;
grant execute on function public.export_my_data() to authenticated;
