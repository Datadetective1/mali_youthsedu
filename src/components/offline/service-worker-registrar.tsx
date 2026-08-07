'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker.
 *
 * Deliberately silent: registration failing (unsupported browser, private
 * mode, insecure origin) must never surface as an error to a user who only
 * wanted to read a page. Offline support is an enhancement, not a dependency.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    // In development the worker would cache a constantly-changing bundle and
    // produce confusing stale pages.
    if (process.env.NODE_ENV !== 'production') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        /* offline support unavailable; the app still works */
      });
    };

    // Wait for load so registration never competes with first paint on a slow
    // connection — which is exactly when first paint matters most.
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });

    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
