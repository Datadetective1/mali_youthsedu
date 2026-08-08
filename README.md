# Mali Youth Project

> Le talent est universel. Les opportunités ne le sont pas.

A French-first, mobile-first, offline-friendly career and skill roadmap
application for young people in Mali.

The working name is configurable — set `NEXT_PUBLIC_BRAND_NAME` and
`NEXT_PUBLIC_BRAND_SHORT_NAME`. Nothing in the codebase hard-codes it.

---

## What it does

It supports one journey: **Découvrir → Apprendre → Pratiquer → Préparer →
Postuler → Gagner → Transmettre.**

| Area | What a user can do |
| --- | --- |
| **Découvrir** | Answer a 14-question onboarding, get a recommended pathway with a plain-French explanation of *why*, and a realistic weekly pace. |
| **Apprendre** | Follow an 8-pathway curriculum (45 stages, 229 tasks) with curated free resources, mark progress, take notes, and check understanding. |
| **Pratiquer** | Work through 16 practical projects that produce real, showable evidence, each with a self-evaluation grid and a portfolio description. |
| **Préparer** | A nine-module Job Readiness Center: CV, job-description analyzer, value proposition, interview prep, employer research, skills gaps, professional communication, confidence, application checklist. |
| **Postuler** | Paste a job advert, get its requirements extracted, compared against the profile, and a readiness index with a fully visible breakdown. |
| **Hors ligne** | Install to the home screen, save pathways and the weekly plan for offline use, keep working with no connection, sync when it returns. |

### What it deliberately does not do

- It does not guarantee employment, interviews, or income, and says so on every page.
- It does not train anyone for regulated mining roles; pathways that touch the sector carry an explicit warning about diplomas, certification and safety training.
- It does not sell data, show targeted advertising, or use streaks, leaderboards or shame messaging.
- It does not require an account to explore, or a permanent internet connection to work.

---

## Screenshots

_Not yet captured._ To produce them:

```bash
npm run build && npm run start
```

Then visit `/`, `/parcours`, `/tableau-de-bord`, `/plan-semaine` and
`/preparation-emploi/analyser` at a 390 × 844 viewport (the primary target is a
mid-range Android phone) and save the images to `docs/screenshots/`.

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19 | Server components keep the client bundle small |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` | |
| Styling | Tailwind CSS 4, system font stack | Zero webfont bytes — see [DECISIONS](docs/DECISIONS.md) |
| Components | Hand-written primitives, no component library | Every kilobyte is downloaded over a metered connection |
| Validation | Zod 4 | Also generates the JSON Schema for AI structured output |
| Database | Supabase (PostgreSQL) with Row Level Security | |
| Local fallback | JSON file store | The app runs and is fully testable with no credentials |
| Offline | Hand-written service worker + localStorage queue | The caching policy is a privacy decision, not just a performance one |
| AI | Provider abstraction, optional | Every AI feature has a deterministic implementation that is the primary one |
| Tests | Vitest, Testing Library, Playwright | 168 unit + 45 end-to-end |

---

## Local setup

Requires **Node 20.9+**.

```bash
git clone <repository-url>
cd mali-youth-project
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. It works immediately — no Supabase account
needed. The local driver stores data in `.data/db.json` (gitignored).

To create an administrator locally, set `ADMIN_EMAILS` in `.env.local` to the
address you sign up with, then visit `/admin`.

---

## Environment variables

Every variable is documented in [`.env.example`](.env.example). The ones that
matter:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BRAND_NAME` | no | Product name shown in the UI |
| `DATA_DRIVER` | no | `supabase` or `local`. Inferred from whether Supabase is configured |
| `NEXT_PUBLIC_SUPABASE_URL` | for production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for production | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | for seeding | **Server only.** Never expose to the browser |
| `SUPABASE_DB_URL` | for migrations | Direct Postgres connection string |
| `AUTH_SECRET` | local driver | ≥32 chars. Signs local session cookies |
| `ADMIN_EMAILS` | yes | Comma-separated administrator addresses |
| `AI_PROVIDER` | no | `none` (default), `mock`, or `anthropic` |
| `AI_API_KEY` | if AI enabled | **Server only** |

`productionConfigIssues()` in `src/config/index.ts` detects development settings
that have reached a production build — a file-based data driver, a mock AI
provider, a missing admin allowlist — and reports them at the top of `/admin`,
so the person who can fix it is told. It warns rather than refusing to boot: an
empty `ADMIN_EMAILS` should not take the whole site down.

---

## Supabase setup

```bash
# 1. Create a project at https://supabase.com

# 2. Copy the credentials into .env.local
#    Project Settings > API          -> NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
#    Project Settings > Database     -> SUPABASE_DB_URL

