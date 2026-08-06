import { buildPath } from './builder';

export const entrepreneuriat = buildPath({
  slug: 'entrepreneuriat',
  name: 'Créer une activité',
  summary:
    'Partir d’un problème local réel, tester l’idée à faible coût, fixer un prix tenable et suivre ses comptes.',
  description:
    'Créer une activité n’est pas un plan de secours quand l’emploi manque : c’est un métier qui s’apprend. Ce parcours suit l’ordre qui limite les pertes — identifier un problème réel, parler à de vrais clients, tester avant d’investir, calculer un prix qui tient, puis tenir des comptes qui disent la vérité.',
  audience: [
    'Vous avez une idée d’activité mais ne savez pas par où commencer',
    'Vous vendez déjà quelque chose sans savoir si c’est rentable',
    'L’emploi salarié est difficile d’accès dans votre zone',
  ],
  outcomes: [
    'Un problème client validé auprès de personnes réelles',
    'Une offre décrite en une page',
    'Un prix calculé à partir de vos coûts réels',
    'Un test à faible coût réalisé et mesuré',
    'Un registre de recettes et de dépenses tenu régulièrement',
  ],
  prerequisites: ['Savoir compter et tenir des comptes simples'],
  sectorIds: ['entrepreneuriat', 'commerce', 'agriculture'],
  skillIds: [
    'etude-besoin',
    'proposition-valeur',
    'pricing',
    'budget',
    'tenue-registres',
    'test-idee',
    'marketing-digital',
    'ethique-pro',
    'initiative',
  ],
  level: 'debutant',
  featured: false,
  order: 6,
  icon: 'Sprout',
  projectIds: ['proj-ent-validation-idee', 'proj-ent-plan-action'],
  stages: [
    {
      name: 'Partir d’un problème, pas d’une idée',
      objective:
        'Identifier un problème réel et fréquent autour de vous, que des gens paieraient pour résoudre.',
      skillIds: ['etude-besoin', 'pensee-critique', 'initiative'],
      estimatedMinutes: 180,
      resourceIds: ['res-ilo-siyb', 'res-strategyzer-vpc'],
      items: [
        {
          title: 'Pourquoi les idées échouent : personne n’en avait besoin',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-ilo-siyb'],
        },
        {
          title: 'Observer les problèmes autour de soi',
          description:
            'Le temps perdu, l’argent gaspillé, les déplacements inutiles, les ruptures d’approvisionnement.',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Interroger dix personnes sans vendre',
          minutes: 60,
          kind: 'pratique',
        },
        {
          title: 'Distinguer un vrai problème d’un inconfort',
          description:
            'Un vrai problème est fréquent, coûteux et déjà « résolu » par un moyen insatisfaisant.',
          minutes: 30,
          kind: 'reflexion',
          resourceIds: ['res-strategyzer-vpc'],
        },
        {
          title: 'Choisir un problème et le décrire précisément',
          minutes: 20,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Dix entretiens problème',
        instructions: [
          'Listez cinq problèmes que vous observez régulièrement autour de vous.',
          'Choisissez-en un et interrogez dix personnes concernées.',
          'Demandez : à quelle fréquence ? Comment faites-vous aujourd’hui ? Combien cela vous coûte-t-il ?',
          'Ne proposez aucune solution pendant l’entretien.',
          'Écrivez le problème retenu en trois phrases précises.',
        ],
        deliverable: 'Dix comptes rendus d’entretien et une description du problème validé.',
      },
      checklist: [
        'J’ai interrogé dix personnes réellement concernées',
        'Je n’ai proposé aucune solution pendant les entretiens',
        'Je connais la fréquence et le coût du problème',
        'Mon problème tient en trois phrases',
      ],
      reflection:
        'Le problème que vous imaginiez au départ est-il celui que les gens vous ont décrit ? Qu’est-ce qui a changé ?',
      evidence: 'Un problème client validé auprès de dix personnes réelles.',
      knowledgeCheck: [
        {
          question: 'Quel signe indique qu’un problème vaut la peine d’être résolu ?',
          options: [
            'L’idée vous plaît beaucoup',
            'Les gens dépensent déjà du temps ou de l’argent pour le contourner',
            'Personne n’en parle',
          ],
          answerIndex: 1,
          explanation:
            'Un problème que les gens contournent déjà à leurs frais est un problème payé. C’est le signal le plus fiable d’un marché réel.',
        },
      ],
    },
    {
      name: 'Construire une offre claire',
      objective:
        'Décrire ce que vous proposez, à qui, et pourquoi c’est mieux que la solution actuelle.',
      skillIds: ['proposition-valeur', 'communication-ecrite'],
      estimatedMinutes: 150,
      resourceIds: ['res-strategyzer-vpc', 'res-fun-mooc'],
      items: [
        {
          title: 'Le canevas de proposition de valeur',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-strategyzer-vpc'],
        },
        {
          title: 'Définir votre client précisément',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Décrire l’offre en une page',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-fun-mooc'],
        },
        {
          title: 'Comparer honnêtement à l’existant',
          minutes: 20,
          kind: 'reflexion',
        },
        {
          title: 'Tester la description auprès de cinq personnes',
          minutes: 20,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Votre offre en une page',
        instructions: [
          'Rédigez une page décrivant : le client, son problème, votre solution, ce qui la distingue.',
          'Présentez-la à cinq personnes du profil visé.',
          'Demandez-leur de reformuler ce que vous proposez.',
          'Réécrivez la page si leur reformulation ne correspond pas à votre intention.',
        ],
        deliverable: 'Une description d’offre d’une page, comprise par cinq personnes sur cinq.',
      },
      checklist: [
        'Ma page décrit un client précis, pas « tout le monde »',
        'Le problème est celui validé à l’étape précédente',
        'Cinq personnes ont pu reformuler mon offre correctement',
        'Je sais dire en quoi je fais mieux que la solution actuelle',
      ],
      reflection:
        'Quand les gens reformulent votre offre, qu’ajoutent-ils ou qu’oublient-ils systématiquement ?',
      evidence: 'Une description d’offre validée par reformulation.',
    },
    {
      name: 'Prix, coûts et rentabilité',
      objective:
        'Calculer ce que vous coûte réellement une unité vendue et fixer un prix qui tient.',
      skillIds: ['pricing', 'budget', 'comptabilite-base'],
      estimatedMinutes: 180,
      resourceIds: ['res-ilo-siyb', 'res-gcf-excel', 'res-kiva-guides'],
      items: [
        {
          title: 'Coûts fixes et coûts variables',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-ilo-siyb'],
        },
        {
          title: 'Calculer un coût de revient complet',
          description:
            'Y compris votre temps. Un travail non payé est un coût caché qui finit par tuer l’activité.',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Fixer un prix et savoir le défendre',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Calculer le seuil de rentabilité',
          description: 'Combien devez-vous vendre pour ne rien perdre ?',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Financement : ce qu’il faut savoir avant d’emprunter',
          minutes: 20,
          kind: 'lecture',
          resourceIds: ['res-kiva-guides'],
        },
      ],
      practicalExercise: {
        title: 'Le calcul complet',
        instructions: [
          'Listez tous vos coûts fixes mensuels et tous vos coûts variables par unité.',
          'Intégrez votre temps de travail à un taux horaire, même modeste.',
          'Calculez votre coût de revient unitaire et fixez un prix de vente.',
          'Calculez combien d’unités il faut vendre chaque mois pour couvrir vos coûts.',
          'Vérifiez que ce volume est atteignable : sinon, revoyez l’offre ou le prix.',
        ],
        deliverable:
          'Un tableau de calcul de coûts et un seuil de rentabilité mensuel chiffré.',
      },
      checklist: [
        'J’ai listé tous mes coûts, fixes et variables',
        'J’ai valorisé mon propre temps',
        'Je connais mon seuil de rentabilité mensuel',
        'Ce volume est réaliste au vu de ma clientèle',
      ],
      reflection:
        'Votre prix initial couvrait-il vos coûts réels ? Beaucoup d’activités travaillent à perte sans le savoir.',
      evidence: 'Un calcul de coûts et un seuil de rentabilité documentés.',
      knowledgeCheck: [
        {
          question: 'Pourquoi faut-il compter son propre temps dans le coût de revient ?',
          options: [
            'Ce n’est pas nécessaire puisque ce temps est gratuit',
            'Parce qu’un prix qui ne rémunère pas votre travail rend l’activité intenable dès qu’elle grandit',
            'Uniquement si l’on emploie des salariés',
          ],
          answerIndex: 1,
          explanation:
            'Une activité qui ne paie pas votre temps ne peut ni durer ni embaucher. Le jour où vous devrez déléguer, le prix ne couvrira rien.',
        },
      ],
    },
    {
      name: 'Tester à faible coût',
      objective:
        'Vérifier que des gens paient réellement, avant d’engager de l’argent.',
      skillIds: ['test-idee', 'vente-techniques', 'suivi-resultats'],
      estimatedMinutes: 180,
      resourceIds: ['res-ilo-siyb', 'res-google-ateliers'],
      items: [
        {
          title: 'Le plus petit test possible',
          description:
            'Vendre dix unités à la main vaut mieux que construire une boutique avant d’avoir un client.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-ilo-siyb'],
        },
        {
          title: 'Définir ce qui prouverait que ça marche',
          description: 'Décidez du critère avant le test, pas après.',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Faire connaître son offre sans budget',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-google-ateliers'],
        },
        {
          title: 'Réaliser le test',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Décider : continuer, ajuster ou arrêter',
          minutes: 20,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Vendre dix fois',
        instructions: [
          'Fixez à l’avance votre critère de réussite, par exemple : dix ventes réelles en deux semaines.',
          'Réalisez le test avec le minimum d’investissement possible.',
          'Notez chaque contact, chaque vente et chaque refus, avec le motif.',
          'Comparez le résultat à votre critère et écrivez votre décision.',
        ],
        deliverable:
          'Un compte rendu de test : critère fixé, résultat obtenu, motifs de refus, décision.',
      },
      checklist: [
        'J’ai fixé mon critère avant de commencer',
        'J’ai engagé le minimum d’argent',
        'J’ai noté chaque refus et son motif',
        'J’ai écrit une décision claire',
      ],
      reflection:
        'Quel motif de refus revient le plus souvent ? Est-ce le prix, le besoin, ou la confiance ?',
      evidence: 'Un test de marché documenté avec décision argumentée.',
    },
    {
      name: 'Tenir ses comptes et durer',
      objective:
        'Enregistrer chaque mouvement d’argent, savoir si l’activité gagne, et travailler honnêtement.',
      skillIds: ['tenue-registres', 'budget', 'ethique-pro', 'gestion-temps'],
      estimatedMinutes: 180,
      resourceIds: ['res-ilo-siyb', 'res-gcf-excel'],
      items: [
        {
          title: 'Séparer l’argent de l’activité et l’argent personnel',
          description:
            'C’est la première cause de faillite des petites activités, avant même la concurrence.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-ilo-siyb'],
        },
        {
          title: 'Tenir un registre de recettes et de dépenses',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Calculer un résultat mensuel',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Éthique et réputation',
          description:
            'Dans une petite ville, votre réputation est votre principal actif commercial.',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Écrire un plan d’action à trois mois',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Un mois de comptes réels',
        instructions: [
          'Créez un registre avec date, nature, entrée, sortie, solde.',
          'Enregistrez chaque mouvement pendant un mois complet, sans exception.',
          'Calculez le résultat du mois.',
          'Rédigez un plan d’action à trois mois avec trois objectifs chiffrés.',
        ],
        deliverable: 'Un registre d’un mois, un résultat calculé et un plan d’action à trois mois.',
      },
      checklist: [
        'J’ai enregistré chaque mouvement pendant un mois',
        'L’argent de l’activité est séparé du mien',
        'Je connais mon résultat du mois',
        'Mon plan contient trois objectifs chiffrés',
      ],
      reflection:
        'Votre activité gagne-t-elle réellement de l’argent une fois votre temps compté ? Si non, qu’allez-vous changer ?',
      evidence:
        'Un registre comptable d’un mois et un plan d’action à trois mois — deux documents qui crédibilisent immédiatement un porteur de projet.',
    },
  ],
});
