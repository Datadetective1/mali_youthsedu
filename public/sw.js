/* eslint-disable no-restricted-globals */
/**
 * Service worker.
 *
 * Written by hand rather than generated, because the caching policy here is a
 * privacy decision as much as a performance one.
 *
 * POLICY
 *  - Static build assets: cache-first. They are immutable and hashed.
 *  - Public pages (landing, pathways, resources, legal): stale-while-revalidate.
 *  - The offline fallback page: precached.
 *  - PERSONAL pages (dashboard, weekly plan, CV, interview answers, analyses):
 *    NEVER cached automatically. They are only stored when the user explicitly
 *    presses "Enregistrer hors ligne", because this platform runs on shared and
 *    borrowed phones. Silent caching of someone's CV on a cybercafé machine
 *    would be a betrayal, not a feature.
 *  - Anything with credentials, any non-GET request, and everything under
 *    /api/ is never cached.
 *
 * Bump CACHE_VERSION on any change to the policy so old caches are dropped.
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `myp-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `myp-static-${CACHE_VERSION}`;
const PAGES_CACHE = `myp-pages-${CACHE_VERSION}`;
const OFFLINE_CACHE = `myp-offline-${CACHE_VERSION}`;

const OFFLINE_URL = '/hors-ligne';

const SHELL_URLS = ['/', '/hors-ligne', '/parcours', '/manifest.webmanifest'];

/** Paths whose responses may contain personal data. Never auto-cached. */
const PERSONAL_PREFIXES = [
  '/tableau-de-bord',
  '/mon-parcours',
  '/plan-semaine',
  '/profil',
  '/enregistre',
  '/preparation-emploi/cv',
  '/preparation-emploi/analyser',
  '/preparation-emploi/valeur',
  '/preparation-emploi/entretien',
  '/preparation-emploi/employeur',
  '/preparation-emploi/ecarts',
  '/admin',
  '/connexion',
  '/inscription',
  '/bienvenue',
];

/** Public paths that are safe to keep fresh in the background. */
const PUBLIC_PREFIXES = [
  '/parcours',
  '/ressources',
  '/projets',
  '/a-propos',
  '/confidentialite',
  '/conditions',
  '/accessibilite',
  '/contact',
];

function isPersonal(pathname) {
  return PERSONAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicPage(pathname) {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  );
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individually, so one 404 does not abort the whole install.
      await Promise.all(
        SHELL_URLS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch {
            /* non-fatal */
          }
        }),
      );
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL_CACHE, STATIC_CACHE, PAGES_CACHE, OFFLINE_CACHE]);
      const names = await caches.keys();
      await Promise.all(names.filter((name) => !keep.has(name)).map((name) => caches.delete(name)));

      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

// ---------------------------------------------------------------------------
// Fetch strategies
// ---------------------------------------------------------------------------

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached ?? (await network) ?? Response.error();
}

async function handleNavigation(event) {
  const url = new URL(event.request.url);

  try {
    const preload = await event.preloadResponse;
    if (preload) {
      if (isPublicPage(url.pathname)) {
        const cache = await caches.open(PAGES_CACHE);
        cache.put(event.request, preload.clone());
      }
      return preload;
    }

    const response = await fetch(event.request);
    if (response.ok && isPublicPage(url.pathname)) {
      const cache = await caches.open(PAGES_CACHE);
      cache.put(event.request, response.clone());
    }
    return response;
  } catch {
    // Offline. Serve a user-saved copy first, then the public cache, then the
    // dedicated offline page — never a stale personal page we did not save
    // deliberately.
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const saved = await offlineCache.match(event.request, { ignoreSearch: true });
    if (saved) return saved;

    const pagesCache = await caches.open(PAGES_CACHE);
    const cached = await pagesCache.match(event.request, { ignoreSearch: true });
    if (cached) return cached;

    const shell = await caches.open(SHELL_CACHE);
    const fallback = await shell.match(OFFLINE_URL);
    if (fallback) return fallback;

    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Hors ligne</title><p>Vous etes hors ligne.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never touch anything that could mutate state or carry credentials.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (isPersonal(url.pathname)) return;

  event.respondWith(staleWhileRevalidate(request, PAGES_CACHE));
});

// ---------------------------------------------------------------------------
// Explicit "save for offline"
// ---------------------------------------------------------------------------

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (data.type === 'SAVE_OFFLINE' && Array.isArray(data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(OFFLINE_CACHE);
        const saved = [];
        for (const url of data.urls) {
          try {
            // `same-origin` credentials: this is the user asking for their own
            // page, on their own device, by explicit action.
            const response = await fetch(url, { credentials: 'same-origin' });
            if (response.ok) {
              await cache.put(url, response.clone());
              saved.push(url);
            }
          } catch {
            /* skip */
          }
        }
        broadcast({ type: 'OFFLINE_SAVED', urls: saved, key: data.key });
      })(),
    );
    return;
  }

  if (data.type === 'REMOVE_OFFLINE' && Array.isArray(data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(OFFLINE_CACHE);
        await Promise.all(data.urls.map((url) => cache.delete(url, { ignoreSearch: true })));
        broadcast({ type: 'OFFLINE_REMOVED', urls: data.urls, key: data.key });
      })(),
    );
    return;
  }

  if (data.type === 'CLEAR_OFFLINE') {
    event.waitUntil(
      (async () => {
        await caches.delete(OFFLINE_CACHE);
        broadcast({ type: 'OFFLINE_CLEARED' });
      })(),
    );
  }

  if (data.type === 'OFFLINE_STATUS') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(OFFLINE_CACHE);
        const keys = await cache.keys();
        broadcast({ type: 'OFFLINE_STATUS', urls: keys.map((request) => new URL(request.url).pathname) });
      })(),
    );
  }
});

async function broadcast(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const client of clients) client.postMessage(message);
}