# 3. Apply the schema, RLS policies and retention functions
npm run db:migrate

# 4. Seed the reference content
DATA_DRIVER=supabase npm run db:seed

# 5. Switch the app over
#    DATA_DRIVER=supabase in .env.local
npm run dev
```

Migrations are plain SQL in `supabase/migrations/`, applied in filename order
and recorded in `schema_migrations`, so re-running is safe. If you prefer the
Supabase CLI, `supabase db push` does the same job.

Full detail: [docs/DATABASE.md](docs/DATABASE.md) and
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Commands

```bash
npm run dev              # development server
npm run build            # production build
npm run start            # serve the production build

npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm test                 # Vitest (unit + integration)
npm run test:e2e         # Playwright (builds and serves automatically)
npm run verify           # lint + typecheck + test + build

npm run db:migrate       # apply SQL migrations (needs SUPABASE_DB_URL)
npm run db:seed          # seed reference content
npm run db:reset         # wipe the local JSON store (never touches Supabase)
npm run content:check    # pre-publication content report
```

`npm run content:check` lists what still needs a human before launch — chiefly
which external links nobody has opened yet. Add `-- --strict` to make it exit
non-zero.

---

## Deployment (Vercel)

1. Push the repository to GitHub and import it into Vercel.
2. Add the environment variables above under **Settings → Environment Variables**. `SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` must be server-side only — never prefixed `NEXT_PUBLIC_`.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Run `npm run db:migrate` and `npm run db:seed` against the production database before the first deploy.
5. Add the production URL to Supabase **Authentication → URL Configuration → Redirect URLs**.

Step-by-step checklist: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Current limitations

Stated plainly, because a launch checklist built on optimism is worthless.

- **48 external links are unverified.** Every seeded resource ships as *« À vérifier avant publication »*. They were chosen from knowledge of the providers, but nobody has opened them. Run `npm run content:check` for the list. This is the single biggest blocker to a public launch.
- **Legal documents are drafts.** The privacy policy and terms need a lawyer's review; both pages say so on screen.
- **Bambara is not translated.** The infrastructure works and a starter dictionary exists, but real translation must be done by native speakers, not machine translation.
- **Rate limiting is per-instance.** In-memory counters stop obvious abuse; a shared store (Postgres, Upstash, Vercel KV) is needed for a hard guarantee across serverless instances. See [docs/SECURITY.md](docs/SECURITY.md).
- **No accessibility testing with real screen-reader users.** The code follows WCAG 2.1 AA, and that is not the same thing.
- **Light theme only.** A deliberate MVP scope decision, stated on the accessibility page.
- **The local JSON driver is development-only.** No concurrency control, no RLS. `productionConfigIssues()` blocks it from passing silently into production.
- **Magic-link sign-in requires Supabase.** With the local driver it reports itself unavailable rather than pretending.
- **Self-reported outcomes are not verified**, and are labelled as such wherever they appear.

---

## Next recommended work

1. **Verify the 48 links** and set `verification: 'verified'` with a real review date, through `/admin/ressources` so the date is stamped automatically.
2. **Legal review** of the privacy policy and terms.
3. **Test with 5–10 young people in Mali**, on their own phones and their own connections. Everything else is a guess until then.
4. **Shared-store rate limiting** before any significant traffic.
5. **Bambara translation** by native speakers, starting with onboarding and the dashboard.
6. **Mentor accounts** — the highest-value secondary user, and the architecture is ready for them.

---

## Documentation

| Document | Contents |
| --- | --- |
| [GO_LIVE.md](docs/GO_LIVE.md) | **Click-by-click guide from repository to live deployment** |
| [PRODUCT_VISION.md](docs/PRODUCT_VISION.md) | Mission, principles, the HR findings that shaped the product |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the pieces fit together |
| [DATABASE.md](docs/DATABASE.md) | Schema, RLS model, migrations |
| [CONTENT_MODEL.md](docs/CONTENT_MODEL.md) | How content is authored and the link-verification rule |
| [OFFLINE_STRATEGY.md](docs/OFFLINE_STRATEGY.md) | Caching policy, sync queue, honest browser limitations |
| [SECURITY.md](docs/SECURITY.md) | Threat model and controls |
| [PRIVACY.md](docs/PRIVACY.md) | What is collected, why, and for how long |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment checklist |
| [TESTING.md](docs/TESTING.md) | Test strategy and what each suite guards |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | How to work on this |
| [ROADMAP.md](docs/ROADMAP.md) | What comes next |
| [DECISIONS.md](docs/DECISIONS.md) | Architecture decision records |

---

## Licence

Educational content is intended for reuse. Confirm licensing before public
launch.
