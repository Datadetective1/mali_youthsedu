# Go live — click-by-click

From a pushed repository to a working public deployment. Roughly 25 minutes.

Everything here is free tier. You need two accounts: **Supabase** (the database)
and **Vercel** (the host). Both accept "Sign in with GitHub", which is the
fastest route.

**Do not skip Part 1.** Without a database the site builds and the public pages
work, but sign-up, sign-in and all progress saving return a server error,
because the development data driver writes to a file and serverless
filesystems are read-only.

---

## Part 1 — Supabase (about 10 minutes)

### 1.1 Create the project

1. Go to **<https://supabase.com>** and click **Start your project**.
2. Click **Continue with GitHub** and authorise.
3. On the dashboard click **New project**.
4. Fill in:
   - **Name:** `mali-youth-project`
   - **Database Password:** click **Generate a password**, then **copy it somewhere safe now** — Supabase will not show it again.
   - **Region:** choose **West EU (London)** or **Central EU (Frankfurt)** — closest to Mali of the available options.
   - **Plan:** Free
5. Click **Create new project** and wait ~2 minutes for provisioning.

### 1.2 Apply the database schema

1. In the left sidebar click **SQL Editor** (the `>_` icon).
2. Click **+ New query**.
3. Open `supabase/migrations/0001_schema.sql` from the repository, select **all** of it, copy, paste into the editor.
4. Click **Run** (bottom right, or Ctrl+Enter). Wait for **Success. No rows returned**.
5. Click **+ New query** again. Repeat with `supabase/migrations/0002_rls.sql`. Run.
6. Click **+ New query** again. Repeat with `supabase/migrations/0003_retention.sql`. Run.

Order matters — 0001, then 0002, then 0003.

> Prefer the terminal? `SUPABASE_DB_URL="<connection string>" npm run db:migrate`
> does the same thing. The SQL Editor is fewer steps and needs no connection
> string.

### 1.3 Confirm it worked

1. Left sidebar → **Table Editor**.
2. You should see ~30 tables (`profiles`, `user_progress`, `career_paths`, …).
3. Click **profiles**. Look at the top right — it should say **RLS enabled**. If any table says *RLS disabled*, re-run `0002_rls.sql`.

### 1.4 Collect your keys

1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy these three into a scratch file — you will paste them into Vercel in Part 2:

| Label on screen | Copy it as |
| --- | --- |
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** / `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** key (click **Reveal**) | `SUPABASE_SERVICE_ROLE_KEY` |

> The **service_role** key bypasses all security. Never put it in a variable
> whose name starts with `NEXT_PUBLIC_`, never paste it into a chat or an
> issue, never commit it.

### 1.5 Turn off email confirmation (recommended for launch)

Otherwise every new user must click a confirmation email before they can use
the app, and email deliverability to Malian addresses is unpredictable.

1. Left sidebar → **Authentication** → **Sign In / Providers**.
2. Find **Email**. Click it.
3. Turn **Confirm email** **off**.
4. Click **Save**.

---

## Part 2 — Vercel (about 10 minutes)

### 2.1 Import the repository

1. Go to **<https://vercel.com>** and click **Sign Up** (or Log In).
2. Click **Continue with GitHub** and authorise.
3. On the dashboard click **Add New…** → **Project**.
4. Find **`mali_youthsedu`** in the list and click **Import**.
   - If it is not listed, click **Adjust GitHub App Permissions**, grant access to the repository, and come back.

### 2.2 Add the environment variables

**Do this before deploying.** On the configuration screen, expand
**Environment Variables** and add each row below — type the **Key**, paste the
**Value**, click **Add**, repeat.

| Key | Value |
| --- | --- |
| `DATA_DRIVER` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | *(from step 1.4)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(from step 1.4)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(from step 1.4)* |
| `ADMIN_EMAILS` | your own email address |
| `NEXT_PUBLIC_BRAND_NAME` | `Mali Youth Project` |
| `NEXT_PUBLIC_BRAND_SHORT_NAME` | `MYP` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | your contact address |
| `AI_PROVIDER` | `none` |

`NEXT_PUBLIC_SITE_URL` is added in step 2.4, once you know the URL.

Leave **Framework Preset** as **Next.js** and do not touch the build settings.

### 2.3 Deploy

1. Click **Deploy**.
2. Wait 2–4 minutes.
3. When it finishes you will see **Congratulations** and a preview image. Click **Continue to Dashboard**.
4. Copy your URL from the top of the page — something like `https://mali-youthsedu.vercel.app`.

### 2.4 Add the site URL and redeploy

