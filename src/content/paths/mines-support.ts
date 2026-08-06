import { buildPath } from './builder';

export const minesSupport = buildPath({
  slug: 'mines-support',
  name: 'Métiers support du secteur minier',
  summary:
    'Comprendre le secteur minier et se préparer aux fonctions support : logistique, achats, administration, reporting.',
  description:
    'Le secteur minier emploie bien plus que des ingénieurs et des opérateurs. Autour de chaque site gravitent des fonctions support et des sous-traitants qui recrutent : magasiniers, assistants achats, agents administratifs, appui RH et finance, agents de reporting. Ce parcours vous prépare à ces fonctions et à comprendre le secteur avant de postuler.',
  caution:
    'Ce parcours ne forme à aucun métier minier réglementé. Les postes techniques et d’exploitation exigent des diplômes, des certifications et des formations de sécurité délivrées par des organismes habilités. Vérifiez toujours les exigences officielles d’un poste avant de vous engager dans une préparation.',
  audience: [
    'Vous vivez près d’une zone minière ou souhaitez y travailler',
    'Vous visez un poste administratif, logistique ou de support dans l’industrie',
    'Vous voulez comprendre ce que ces employeurs attendent avant de postuler',
  ],
  outcomes: [
    'Décrire l’organisation d’un site minier et ses familles de métiers',
    'Identifier les postes support réellement accessibles à votre profil',
    'Connaître les règles et le vocabulaire de base de la sécurité au travail',
    'Produire un rapport et un tableau de suivi conformes aux attentes du secteur',
    'Rechercher un employeur minier et préparer une candidature ciblée',
  ],
  prerequisites: [
    'Un niveau de français écrit correct',
    'Les bases du tableur (voir le parcours Compétences numériques)',
  ],
  sectorIds: ['mines', 'logistique', 'administration'],
  skillIds: [
    'mines-connaissance',
    'hse',
    'environnement-social',
    'tableur',
    'reporting-pro',
    'gestion-stock',
    'achats-support',
    'rh-support',
    'anglais-pro',
    'ethique-pro',
  ],
  level: 'intermediaire',
  featured: true,
  order: 4,
  icon: 'HardHat',
  projectIds: ['proj-min-rapport-hebdo', 'proj-min-suivi-stock'],
  stages: [
    {
      name: 'Comprendre le secteur',
      objective:
        'Savoir comment fonctionne un site minier, qui y travaille et qui recrute réellement.',
      skillIds: ['mines-connaissance', 'recherche-web'],
      estimatedMinutes: 180,
      resourceIds: ['res-itie-mali', 'res-chambre-mines-mali', 'res-icmm'],
      items: [
        {
          title: 'Le cycle d’un projet minier',
          description:
            'Exploration, développement, exploitation, traitement, fermeture. Chaque phase emploie des profils différents.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-icmm'],
        },
        {
          title: 'Qui emploie : opérateurs, sous-traitants, fournisseurs',
          description:
            'Beaucoup de recrutements passent par les sous-traitants, pas par la société minière elle-même.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-chambre-mines-mali'],
        },
        {
          title: 'Les sociétés actives au Mali',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-itie-mali'],
        },
        {
          title: 'Les contraintes du travail sur site',
          description:
            'Rotations, éloignement, hébergement, règles strictes. Il vaut mieux les connaître avant de postuler.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Ce que ce parcours ne couvre pas',
          description:
            'Les métiers réglementés exigent des habilitations officielles. Identifiez-les pour ne pas perdre de temps.',
          minutes: 20,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Cartographie du secteur',
        instructions: [
          'Identifiez cinq entreprises du secteur minier actives au Mali, opérateurs ou sous-traitants.',
          'Pour chacune, notez : activité, localisation, taille approximative, source de l’information.',
          'Listez les postes support que ce type d’entreprise emploie.',
          'Marquez ceux qui exigent une habilitation officielle et ceux qui n’en exigent pas.',
        ],
        deliverable:
          'Un tableau de cinq entreprises avec les postes support accessibles identifiés.',
      },
      checklist: [
        'J’ai identifié cinq entreprises réelles',
        'Chaque information a une source citée',
        'J’ai distingué les postes accessibles des postes réglementés',
        'Je sais qui recrute : l’opérateur ou le sous-traitant',
      ],
      reflection:
        'Qu’est-ce qui vous a le plus surpris dans l’organisation réelle du secteur ?',
      evidence: 'Une cartographie de cinq employeurs du secteur avec postes accessibles.',
      knowledgeCheck: [
        {
          question: 'Qui emploie généralement le plus de personnel autour d’un site minier ?',
          options: [
            'Uniquement la société minière',
            'La société minière et ses sous-traitants, ces derniers représentant souvent une large part des effectifs',
            'Uniquement l’État',
          ],
          answerIndex: 1,
          explanation:
            'Une part importante des emplois passe par les entreprises de sous-traitance : restauration, transport, maintenance, sécurité, nettoyage, logistique. C’est souvent la voie d’entrée la plus accessible.',
        },
      ],
    },
    {
      name: 'La sécurité, condition d’entrée',
      objective:
        'Comprendre la culture de sécurité du secteur et le vocabulaire employé, en français et en anglais.',
      skillIds: ['hse', 'anglais-pro', 'ethique-pro'],
      estimatedMinutes: 180,
      resourceIds: ['res-ilo-osh', 'res-icmm'],
      items: [
        {
          title: 'Pourquoi la sécurité prime sur la production',
          description:
            'Sur un site industriel, un candidat qui minimise la sécurité est écarté immédiatement.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-ilo-osh'],
        },
        {
          title: 'Danger, risque, prévention : le vocabulaire de base',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-ilo-osh'],
        },
        {
          title: 'Les équipements de protection individuelle',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Signaler un incident ou un presque-accident',
          description:
            'Le « near miss » est un incident sans blessure. Le signaler est valorisé, pas sanctionné.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-icmm'],
        },
        {
          title: 'Le vocabulaire HSE en anglais',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-icmm'],
        },
      ],
      practicalExercise: {
        title: 'Analyse de risques d’un lieu réel',
        instructions: [
          'Choisissez un lieu de travail que vous connaissez : atelier, boutique, champ, chantier, cuisine.',
          'Identifiez cinq dangers concrets.',
          'Pour chacun : décrivez le risque, sa gravité possible, et une mesure de prévention réaliste.',
          'Présentez le tout dans un tableau.',
        ],
        deliverable: 'Un tableau d’analyse de risques de cinq lignes sur un lieu réel.',
      },
      checklist: [
        'J’ai identifié cinq dangers réels',
        'Je distingue le danger du risque',
        'Chaque mesure de prévention est réalisable',
        'Je connais dix termes HSE en anglais',
      ],
      reflection:
        'Quel danger aviez-vous cessé de voir parce qu’il fait partie du quotidien ?',
      evidence: 'Une analyse de risques documentée sur un lieu de travail réel.',
      knowledgeCheck: [
        {
          question: 'Que signifie « near miss » dans le vocabulaire de la sécurité ?',
          options: [
            'Un accident grave',
            'Un événement qui aurait pu causer un accident mais n’en a pas causé',
            'Une absence non justifiée',
          ],
          answerIndex: 1,
          explanation:
            'Un presque-accident est une information précieuse : il révèle un risque avant qu’il ne blesse quelqu’un. Les entreprises sérieuses encouragent activement son signalement.',
        },
      ],
    },
    {
      name: 'Logistique et gestion de stock',
      objective:
        'Tenir un stock, gérer une réception et éviter les ruptures — le cœur de nombreux postes support.',
      skillIds: ['gestion-stock', 'tableur', 'fiabilite'],
      estimatedMinutes: 210,
      resourceIds: ['res-gcf-excel', 'res-exceleasy', 'res-openlearn'],
      items: [
        {
          title: 'Les principes de la gestion de stock',
          description: 'Entrées, sorties, stock théorique, stock réel, écart.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
        {
          title: 'Réception et contrôle de marchandise',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Construire une fiche de stock dans un tableur',
          minutes: 60,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Calculer un seuil de réapprovisionnement',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-exceleasy'],
        },
        {
          title: 'Réaliser un inventaire et expliquer un écart',
          description:
            'Un écart n’est pas un échec : ne pas savoir l’expliquer en est un.',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Un stock réel suivi pendant deux semaines',
        instructions: [
          'Choisissez un stock réel : marchandises d’un commerce, fournitures, récolte, matériel.',
          'Créez une fiche de stock avec entrées, sorties et stock calculé automatiquement.',
          'Suivez-la pendant deux semaines sans interruption.',
          'Réalisez un inventaire physique en fin de période et expliquez chaque écart.',
        ],
        deliverable:
          'Une fiche de stock tenue deux semaines, avec inventaire final et analyse des écarts.',
      },
      checklist: [
        'Le stock se calcule automatiquement par formule',
        'J’ai suivi le stock quatorze jours de suite',
        'J’ai fait un inventaire physique',
        'Je peux expliquer chaque écart constaté',
      ],
      reflection:
        'D’où venaient les écarts ? Erreur de saisie, oubli, perte ? Qu’est-ce que cela dit du processus ?',
      evidence: 'Une fiche de stock réelle avec inventaire et analyse des écarts.',
    },
    {
      name: 'Achats et relation fournisseurs',
      objective:
        'Préparer une demande d’achat, comparer des devis et suivre une commande.',
      skillIds: ['achats-support', 'negociation', 'ethique-pro', 'tableur'],
      estimatedMinutes: 180,
      resourceIds: ['res-openlearn', 'res-gcf-excel'],
      items: [
        {
          title: 'Le processus d’achat en entreprise',
          description: 'Besoin → demande → consultation → comparaison → commande → réception → paiement.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
        {
          title: 'Rédiger une demande de devis claire',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Comparer des offres objectivement',
          description: 'Le moins cher n’est pas toujours le moins coûteux : délai, qualité, fiabilité comptent.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Suivre une commande jusqu’à la livraison',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Éthique des achats',
          description:
            'Cadeaux, favoritisme, conflits d’intérêts : les entreprises structurées ont des règles strictes et les font respecter.',
          minutes: 30,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Une consultation fournisseurs complète',
        instructions: [
          'Choisissez un achat réel dont quelqu’un autour de vous a besoin.',
          'Rédigez une demande de devis précise : quantité, qualité attendue, délai, lieu de livraison.',
          'Obtenez trois devis réels auprès de trois fournisseurs.',
          'Construisez un tableau comparatif intégrant prix, délai, conditions et fiabilité.',
          'Rédigez une recommandation argumentée d’une demi-page.',
        ],
        deliverable:
          'Un dossier de consultation : demande de devis, trois devis, tableau comparatif et recommandation.',
      },
      checklist: [
        'Ma demande de devis est précise et sans ambiguïté',
        'J’ai obtenu trois devis réels',
        'Mon tableau compare autre chose que le seul prix',
        'Ma recommandation est argumentée',
      ],
      reflection:
        'Avez-vous recommandé le moins cher ? Si non, comment défendriez-vous ce choix devant un responsable ?',
      evidence:
        'Un dossier de consultation fournisseurs complet — pièce de portfolio très concrète pour un poste achats ou logistique.',
    },
    {
      name: 'Administration, RH et finance en appui',
      objective:
        'Maîtriser les tâches administratives attendues dans une fonction support industrielle.',
      skillIds: ['gestion-administrative', 'rh-support', 'comptabilite-base', 'fichiers-dossiers'],
      estimatedMinutes: 180,
      resourceIds: ['res-gcf-word', 'res-gcf-excel', 'res-indeed-guide-cv'],
      items: [
        {
          title: 'Classement et gestion documentaire',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-word'],
        },
        {
          title: 'Suivi des présences et des heures',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Bases du dossier du personnel',
          description: 'Confidentialité absolue : un dossier RH ne se commente jamais.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Factures, bons de commande, bons de livraison',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Appui au recrutement',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-indeed-guide-cv'],
        },
      ],
      practicalExercise: {
        title: 'Un système administratif complet',
        instructions: [
          'Créez un système de classement numérique pour une petite structure : dossiers, nommage, règles.',
          'Créez un tableau de suivi des présences sur un mois pour cinq personnes fictives.',
          'Créez un modèle de bon de commande et un modèle de bon de livraison.',
          'Rédigez une note d’une page expliquant comment utiliser ce système.',
        ],
        deliverable:
          'Un système de classement, deux modèles de documents et une note d’utilisation.',
      },
      checklist: [
        'Mon classement suit une règle explicite',
        'Le tableau de présence calcule automatiquement les totaux',
        'Mes modèles contiennent tous les champs indispensables',
        'Ma note est compréhensible par quelqu’un qui découvre le système',
      ],
      reflection:
        'Une nouvelle personne pourrait-elle utiliser votre système sans vous poser de question ? Si non, que manque-t-il ?',
      evidence: 'Un système administratif documenté avec modèles réutilisables.',
    },
    {
      name: 'Reporting et candidature ciblée',
      objective:
        'Produire un rapport hebdomadaire professionnel et construire une candidature adaptée au secteur.',
      skillIds: ['reporting-pro', 'communication-ecrite', 'analyse-offre', 'environnement-social'],
      estimatedMinutes: 210,
      resourceIds: ['res-itie-mali', 'res-indeed-guide-cv', 'res-gcf-excel'],
      items: [
        {
          title: 'La structure d’un rapport d’activité',
          description: 'Période, faits, chiffres, écarts, points d’attention, actions.',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Écrire des faits, pas des impressions',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Présenter des chiffres lisibles',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Enjeux environnementaux et communautaires',
          description:
            'Les grands opérateurs sont évalués sur ces sujets : les comprendre distingue un candidat.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-itie-mali'],
        },
        {
          title: 'Adapter son CV au secteur',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-indeed-guide-cv'],
        },
      ],
      practicalExercise: {
        title: 'Candidature complète pour un poste support',
        instructions: [
          'Trouvez une offre réelle de poste support dans l’industrie, ou utilisez l’exemple fourni dans l’analyseur d’offres.',
          'Analysez-la avec l’outil « Analyser une offre ».',
          'Adaptez votre CV en reprenant le vocabulaire de l’offre, sans rien inventer.',
          'Rédigez une lettre d’une demi-page reliant votre profil aux trois exigences principales.',
          'Préparez trois questions à poser à l’employeur.',
        ],
        deliverable:
          'Un dossier de candidature complet : analyse de l’offre, CV adapté, lettre et questions préparées.',
      },
      checklist: [
        'J’ai analysé l’offre exigence par exigence',
        'Mon CV reprend le vocabulaire de l’offre sans mensonge',
        'Ma lettre traite les trois exigences principales',
        'Mes trois questions montrent que j’ai étudié l’entreprise',
      ],
      reflection:
        'Quelle exigence de l’offre ne remplissez-vous pas ? Comment allez-vous en parler avant que le recruteur ne le fasse ?',
      evidence: 'Un dossier de candidature complet et ciblé.',
      knowledgeCheck: [
        {
          question: 'Dans un rapport d’activité, quelle formulation est professionnelle ?',
          options: [
            'La semaine s’est plutôt bien passée dans l’ensemble',
            '38 réceptions traitées sur 40 prévues ; 2 reportées faute de bon de livraison conforme',
            'Tout va bien, rien à signaler',
          ],
          answerIndex: 1,
          explanation:
            'Un rapport utile contient des faits chiffrés, l’écart avec le prévu et sa cause. Une appréciation générale n’aide personne à décider.',
        },
      ],
    },
  ],
});
