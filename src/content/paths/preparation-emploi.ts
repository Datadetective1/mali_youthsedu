import { buildPath } from './builder';

export const preparationEmploi = buildPath({
  slug: 'preparation-emploi',
  name: 'Préparation à l’emploi',
  summary:
    'De la définition de votre objectif à l’entretien : la préparation qui fait la différence entre deux candidats de même niveau.',
  description:
    'Selon les recruteurs, la plupart des candidatures échouent pour des raisons évitables : CV mal maîtrisé, entreprise non étudiée, exigences du poste non comprises, écarts non anticipés, valeur ajoutée jamais formulée. Ce parcours traite chacune de ces causes, dans l’ordre où elles se présentent.',
  audience: [
    'Vous cherchez activement un emploi',
    'Vous avez déjà postulé sans obtenir d’entretien',
    'Vous avez obtenu des entretiens sans aller plus loin',
    'Vous préparez votre première candidature',
  ],
  outcomes: [
    'Un objectif professionnel clair et réaliste',
    'Un CV que vous savez défendre ligne par ligne',
    'Une méthode d’analyse d’offre reproductible',
    'Une proposition de valeur formulée en quelques phrases',
    'Des réponses préparées aux questions les plus fréquentes et les plus difficiles',
  ],
  prerequisites: [],
  sectorIds: ['administration', 'commerce', 'communication'],
  skillIds: [
    'analyse-offre',
    'analyse-ecarts',
    'communication-ecrite',
    'communication-orale',
    'confiance',
    'conscience-de-soi',
    'proposition-valeur',
    'recherche-web',
    'feedback',
  ],
  level: 'debutant',
  featured: true,
  order: 5,
  icon: 'Briefcase',
  projectIds: ['proj-emp-dossier-candidature', 'proj-emp-analyse-trois-offres'],
  stages: [
    {
      name: 'Définir un objectif réaliste',
      objective:
        'Savoir quel poste vous visez, pourquoi, et si votre profil actuel le permet.',
      skillIds: ['conscience-de-soi', 'analyse-ecarts', 'pensee-critique'],
      estimatedMinutes: 150,
      resourceIds: ['res-indeed-guide-cv', 'res-anpe-mali'],
      items: [
        {
          title: 'Inventorier ce que vous savez déjà faire',
          description:
            'Y compris hors emploi : commerce familial, travaux agricoles, entraide, responsabilités associatives.',
          minutes: 40,
          kind: 'reflexion',
        },
        {
          title: 'Identifier trois métiers accessibles',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-anpe-mali'],
        },
        {
          title: 'Vérifier ce que le marché demande réellement',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-indeed-guide-cv'],
        },
        {
          title: 'Choisir une cible principale et une cible de repli',
          minutes: 20,
          kind: 'reflexion',
        },
        {
          title: 'Écrire votre objectif en une phrase',
          minutes: 20,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Votre objectif professionnel',
        instructions: [
          'Listez vingt choses que vous savez faire, sans filtre.',
          'Cherchez dix offres réelles correspondant à trois métiers envisagés.',
          'Notez pour chaque métier les exigences qui reviennent le plus souvent.',
          'Choisissez une cible principale et écrivez en une phrase : le poste, le secteur, la zone géographique.',
        ],
        deliverable:
          'Un objectif professionnel écrit en une phrase, appuyé sur dix offres réelles analysées.',
      },
      checklist: [
        'J’ai listé vingt capacités réelles',
        'J’ai examiné dix offres réelles',
        'J’ai une cible principale et une cible de repli',
        'Mon objectif tient en une phrase',
      ],
      reflection:
        'Votre objectif est-il ambitieux et atteignable, ou avez-vous choisi par facilité ou par peur ?',
      evidence: 'Un objectif professionnel écrit, documenté par une analyse du marché.',
    },
    {
      name: 'Construire et maîtriser son CV',
      objective:
        'Produire un CV clair et savoir défendre chaque ligne devant un recruteur.',
      skillIds: ['communication-ecrite', 'traitement-texte', 'conscience-de-soi'],
      estimatedMinutes: 210,
      resourceIds: ['res-europass-cv', 'res-canva-cv', 'res-indeed-guide-cv'],
      items: [
        {
          title: 'Ce qu’un recruteur regarde en dix secondes',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-indeed-guide-cv'],
        },
        {
          title: 'Structurer un CV sans expérience professionnelle',
          description:
            'Projets, bénévolat, travaux scolaires, activité familiale : ce sont des expériences si elles sont décrites précisément.',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Décrire une expérience en résultats',
          description:
            '« Tenue de la caisse » devient « Tenue quotidienne de la caisse, environ 40 transactions par jour, sans écart constaté sur six mois ».',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Mettre en forme et exporter',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-europass-cv', 'res-canva-cv'],
        },
        {
          title: 'Maîtriser son CV : trois questions par ligne',
          description:
            'Que faisiez-vous ? Quel résultat ? Qu’en avez-vous appris qui serve à ce poste ?',
          minutes: 40,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Votre CV et son interrogatoire',
        instructions: [
          'Rédigez un CV d’une page dans l’espace « Mon CV ».',
          'Pour chaque ligne, écrivez les réponses aux trois questions de maîtrise.',
          'Faites relire le CV par deux personnes différentes.',
          'Demandez à l’une d’elles de vous interroger sur trois lignes au hasard.',
        ],
        deliverable:
          'Un CV d’une page en PDF, plus un document de maîtrise couvrant chaque ligne.',
      },
      checklist: [
        'Mon CV tient sur une page',
        'Chaque expérience contient au moins un élément concret ou chiffré',
        'Je peux défendre chaque ligne sans hésiter',
        'Deux personnes l’ont relu',
        'Aucune information n’est fausse ou exagérée',
      ],
      reflection:
        'Quelle ligne de votre CV avez-vous le plus de mal à défendre ? Faut-il la retravailler ou la retirer ?',
      evidence: 'Un CV maîtrisé, prêt à être défendu en entretien.',
      knowledgeCheck: [
        {
          question: 'Quelle description d’expérience est la plus convaincante ?',
          options: [
            'Vendeur — bonne relation avec les clients',
            'Vendeur — accueil de 30 à 50 clients par jour, gestion de la caisse, réassort quotidien du rayon',
            'Vendeur — dynamique, motivé, sérieux',
          ],
          answerIndex: 1,
          explanation:
            'Les faits et les volumes se vérifient et se discutent. Les adjectifs ne prouvent rien : tous les candidats se disent motivés.',
        },
      ],
    },
    {
      name: 'Analyser une offre en profondeur',
      objective:
        'Comprendre ce qu’un employeur cherche réellement derrière l’intitulé du poste.',
      skillIds: ['analyse-offre', 'pensee-critique', 'analyse-ecarts'],
      estimatedMinutes: 180,
      resourceIds: ['res-indeed-guide-cv', 'res-wttj-entretien'],
      items: [
        {
          title: 'Lire une offre : intitulé, missions, profil, implicite',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-indeed-guide-cv'],
        },
        {
          title: 'Distinguer l’exigé de l’apprécié',
          description:
            'Postuler sans remplir 100 % des critères est normal. Ignorer un critère éliminatoire ne l’est pas.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Identifier le problème que ce poste doit résoudre',
          minutes: 40,
          kind: 'reflexion',
        },
        {
          title: 'Utiliser l’analyseur d’offres',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Repérer les thèmes probables de l’entretien',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-wttj-entretien'],
        },
      ],
      practicalExercise: {
        title: 'Trois offres décortiquées',
        instructions: [
          'Choisissez trois offres réelles correspondant à votre objectif.',
          'Analysez chacune avec l’outil « Analyser une offre ».',
          'Pour chaque offre, listez : trois exigences que vous remplissez, deux que vous ne remplissez pas.',
          'Identifiez ce qui revient dans les trois offres : c’est votre priorité d’apprentissage.',
        ],
        deliverable:
          'Trois analyses d’offres et une liste priorisée de vos écarts récurrents.',
      },
      checklist: [
        'J’ai analysé trois offres réelles',
        'Je distingue les exigences éliminatoires des autres',
        'J’ai identifié mes écarts récurrents',
        'Je sais quel apprentissage traiter en priorité',
      ],
      reflection:
        'Quelle exigence revient dans les trois offres et vous manque ? Que faites-vous à ce sujet cette semaine ?',
      evidence: 'Trois analyses d’offres documentées avec plan de comblement des écarts.',
    },
    {
      name: 'Étudier l’employeur',
      objective:
        'Arriver en entretien en sachant ce que fait l’entreprise et pourquoi vous voulez y travailler.',
      skillIds: ['recherche-web', 'pensee-critique', 'communication-orale'],
      estimatedMinutes: 150,
      resourceIds: ['res-itie-mali', 'res-chambre-mines-mali', 'res-wttj-entretien'],
      items: [
        {
          title: 'Ce qu’il faut savoir avant un entretien',
          description:
            'Activité, taille, implantations, clients, actualités récentes, concurrents.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Où chercher l’information',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-itie-mali', 'res-chambre-mines-mali'],
        },
        {
          title: 'Utiliser son réseau réel',
          description:
            'Quelqu’un de votre entourage connaît peut-être cette entreprise. C’est la source la plus fiable.',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'Transformer une recherche en question intelligente',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-wttj-entretien'],
        },
        {
          title: 'Formuler « pourquoi cette entreprise »',
          minutes: 20,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Dossier employeur',
        instructions: [
          'Choisissez une entreprise que vous visez réellement.',
          'Remplissez la check-list « Étudier l’employeur » dans la préparation à l’emploi.',
          'Rédigez une fiche d’une page : activité, taille, implantations, actualité, ce qui vous attire.',
          'Préparez trois questions que vous poseriez en entretien, dont aucune n’a sa réponse sur la page d’accueil du site.',
        ],
        deliverable: 'Une fiche employeur d’une page et trois questions préparées.',
      },
      checklist: [
        'Je sais ce que l’entreprise vend ou produit',
        'Je connais une actualité récente la concernant',
        'Je peux dire pourquoi elle m’intéresse en particulier',
        'Mes trois questions ne trouvent pas leur réponse sur le site',
      ],
      reflection:
        'Si l’entretien commençait par « que savez-vous de nous ? », que répondriez-vous en une minute ?',
      evidence: 'Une fiche employeur documentée avec questions préparées.',
    },
    {
      name: 'Formuler sa valeur',
      objective:
        'Expliquer en quelques phrases ce que vous apportez, du point de vue de l’employeur.',
      skillIds: ['proposition-valeur', 'communication-orale', 'confiance'],
      estimatedMinutes: 150,
      resourceIds: ['res-star-method', 'res-ted-talks-confiance'],
      items: [
        {
          title: 'Pourquoi « je suis motivé » ne convainc personne',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Passer de la qualité au résultat',
          description: '« Rigoureux » devient « aucun écart de caisse sur six mois ».',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Utiliser le générateur de proposition de valeur',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Préparer « parlez-moi de vous »',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-star-method'],
        },
        {
          title: 'Confiance sans arrogance',
          minutes: 10,
          kind: 'reflexion',
          resourceIds: ['res-ted-talks-confiance'],
        },
      ],
      practicalExercise: {
        title: 'Votre proposition de valeur',
        instructions: [
          'Complétez les six questions du générateur de proposition de valeur.',
          'Relisez et réécrivez chaque texte produit avec vos propres mots.',
          'Dites votre présentation de trente secondes à voix haute dix fois.',
          'Testez-la sur trois personnes et demandez ce qu’elles ont retenu.',
        ],
        deliverable:
          'Une présentation de trente secondes, une accroche de CV et deux réponses d’entretien préparées.',
      },
      checklist: [
        'Ma présentation dure trente secondes',
        'Elle contient au moins un fait concret',
        'Rien n’y est inventé',
        'Trois personnes ont retenu le message principal',
      ],
      reflection:
        'Qu’ont retenu vos testeurs ? Est-ce bien ce que vous vouliez faire passer ?',
      evidence: 'Une proposition de valeur formulée et testée.',
    },
    {
      name: 'Entretien, relance et refus',
      objective:
        'Préparer l’entretien, poser vos questions, relancer proprement et apprendre d’un refus.',
      skillIds: ['communication-orale', 'confiance', 'feedback', 'ethique-pro'],
      estimatedMinutes: 210,
      resourceIds: ['res-star-method', 'res-wttj-entretien', 'res-indeed-guide-cv'],
      items: [
        {
          title: 'La check-list de préparation',
          minutes: 30,
          kind: 'pratique',
        },
        {
          title: 'La méthode STAR',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-star-method'],
        },
        {
          title: 'Préparer trois exemples réutilisables',
          description: 'Une réussite, une difficulté surmontée, un travail en équipe.',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Les questions difficiles',
          description:
            'Vos défauts, un échec, un trou dans votre parcours, vos prétentions salariales.',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-wttj-entretien'],
        },
        {
          title: 'Après l’entretien : remerciement et relance',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-indeed-guide-cv'],
        },
        {
          title: 'Apprendre d’un refus',
          minutes: 20,
          kind: 'reflexion',
        },
      ],
      practicalExercise: {
        title: 'Entretien blanc complet',
        instructions: [
          'Préparez par écrit huit réponses dans l’espace « Préparer l’entretien ».',
          'Construisez trois exemples STAR complets.',
          'Demandez à quelqu’un de mener un entretien blanc de vingt minutes.',
          'Notez les trois questions qui vous ont le plus déstabilisé et retravaillez-les.',
          'Rédigez le message de remerciement que vous enverriez.',
        ],
        deliverable:
          'Huit réponses rédigées, trois exemples STAR, un entretien blanc réalisé et un message de remerciement.',
      },
      checklist: [
        'J’ai préparé au moins huit réponses écrites',
        'J’ai trois exemples STAR complets',
        'J’ai réalisé un entretien blanc avec une autre personne',
        'J’ai préparé trois questions à poser',
        'J’ai rédigé mon message de remerciement à l’avance',
      ],
      reflection:
        'Quelle question vous a le plus déstabilisé pendant l’entretien blanc ? Quelle réponse préparez-vous maintenant ?',
      evidence:
        'Un dossier de préparation d’entretien complet, testé lors d’un entretien blanc.',
      knowledgeCheck: [
        {
          question: 'Combien de temps après un entretien faut-il relancer sans réponse ?',
          options: [
            'Le lendemain',
            'Environ sept à dix jours, une seule fois, poliment',
            'Jamais : cela dérange',
          ],
          answerIndex: 1,
          explanation:
            'Une relance unique après une semaine montre l’intérêt sans harceler. Relancer tous les jours nuit ; ne jamais relancer fait passer pour peu motivé.',
        },
      ],
    },
  ],
});
