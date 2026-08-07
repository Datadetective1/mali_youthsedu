# Architecture decision records

Each record states the decision, the reasoning, and what it costs. Decisions
that turned out to be wrong are marked and kept, because the reasoning is
useful even when the conclusion was not.

---

## ADR-001 — System font stack, no webfonts

**Decision.** Typography uses `system-ui` and the platform fallbacks. No
webfont is downloaded.

**Why.** A typical webfont pair is 150–250 KB. On a 2G connection that is
several seconds of blank or unstyled text before a user can read anything, and
it is billed against a metered data bundle. The product's first principle is
access; a brand typeface is not worth the tax.

**Cost.** The product looks like the device it runs on rather than having a
distinctive typographic identity. Accepted: distinctiveness comes from colour,
spacing and tone instead.

---

## ADR-002 — Hand-written UI primitives, no component library

**Decision.** No shadcn/ui, no Radix. Buttons, cards, fields, disclosures and
tabs are written by hand on native elements.

**Why.** The same access argument. Radix primitives are excellent but add
weight, and the components this product needs are simple. `<details>` gives a
working disclosure with keyboard support and no JavaScript; native form
controls give correct labels and focus behaviour for free.

**Cost.** More code to maintain, and accessibility is our responsibility rather
than a library's. Mitigated by keeping the primitive set small and using native
elements wherever one exists.

---

## ADR-003 — Content lives in TypeScript modules, the database holds an overlay

**Decision.** Curriculum content (pathways, stages, resources, projects,
questions) is authored as typed TypeScript in `src/content/`. The database
holds the same content, seeded from those modules, plus admin edits stored as
overrides that are merged at read time.

**Why.**
- Content ships in the bundle and renders with zero database round trips, which
  matters most on the slow connections this product targets.
- The service worker can cache it as part of the app shell.
- It is type-checked: a stage referencing a deleted resource fails the build,
  not a user's page.
- Admin edits never mutate the seed, so "rétablir le contenu d'origine" is
  always available and an accidental edit is never destructive.

**Cost.** Content changes require a deploy unless made through the admin
overlay. Acceptable: curriculum changes slowly, and the overlay covers urgent
fixes such as a dead link.

---

## ADR-004 — A local JSON data driver alongside Supabase

**Decision.** Two implementations of one `Store` primitive: Supabase for
production, a JSON file for development. A single domain repository is written
against the primitive.

**Why.** Supabase credentials are an external dependency. Without a fallback,
nobody can run, test or demonstrate the application without an account, and CI
needs secrets to run a single end-to-end test. With it, `npm run dev` works on
a fresh clone and the whole Playwright suite runs with no secrets.

Writing both against one primitive is what stops the fallback from drifting
into a liability: there is one repository, so behaviour cannot diverge.

**Cost.** The local driver has no concurrency control beyond an in-process lock
and no row-level security. `productionConfigIssues()` refuses to let it pass
silently into production, and the sign-in screen shows a development banner
while it is active.

---

## ADR-005 — Deterministic engines first; AI may only polish

**Decision.** Recommendation, weekly planning, job-description analysis,
profile matching, readiness scoring and value-proposition generation are all
implemented as deterministic rules. AI is exposed through a single `enhance()`
function that takes an already-correct result and an improvement attempt, and
returns the original whenever the improvement is unavailable, slow, rate
limited, malformed, or fails a safety check.

**Why.** A feature that stops working without an API key is a feature that does
not work — for a user with no connection, for an installation with no budget,
and on the day the provider has an outage. Inverting the usual arrangement
means AI is genuinely optional.

There is a second reason specific to this product: the deterministic
recommendation can explain itself. Every rule returns the French sentence
describing its own contribution, so the user sees *why* a pathway was suggested
and can disagree with it. A model cannot offer that.

**Cost.** The rules need maintenance as the content grows, and extraction is
less flexible than a model on unusual phrasing. Mitigated by keeping the
keyword vocabulary in `src/content/skills.ts`, where improving extraction is a
content edit rather than a code change.

---

## ADR-006 — Personal pages are never cached automatically

