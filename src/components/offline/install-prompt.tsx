'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'myp_install_dismissed';
const DISMISSED_EVENT = 'myp:install-dismissed';

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function subscribeDismissed(onChange: () => void): () => void {
  window.addEventListener(DISMISSED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(DISMISSED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Captures `beforeinstallprompt`, which fires before React has a chance to. */
function subscribeInstallPrompt(onChange: () => void): () => void {
  function onBeforeInstall(event: Event) {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    onChange();
  }
  window.addEventListener('beforeinstallprompt', onBeforeInstall);
  return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Install prompt.
 *
 * Shown once, dismissible permanently, never re-nagged. Installing matters here
 * — it is what makes the app openable offline from the home screen — but a
 * banner that keeps coming back is exactly the manipulative pattern the brief
 * rules out.
 */
export function InstallPrompt({
  title,
  body,
  action,
  later,
  iosHint,
}: {
  title: string;
  body: string;
  action: string;
  later: string;
  iosHint: string;
}) {
  const [justDismissed, setJustDismissed] = useState(false);

  const dismissed = useSyncExternalStore(
    subscribeDismissed,
    readDismissed,
    // Never render the prompt during SSR: it depends entirely on browser state.
    () => true,
  );

  const hasPrompt = useSyncExternalStore(
    subscribeInstallPrompt,
    () => deferredPrompt !== null,
    () => false,
  );

  const standalone = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => window.matchMedia('(display-mode: standalone)').matches,
    () => true,
  );

  // iOS never fires `beforeinstallprompt`; Safari requires the manual
  // Share → Add to Home Screen flow, so we explain it instead.
  const showIosHint = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () =>
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      /safari/i.test(navigator.userAgent) &&
      !/crios|fxios/i.test(navigator.userAgent),
    () => false,
  );

  function dismiss() {
    setJustDismissed(true);
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1');
      window.dispatchEvent(new CustomEvent(DISMISSED_EVENT));
    } catch {
      /* nothing to persist to; the banner simply reappears next visit */
    }
  }

  if (dismissed || justDismissed || standalone) return null;
  if (!hasPrompt && !showIosHint) return null;

  return (
    <aside
      data-print="hide"
      aria-label={title}
      className="rounded-[--radius-card] border border-brand-200 bg-brand-50 p-4"
    >
      <div className="flex items-start gap-3">
        <Download aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-700" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-brand-900">{title}</p>
          <p className="mt-1 text-sm text-brand-800">{body}</p>
          {showIosHint && !hasPrompt ? (
            <p className="mt-2 text-sm text-brand-800">{iosHint}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {hasPrompt ? (
              <Button
                size="sm"
                onClick={async () => {
                  const prompt = deferredPrompt;
                  if (!prompt) return;
                  await prompt.prompt();
                  await prompt.userChoice;
                  deferredPrompt = null;
                  dismiss();
                }}
              >
                {action}
              </Button>
            ) : null}
            <Button size="sm" variant="ghost" onClick={dismiss}>
              {later}
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={later}
          className="-m-1 shrink-0 rounded p-1 text-brand-700 hover:bg-brand-100"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
    </aside>
  );
}
