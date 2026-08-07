# Privacy

The engineering behind the promise. The user-facing policy lives at
`/confidentialite`; this document explains how it is actually enforced.

## The commitment

> Nous ne vendons aucune donnée personnelle et n'affichons aucune publicité ciblée.

That has to be true in the schema, not just in the copy.

## What is collected

| Data | Why | Where |
| --- | --- | --- |
| Email, display name | Sign back in, greet by name | `profiles` |
| Onboarding answers | Build the recommendation | `onboarding_responses` |
| Progress, notes, projects | Resume where the user stopped | `user_progress`, `user_notes`, `user_projects` |
| CV, interview answers, value proposition | The job-readiness workspaces | `cv_profiles`, `interview_practice_answers`, `value_propositions` |
| Pasted job adverts | Run the analysis | `job_descriptions` |
| Aggregate counters | Steer the product | `metric_counters` |

## What is not collected

- No biometrics, no audio, no video. The interview module is written practice only, by design.
- No precise location. Onboarding asks urban / peri-urban / rural, which is a planning input, not a coordinate.
- No health, religion, ethnicity or political data.
- No phone contacts.
- No behavioural profile. There is no per-user event stream to build one from.

## Analytics

Disabled by default. When `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` is set, a
single cookie-free, self-hostable script is loaded for page views. **No product
code calls a tracking function**, so there is no path by which an onboarding
answer, a CV or an analysis could reach an analytics provider.

Everything the team needs to steer the product is counted server-side as
aggregates ([ADR-012](DECISIONS.md)):

```sql
create table metric_counters (
  event      text primary key,
  count      bigint not null default 0,
  updated_at timestamptz not null default now()
);
```

No user id. No session id. No timestamp beyond `updated_at`. An individual's
journey cannot be reconstructed from this table even by someone with direct
database access. Writes go through a `SECURITY DEFINER` function, so a client
can increment but can neither read nor forge the totals.

## Impact measurement

The outcomes that matter are skills acquired, projects completed, applications
sent, interviews obtained, jobs obtained, income created, youth mentoring
youth, rural participation, and participation by young women.

The first four are countable today. The rest are **self-reported**, and are
labelled as such everywhere they appear:

> Ces chiffres sont déclarés par les utilisateurs eux-mêmes et ne sont pas
> vérifiés de façon indépendante.

Rural participation and participation by young women are deliberately **not**
tracked per user. Recording gender against a young person's profile in order to
report a diversity statistic is exactly the trade this product refuses. If
these become necessary for funding, the right instrument is a voluntary,
anonymous survey — not a profile field.

## AI and data flow

Every essential feature works with no AI. When AI enhancement is offered and
the user opts in — unchecked by default — the relevant text is sent to the
configured provider solely to produce the response.

The consent checkbox states this in the same sentence as the action, before the
text leaves the device, rather than in a policy three clicks away.

Prompts are never logged. The provider module logs status codes and a truncated
provider message on failure, never the user's text, because that text is their
own words about their own situation.

## Retention

| Data | Retention |
| --- | --- |
| Account and content | Until the user deletes their account |
| Guest job adverts | 7 days, via `purge_anonymous_job_data()` |
| Aggregate counters | Indefinite — they contain nothing personal |
| Feedback | Indefinite; email stored only if the sender asked for a reply |

## User rights

| Right | Implementation |
| --- | --- |
| Access | `/profil` shows everything held |
| Portability | `/api/export` returns the complete record as JSON |
| Rectification | Onboarding answers and every workspace are editable |
| Erasure | `/profil` → typed `SUPPRIMER` confirmation → hard delete |

Deletion is a hard delete, not a flag ([DATABASE.md](DATABASE.md)). Rows that
fed aggregate counters are anonymised rather than removed, so the counts stay
correct without retaining anything identifying.

## Cookies

Two, both first-party:

| Cookie | Purpose | Lifetime |
| --- | --- | --- |
| `myp_session` | Keeps the user signed in | 30 days |
| `myp_locale` | Interface language preference | 1 year |

No advertising cookies, no third-party tracking cookies. There is no consent
banner because there is nothing to consent to — which is the point.

## Shared devices

Assumed, not treated as an edge case:

- Personal pages are never cached automatically ([ADR-006](DECISIONS.md)).
- `/enregistre` lists what is stored locally and clears it in one tap.
- `/api/export` is `no-store`.
- Sessions expire, with the expiry inside the signed cookie payload.

## Under-18 users

The product targets 15–35 year-olds, so many users are minors. Practically:

- The age question is optional and offers « Je préfère ne pas répondre ».
- No public profiles, no social features, no messaging between users — nothing that creates a contact surface with strangers.
- No behavioural profiling and no advertising.
- The same deletion and export rights as everyone else.

A jurisdiction-specific review of minors' data requirements in Mali is on the
pre-launch checklist and has not been done.
