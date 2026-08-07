# Testing

```bash
npm test                 # 168 unit and integration tests (Vitest)
npm run test:e2e         # 45 end-to-end tests (Playwright, mobile + desktop)
npm run verify           # lint + typecheck + test + build
```

## What each layer guards

### Unit and integration — `src/**/*.test.ts`

The engines are pure functions with no I/O, which is what makes this layer fast
and worth trusting.

| Suite | Tests | Guards |
| --- | --- | --- |
| `content.test.ts` | 29 | Referential integrity, volume floors, and the honesty rules |
| `job-analyzer.test.ts` | 30 | Extraction against real advert phrasing |
| `matching.test.ts` | 18 | Comparison, readiness bands, profile snapshots |
| `queue.test.ts` | 21 | Offline queue including every failure path |
| `weekly-plan.test.ts` | 17 | Realistic workloads, determinism, guaranteed activity types |
| `recommendation.test.ts` | 15 | Rules across every goal × level combination |
| `value-proposition.test.ts` | 14 | That nothing is ever invented |
| `progress.test.ts` | 13 | Completion, stage locking, idempotence |
| `i18n.test.ts` | 11 | Fallback chain, formatting, serializability |

Several tests exist specifically to stop a past bug from returning:

- **Dictionary serializability.** Formatter functions cannot cross the server/client boundary; a function anywhere in the dictionary throws at runtime, on a page that may not be the one under test. The test walks the whole tree.
- **No seeded resource claims verification.** If this fails, someone marked a link verified without opening it.
- **Simulated projects say they are simulated**, in both the scenario and the portfolio description.
- **Job examples are labelled fictional.**
- **Skill keywords are lowercase and accent-free**, because incoming text is normalised that way and a keyword with an accent silently never matches.
- **Regulated pathways carry their warning.**

### End-to-end — `e2e/`

Runs against a real production build, on a Pixel 5 viewport and a desktop
viewport, using the local data driver and the mock AI provider so no secrets
are needed.

| File | Covers |
| --- | --- |
| `auth.setup.ts` | Creates accounts once and stores their session |
| `guest.spec.ts` | Flow 1 — exploration with no account |
| `journey.spec.ts` | Flows 2–12 — the full authenticated journey |
| `admin.spec.ts` | Flows 13–14 — admin editing and access control |
| `offline.spec.ts` | Flow 12 — real offline behaviour |

All fourteen flows in the brief are covered.

Beyond happy paths, the suite asserts product commitments:

- The readiness index never renders without its disclaimer.
- Unverified links are labelled on the public library.
- The mining pathway shows its regulatory warning.
- Legal pages state they are drafts.
- The admin metrics page contains no email address anywhere.
- Admin edits leave the original content recoverable.
- The value proposition contains no fabricated experience.

### Offline tests are real

`context.setOffline(true)` cuts the network at the browser level, so the queue,
the banner and the replay are exercised through the real code path rather than
a mocked flag. The suite asserts that a completion made offline is durably
queued and that the queue drains on reconnect.

## Conventions

**Accounts are created once**, in a setup project, and reused through
Playwright storage state. Signing in inside every test trips the application's
own rate limit — which is correct behaviour — and reports a product bug that
does not exist. When a suite fights a security control, the suite is usually
wrong.

**The journey suite is serial and shares an account**, because the steps
genuinely depend on each other: you cannot complete a task before starting a
roadmap.

**Tests wait for confirmation, not timeouts.** Where a save had no visible
confirmation, the fix was to add one — which also fixed a real accessibility
gap, since a screen-reader user had no way to know a tick had persisted.

**Queries use roles and labels**, not CSS classes, so a test breaks when the
accessible name breaks. Two selectors were tightened after the suite found that
the roadmap task list and the stage self-check list were both announced as
« Liste de vérification » — a genuine defect the tests surfaced.

## What is not covered

- **No accessibility testing with real screen-reader users.** The code follows WCAG 2.1 AA; that is not the same thing, and the accessibility page says so.
- **No visual regression testing.** Layout changes are caught by eye.
- **No load testing.**
- **The Supabase driver is not exercised end-to-end**, because that needs credentials. Both drivers implement one `Store` primitive and share one repository, which limits the divergence risk but does not eliminate it. Running the suite against a Supabase project before launch is on the checklist.
- **No automated link checking.** `npm run content:check` lists what needs a human, deliberately: automated checking would report a 200 and tell you nothing about whether the content is still what we said it was.

## Adding tests

Engine work belongs in a unit test — no mocks needed, and it will run in
milliseconds. A user-visible flow belongs in Playwright. If a bug reaches a
user, the fix includes the test that would have caught it; every such test in
this suite is marked with the reason it exists.
