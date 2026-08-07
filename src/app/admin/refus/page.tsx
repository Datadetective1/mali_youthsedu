import type { Metadata } from 'next';
import { ShieldX } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { EmptyState } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Accès refusé', robots: { index: false } };

/**
 * Deliberately outside the admin layout — that layout calls `requireAdmin()`,
 * which redirects here, so putting this page inside it would loop.
 */
export default async function AdminForbiddenPage() {
  const t = await getDictionary();

  return (
    <main id="contenu" className="mx-auto w-full max-w-3xl px-4 py-16">
      <EmptyState
        icon={<ShieldX className="size-10" />}
        title={t.admin.forbiddenTitle}
        description={t.admin.forbiddenBody}
        action={<ButtonLink href="/tableau-de-bord">{t.nav.dashboard}</ButtonLink>}
      />
    </main>
  );
}
