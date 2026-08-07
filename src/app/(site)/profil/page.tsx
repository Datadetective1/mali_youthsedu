import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDictionary, formatDate, getLocale } from '@/lib/i18n';
import { getSession } from '@/lib/auth';
import { getOnboarding, getPreferences, getProfile } from '@/lib/db/repository';
import { Breadcrumb, PageHeader, PageShell } from '@/components/layout/page';
import { Card, CardBody, DefinitionList, Notice, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';
import { PreferencesForm } from '@/components/profile/preferences-form';
import { DangerZone } from '@/components/profile/danger-zone';
import { SignOutButton } from '@/components/profile/sign-out-button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.profile.metaTitle, robots: { index: false } };
}

export default async function ProfilePage() {
  const t = await getDictionary();
  const locale = await getLocale();
  const session = await getSession();
  if (!session) redirect(`/connexion?suivant=${encodeURIComponent('/profil')}`);

  const [profile, preferences, onboarding] = await Promise.all([
    getProfile(session.userId),
    getPreferences(session.userId),
    getOnboarding(session.userId),
  ]);

  return (
    <PageShell width="narrow">
      <Breadcrumb
        label={t.a11y.breadcrumb}
        items={[{ href: '/tableau-de-bord', label: t.nav.dashboard }, { label: t.profile.title }]}
      />

      <PageHeader
        title={t.profile.title}
        actions={<SignOutButton label={t.auth.signOutAction} />}
      />

      <Section title={t.profile.sectionAccount}>
        <DefinitionList
          items={[
            { term: t.profile.email, description: session.email },
            {
              term: t.profile.memberSince,
              description: profile ? formatDate(profile.createdAt, locale) : '—',
            },
          ]}
        />
        <p className="text-sm text-sand-500">{t.profile.emailImmutable}</p>
      </Section>

      <Section title={t.profile.sectionPreferences} className="mt-10">
        <Card>
          <CardBody>
            <PreferencesForm
              initial={{
                displayName: profile?.displayName ?? '',
                hoursPerWeek: preferences.hoursPerWeek,
                connectivity: preferences.connectivity,
              }}
              labels={{
                displayName: t.profile.displayName,
                hoursPerWeek: t.profile.hoursPerWeek,
                hoursPerWeekHint: t.profile.hoursPerWeekHint,
                connectivity: t.profile.connectivity,
                connectivityHint: t.profile.connectivityHint,
                connectivityOptions: t.onboarding.options.connectivity,
                hoursOptions: t.onboarding.options.hours,
                save: t.actions.save,
                saving: t.actions.saving,
              }}
            />
          </CardBody>
        </Card>
      </Section>

      <Section title={t.profile.sectionAnswers} className="mt-10">
        {onboarding ? (
          <DefinitionList
            items={[
              {
                term: t.onboarding.q.goal,
                description: t.onboarding.options.goal[onboarding.goal],
              },
              {
                term: t.onboarding.q.educationLevel,
                description: t.onboarding.options.education[onboarding.educationLevel],
              },
              {
                term: t.onboarding.q.englishLevel,
                description: t.onboarding.options.englishLevel[onboarding.englishLevel],
              },
              {
                term: t.onboarding.q.digitalLevel,
                description: t.onboarding.options.digitalLevel[onboarding.digitalLevel],
              },
              {
                term: t.onboarding.q.locationType,
                description: t.onboarding.options.location[onboarding.locationType],
              },
              {
                term: t.onboarding.q.experience,
                description: t.onboarding.options.experience[onboarding.experience],
              },
            ]}
          />
        ) : (
          <Notice tone="info">{t.dashboard.noRoadmapBody}</Notice>
        )}
        <ButtonLink href="/bienvenue" variant="secondary">
          {t.profile.editAnswers}
        </ButtonLink>
      </Section>

      <Section title={t.profile.sectionData} className="mt-10">
        <Card>
          <CardBody>
            <h3 className="font-semibold">{t.profile.exportTitle}</h3>
            <p className="mt-1 text-sm text-sand-600">{t.profile.exportBody}</p>
            {/* A plain link, not a fetch: the browser handles the download and
                it works with JavaScript disabled. */}
            <ButtonLink href="/api/export" variant="secondary" className="mt-3" download>
              {t.profile.exportAction}
            </ButtonLink>
          </CardBody>
        </Card>
      </Section>

      <Section title={t.profile.sectionDanger} className="mt-10">
        <DangerZone
          labels={{
            title: t.profile.deleteTitle,
            body: t.profile.deleteBody,
            action: t.profile.deleteAction,
            confirmTitle: t.profile.deleteConfirmTitle,
            confirmBody: t.profile.deleteConfirmBody,
            confirmWord: t.profile.deleteConfirmWord,
            placeholder: t.profile.deleteConfirmPlaceholder,
            cancel: t.actions.cancel,
            working: t.actions.loading,
          }}
        />
      </Section>
    </PageShell>
  );
}
