# Deployment

Target: Vercel + Supabase. Nothing is Vercel-specific beyond the dashboard
steps; any Node host that runs `next start` will work.

## 1. Supabase

```bash
# Create a project at https://supabase.com, then collect:
#   Project Settings > API       -> URL, anon key, service_role key
#   Project Settings > Database  -> connection string (URI)
```

Apply the schema:

```bash
SUPABASE_DB_URL="postgresql://…" npm run db:migrate
```

Expected output: three migrations applied (`0001_schema`, `0002_rls`,
`0003_retention`). Re-running is safe — applied migrations are recorded in
`schema_migrations`.

Seed the reference content:

```bash
DATA_DRIVER=supabase \
NEXT_PUBLIC_SUPABASE_URL="https://….supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="…" \
npm run db:seed
```

It reports the counts and warns about resources still marked « à vérifier ».
The seed is idempotent — every write is an upsert keyed on the content id — and
it **never** promotes a link to verified.

### Verify RLS actually works

Do not skip this. In the Supabase SQL editor:

```sql
-- Should return only the calling user's rows once RLS is on.
select count(*) from public.user_progress;
```

Then sign in as two different users in the browser and confirm neither can see
the other's dashboard data.

### Create the first administrator

```sql
update public.profiles set is_admin = true where email = 'you@example.org';
```

`ADMIN_EMAILS` is a bootstrap allowlist; the database flag is authoritative.

## 2. Vercel

1. Push to GitHub, then **Add New → Project** in Vercel and import the repository.
2. Framework preset: Next.js. Build command and output are detected.
3. Add environment variables (**Settings → Environment Variables**):

| Variable | Environments | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | all | The production URL |
| `NEXT_PUBLIC_BRAND_NAME` | all | |
| `NEXT_PUBLIC_BRAND_SHORT_NAME` | all | |
| `NEXT_PUBLIC_CONTACT_EMAIL` | all | |
| `DATA_DRIVER` | all | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | all | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all | |
| `SUPABASE_SERVICE_ROLE_KEY` | production | **Never** prefix with `NEXT_PUBLIC_` |
| `ADMIN_EMAILS` | all | |
| `AI_PROVIDER` | all | `none` unless AI is wanted |
| `AI_API_KEY` | production | Server-only |

4. Deploy.
5. In Supabase → **Authentication → URL Configuration**, add the production URL to **Site URL** and **Redirect URLs**. Without this, magic links and email confirmations bounce.

## 3. Post-deploy checklist

Functional:

- [ ] `/` renders; both calls to action work.
- [ ] `/parcours` lists 8 pathways; a guest can open one.
- [ ] Sign-up works; onboarding completes; a recommendation appears with its explanation.
- [ ] Starting a pathway creates a weekly plan.
- [ ] Ticking a task persists across a reload.
- [ ] The job analyzer extracts requirements from a real advert.
- [ ] The readiness index shows its disclaimer and its breakdown.
- [ ] `/api/export` downloads a complete JSON file.
- [ ] Account deletion removes everything.

Security:

- [ ] Signed-out visitors are **redirected** from every protected page, not shown an error. Check `/tableau-de-bord`, `/profil`, `/mon-parcours`, `/plan-semaine`, `/enregistre`, `/admin`.
- [ ] A signed-in non-admin hitting `/admin` lands on `/acces-refuse`, with no redirect loop.
- [ ] Two accounts cannot see each other's data.
- [ ] No secret appears in the client bundle: `curl -s <url>/_next/static/chunks/*.js | grep -i "service_role\|sk-"` returns nothing.
- [ ] Security headers present: `curl -sI <url> | grep -i "content-security-policy\|strict-transport"`.

PWA:

- [ ] `/manifest.webmanifest` returns 200 with icons.
- [ ] `/sw.js` returns 200 with `Cache-Control: must-revalidate`.
- [ ] Chrome on Android offers installation.
- [ ] With the network disabled, a saved pathway is still readable and `/hors-ligne` renders.

Content:

- [ ] `npm run content:check` — decide consciously whether to launch with unverified links.

## 4. Scheduled jobs

Guest job adverts are purged by a function, which needs scheduling. With
pg_cron:

```sql
select cron.schedule(
  'purge-anonymous-job-data',
  '0 3 * * *',
  $$ select public.purge_anonymous_job_data(); $$
);
```

Or call it from any external scheduler. It is plain SQL so it works on every
Supabase plan.

## 5. Rollback

Vercel keeps previous deployments; promote one from the dashboard.

Database migrations are forward-only. Before applying a destructive migration
to production, take a backup (Supabase → Database → Backups). Nothing in
`0001`–`0003` is destructive.

## Environments

Use two Supabase projects — development and production — rather than one with a
prefix. `DATA_DRIVER=local` covers local development with no cloud dependency
at all.

Never point a preview deployment at the production database. Vercel's
per-environment variables make this straightforward; the failure mode if you do
not is a preview branch writing to real users' rows.