1. **Settings** → **Environment Variables**.
2. Add: Key `NEXT_PUBLIC_SITE_URL`, Value *your URL from 2.3* (no trailing slash).
3. Click **Add**.
4. Go to the **Deployments** tab.
5. On the top deployment, click the **⋯** menu → **Redeploy** → **Redeploy**.

### 2.5 Tell Supabase about the URL

Without this, sign-up works but any email link points at `localhost`.

1. Back in Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** paste your Vercel URL.
3. **Redirect URLs:** click **Add URL** and enter `https://your-url.vercel.app/**` (with the two asterisks).
4. Click **Save**.

---

## Part 3 — Verify (about 5 minutes)

Open your live URL and walk through this. Each step should just work.

1. **Landing page** loads, shows *« Le talent est universel… »*.
2. Click **Explorer les parcours** → 8 pathways listed.
3. Open **Commercial et vente** → stages, resources, projects visible.
4. Click **Créer un compte** → sign up with your admin email → you land on the questionnaire.
5. Complete the questionnaire → a recommendation appears **with an explanation of why**.
6. Click **Commencer ce parcours** → dashboard shows your pathway.
7. Open **Mon parcours**, tick a task, **reload the page** — the tick is still there. *(This is the real test that the database is wired correctly.)*
8. Open **Plan de la semaine** → tasks grouped by day.
9. Open **Préparation à l'emploi → Analyser une offre** → click **Support minier** → **Analyser cette offre** → requirements extracted and a readiness index appears.
10. Go to `/admin` → you should see the admin dashboard with a green **Configuration conforme** banner.

If step 10 shows a **red** banner, it lists exactly which environment variable
is wrong. Fix it in Vercel and redeploy.

If step 7 fails, `DATA_DRIVER` is not set to `supabase`, or the migrations did
not run.

### Make yourself a permanent administrator

`ADMIN_EMAILS` is the bootstrap. Make it durable in the database:

1. Supabase → **SQL Editor** → **+ New query**.
2. Paste, replacing the address with yours:

```sql
update public.profiles set is_admin = true where email = 'you@example.org';
```

3. Click **Run**.

---

## Part 4 — Before you share it with real users

The deployment works. These are the things that should be true before you put
it in front of young people looking for work.

- [ ] **Verify the 48 external links.** They are all labelled *« À vérifier avant publication »* because nobody has opened them. Run `npm run content:check` for the list, open each one, then mark it verified at `/admin/ressources` (which stamps the review date automatically). This is the biggest single item.
- [ ] **Legal review** of `/confidentialite` and `/conditions`. Both are drafts and say so on screen.
- [ ] **Test on a real phone**, on a real Malian mobile connection, ideally with 5–10 young people. Watch where they hesitate.
- [ ] **Schedule the data-retention job.** Supabase → SQL Editor:

```sql
select cron.schedule(
  'purge-anonymous-job-data',
  '0 3 * * *',
  $$ select public.purge_anonymous_job_data(); $$
);
```

- [ ] **Take a database backup point** — Supabase → Database → Backups.

---

## Optional extras

### Turn on AI enhancement

Every feature works without it. To enable optional rewording:

1. Vercel → **Settings** → **Environment Variables**.
2. Set `AI_PROVIDER` to `anthropic`.
3. Add `AI_API_KEY` with your Anthropic key. **Never** prefix it with `NEXT_PUBLIC_`.
4. Redeploy.

### Custom domain

1. Vercel → **Settings** → **Domains** → enter your domain → **Add**.
2. Follow the DNS records Vercel shows you at your registrar.
3. Update `NEXT_PUBLIC_SITE_URL` and the Supabase **Site URL** / **Redirect URLs** to the new domain, then redeploy.

### Copy the reference content into the database

Optional. The app reads its curriculum from the code, so this is only needed if
you want the content queryable in SQL.

```bash
DATA_DRIVER=supabase \
NEXT_PUBLIC_SUPABASE_URL="…" \
SUPABASE_SERVICE_ROLE_KEY="…" \
npm run db:seed
```

---

## If something breaks

| Symptom | Cause | Fix |
| --- | --- | --- |
| Build fails on Vercel | Usually a missing env var | Open the build log; the failing variable is named |
| Sign-up returns an error | Migrations not run, or `DATA_DRIVER` ≠ `supabase` | Re-check 1.2 and 2.2 |
| Progress does not persist | Same as above | Check `/admin` for the red banner |
| Red banner at `/admin` | Misconfiguration | The banner lists each problem explicitly |
| Confirmation email never arrives | Email confirmation still on | Step 1.5 |
| `/admin` says access denied | Your email is not in `ADMIN_EMAILS` | Fix the variable, redeploy, then run the SQL in Part 3 |
| Everything 404s | Wrong branch deployed | Vercel → Settings → Git → Production Branch = `main` |
