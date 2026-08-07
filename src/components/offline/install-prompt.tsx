'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'myp_install_dismissed';

/**
 * Install prompt.
 *
 * Shown once, dismissible permanently, and never re-nagged. Installing matters
 * here — it is what makes the app openable offline from the home screen — but
 * a banner that keeps coming back is exactly the manipulative pattern the brief
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
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === '1');
    } catch {
      setDismissed(false);
    }

    // Already installed — nothing to offer.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setDismissed(true);
      return;
    }

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS never fires beforeinstallprompt; Safari requires the manual
    // Share → Add to Home Screen flow, so we explain it instead.
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
    if (isIos && isSafari) setShowIosHint(true);

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      /* nothing to persist to; the banner simply reappears next visit */
    }
  }

  if (dismissed || (!deferred && !showIosHint)) return null;

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
          {showIosHint && !deferred ? (
            <p className="mt-2 text-sm text-brand-800">{iosHint}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {deferred ? (
              <Button
                size="sm"
                onClick={async () => {
                  await deferred.prompt();
                  await deferred.userChoice;
                  setDeferred(null);
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
