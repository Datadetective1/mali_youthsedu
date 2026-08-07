'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui';

/**
 * Root error boundary.
 *
 * Strings are inlined rather than read from the dictionary: this component
 * renders when something has already gone wrong, so it must not depend on any
 * async work that could fail again.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Digest only. The message can contain user content, which has no business
    // in a browser console on a shared machine.
    if (process.env.NODE_ENV !== 'production') console.error(error);
  }, [error]);

  return (
    <main id="contenu" className="mx-auto w-full max-w-3xl px-4 py-16">
      <EmptyState
        icon={<AlertTriangle className="size-10" />}
        title="Une erreur est survenue"
        description="Quelque chose s’est mal passé de notre côté. Vous pouvez réessayer ; si le problème persiste, signalez-le-nous."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Réessayer</Button>
            <ButtonLink href="/" variant="secondary">
              Revenir à l’accueil
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Signaler le problème
            </ButtonLink>
          </div>
        }
      />
      {error.digest ? (
        <p className="mt-6 text-center text-xs text-sand-400">Référence : {error.digest}</p>
      ) : null}
    </main>
  );
}
