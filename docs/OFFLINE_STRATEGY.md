# Offline strategy

Offline support is a core product feature here, not a badge. The target user
has intermittent connectivity, a metered data bundle, and often a shared
device. All three shape the design.

## Three independent mechanisms

### 1. Service worker (`public/sw.js`)

Written by hand rather than generated, because the caching policy is a privacy
decision as much as a performance one.

| Request | Strategy |
| --- | --- |
| `/_next/static/*`, icons, images | Cache-first — immutable and hashed |
| Public pages (`/`, `/parcours`, `/ressources`, legal) | Stale-while-revalidate |
| `/hors-ligne` | Precached on install |
| **Personal pages** | **Never cached automatically** |
| `/api/*`, any non-GET, any cross-origin | Never touched |

**Personal pages are never cached automatically** ([ADR-006](DECISIONS.md)).
This product runs on shared and borrowed phones and in cybercafés. Leaving
someone's CV or interview answers in a cache on a machine they do not own is a
betrayal, not a feature.

They are stored only when the user presses « Enregistrer hors ligne », which
posts `SAVE_OFFLINE` to the worker. `/enregistre` lists what is actually stored
— read back from the worker, not from our own record of what we think we saved
— and offers a one-tap clear.

Bump `CACHE_VERSION` on any policy change; `activate` deletes every cache not
in the current set.

### 2. Sync queue (`src/lib/offline/queue.ts`)

Mutations that fail are appended to a `localStorage` queue and replayed when
the connection returns.

`localStorage`, not IndexedDB: the payload is a handful of small records,
`localStorage` is synchronous and universally available, and it survives the
aggressive storage eviction low-end Android applies. IndexedDB would be right
for cached content; it is overkill for a queue.

Three behaviours worth stating:

- **Coalescing.** Only the last operation per target is sent. Ticking, unticking and re-ticking a task offline replays as one write, not three — which matters when a week offline would otherwise produce a burst on a metered connection.
- **Partial success.** The server reports exactly which operations landed. Anything not acknowledged stays queued. Reporting "all applied" would make the client discard work that never reached the database.
- **Poison-entry escape.** After five failed attempts an operation is dropped, so one permanently failing entry cannot block everything behind it.

The queue is covered by 21 unit tests, including the failure paths.

### 3. Optimistic UI

Ticking a task updates immediately and reconciles when the server responds. On
an intermittent connection the alternative — a checkbox that silently springs
back — is what makes people stop trusting an app.

**A failing server action rejects; it does not return a failure result.** Every
optimistic call site therefore uses `try/catch` as well as checking `result.ok`.
Missing that silently defeated the whole offline feature during development, and
an end-to-end test now guards it.

## Sync lifecycle

```
offline ──► action fails ──► queued in localStorage ──► banner shows pending
                                                              │
online ───► useAutoSync fires ──► POST /api/sync ──► applied ids returned
                                                              │
                                        acknowledged removed ─┘
                                        unacknowledged retried (max 5)
```

`/api/sync` re-checks the session, validates every operation with Zod, applies
them independently, and returns only the ids that succeeded. `user_progress` is
unique on `(user_id, item_id)`, so replaying a completion is idempotent.

Auto-sync is mounted in the offline banner, which is present on every page, so
recovery never depends on the user finding a button.

## Installability

`src/app/manifest.ts` generates the manifest so the brand name comes from
configuration. Icons are rendered at build time by `src/app/icons/[size]` — no
binary assets in the repository, and the icon follows the brand.

The install prompt appears once, is permanently dismissible, and never returns.
Installing matters — it is what makes the app openable offline from the home
screen — but a banner that keeps coming back is exactly the manipulative
pattern the brief rules out.

## Honest browser limitations

- **iOS/Safari never fires `beforeinstallprompt`.** Installation requires Share → Add to Home Screen. The UI explains this rather than showing a button that cannot work.
- **iOS evicts service worker caches** after roughly 7 days of non-use. Saved content can disappear without warning. We do not promise permanence.
- **Private browsing** disables or restricts `localStorage`; the queue degrades to memory and is lost on close. The app still works online.
- **Storage quota** is finite and low-end Android is aggressive about reclaiming it. Saving many pages may silently evict earlier ones.
- **The service worker is disabled in development** — it would cache a constantly changing bundle and produce confusing stale pages.
- **External resources are not cached.** They are on other origins and outside our control. Resources marked `offlineCapable` are ones the *provider* allows you to download; the app cannot do it for you.
- **Registration failure is silent.** An unsupported browser, an insecure origin or private mode disables offline support, and the app carries on working online. Offline is an enhancement, never a dependency.

## Testing offline

```bash
npm run test:e2e            # includes real offline tests
```

`e2e/offline.spec.ts` uses Playwright's `context.setOffline`, which cuts the
network at the browser level, so the queue and banner are exercised through the
real code path rather than a mocked flag. It asserts that a completion made
offline is queued, that it drains on reconnect, and that the manifest and
service worker are served correctly.

Manually: DevTools → Application → Service Workers → Offline, or Network →
Offline, then navigate.
