import { buildPath } from './builder';

export const savoirEtre = buildPath({
  slug: 'savoir-etre',
  name: 'Savoir-être et confiance professionnelle',
  summary:
    'Les qualités que les recruteurs évaluent en premier : fiabilité, communication, esprit d’équipe, initiative, confiance.',
  description:
    'Les recruteurs évaluent trois dimensions : le savoir-faire, le savoir-être et la capacité de réflexion. La deuxième et la troisième font échouer plus de candidatures que la première. Ce parcours travaille ce qui se juge en entretien et se confirme pendant la période d’essai : la fiabilité, la façon de communiquer, l’attitude en équipe, la capacité à résoudre un problème inhabituel et une confiance qui repose sur des faits.',
  audience: [
    'Vous avez les compétences techniques mais échouez en entretien',
    'On vous a dit que vous manquiez de confiance',
    'Vous préparez votre première expérience professionnelle',
    'Vous voulez évoluer vers un poste d’encadrement',
  ],
  outcomes: [
    'Une connaissance claire de vos forces et de vos limites, appuyée sur des faits',
    'Une communication professionnelle à l’écrit comme à l’oral',
    'Une méthode pour aborder un problème que vous n’avez jamais rencontré',
    'Des exemples STAR prêts pour un entretien',
    'Une confiance fondée sur des preuves, pas sur des encouragements',
  ],
  prerequisites: [],
  sectorIds: ['communication', 'administration', 'commerce'],
  skillIds: [
    'conscience-de-soi',
    'confiance',
    'fiabilite',
    'ponctualite',
    'travail-equipe',
    'adaptabilite',
    'leadership',
    'gestion-equipe',
    'resolution-problemes',
    'pensee-critique',
    'initiative',
    'creativite',
    'gestion-conflit',
    'feedback',
    'orientation-resultats',
    'ecoute-active',
  ],
  level: 'debutant',
  featured: false,
  order: 8,
  icon: 'Users',
  projectIds: ['proj-sav-star-portfolio', 'proj-sav-resolution-probleme'],
  stages: [
    {
      name: 'Se connaître honnêtement',
      objective:
        'Identifier vos forces et vos limites réelles, avec des preuves plutôt que des impressions.',
      skillIds: ['conscience-de-soi', 'feedback', 'pensee-critique'],
      estimatedMinutes: 150,
      resourceIds: ['res-mindtools-communication', 'res-openlearn'],
      items: [
        {
          title: 'Forces et limites : la différence entre croire et savoir',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
        {
          title: 'Chercher la preuve de chaque force revendiquée',
          description:
            'Si vous vous dites organisé, quel fait le démontre ? Sans fait, ce n’est pas une force, c’est une impression.',
          minutes: 40,
          kind: 'reflexion',
        },
        {
          title: 'Demander un retour à trois personnes',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Accepter une critique sans se justifier',
          minutes: 20,
          kind: 'reflexion',
        },
        {
          title: 'Écrire son bilan personnel',
          minutes: 20,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Votre bilan avec preuves',
        instructions: [
          'Listez cinq forces et trois limites.',
          'Pour chaque force, écrivez un fait précis qui la démontre.',
          'Demandez à trois personnes qui vous connaissent au travail ou dans un projet : quelle est ma principale force, quelle est ma principale limite ?',
          'Comparez leurs réponses aux vôtres et notez les écarts.',
        ],
        deliverable:
          'Un bilan personnel avec preuves et le retour de trois personnes.',
      },
      checklist: [
        'Chaque force revendiquée est appuyée par un fait',
        'J’ai obtenu trois retours extérieurs',
        'J’ai noté les écarts entre ma perception et la leur',
        'Je n’ai justifié aucune critique reçue',
      ],
      reflection:
        'Quel retour vous a le plus surpris ? Pourquoi ne le voyiez-vous pas vous-même ?',
      evidence: 'Un bilan personnel documenté par des faits et des retours extérieurs.',
      knowledgeCheck: [
        {
          question: 'En entretien, on vous demande votre principal défaut. Quelle réponse est la plus crédible ?',
          options: [
            'Je suis trop perfectionniste',
            'J’ai du mal à dire non, ce qui m’a déjà mis en retard ; depuis, j’annonce mes délais avant d’accepter',
            'Je n’ai pas de défaut particulier',
          ],
          answerIndex: 1,
          explanation:
            'Un vrai défaut, une conséquence concrète, et ce que vous avez mis en place. Les faux défauts déguisés en qualités sont repérés immédiatement.',
        },
      ],
    },
    {
      name: 'Fiabilité et conduite professionnelle',
      objective:
        'Devenir quelqu’un sur qui on peut compter — le critère le plus décisif en période d’essai.',
      skillIds: ['fiabilite', 'ponctualite', 'ethique-pro', 'gestion-temps'],
      estimatedMinutes: 150,
      resourceIds: ['res-mindtools-communication', 'res-remote-work-guide'],
      items: [
        {
          title: 'Pourquoi la fiabilité prime sur le talent',
          description:
            'Un collaborateur brillant mais imprévisible coûte plus cher qu’un collaborateur moyen et régulier.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Tenir un engagement : annoncer, faire, rendre compte',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Prévenir avant l’échéance, jamais après',
          minutes: 20,
          kind: 'lecture',
          resourceIds: ['res-remote-work-guide'],
        },
        {
          title: 'Ponctualité et présence',
          minutes: 20,
          kind: 'reflexion',
        },
        {
          title: 'Discrétion et confidentialité',
          minutes: 40,
          kind: 'lecture',
        },
      ],
      practicalExercise: {
        title: 'Deux semaines d’engagements tenus',
        instructions: [
          'Prenez trois engagements par semaine, avec une date précise, pendant deux semaines.',
          'Notez chacun dans un carnet ou un tableau.',
          'Cochez ce qui a été tenu, et pour ce qui ne l’a pas été, notez la cause réelle.',
          'Prévenez à l’avance chaque fois qu’un engagement ne pourra pas être tenu.',
        ],
        deliverable: 'Un relevé de deux semaines d’engagements avec taux de respect.',
      },
      checklist: [
        'J’ai pris six engagements datés',
        'J’ai suivi chacun par écrit',
        'J’ai prévenu à l’avance en cas d’empêchement',
        'Je connais mon taux réel de respect des engagements',
      ],
      reflection:
        'Quel pourcentage de vos engagements avez-vous tenu ? Qu’est-ce qui a fait échouer les autres ?',
      evidence: 'Un relevé d’engagements sur deux semaines — un fait vérifiable à citer en entretien.',
    },
    {
      name: 'Communiquer et écouter',
      objective:
        'Transmettre une information clairement et vérifier que vous avez bien compris l’autre.',
      skillIds: ['communication-orale', 'communication-ecrite', 'ecoute-active', 'presentation-orale'],
      estimatedMinutes: 180,
      resourceIds: ['res-mindtools-communication', 'res-ted-talks-confiance', 'res-tv5-apprendre'],
      items: [
        {
          title: 'Message clair : une idée, une phrase',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'L’écoute active et la reformulation',
          description:
            '« Si je comprends bien, vous voulez… » — cette phrase évite la moitié des erreurs de travail.',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Adapter son message à son interlocuteur',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-tv5-apprendre'],
        },
        {
          title: 'Parler devant un groupe',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-ted-talks-confiance'],
        },
        {
          title: 'Dire non et poser une limite',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Une présentation de cinq minutes',
        instructions: [
          'Choisissez un sujet que vous connaissez bien.',
          'Préparez une présentation de cinq minutes structurée en trois parties.',
          'Présentez-la devant au moins trois personnes.',
          'Demandez-leur ensuite de résumer votre message principal en une phrase.',
          'Si leur résumé ne correspond pas, retravaillez la structure et recommencez.',
        ],
        deliverable:
          'Une présentation de cinq minutes tenue devant un public réel, avec retours recueillis.',
      },
      checklist: [
        'Ma présentation dure cinq minutes',
        'Elle a une structure en trois parties',
        'Je l’ai tenue devant au moins trois personnes',
        'Elles ont pu résumer mon message correctement',
      ],
      reflection:
        'Ce que votre public a retenu correspond-il à ce que vous vouliez transmettre ? Si non, où était la perte ?',
      evidence: 'Une présentation orale réalisée devant un public réel.',
    },
    {
      name: 'Équipe, conflits et initiative',
      objective:
        'Travailler avec les autres, gérer un désaccord et prendre des initiatives utiles.',
      skillIds: ['travail-equipe', 'gestion-conflit', 'initiative', 'adaptabilite', 'leadership', 'gestion-equipe'],
      estimatedMinutes: 180,
      resourceIds: ['res-openlearn', 'res-mindtools-communication'],
      items: [
        {
          title: 'Ce qui fait fonctionner une équipe',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
        {
          title: 'Traiter un désaccord sans l’aggraver',
          description:
            'Séparer le problème de la personne, parler des faits, chercher l’intérêt commun.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Prendre une initiative utile',
          description:
            'Une bonne initiative résout un problème réel et ne crée pas de travail pour les autres.',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'S’adapter à un changement imposé',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Les bases de l’encadrement',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
      ],
      practicalExercise: {
        title: 'Une initiative menée à bien',
        instructions: [
          'Repérez dans votre entourage — famille, école, association, travail — un problème d’organisation réel.',
          'Proposez une amélioration à la personne concernée.',
          'Mettez-la en œuvre avec au moins une autre personne.',
          'Mesurez le résultat, même de façon approximative.',
          'Notez comment vous avez géré les désaccords rencontrés.',
        ],
        deliverable:
          'Un compte rendu d’initiative : problème, proposition, mise en œuvre, résultat, difficultés.',
      },
      checklist: [
        'Le problème traité était réel',
        'J’ai travaillé avec au moins une autre personne',
        'J’ai un résultat, même approximatif',
        'J’ai décrit honnêtement les difficultés',
      ],
      reflection:
        'Comment votre proposition a-t-elle été reçue ? Qu’est-ce que cela vous apprend sur la façon de proposer un changement ?',
      evidence:
        'Un compte rendu d’initiative — l’un des meilleurs exemples STAR possibles en entretien.',
      knowledgeCheck: [
        {
          question: 'Un collègue conteste publiquement votre travail. Quelle réaction est la plus professionnelle ?',
          options: [
            'Répondre immédiatement devant tout le monde pour ne pas perdre la face',
            'Écouter, remercier, puis proposer d’en reparler à deux avec les éléments concrets',
            'Ne rien dire et en parler à d’autres collègues ensuite',
          ],
          answerIndex: 1,
          explanation:
            'Un affrontement public durcit les positions et se retient longtemps. Un échange à deux, sur des faits, résout le fond sans coût relationnel.',
        },
      ],
    },
    {
      name: 'Réflexion, problèmes et confiance',
      objective:
        'Aborder un problème inconnu avec méthode et construire une confiance fondée sur des faits.',
      skillIds: ['resolution-problemes', 'pensee-critique', 'creativite', 'confiance', 'orientation-resultats'],
      estimatedMinutes: 180,
      resourceIds: ['res-mindtools-communication', 'res-khan-academy', 'res-ted-talks-confiance'],
      items: [
        {
          title: 'La méthode face à un problème inconnu',
          description:
            'Reformuler le problème, lister les faits, séparer ce qui est certain de ce qui est supposé, envisager trois options, choisir.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Les tests de recrutement de raisonnement',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-khan-academy'],
        },
        {
          title: 'Chercher une solution quand les moyens manquent',
          description:
            'La contrainte de moyens est une compétence en soi, très valorisée dans les contextes exigeants.',
          minutes: 30,
          kind: 'reflexion',
        },
        {
          title: 'Construire une confiance fondée sur des preuves',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-ted-talks-confiance'],
        },
        {
          title: 'Confiance et arrogance : la limite',
          minutes: 30,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Un problème réel résolu avec méthode',
        instructions: [
          'Choisissez un problème concret que vous n’avez jamais résolu.',
          'Appliquez la méthode : reformulation, faits, hypothèses, trois options, choix argumenté.',
          'Mettez en œuvre la solution retenue.',
          'Écrivez ce qui a fonctionné et ce qui a échoué.',
          'Complétez ensuite l’inventaire des preuves dans « Confiance et posture ».',
        ],
        deliverable:
          'Un compte rendu de résolution de problème et un inventaire de dix preuves de capacité.',
      },
      checklist: [
        'J’ai reformulé le problème avant de chercher une solution',
        'J’ai envisagé au moins trois options',
        'J’ai mis en œuvre une solution et mesuré le résultat',
        'J’ai listé dix réussites personnelles vérifiables',
      ],
      reflection:
        'Relisez votre inventaire de preuves. Qu’est-ce que ces dix faits disent de vous, que vous n’osiez pas affirmer ?',
      evidence:
        'Un compte rendu de résolution de problème et un inventaire de preuves de capacité.',
      knowledgeCheck: [
        {
          question:
            'En entretien, on vous pose une question technique dont vous ignorez la réponse. Que faire ?',
          options: [
            'Inventer une réponse plausible',
            'Dire que vous ne savez pas, expliquer comment vous chercheriez la réponse, et citer un cas où vous avez appris vite',
            'Changer de sujet',
          ],
          answerIndex: 1,
          explanation:
            'Les recruteurs posent souvent ces questions pour observer votre réaction, pas pour vérifier un savoir. Reconnaître une limite et montrer une méthode vaut mieux qu’un bluff qui s’effondrera.',
        },
      ],
    },
  ],
});
