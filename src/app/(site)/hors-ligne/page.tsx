import type { Metadata } from 'next';
import { CloudOff } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { PageShell } from '@/components/layout/page';
import { EmptyState } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Hors ligne',
  robots: { index: false },
};

/**
 * Offline fallback, precached by the service worker.
 *
 * Must render entirely from the cache: no data fetching, no personalisation.
 */
export default async function OfflinePage() {
  const t = await getDictionary();

  return (
    <PageShell width="narrow">
      <EmptyState
        icon={<CloudOff className="size-10" />}
        title={t.errors.offlineTitle}
        description={t.errors.offlineBody}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/enregistre">{t.errors.offlineSaved}</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              {t.errors.notFoundHome}
            </ButtonLink>
          </div>
        }
      />
    </PageShell>
  );
}
