import Link from 'next/link';
import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/profile/sign-out-button';

/**
 * Admin shell.
 *
 * Separate from the main site layout: no bottom navigation, no marketing
 * footer, and the session guard below gates every route beneath it.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getDictionary();
  const session = await getSession();
  // `/acces-refuse` lives outside /admin: this layout guards every route
  // beneath it, so redirecting to a page nested here would loop forever.
  if (!session) redirect(`/connexion?suivant=${encodeURIComponent('/admin')}`);
  if (!session.isAdmin) redirect('/acces-refuse');

  const links = [
    { href: '/admin', label: t.admin.tabs.overview },
    { href: '/admin/ressources', label: t.admin.tabs.resources },
    { href: '/admin/parcours', label: t.admin.tabs.paths },
    { href: '/admin/retours', label: t.admin.tabs.feedback },
    { href: '/admin/statistiques', label: t.admin.tabs.metrics },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-brand-800">
              {brand.name}
            </Link>
            <span className="rounded-full bg-sand-800 px-2 py-0.5 text-xs font-semibold text-white">
              {t.admin.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-sand-600 sm:inline">{session.email}</span>
            <SignOutButton label={t.auth.signOutAction} />
          </div>
        </div>

        <nav aria-label={t.admin.title} className="mx-auto max-w-6xl px-4 pb-2">
          <ul className="flex flex-wrap gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-sand-700 hover:bg-sand-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
