# Contributing

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

No Supabase account is needed. The local driver stores data in `.data/db.json`.

Before opening a pull request:

```bash
npm run verify        # lint + typecheck + test + build
npm run test:e2e      # when you touched a user-facing flow
```

## Working on content

Content is the highest-leverage contribution and needs no TypeScript beyond
filling in an object. Read [CONTENT_MODEL.md](CONTENT_MODEL.md) first.

**Verifying links is the single most useful thing anyone can do right now.**
Run `npm run content:check` for the list, open them, and mark them through
`/admin/ressources` so the review date is stamped automatically.

Content rules that are enforced by tests, not convention:

- A resource is `verified` only if a person opened it.
- Simulated projects say so, in the scenario and the portfolio description.
- Job examples are labelled fictional.
- Pathways in regulated sectors carry their warning.
- Skill keywords are lowercase and accent-free.

## Working on French copy

All user-facing text lives in `src/lib/i18n/dictionaries/fr/`. Never hard-code
a string in a component.

- Vouvoiement.
- Clear French, never academic. If a sentence would not survive being read aloud to a 17-year-old, rewrite it.
- Proper accents and typographic apostrophes (`’`, not `'`).
- Values are interpolated with `format()` / `plural()`. **Never put a function in the dictionary** — a test enforces this, because functions cannot cross the server/client boundary ([ADR-008](DECISIONS.md)).
- French treats 0 as singular, so use `plural()` rather than `n === 1`.

## Working on the engines

`src/lib/engine/` is pure: no I/O, no request context, no ambient clock. Keep
it that way — it is what makes the tests fast and trustworthy.

Any change to a rule needs a test that would fail without it. The engines
decide what a young person is told to do with their time; a regression there is
not a cosmetic bug.

## Code conventions

- TypeScript `strict`, plus `noUncheckedIndexedAccess`. Array access returns `T | undefined`; handle it rather than asserting.
- No `any`. Lint enforces it.
- Server components by default; add `'use client'` only when interaction demands it.
- Strings reach client components as props, not via context.
- Every mutation is a server action that re-checks the session, validates with Zod, and returns `{ ok: false, error }` rather than throwing.
- Callers of server actions use `try/catch` **as well as** checking `result.ok` — a failing action rejects rather than returning a result, and forgetting this silently broke the offline queue once already.

### Comments

Explain *why*, not *what*. A comment that restates the code is noise; a comment
that records why a non-obvious choice was made is what stops someone
"simplifying" it back into a bug six months later.

Good: *"Personal pages are never cached automatically because this product runs
on shared phones."*

Not useful: *"Set the state to true."*

## Accessibility

Not optional, and not a checklist item at the end:

- Every control is a real element with an accessible name.
- Minimum 44px touch targets; 16px minimum font size on inputs (anything smaller triggers zoom-on-focus in mobile Safari).
- Visible focus ring everywhere; never remove the outline.
- Never convey information by colour alone.
- Respect `prefers-reduced-motion`.
- Anything that saves silently needs a live region saying so.

Query by role and accessible name in tests. If a test cannot find your control
that way, a screen-reader user cannot either.

## Commits and pull requests

Explain the reasoning, not the diff. A reviewer can read the diff; what they
cannot read is why you chose this approach, what you rejected, and what it
costs.

If you found a bug, say what the user-visible symptom was. If you changed an
architectural decision, add or update an ADR in [DECISIONS.md](DECISIONS.md).

## What not to add

The brief rules these out, and they stay out:

- Streaks, leaderboards, badges for their own sake, or any addictive loop.
- Shame or guilt messaging.
- Targeted advertising or data sale.
- Any claim of a partnership, endorsement or job opportunity that does not exist.
- Any promise of employment or income.
- Native apps, employer marketplaces, social feeds, chat or public profiles in this phase.

## Questions worth asking before you build

1. Does this work on an entry-level Android phone over 2G?
2. Does it work with no connection, or does it fail honestly?
3. Would a 17-year-old understand the French?
4. Does it produce something the user can show an employer?
5. Does it claim anything we cannot back up?

If the answer to (5) is yes, it does not ship.
