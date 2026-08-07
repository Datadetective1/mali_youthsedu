import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dataConfig, isProduction } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, Notice } from '@/components/ui';
import { AuthForm } from '@/components/auth/auth-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.signUpTitle, robots: { index: false } };
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ suivant?: string }>;
}) {
  const session = await getSession();
  if (session) redirect('/tableau-de-bord');

  const t = await getDictionary();
  const { suivant } = await searchParams;

  return (
    <PageShell width="narrow" className="max-w-md">
      <PageHeader title={t.auth.signUpTitle} description={t.auth.signUpSubtitle} />

      <Card>
        <CardBody>
          <AuthForm
            mode="sign-up"
            next={suivant ?? '/bienvenue'}
            labels={{
              email: t.auth.email,
              emailHint: t.auth.emailHint,
              password: t.auth.password,
              passwordHint: t.auth.passwordHint,
              displayName: t.auth.displayName,
              displayNameHint: t.auth.displayNameHint,
              submit: t.auth.signUpAction,
              submitting: t.actions.loading,
              altPrompt: t.auth.hasAccount,
              altHref: '/connexion',
              altLabel: t.auth.signInAction,
              guestPrompt: t.auth.guestExplanation,
              guestHref: '/parcours',
              guestLabel: t.auth.continueAsGuest,
              devNotice:
                dataConfig.driver === 'local' && !isProduction ? t.auth.devDriverNotice : undefined,
            }}
          />
        </CardBody>
      </Card>

      <Notice tone="info" className="mt-4">
        {t.legal.privacy.sections.summary[0]} {t.legal.privacy.sections.summary[1]}
      </Notice>
    </PageShell>
  );
}
