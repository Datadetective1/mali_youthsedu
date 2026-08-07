import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dataConfig, isProduction } from '@/config';
import { getDictionary } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody } from '@/components/ui';
import { AuthForm } from '@/components/auth/auth-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.signInTitle, robots: { index: false } };
}

export default async function SignInPage({
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
      <PageHeader title={t.auth.signInTitle} description={t.auth.signInSubtitle} />

      <Card>
        <CardBody>
          <AuthForm
            mode="sign-in"
            next={suivant}
            labels={{
              email: t.auth.email,
              emailHint: t.auth.emailHint,
              password: t.auth.password,
              passwordHint: t.auth.passwordHint,
              displayName: t.auth.displayName,
              displayNameHint: t.auth.displayNameHint,
              submit: t.auth.signInAction,
              submitting: t.actions.loading,
              altPrompt: t.auth.noAccount,
              altHref: '/inscription',
              altLabel: t.auth.signUpAction,
              guestPrompt: t.auth.guestExplanation,
              guestHref: '/parcours',
              guestLabel: t.auth.continueAsGuest,
              devNotice:
                dataConfig.driver === 'local' && !isProduction ? t.auth.devDriverNotice : undefined,
            }}
          />
        </CardBody>
      </Card>
    </PageShell>
  );
}
