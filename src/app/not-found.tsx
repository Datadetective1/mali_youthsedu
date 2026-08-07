import { SearchX } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';
import { EmptyState } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getDictionary();

  return (
    <main id="contenu" className="mx-auto w-full max-w-3xl px-4 py-16">
      <EmptyState
        icon={<SearchX className="size-10" />}
        title={t.errors.notFoundTitle}
        description={t.errors.notFoundBody}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">{t.errors.notFoundHome}</ButtonLink>
            <ButtonLink href="/parcours" variant="secondary">
              {t.nav.explore}
            </ButtonLink>
          </div>
        }
      />
    </main>
  );
}
