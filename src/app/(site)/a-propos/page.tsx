import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { PageHeader, PageShell, Prose } from '@/components/layout/page';
import { BulletList, Card, CardBody, Notice, Section } from '@/components/ui';
import { ButtonLink } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.about.metaTitle, description: t.about.intro };
}

export default async function AboutPage() {
  const t = await getDictionary();

  const hrDemand = [
    'Profils commerciaux et de vente',
    'Profils liés au secteur minier',
    'Fonctions support des mines et de l’industrie',
    'Candidats ayant un potentiel d’encadrement',
  ];

  const hrFailures = [
    'Manque de confiance en soi',
    'Faible estime de soi',
    'Préparation insuffisante à l’entretien',
    'Mauvaise maîtrise de son propre CV',
    'Absence de recherche sur l’employeur',
    'Incompréhension des responsabilités du poste',
    'Aucune comparaison entre son profil et les exigences',
    'Écarts non identifiés et donc non expliqués',
    'Incapacité à formuler sa valeur ajoutée',
    'Difficulté à raisonner sur un problème inhabituel',
  ];

  return (
    <PageShell>
      <PageHeader title={t.about.title} description={t.about.intro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-bold">{t.about.beliefTitle}</h2>
            <p className="mt-2 text-sand-700">{t.about.beliefBody}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-bold">{t.about.northStarTitle}</h2>
            <p className="mt-2 text-sand-700">{t.about.northStarBody}</p>
          </CardBody>
        </Card>
      </div>

      <Section title={t.about.principlesTitle} className="mt-12">
        <ul className="grid gap-3 sm:grid-cols-2">
          {t.about.principles.map((principle) => (
            <li key={principle.title} className="rounded-[--radius-card] border border-sand-200 bg-white p-4">
              <h3 className="font-semibold">{principle.title}</h3>
              <p className="mt-1 text-sm text-sand-600">{principle.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.about.hrTitle} description={t.about.hrIntro} className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">{t.about.hrDemandTitle}</h3>
            <BulletList marker="check" className="mt-3" items={hrDemand} />
          </div>
          <div>
            <h3 className="font-semibold">{t.about.hrFailTitle}</h3>
            <p className="mt-1 text-sm text-sand-600">{t.about.hrFailIntro}</p>
            <BulletList className="mt-3 text-sand-700" items={hrFailures} />
          </div>
        </div>
      </Section>

      <Section title={t.about.scopeTitle} className="mt-12">
        <Notice tone="warning">
          <BulletList items={t.about.scopeItems} />
        </Notice>
      </Section>

      <Section title={t.about.contactTitle} className="mt-12">
        <Prose>
          <p>{t.about.contactBody}</p>
        </Prose>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">{t.footer.contact}</ButtonLink>
          <ButtonLink href="/parcours" variant="secondary">
            {t.nav.explore}
          </ButtonLink>
        </div>
      </Section>
    </PageShell>
  );
}
