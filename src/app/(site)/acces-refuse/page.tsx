import type { Metadata } from 'next';
import { ShieldX } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { PageShell } from '@/components/layout/page';
import { EmptyState } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Accès refusé', robots: { index: false } };

/**
 * Shown when a signed-in user reaches an area they are not authorised for.
 *
 * Deliberately OUTSIDE `/admin`: the admin layout calls `requireAdmin()`, which
 * redirects here, so a page nested under that layout would redirect to itself
 * forever. (It did, until an end-to-end test produced ERR_TOO_MANY_REDIRECTS.)
 */
export default async function AccessDeniedPage() {
  const t = await getDictionary();

  return (
    <PageShell width="narrow">
      <EmptyState
        icon={<ShieldX className="size-10" />}
        title={t.admin.forbiddenTitle}
        description={t.admin.forbiddenBody}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/tableau-de-bord">{t.nav.dashboard}</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              {t.errors.notFoundHome}
            </ButtonLink>
          </div>
        }
      />
    </PageShell>
  );
}
