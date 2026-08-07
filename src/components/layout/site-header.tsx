'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HeaderLabels {
  brandName: string;
  navigation: string;
  openMenu: string;
  closeMenu: string;
  explore: string;
  about: string;
  jobPrep: string;
  resources: string;
  signIn: string;
  signUp: string;
  dashboard: string;
}

const publicLinks = (labels: HeaderLabels) => [
  { href: '/parcours', label: labels.explore },
  { href: '/preparation-emploi', label: labels.jobPrep },
  { href: '/ressources', label: labels.resources },
  { href: '/a-propos', label: labels.about },
];

export function SiteHeader({
  labels,
  isSignedIn,
}: {
  labels: HeaderLabels;
  isSignedIn: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = publicLinks(labels);

  // Close the menu on navigation — otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      data-app-header
      className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-brand-800"
          aria-label={labels.brandName}
        >
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-lg bg-brand-700 text-sm font-black text-white"
          >
            {labels.brandName.slice(0, 1)}
          </span>
          <span className="hidden text-base sm:inline">{labels.brandName}</span>
        </Link>

        <nav aria-label={labels.navigation} className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-brand-50 text-brand-800' : 'text-sand-700 hover:bg-sand-100',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <ButtonLink href="/tableau-de-bord" size="sm">
              {labels.dashboard}
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/connexion" variant="ghost" size="sm" className="hidden sm:inline-flex">
                {labels.signIn}
              </ButtonLink>
              <ButtonLink href="/bienvenue" size="sm">
                {labels.signUp}
              </ButtonLink>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-principal"
          aria-label={labels.navigation}
          className="border-t border-sand-200 bg-white md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block min-h-12 rounded-lg px-3 py-3 font-medium text-sand-800 hover:bg-sand-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!isSignedIn ? (
              <li>
                <Link
                  href="/connexion"
                  className="block min-h-12 rounded-lg px-3 py-3 font-medium text-sand-800 hover:bg-sand-100"
                >
                  {labels.signIn}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
