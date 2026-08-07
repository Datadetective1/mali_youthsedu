# Security

## Who we are protecting, and from what

The users are young people, many under 18, storing CVs, interview answers,
confidence notes and job applications. The realistic threats are not exotic:

1. Another user reading someone's data.
2. An administrator browsing personal content out of curiosity.
3. A shared or borrowed device leaking the previous user's data.
4. Credential stuffing against a weak sign-in.
5. Secrets leaking to the browser.
6. Injection through a pasted job advert.

## Controls

### Authentication

Supabase Auth in production: password hashing, email verification and token
rotation are its job, and it does them properly.

The local development driver implements its own, and does it correctly rather
than conveniently: scrypt with a 16-byte per-user salt, constant-time
comparison, and HMAC-signed session cookies whose expiry sits **inside** the
signed payload, so it cannot be extended by editing the cookie's `Max-Age`.

Cookies are `httpOnly`, `sameSite=lax`, and `secure` in production.

Sign-in is rate limited to 10 attempts per address per 10 minutes. The limit is
keyed on the **address, not the IP**, because an IP limit would lock out an
entire cybercafé or a shared mobile connection.

A missing account still runs the hash, so a wrong address and a wrong password
take the same time.

### Authorisation

Three independent layers, because "the UI does not show the button" is not
access control:

1. **Row Level Security** on every table. A table with no policy denies everything.
2. **Server-side session checks** in every page, layout and server action.
3. **Content validation** — referenced ids must exist before anything is written.

Administrators are deliberately excluded from personal tables. The admin area
shows aggregates only.

`profiles.is_admin` cannot be set through the application at all; see
[DATABASE.md](DATABASE.md#admin-provisioning).

### Input validation

Every server action and route handler validates with Zod: types, enum
membership, and length limits on every string. The job-description analyzer
caps input at 20 000 characters.

Checklist ticks are filtered against the ids the checklist actually contains,
so a stale or crafted client cannot store arbitrary strings.

### Output safety

React escapes by default. No `dangerouslySetInnerHTML` anywhere. External links
carry `rel="noopener noreferrer nofollow"` and announce that they open a new tab.

### Content Security Policy

Nonce-based, generated per request in middleware:

```
default-src 'self';
script-src 'self' 'nonce-…' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
connect-src 'self' <supabase origin>;
frame-ancestors 'none';
object-src 'none';
```

`style-src` needs `unsafe-inline` because React inlines style attributes. In
development the policy is relaxed for Turbopack's HMR client — a policy that
only holds in development is worth nothing, so the difference is explicit.

Static headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, HSTS) are in `next.config.ts`.

### Secrets

Only `NEXT_PUBLIC_*` variables reach the browser. `AI_API_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` are read server-side only; the AI provider module
is the only file that touches the key and is never imported by a client
component. `src/lib/ai/tasks.ts` carries `import 'server-only'` so a mistaken
client import fails the build.

`.gitignore` excludes `.env*` except `.env.example`. No secret is committed.

### Rate limiting

| Operation | Limit |
| --- | --- |
| Sign-in | 10 / 10 min per address |
| Job analysis | 30 / hour per user |
| AI enhancement | `AI_RATE_LIMIT_PER_HOUR` (default 20) |
| Offline sync | 60 / min per user |
| Feedback | 5 / hour |
| Data export | 5 / hour |

**Honest limitation.** These are in-memory, per-instance counters. On a single
server or a warm serverless instance they stop the obvious abuse — a script
hammering an endpoint, a runaway retry loop. Across many cold serverless
instances they are best-effort. A hard guarantee needs a shared counter
(a Postgres row, Upstash, or Vercel KV). This is the top security item on the
roadmap, and it is documented rather than pretended away.

### Shared devices

- Sessions expire after 30 days, with the expiry inside the signed payload.
- The service worker never caches personal pages automatically ([ADR-006](DECISIONS.md)).
- `/api/export` sends `Cache-Control: no-store`.
- `/enregistre` shows exactly what is stored on the device and offers a one-tap clear.

### Dependency surface

Deliberately small: no component library, no PDF library, no analytics SDK, no
webfonts. Fewer dependencies is fewer supply-chain risks and less to audit.

```bash
npm audit --omit=dev
```

## Before public launch

- [ ] Move rate limiting to a shared store.
- [ ] Run `npm audit` and resolve anything high or critical.
- [ ] Verify RLS by attempting cross-user reads with a second account.
- [ ] Confirm `ADMIN_EMAILS` contains only intended addresses, and set `is_admin` in the database.
- [ ] Confirm no `NEXT_PUBLIC_` variable holds a secret.
- [ ] Schedule `purge_anonymous_job_data()`.
- [ ] Legal review of the privacy policy and terms.
- [ ] Penetration test focused on RLS bypass and admin escalation.

## Reporting

Security issues should go to the contact address in `NEXT_PUBLIC_CONTACT_EMAIL`
rather than a public issue tracker.
