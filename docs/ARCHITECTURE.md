# Architecture

## Shape

```
Browser (mobile-first, PWA)
  │  server-rendered HTML, minimal JS
  ▼
Next.js App Router  ── middleware.ts (CSP nonce + Supabase session refresh)
  │
  ├── Server Components ─── read content (bundled) + user data (repository)
  ├── Server Actions ────── all mutations; re-check the session, validate with Zod
  ├── Route Handlers ────── /api/sync (offline replay), /api/export (data export)
  │
  ▼
Domain layer
  ├── src/lib/engine/   deterministic rules (no I/O, pure, heavily tested)
  ├── src/lib/db/       repository over a Store primitive
  ├── src/lib/ai/       optional enhancement, never required
  └── src/content/      curriculum as typed TypeScript
  │
  ▼
Store primitive
  ├── SupabaseStore  → PostgreSQL + Row Level Security   (production)
  └── LocalStore     → JSON file                          (development)
```

## Directory map

| Path | Contents |
| --- | --- |
| `src/app/(site)/` | Every user-facing page, under one shell |
| `src/app/admin/` | Admin area, its own layout and session guard |
| `src/app/actions/` | Server actions, grouped by domain |
| `src/app/api/` | Route handlers |
| `src/components/` | UI, grouped by feature (`jobs/`, `roadmap/`, `offline/`, …) |
| `src/content/` | Curriculum: pathways, skills, resources, projects, questions |
| `src/lib/engine/` | Recommendation, planning, analysis, matching, scoring |
| `src/lib/db/` | Store primitive, two drivers, one repository |
| `src/lib/i18n/` | Locale config, dictionaries, formatting |
| `src/lib/offline/` | Sync queue and client hooks |
| `src/lib/ai/` | Provider interface, mock, Anthropic, task definitions |
| `supabase/migrations/` | Schema, RLS, retention — plain SQL |
| `e2e/` | Playwright suites |

## Rendering

Server components by default. Client components exist only where interaction
demands them: form state, optimistic updates, offline status, tab panels.

Strings reach client components as **props**, never through a context. Server
components read the dictionary directly, so its ~1000 strings never enter the
client bundle unless a component genuinely needs them.

The dictionary is fully serializable — a test enforces it contains no functions
— so a server component can hand `t` straight to a client component when that
component needs many strings. See [ADR-008](DECISIONS.md).

## Localization

- `src/lib/i18n/dictionaries/fr/` — the reference, complete by definition, split by domain.
- `en.ts`, `bm.ts` — real partial dictionaries. Missing keys resolve to French.
- `dictionaryFor(locale)` deep-merges the overlay over French and memoizes.
- Locale comes from the `myp_locale` cookie. `Accept-Language` is deliberately ignored: devices in the target market frequently report `en-US` regardless of what their owner reads, and silently switching them out of French would be worse than the default.
- Values are interpolated with `format()` / `plural()`, never with functions stored in the dictionary.

## Data access

One `Store` interface — `list`, `getOne`, `insert`, `upsert`, `update`,
`remove`, `incrementCounter` — with two implementations. One repository
(`src/lib/db/repository.ts`) implements every domain operation against it and
owns all row↔domain mapping.

Under Supabase, every query runs through a request-scoped client carrying the
user's session, so **RLS is the authority** on what can be read or written. The
repository's own filters are defence in depth, never the primary control. The
service-role client is used only by scripts.

## Engines

`src/lib/engine/` is pure: no I/O, no request context, no clock beyond an
injected date. That is what makes 168 unit tests fast and meaningful.

| Module | Responsibility |
| --- | --- |
| `recommendation.ts` | Weighted rules; each returns the French sentence explaining its own contribution |
| `weekly-plan.ts` | Fits declared hours, always includes one practical and one reflective activity, deterministic per user/week |
| `progress.ts` | Completion, stage locking, job-readiness progress |
| `job-analyzer.ts` | Section-aware extraction over the skill keyword vocabulary |
| `profile-snapshot.ts` | Flattens everything known about a user's capability |
| `matching.ts` | Requirement-by-requirement comparison with French rationales |
| `readiness.ts` | Weighted score, weights exposed to the user |
| `value-proposition.ts` | Assembles text only from words the user typed |
| `skill-gaps.ts` | Aggregates unmet requirements across analyses |

## Mutations

Every mutation is a server action that:

1. re-reads the session server-side (never trusts the client),
2. validates input with Zod,
3. verifies referenced content actually exists,
4. returns `{ ok: false, error }` rather than throwing, so the UI can show French.

Callers must also `try/catch`: a server action **rejects** when the network is
down rather than returning a failure result. Missing that is what silently
broke the offline queue during development.

## Offline

Three independent mechanisms:

1. **Service worker** — app shell and public pages cached automatically; personal pages only on explicit request ([ADR-006](DECISIONS.md)).
2. **Sync queue** — failed mutations go to `localStorage`, coalesced to the last operation per target, replayed on reconnect, dropped after five failures so one poisoned entry cannot block the rest.
3. **Optimistic UI** — a tick lands immediately and is reconciled when the server responds.

Details in [OFFLINE_STRATEGY.md](OFFLINE_STRATEGY.md).

## AI

`enhance({ fallback, run, rateLimitKey, reject })` returns `fallback` on any
failure — provider missing, timeout, rate limit, schema mismatch, or a `reject`
predicate catching a fabricated fact. The value-proposition task uses that
predicate to discard any output introducing a number or credential the user
never supplied.

Structured output only. The provider interface has one method, because every
AI use here is "improve this existing result", never "produce this from
nothing".

## Security boundaries

| Boundary | Enforcement |
| --- | --- |
| Anonymous vs authenticated | `getSession()` + `redirect()` in each page; RLS on every table |
| User vs other users | RLS `auth.uid() = user_id`; admins excluded from personal tables |
| User vs admin | `profiles.is_admin`, checked in the layout, in every admin action, and in RLS |
| Browser vs secrets | Only `NEXT_PUBLIC_*` reaches the client; AI and service-role keys are server-only |
| Injection | Zod on every input; parameterised queries throughout |
| XSS | React escaping; nonce-based CSP in production |

## Known architectural debt

- Rate limiting is per-instance and in-memory. Fine for obvious abuse, not a guarantee across serverless instances.
- The local driver serialises through one in-process lock. Correct for development, unsuitable for production.
- `middleware.ts` is deprecated in Next 16 in favour of `proxy.ts`; migrating is mechanical and not yet done.
