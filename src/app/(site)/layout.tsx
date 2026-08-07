import { brand } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { BottomNav } from '@/components/layout/bottom-nav';

/**
 * Shared shell for every user-facing page.
 *
 * One layout rather than separate public/authenticated shells: a signed-in user
 * browsing the public resource library should not lose their bottom navigation,
 * and a guest should see the same page a member does, minus the personal parts.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const t = await getDictionary();
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        isSignedIn={Boolean(session)}
        labels={{
          brandName: brand.name,
          navigation: t.a11y.mainNavigation,
          openMenu: t.a11y.openMenu,
          closeMenu: t.a11y.closeMenu,
          explore: t.nav.explore,
          about: t.nav.about,
          jobPrep: t.nav.jobPrep,
          resources: t.nav.resources,
          signIn: t.nav.signIn,
          signUp: t.nav.signUp,
          dashboard: t.nav.dashboard,
        }}
      />

      <main id="contenu" className="flex-1">
        {children}
      </main>

      <SiteFooter />

      {session ? (
        <>
          <BottomNav
            labels={{
              navigation: t.a11y.bottomNavigation,
              home: t.nav.home,
              myPath: t.nav.myPath,
              weeklyPlan: t.nav.weeklyPlan,
              jobPrep: t.nav.jobPrep,
              profile: t.nav.profile,
            }}
          />
          {/* Spacer so the fixed bottom bar never covers the last element. */}
          <div aria-hidden className="h-(--spacing-bottomnav) md:hidden" />
        </>
      ) : null}
    </div>
  );
}
