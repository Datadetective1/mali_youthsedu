import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getOnboarding } from '@/lib/db/repository';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, Notice } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.onboarding.metaTitle, robots: { index: false } };
}

export default async function OnboardingPage() {
  const t = await getDictionary();
  const session = await getSession();

  // Guests can see what will be asked, but answers need somewhere to live.
  if (!session) {
    return (
      <PageShell width="narrow">
        <PageHeader title={t.onboarding.title} description={t.onboarding.intro} />
        <Notice tone="info" title={t.auth.signUpTitle}>
          <p>{t.recommendation.guestSaveNotice}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/inscription?suivant=%2Fbienvenue">{t.auth.signUpAction}</ButtonLink>
            <ButtonLink href="/connexion?suivant=%2Fbienvenue" variant="secondary">
              {t.auth.signInAction}
            </ButtonLink>
            <ButtonLink href="/parcours" variant="ghost">
              {t.auth.continueAsGuest}
            </ButtonLink>
          </div>
        </Notice>
      </PageShell>
    );
  }

  const existing = await getOnboarding(session.userId);

  return (
    <PageShell width="narrow">
      <PageHeader title={t.onboarding.title} description={t.onboarding.intro} />
      <Card>
        <CardBody>
          <OnboardingWizard labels={t.onboarding} initialAnswers={existing ?? {}} />
        </CardBody>
      </Card>
    </PageShell>
  );
}
