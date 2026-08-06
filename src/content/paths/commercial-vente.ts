import { buildPath } from './builder';

export const commercialVente = buildPath({
  slug: 'commercial-vente',
  name: 'Commercial et vente',
  summary:
    'Le profil le plus recherché : comprendre un besoin, prospecter, convaincre, suivre et rendre compte.',
  description:
    'Les recruteurs cherchent en permanence des profils commerciaux, et beaucoup de postes s’ouvrent à des candidats sans diplôme spécialisé. Ce parcours enseigne le métier tel qu’il se pratique : découvrir un besoin réel, prospecter avec méthode, traiter une objection, construire une relation durable et suivre ses résultats.',
  audience: [
    'Vous cherchez un premier emploi et acceptez un métier de terrain',
    'Vous vendez déjà quelque chose sans avoir appris la méthode',
    'Vous voulez un métier où le résultat compte plus que le diplôme',
  ],
  outcomes: [
    'Conduire un entretien de vente structuré',
    'Construire et travailler une liste de prospects',
    'Traiter les objections les plus courantes sans agressivité',
    'Tenir un fichier de suivi client',
    'Présenter vos résultats de façon claire et chiffrée',
  ],
  prerequisites: ['Savoir lire, écrire et compter'],
  sectorIds: ['commerce', 'communication'],
  skillIds: [
    'vente-techniques',
    'prospection',
    'relation-client',
    'negociation',
    'strategie-commerciale',
    'crm',
    'suivi-resultats',
    'ecoute-active',
    'orientation-resultats',
  ],
  level: 'debutant',
  featured: true,
  order: 3,
  icon: 'Handshake',
  projectIds: ['proj-com-simulation-vente', 'proj-com-fichier-prospection'],
  stages: [
    {
      name: 'Comprendre le besoin avant de vendre',
      objective:
        'Apprendre à poser des questions et à écouter, au lieu de réciter un argumentaire.',
      skillIds: ['ecoute-active', 'etude-besoin', 'relation-client'],
      estimatedMinutes: 180,
      resourceIds: ['res-hubspot-academy-vente', 'res-mindtools-communication'],
      items: [
        {
          title: 'Pourquoi la découverte précède l’argumentation',
          description:
            'Un vendeur moyen parle. Un bon vendeur pose des questions et écoute la réponse.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-hubspot-academy-vente'],
        },
        {
          title: 'Les questions ouvertes',
          description: 'Comment faites-vous aujourd’hui ? Qu’est-ce qui vous gêne le plus ?',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Distinguer le besoin exprimé du besoin réel',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Reformuler pour vérifier',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Prendre des notes pendant un échange',
          minutes: 40,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Cinq entretiens de découverte',
        instructions: [
          'Choisissez un produit ou service vendu autour de vous.',
          'Interrogez cinq clients ou clients potentiels réels pendant dix minutes chacun.',
          'Posez uniquement des questions ouvertes : ne vendez rien.',
          'Notez leurs réponses mot pour mot autant que possible.',
          'Repérez ce qui revient chez plusieurs personnes.',
        ],
        deliverable:
          'Cinq comptes rendus d’entretien et une synthèse des trois besoins les plus fréquents.',
      },
      checklist: [
        'J’ai interrogé cinq personnes réelles',
        'J’ai posé au moins cinq questions ouvertes à chacune',
        'J’ai pris des notes pendant l’échange',
        'J’ai identifié un besoin que je n’avais pas anticipé',
      ],
      reflection:
        'Qu’avez-vous entendu qui contredisait ce que vous pensiez savoir sur ces clients ?',
      evidence: 'Une synthèse de cinq entretiens clients avec les besoins récurrents identifiés.',
      knowledgeCheck: [
        {
          question: 'Quelle question est une vraie question ouverte ?',
          options: [
            'Vous êtes satisfait de votre fournisseur ?',
            'Comment vous approvisionnez-vous aujourd’hui ?',
            'Vous voulez acheter maintenant ?',
          ],
          answerIndex: 1,
          explanation:
            'Une question ouverte ne peut pas se répondre par oui ou non. Elle oblige le client à décrire sa situation, et c’est là que se trouve l’information utile.',
        },
      ],
    },
    {
      name: 'Prospecter avec méthode',
      objective:
        'Construire une liste de prospects, préparer une approche et tenir un rythme de contacts régulier.',
      skillIds: ['prospection', 'gestion-temps', 'fiabilite'],
      estimatedMinutes: 210,
      resourceIds: ['res-hubspot-academy-vente', 'res-openclassrooms-prospection'],
      items: [
        {
          title: 'Définir sa cible',
          description: 'Vendre à tout le monde revient à ne vendre à personne.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-openclassrooms-prospection'],
        },
        {
          title: 'Construire une liste de prospects',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Préparer une accroche de trente secondes',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-hubspot-academy-vente'],
        },
        {
          title: 'Prendre contact : en personne, par téléphone, par message',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Organiser le suivi et la relance',
          description:
            'La majorité des ventes se font après plusieurs contacts, pas au premier.',
          minutes: 40,
          kind: 'lecture',
        },
      ],
      practicalExercise: {
        title: 'Trente prospects, dix contacts',
        instructions: [
          'Constituez une liste de trente prospects réels et qualifiés pour un produit de votre choix.',
          'Pour chacun, notez : nom, activité, contact, raison de le contacter.',
          'Contactez-en réellement dix.',
          'Notez le résultat de chaque contact et la date de relance prévue.',
        ],
        deliverable: 'Un fichier de trente prospects avec dix contacts effectivement réalisés.',
      },
      checklist: [
        'Ma liste contient trente prospects qualifiés',
        'J’ai une raison précise de contacter chacun',
        'J’ai réalisé dix contacts réels',
        'Chaque contact a une date de relance',
      ],
      reflection:
        'Sur dix contacts, combien ont abouti à un échange réel ? Qu’est-ce qui distinguait ceux qui ont répondu ?',
      evidence: 'Un fichier de prospection renseigné, avec historique et relances planifiées.',
    },
    {
      name: 'Conduire l’entretien de vente',
      objective:
        'Mener un entretien complet, de l’accroche à la conclusion, sans forcer la main.',
      skillIds: ['vente-techniques', 'communication-orale', 'confiance'],
      estimatedMinutes: 210,
      resourceIds: ['res-hubspot-academy-vente', 'res-coursera-audit'],
      items: [
        {
          title: 'Les étapes d’un entretien de vente',
          description: 'Accueil → découverte → proposition → objections → conclusion → suivi.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-hubspot-academy-vente'],
        },
        {
          title: 'Argumenter en bénéfices, pas en caractéristiques',
          description:
            'Le client n’achète pas « une batterie de 5000 mAh », il achète « deux jours sans recharger ».',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Présenter un prix sans s’excuser',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Conclure : demander la décision',
          description: 'Beaucoup de ventes échouent simplement parce que personne n’a conclu.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-coursera-audit'],
        },
        {
          title: 'Accepter un refus proprement',
          minutes: 40,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Argumentaire complet',
        instructions: [
          'Choisissez un produit ou service réel.',
          'Rédigez un argumentaire complet : accroche, cinq questions de découverte, trois bénéfices, présentation du prix, phrase de conclusion.',
          'Testez-le auprès de trois personnes réelles.',
          'Notez après chaque essai ce qui a fonctionné et ce qui a bloqué.',
        ],
        deliverable: 'Un argumentaire de vente écrit et testé trois fois.',
      },
      checklist: [
        'Mon argumentaire couvre les six étapes',
        'Chaque argument est formulé en bénéfice client',
        'Je sais annoncer le prix sans hésiter',
        'Je l’ai testé auprès de trois personnes',
      ],
      reflection:
        'À quel moment de l’entretien vous sentez-vous le moins à l’aise ? Pourquoi selon vous ?',
      evidence: 'Un argumentaire de vente structuré, testé sur le terrain.',
      knowledgeCheck: [
        {
          question: 'Un client dit « je vais réfléchir ». Quelle est la meilleure réaction ?',
          options: [
            'Insister immédiatement pour qu’il décide maintenant',
            'Accepter, demander ce qui le fait hésiter, et convenir d’une date de rappel',
            'Le laisser partir sans rien dire',
          ],
          answerIndex: 1,
          explanation:
            '« Je vais réfléchir » cache presque toujours une objection non exprimée. Poser la question fait avancer la vente ; insister la tue ; ne rien dire la perd.',
        },
      ],
    },
    {
      name: 'Traiter les objections',
      objective:
        'Répondre aux résistances les plus fréquentes sans agressivité et sans se dévaloriser.',
      skillIds: ['negociation', 'gestion-conflit', 'confiance'],
      estimatedMinutes: 180,
      resourceIds: ['res-openclassrooms-prospection', 'res-mindtools-communication'],
      items: [
        {
          title: 'Une objection est un signe d’intérêt',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'La méthode : écouter, reformuler, répondre, vérifier',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-mindtools-communication'],
        },
        {
          title: 'Les objections de prix',
          description: '« C’est trop cher » signifie souvent « je ne vois pas encore la valeur ».',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-openclassrooms-prospection'],
        },
        {
          title: 'Les objections de confiance',
          description: '« Je ne vous connais pas » — la réponse est la preuve, pas l’insistance.',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Savoir renoncer à une vente',
          description:
            'Vendre à quelqu’un qui n’en a pas besoin détruit la relation et la réputation.',
          minutes: 40,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Votre catalogue d’objections',
        instructions: [
          'Listez les dix objections que vous entendez ou entendriez le plus souvent.',
          'Pour chacune, écrivez une réponse en quatre temps : écoute, reformulation, réponse, vérification.',
          'Faites-vous poser ces objections par une autre personne, sans préparation.',
          'Corrigez les réponses qui sonnaient faux.',
        ],
        deliverable: 'Un catalogue de dix objections avec réponses préparées et testées.',
      },
      checklist: [
        'J’ai dix objections réelles listées',
        'Chaque réponse suit la méthode en quatre temps',
        'Je les ai testées à l’oral',
        'Je sais reconnaître un cas où il faut renoncer',
      ],
      reflection:
        'Quelle objection vous met le plus en difficulté ? Est-ce parce que vous n’avez pas de réponse, ou parce que vous doutez de votre offre ?',
      evidence: 'Un catalogue de traitement des objections.',
    },
    {
      name: 'Fidéliser et suivre',
      objective:
        'Construire une relation durable et tenir un outil de suivi, même simple.',
      skillIds: ['relation-client', 'crm', 'fiabilite', 'ethique-pro'],
      estimatedMinutes: 180,
      resourceIds: ['res-trailhead-vente', 'res-hubspot-academy-vente', 'res-gcf-excel'],
      items: [
        {
          title: 'Pourquoi un client existant vaut plus qu’un nouveau',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-hubspot-academy-vente'],
        },
        {
          title: 'Le suivi après-vente',
          description: 'Un appel une semaine après livraison change la relation entière.',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Traiter une réclamation',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Les principes d’un CRM',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-trailhead-vente'],
        },
        {
          title: 'Construire un CRM dans un tableur',
          description:
            'Vous n’avez pas besoin d’un logiciel payant pour tenir un fichier client rigoureux.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
      ],
      practicalExercise: {
        title: 'Votre fichier client',
        instructions: [
          'Construisez dans un tableur un fichier client avec : nom, contact, besoin, dernier échange, prochaine action, date.',
          'Renseignez au moins vingt lignes à partir de vos contacts réels de l’étape 2.',
          'Ajoutez un filtre sur « prochaine action » pour voir ce qui est en retard.',
          'Utilisez-le réellement pendant deux semaines.',
        ],
        deliverable: 'Un fichier de suivi client utilisé pendant deux semaines.',
      },
      checklist: [
        'Mon fichier contient au moins vingt clients ou prospects',
        'Chaque ligne a une prochaine action datée',
        'Je l’ai réellement mis à jour pendant deux semaines',
        'Je peux dire en dix secondes qui rappeler aujourd’hui',
      ],
      reflection:
        'Combien de contacts auriez-vous oubliés sans ce fichier ? Que représente cela en opportunités perdues ?',
      evidence:
        'Un fichier de suivi client tenu pendant deux semaines — preuve directe de rigueur commerciale.',
    },
    {
      name: 'Stratégie et résultats',
      objective:
        'Se fixer des objectifs, suivre ses chiffres et savoir en rendre compte à un responsable.',
      skillIds: ['strategie-commerciale', 'suivi-resultats', 'orientation-resultats', 'leadership'],
      estimatedMinutes: 180,
      resourceIds: ['res-fun-mooc', 'res-gcf-excel', 'res-openlearn'],
      items: [
        {
          title: 'Se fixer un objectif atteignable et mesurable',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-fun-mooc'],
        },
        {
          title: 'Les indicateurs commerciaux de base',
          description:
            'Contacts, rendez-vous, propositions, ventes, panier moyen, taux de transformation.',
          minutes: 40,
          kind: 'lecture',
        },
        {
          title: 'Construire un tableau de bord simple',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-gcf-excel'],
        },
        {
          title: 'Rendre compte à un responsable',
          description: 'Chiffres, écarts, causes, actions correctives. Dans cet ordre.',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Vers l’encadrement d’équipe',
          minutes: 20,
          kind: 'lecture',
          resourceIds: ['res-openlearn'],
        },
      ],
      practicalExercise: {
        title: 'Un mois de suivi commercial',
        instructions: [
          'Fixez-vous un objectif chiffré réaliste sur quatre semaines.',
          'Suivez chaque semaine : contacts, échanges aboutis, propositions, ventes.',
          'Calculez votre taux de transformation.',
          'Rédigez un compte rendu d’une page : résultats, écart avec l’objectif, causes, actions pour le mois suivant.',
        ],
        deliverable:
          'Un tableau de bord de quatre semaines et un compte rendu d’activité d’une page.',
      },
      checklist: [
        'J’ai fixé un objectif chiffré au départ',
        'J’ai suivi mes indicateurs chaque semaine',
        'Je connais mon taux de transformation',
        'Mon compte rendu explique les écarts, pas seulement les chiffres',
      ],
      reflection:
        'Votre objectif initial était-il réaliste ? Qu’est-ce que l’écart vous apprend sur votre façon de travailler ?',
      evidence:
        'Un tableau de bord commercial et un compte rendu d’activité — exactement ce qu’un recruteur commercial demande à voir.',
      knowledgeCheck: [
        {
          question:
            'Vous avez contacté 100 prospects et conclu 8 ventes. Quel est votre taux de transformation ?',
          options: ['8 %', '12,5 %', '80 %'],
          answerIndex: 0,
          explanation:
            '8 ventes sur 100 contacts font 8 %. Connaître ce chiffre permet de savoir combien de contacts sont nécessaires pour atteindre un objectif — c’est la base du pilotage commercial.',
        },
      ],
    },
  ],
});
