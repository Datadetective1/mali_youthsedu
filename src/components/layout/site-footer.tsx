import Link from 'next/link';
import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';

export async function SiteFooter() {
  const t = await getDictionary();
  const year = new Date().getUTCFullYear();

  const columns = [
    {
      title: t.footer.productSection,
      links: [
        { href: '/parcours', label: t.nav.explore },
        { href: '/preparation-emploi', label: t.nav.jobPrep },
        { href: '/projets', label: t.nav.projects },
        { href: '/ressources', label: t.nav.resources },
      ],
    },
    {
      title: t.footer.aboutSection,
      links: [
        { href: '/a-propos', label: t.nav.about },
        { href: '/contact', label: t.footer.contact },
      ],
    },
    {
      title: t.footer.legalSection,
      links: [
        { href: '/confidentialite', label: t.footer.privacy },
        { href: '/conditions', label: t.footer.terms },
        { href: '/accessibilite', label: t.footer.accessibility },
      ],
    },
  ];

  return (
    <footer data-app-footer className="mt-16 border-t border-sand-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-bold text-brand-800">{brand.name}</p>
            <p className="mt-2 max-w-xs text-sm text-sand-600">{t.footer.tagline}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-sand-500">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sand-700 underline-offset-4 hover:text-brand-800 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* These two statements are product commitments, not legal boilerplate.
            They stay on every page because they are what the platform is for. */}
        <div className="mt-8 space-y-2 border-t border-sand-200 pt-6 text-sm text-sand-600">
          <p className="font-medium text-sand-700">{t.footer.noGuarantee}</p>
          <p>{t.footer.dataPromise}</p>
          <p className="pt-2 text-xs text-sand-500">{t.footer.rights(year)}</p>
        </div>
      </div>
    </footer>
  );
}
