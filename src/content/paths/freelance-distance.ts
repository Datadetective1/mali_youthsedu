import { buildPath } from './builder';

export const freelanceDistance = buildPath({
  slug: 'freelance-distance',
  name: 'Freelance et travail à distance',
  summary:
    'Ce que le freelance est réellement, comment construire un portfolio, trouver des clients et éviter les arnaques.',
  description:
    'Le travail à distance ouvre de vraies opportunités, mais il est aussi entouré de promesses fausses. Ce parcours commence par une mise au point honnête sur les revenus et les délais, puis construit méthodiquement ce qui compte : une compétence vendable, des preuves, une proposition claire, une communication client fiable et une vigilance sérieuse face aux arnaques.',
  audience: [
    'Vous voulez travailler pour des clients hors de votre ville',
    'Vous avez une compétence mais aucun client',
    'Vous avez déjà été démarché par de fausses offres en ligne',
  ],
  outcomes: [
    'Une compétence choisie et vendable, décrite précisément',
    'Un portfolio de trois réalisations démontrables',
    'Un modèle de proposition et de devis',
    'Une méthode de communication client fiable',
    'La capacité à reconnaître une arnaque avant d’y perdre du temps ou de l’argent',
  ],
  prerequisites: [
    'Un accès internet régulier, au moins quelques heures par semaine',
    'Les bases de la bureautique',
  ],
  sectorIds: ['numerique', 'entrepreneuriat', 'communication'],
  skillIds: [
    'freelance-proposition',
    'portfolio',
    'pricing',
    'communication-ecrite',
    'anglais-pro',
    'gestion-temps',
    'securite-numerique',
    'ethique-pro',
    'fiabilite',
  ],
  level: 'intermediaire',
  featured: false,
  order: 7,
  icon: 'Globe',
  projectIds: ['proj-fre-portfolio', 'proj-fre-proposition'],
  stages: [
    {
      name: 'Comprendre ce qu’est vraiment le freelance',
      objective:
        'Distinguer les promesses des réalités avant d’investir du temps.',
      skillIds: ['pensee-critique', 'conscience-de-soi'],
      estimatedMinutes: 120,
      resourceIds: ['res-upwork-guides', 'res-anti-arnaque-freelance'],
      items: [
        {
          title: 'Ce que le freelance implique réellement',
          description:
            'Irrégularité des revenus, prospection permanente, autodiscipline, aucune protection sociale automatique.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-upwork-guides'],
        },
        {
          title: 'Combien de temps avant les premiers revenus',
          description:
            'Plusieurs mois est la norme, pas l’exception. Toute promesse de revenu rapide doit alerter.',
          minutes: 20,
          kind: 'lecture',
        },
        {
          title: 'Les contraintes concrètes : connexion, électricité, paiement',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Reconnaître une arnaque',
          description:
            'Paiement demandé à l’avance, promesse de gain élevé sans compétence, urgence artificielle, refus de contrat écrit.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-anti-arnaque-freelance'],
        },
        {
          title: 'Décider en connaissance de cause',
          minutes: 10,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Votre bilan de faisabilité',
        instructions: [
          'Évaluez honnêtement : heures disponibles par semaine, fiabilité de votre connexion, accès à l’électricité, moyen de paiement possible.',
          'Estimez combien de mois vous pouvez tenir sans revenu freelance.',
          'Listez trois arnaques que vous avez déjà croisées et ce qui aurait dû vous alerter.',
          'Écrivez votre décision : je me lance, je me prépare d’abord, ou je choisis une autre voie.',
        ],
        deliverable: 'Un bilan de faisabilité écrit avec une décision argumentée.',
      },
      checklist: [
        'J’ai évalué mes contraintes réelles',
        'Je sais combien de mois je peux tenir sans revenu',
        'Je reconnais les signes d’une arnaque',
        'Ma décision est écrite et argumentée',
      ],
      reflection:
        'Qu’est-ce qui vous attire dans le freelance : la liberté, le revenu, ou l’absence d’alternative ? La réponse change la façon de s’y préparer.',
      evidence: 'Un bilan de faisabilité honnête et documenté.',
      knowledgeCheck: [
        {
          question: 'Un « client » demande 15 000 FCFA pour vous inscrire sur sa plateforme. Que faites-vous ?',
          options: [
            'Vous payez : c’est un investissement',
            'Vous refusez : un vrai client vous paie, il ne vous facture pas le droit de travailler',
            'Vous négociez le montant',
          ],
          answerIndex: 1,
          explanation:
            'L’argent va toujours du client vers le prestataire. Toute demande inverse avant le début du travail est une arnaque, sans exception qui vaille la peine d’être testée.',
        },
      ],
    },
    {
      name: 'Choisir une compétence vendable',
      objective:
        'Sélectionner une compétence que vous pouvez atteindre et que des clients paient réellement.',
      skillIds: ['conscience-de-soi', 'recherche-web', 'pensee-critique'],
      estimatedMinutes: 150,
      resourceIds: ['res-upwork-guides', 'res-google-ateliers', 'res-coursera-audit'],
      items: [
        {
          title: 'Les compétences accessibles depuis le Mali',
          description:
            'Saisie et traitement de données, assistance administrative à distance, traduction français-anglais, création de visuels simples, gestion de réseaux sociaux, rédaction.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-upwork-guides'],
        },
        {
          title: 'Vérifier la demande réelle',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Évaluer le temps nécessaire pour être crédible',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Le rôle décisif de l’anglais',
          description:
            'La majorité des missions internationales se traitent en anglais écrit. C’est souvent le vrai facteur limitant.',
          minutes: 20,
          kind: 'lecture',
        },
        {
          title: 'Choisir et se former',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-coursera-audit', 'res-google-ateliers'],
        },
      ],
      practicalExercise: {
        title: 'Étude de trois compétences',
        instructions: [
          'Choisissez trois compétences envisageables.',
          'Pour chacune, trouvez cinq annonces réelles de mission et notez le tarif affiché.',
          'Estimez le temps nécessaire pour atteindre un niveau crédible.',
          'Choisissez-en une et écrivez pourquoi.',
        ],
        deliverable:
          'Une comparaison de trois compétences avec tarifs relevés et un choix argumenté.',
      },
      checklist: [
        'J’ai relevé quinze annonces réelles',
        'Je connais les tarifs pratiqués',
        'J’ai estimé mon temps de montée en compétence',
        'Mon choix est écrit et argumenté',
      ],
      reflection:
        'La compétence choisie est-elle celle qui vous plaît, celle qui paie, ou celle que vous pouvez atteindre le plus vite ? Idéalement, les trois se recoupent en partie.',
      evidence: 'Une étude comparative de compétences avec choix argumenté.',
    },
    {
      name: 'Construire un portfolio sans client',
      objective:
        'Produire trois réalisations démontrables alors que vous n’avez encore aucun client.',
      skillIds: ['portfolio', 'initiative', 'communication-ecrite'],
      estimatedMinutes: 210,
      resourceIds: ['res-upwork-guides', 'res-canva-cv', 'res-google-ateliers'],
      items: [
        {
          title: 'Le problème de l’œuf et de la poule',
          description:
            'Pas de client sans preuve, pas de preuve sans client. La sortie est de créer les preuves vous-même.',
          minutes: 20,
          kind: 'lecture',
        },
        {
          title: 'Trois façons honnêtes de créer des preuves',
          description:
            'Projet personnel, travail bénévole pour une structure locale, refonte volontaire d’un travail existant présentée comme exercice.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-upwork-guides'],
        },
        {
          title: 'Réaliser trois travaux complets',
          minutes: 90,
          kind: 'pratique',
        },
        {
          title: 'Présenter une réalisation : contexte, tâche, résultat',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-canva-cv'],
        },
        {
          title: 'Publier son portfolio',
          minutes: 20,
          kind: 'pratique',
          resourceIds: ['res-google-ateliers'],
        },
      ],
      practicalExercise: {
        title: 'Trois pièces de portfolio',
        instructions: [
          'Réalisez trois travaux complets dans votre compétence choisie.',
          'Au moins un doit être fait pour une personne ou une structure réelle, même gratuitement.',
          'Pour chacun, écrivez : le contexte, ce qui était demandé, ce que vous avez fait, le résultat.',
          'Indiquez explicitement lorsqu’il s’agit d’un exercice personnel et non d’une commande client.',
          'Rassemblez le tout dans un document ou une page accessible en ligne.',
        ],
        deliverable: 'Un portfolio de trois réalisations décrites honnêtement.',
      },
      checklist: [
        'J’ai trois réalisations complètes',
        'Au moins une a été faite pour quelqu’un de réel',
        'Chaque réalisation indique son contexte réel ou son statut d’exercice',
        'Mon portfolio est consultable par un client',
      ],
      reflection:
        'Un client sceptique regarderait votre portfolio : qu’est-ce qui le rassurerait, qu’est-ce qui l’inquiéterait ?',
      evidence: 'Un portfolio de trois réalisations présentées honnêtement.',
      knowledgeCheck: [
        {
          question:
            'Vous avez refait le visuel d’un commerce local sans qu’il vous l’ait demandé. Comment le présenter ?',
          options: [
            'Comme une mission réalisée pour ce commerce',
            'Comme un exercice personnel réalisé à partir d’un cas réel, en le précisant',
            'Sans mentionner le commerce concerné',
          ],
          answerIndex: 1,
          explanation:
            'Présenter un exercice comme une commande est un mensonge qui se vérifie en un appel. Le présenter honnêtement comme un exercice démontre à la fois la compétence et l’intégrité.',
        },
      ],
    },
    {
      name: 'Trouver des clients et proposer',
      objective: 'Rédiger une proposition qui répond au besoin, et fixer un prix défendable.',
      skillIds: ['freelance-proposition', 'pricing', 'anglais-pro', 'communication-ecrite'],
      estimatedMinutes: 180,
      resourceIds: ['res-upwork-guides', 'res-business-english-pod', 'res-ilo-siyb'],
      items: [
        {
          title: 'Où trouver des missions',
          description:
            'Plateformes internationales, mais aussi et surtout réseau local, associations, commerçants, ONG.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-upwork-guides'],
        },
        {
          title: 'Lire une demande client et repérer le vrai besoin',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Structurer une proposition',
          description:
            'Compréhension du besoin, ce que vous ferez, ce que vous ne ferez pas, délai, prix, conditions.',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Fixer son tarif',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-ilo-siyb'],
        },
        {
          title: 'Écrire une proposition en anglais',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-business-english-pod'],
        },
      ],
      practicalExercise: {
        title: 'Cinq propositions envoyées',
        instructions: [
          'Créez un modèle de proposition réutilisable.',
          'Identifiez cinq demandes réelles, locales ou en ligne.',
          'Envoyez cinq propositions personnalisées : la première phrase doit montrer que vous avez lu la demande.',
          'Notez les réponses obtenues et ce qui distinguait celles qui ont abouti.',
        ],
        deliverable:
          'Un modèle de proposition et cinq propositions réellement envoyées, avec leur suivi.',
      },
      checklist: [
        'Mon modèle précise le périmètre, le délai et le prix',
        'Chaque proposition est personnalisée',
        'J’ai envoyé cinq propositions réelles',
        'Je sais expliquer mon tarif',
      ],
      reflection:
        'Parmi vos cinq propositions, laquelle a reçu la meilleure réponse ? Qu’avait-elle de différent ?',
      evidence: 'Un modèle de proposition et cinq envois documentés.',
    },
    {
      name: 'Travailler proprement et durer',
      objective:
        'Tenir ses délais, communiquer clairement, se faire payer et construire une réputation.',
      skillIds: ['fiabilite', 'gestion-temps', 'communication-ecrite', 'ethique-pro', 'visio'],
      estimatedMinutes: 180,
      resourceIds: ['res-remote-work-guide', 'res-anti-arnaque-freelance', 'res-mindtools-communication'],
      items: [
        {
          title: 'La communication écrite avec un client distant',
          description:
            'Confirmer par écrit, annoncer un retard avant l’échéance, poser les questions tôt.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-remote-work-guide'],
        },
        {
          title: 'Organiser son temps sans supérieur',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Se faire payer : acompte, jalons, moyens de paiement',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-anti-arnaque-freelance'],
        },
        {
          title: 'Gérer un client mécontent',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Construire sa réputation',
          description:
            'Demander un témoignage écrit après chaque mission réussie. C’est votre principal actif.',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Votre système de travail',
        instructions: [
          'Créez un modèle de message de démarrage de mission : ce qui est convenu, délai, prix, modalité de paiement.',
          'Créez un modèle de point d’avancement hebdomadaire.',
          'Créez un modèle de demande de témoignage.',
          'Testez le système sur une mission réelle, même bénévole.',
        ],
        deliverable: 'Trois modèles de communication client, testés sur une mission réelle.',
      },
      checklist: [
        'Mes modèles couvrent démarrage, suivi et clôture',
        'Je demande un acompte ou je travaille par jalons',
        'J’ai testé le système sur une mission réelle',
        'J’ai obtenu au moins un témoignage écrit',
      ],
      reflection:
        'Qu’est-ce qui rend un prestataire agréable à travailler avec, indépendamment de la qualité technique ?',
      evidence:
        'Un système de communication client documenté et un témoignage obtenu.',
    },
  ],
});