**Decision.** The service worker caches static assets and public pages
automatically. Pages that can contain personal data — dashboard, roadmap,
weekly plan, CV, interview answers, analyses — are cached **only** when the
user presses « Enregistrer hors ligne ».

**Why.** This product runs on shared and borrowed phones and in cybercafés.
Silently leaving someone's CV or interview answers in a browser cache on a
machine they do not own is a betrayal, not a feature. Offline access is
valuable enough to offer deliberately and dangerous enough not to impose.

**Cost.** Offline access to personal pages takes one extra tap, and users who
never tap it get no offline dashboard. Accepted.

---

## ADR-007 — Print to PDF rather than bundling a PDF library

**Decision.** « Télécharger le plan (PDF) » and CV export call
`window.print()` with a dedicated print stylesheet.

**Why.** A client-side PDF library costs roughly 300 KB. Every browser already
has a PDF writer, users understand the print dialogue, and printing to paper is
a genuinely useful outcome for a weekly plan.

**Cost.** Less control over the output, and the flow differs slightly between
browsers. The UI explains the step.

---

## ADR-008 — Message templates, not formatter functions, in the dictionary

**Decision.** Dictionary entries needing a value are stored as strings with
named placeholders (`'{done} sur {total}'`) and rendered with `format()` /
`plural()`.

**Why.** This started as a bug. Formatter functions cannot cross the
server/client boundary in React, so handing a dictionary containing them to a
client component throws at runtime — and several pages did. Templates keep the
whole dictionary serializable, so a server component can pass `t` straight to a
client component. They are also easier for a translator, who gets a plain
string instead of a code fragment.

A test now asserts the dictionary contains no functions at all, so the class of
bug cannot return.

**Cost.** Slightly more ceremony at call sites. Worth it.

---

## ADR-009 — Redirect at the call site, not in a shared guard helper

**Decision.** Protected pages call `getSession()` and then `redirect()`
themselves. There is no `requireSession()` helper.

**Why.** This also started as a bug, and a serious one: every signed-out
visitor got a 500 on every protected page. `redirect()` works by throwing, and
that throw did not propagate out of the shared async helper in this Next 16 /
Turbopack setup — execution continued and the page dereferenced a null session.
Called directly inside a page or layout it works correctly, which was confirmed
against a production build.

**Cost.** Two lines per page instead of one, and the redirect target is
repeated. A small price for a guard that actually guards; the end-to-end suite
now asserts the redirect for every protected route.

---

## ADR-010 — French plural rules, not `n === 1`

**Decision.** `plural()` selects the singular form for `|n| < 2`.

**Why.** French treats zero as singular — « 0 étape », not « 0 étapes ». Using
the English rule would produce visibly wrong French on empty states, which are
exactly the screens a new user sees first.

**Cost.** None worth mentioning.

---

## ADR-011 — Every seeded link ships unverified

**Decision.** All 48 curated resources have `verification: 'pending'` and
`lastReviewed: null`, and the UI shows « À vérifier avant publication » on each
one. A database constraint forbids `verification = 'verified'` without a
review date.

**Why.** The resources were selected from knowledge of the providers, but
nobody opened them during implementation. Marking them verified would be a lie
told to someone with a 500 MB monthly bundle who is about to spend it on a link
we did not check.

**Cost.** The library looks provisional at launch, which it is. `npm run
content:check` lists exactly what needs a human, and the admin screen stamps
the review date automatically so the record cannot drift from the truth.

---

## ADR-012 — Aggregate counters only, no per-user analytics

**Decision.** Product metrics are integer counters keyed by event name, with no
user id, session id or timestamp beyond `updated_at`. Third-party analytics is
disabled by default and, when enabled, is a single cookie-free script that no
product code ever calls.

**Why.** The landing page promises not to sell or profile youth data. That
promise has to be true in the schema, not just in the copy. Counters cannot
reconstruct an individual's journey even for someone with database access.

**Cost.** No funnel analysis, no cohort retention, no per-user debugging.
Accepted deliberately: the outcomes that matter here — skills acquired,
projects completed, applications sent, interviews obtained — are counted, and
the rest is not worth the risk to the people being counted.
