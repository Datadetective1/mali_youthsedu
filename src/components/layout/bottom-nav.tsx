'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Briefcase, CalendarDays, Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavLabels {
  navigation: string;
  home: string;
  myPath: string;
  weeklyPlan: string;
  jobPrep: string;
  profile: string;
}

/**
 * Mobile bottom navigation.
 *
 * Five destinations, no more: this is the whole product's spine and it has to
 * be readable and tappable on a 320px screen. Everything else is reachable from
 * the dashboard.
 */
export function BottomNav({ labels }: { labels: BottomNavLabels }) {
  const pathname = usePathname();

  const items = [
    { href: '/tableau-de-bord', label: labels.home, Icon: Home },
    { href: '/mon-parcours', label: labels.myPath, Icon: BookOpen },
    { href: '/plan-semaine', label: labels.weeklyPlan, Icon: CalendarDays },
    { href: '/preparation-emploi', label: labels.jobPrep, Icon: Briefcase },
    { href: '/profil', label: labels.profile, Icon: User },
  ];

  return (
    <nav
      data-bottom-nav
      aria-label={labels.navigation}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-center',
                  active ? 'text-brand-700' : 'text-sand-500',
                )}
              >
                <Icon aria-hidden className="size-6" />
                <span className="text-[11px] font-medium leading-tight">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
