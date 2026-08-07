# Roadmap

## Status

The first product is complete and verified: eight pathways, a nine-module Job
Readiness Center, offline support, an admin area, 168 unit tests and 45
end-to-end tests, all passing against a production build.

It is **not ready for public launch**, for reasons that are stated rather than
buried.

---

## Before any public launch

These are blockers, in order.

### 1. Verify the 48 external links

Every resource ships as « À vérifier avant publication ». They were selected
from knowledge of the providers, but nobody has opened them.

```bash
npm run content:check
```

Open each one, confirm it is reachable, free (or that `cost` says otherwise),
roughly as described, and in the stated language. Mark it through
`/admin/ressources` so the review date is stamped automatically.

*Why it blocks:* a user on a metered bundle spends real money on a dead link.

### 2. Legal review

The privacy policy and terms are drafts written during development and labelled
as such on screen. They need a lawyer familiar with Malian data protection and
with the fact that many users are minors.

### 3. Test with real users

Five to ten young people in Mali, on their own phones and their own
connections. Watch the onboarding, watch someone paste a real job advert, watch
someone try to work offline.

*Why it blocks:* every design decision here is reasoned, and reasoning is not
evidence.

### 4. Shared-store rate limiting

Current limits are in-memory and per-instance — best-effort across serverless
instances. Move to a Postgres row, Upstash, or Vercel KV before meaningful
traffic. See [SECURITY.md](SECURITY.md).

### 5. Run the suite against Supabase

Both drivers share one repository, which limits divergence risk but does not
eliminate it. Run the Playwright suite once against a real Supabase project.

---

## Next phase

### Bambara

The infrastructure works and a starter dictionary exists. Translation must be
done by native speakers — a badly translated interface is worse for the people
it is meant to serve than an honest French one. Start with onboarding, the
dashboard and the weekly plan; the Job Readiness Center can follow.

### Mentors

The highest-value secondary user, and the one the architecture is closest to
supporting. A mentor should be able to see a mentee's progress **only with
explicit consent**, comment on a practical project, and run a mock interview.

Careful design needed: the current RLS model deliberately excludes even
administrators from personal tables, and a mentor role must be a consented
exception, not a hole.

### Content depth

- More practical projects, especially for commercial and administrative roles.
- Sector-specific interview question sets.
- More worked STAR examples drawn from real Malian contexts rather than generic ones.

### Analyzer quality

Improving extraction is mostly a content task: add keywords to
`src/content/skills.ts`. Worth doing against a corpus of real adverts collected
from Malian job boards, measuring which requirements the rules currently miss.

---

## Later

- **Employer research** deepened with a directory of real Malian employers per sector, built with the Chamber of Mines and similar bodies. Only with real data — a fabricated directory is worse than none.
- **Verified outcomes** through partnerships with employers and training organisations, so self-reported figures can be replaced with confirmed ones.
- **Alumni contributions** — the "Transmettre" step of the journey is currently the only one with no product behind it.
- **SMS or USSD fallback** for users whose phones cannot run the PWA at all. A significant piece of work, and the honest answer to "what about the people this still excludes".
- **Offline content packs** — downloading a whole pathway including selected resources in one action, for someone with a single monthly connection.

---

## Explicitly not planned

Per the brief, and unchanged:

- Native mobile applications.
- An employer marketplace or job board.
- Social feeds, chat rooms, public profiles or leaderboards.
- Paid content.
- Any fabricated partnership or job opportunity.

---

## Technical debt

| Item | Impact | Effort |
| --- | --- | --- |
| Rate limiting is per-instance | Security | Medium |
| `middleware.ts` deprecated in favour of `proxy.ts` | Maintenance | Low |
| Local driver serialises through one lock | Development only | Low |
| No visual regression tests | Quality | Medium |
| Content requires a deploy unless edited via the admin overlay | Content velocity | Medium |
| No dark theme | Accessibility, battery | Medium |
