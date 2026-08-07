export const jobs = {
  center: {
    metaTitle: 'Préparation à l’emploi',
    title: 'Préparation à l’emploi',
    intro:
      'La plupart des candidatures n’échouent pas par manque de capacité, mais par manque de préparation. Voici de quoi préparer chaque étape sérieusement.',
    disclaimer:
      'Cette plateforme ne garantit aucun recrutement. Elle vous aide à vous préparer, à comprendre ce qu’un employeur attend et à présenter honnêtement votre valeur.',
    progressTitle: 'Votre préparation',
    progressHint:
      'Cet indicateur reflète votre travail de préparation, pas vos chances d’être recruté.',
    modules: {
      cv: {
        title: 'Mon CV',
        summary: 'Construire un CV clair et savoir en défendre chaque ligne.',
      },
      analyzer: {
        title: 'Analyser une offre',
        summary: 'Comprendre ce que l’employeur cherche vraiment et vous situer.',
      },
      value: {
        title: 'Ma proposition de valeur',
        summary: 'Expliquer en quelques phrases ce que vous apportez.',
      },
      interview: {
        title: 'Préparer l’entretien',
        summary: 'Questions courantes, méthode STAR, réponses écrites, confiance.',
      },
      employer: {
        title: 'Étudier l’employeur',
        summary: 'Ce qu’il faut savoir sur une entreprise avant de la rencontrer.',
      },
      gaps: {
        title: 'Mes écarts de compétences',
        summary: 'Ce qui vous manque, et comment le combler ou l’expliquer.',
      },
      communication: {
        title: 'Communication professionnelle',
        summary: 'E-mails, appels, relances, prise de parole.',
      },
      confidence: {
        title: 'Confiance et posture',
        summary: 'Préparer sa présence sans arrogance ni effacement.',
      },
      checklist: {
        title: 'Check-list de candidature',
        summary: 'Ce qu’il faut avoir fait avant d’envoyer un dossier.',
      },
    },
    sixQuestionsTitle: 'Les six questions à savoir traiter',
    sixQuestions: [
      { q: 'Que cherche réellement l’employeur ?', a: 'Au-delà de l’intitulé : le problème que ce poste doit résoudre.' },
      { q: 'Quelles exigences est-ce que je remplis déjà ?', a: 'Avec un exemple précis pour chacune.' },
      { q: 'Où sont mes écarts ?', a: 'Les nommer avant que le recruteur ne le fasse.' },
      { q: 'Comment les compenser ou les expliquer ?', a: 'Une compétence proche, un apprentissage en cours, un plan crédible.' },
      { q: 'Quelle valeur précise puis-je apporter ?', a: 'Formulée en résultat pour l’employeur, pas en qualité personnelle.' },
      { q: 'Comment adapter mon CV et mes réponses ?', a: 'Reprendre le vocabulaire de l’offre, sans mentir.' },
    ],
  },

  analyzer: {
    metaTitle: 'Analyser une offre d’emploi',
    title: 'Analyser une offre d’emploi',
    intro:
      'Collez le texte d’une offre. Nous en extrayons les exigences, puis nous les comparons à votre profil.',
    pasteLabel: 'Texte de l’offre',
    pastePlaceholder:
      'Collez ici l’annonce complète : intitulé, missions, profil recherché, compétences, langues, logiciels…',
    pasteHint: 'Entre 80 et 20 000 caractères. Plus le texte est complet, meilleure est l’analyse.',
    titleLabel: 'Intitulé du poste',
    titleHint: 'Détecté automatiquement, corrigez si nécessaire.',
    companyLabel: 'Entreprise',
    companyHint: 'Facultatif. Utile pour préparer vos recherches sur l’employeur.',
    analyzeAction: 'Analyser cette offre',
    analyzing: 'Analyse en cours…',
    tooShort: 'Le texte est trop court pour être analysé. Collez l’annonce complète.',
    tooLong: 'Le texte est trop long. Collez uniquement l’annonce.',
    useExample: 'Utiliser un exemple',
    examplesTitle: 'Exemples d’offres',
    examplesIntro:
      'Des annonces réalistes rédigées pour la démonstration. Elles ne correspondent à aucun poste réellement ouvert.',
    exampleNotice:
      'Exemple pédagogique. Cette annonce est fictive et ne correspond à aucune offre réelle.',

    savedTitle: 'Mes analyses',
    savedEmpty: 'Vous n’avez pas encore analysé d’offre.',
    analyzedOn: 'Analysée le',
    deleteAnalysis: 'Supprimer cette analyse',

    extracted: {
      title: 'Ce que demande l’offre',
      jobTitle: 'Intitulé',
      responsibilities: 'Missions principales',
      requiredSkills: 'Compétences exigées',
      preferredSkills: 'Compétences appréciées',
      languages: 'Langues',
      tools: 'Logiciels et outils',
      education: 'Formation',
      experience: 'Expérience',
      behavioral: 'Attentes comportementales',
      keywords: 'Mots-clés à reprendre',
      keywordsHint:
        'Reprenez ces termes dans votre CV et vos réponses — uniquement pour ce que vous savez réellement faire.',
      interviewThemes: 'Thèmes probables en entretien',
      emptySection: 'Rien de détecté dans ce texte.',
    },

    comparison: {
      title: 'Votre profil face à l’offre',
      strong: 'Points forts',
      strongHint: 'Vous remplissez ces exigences. Préparez un exemple concret pour chacune.',
      partial: 'Correspondances partielles',
      partialHint:
        'Vous en avez une base. Montrez ce que vous savez déjà faire et ce que vous êtes en train d’apprendre.',
      missing: 'Exigences non couvertes',
      missingHint:
        'À traiter avant l’entretien : soit vous comblez, soit vous préparez une explication honnête.',
      transferable: 'Compétences transférables',
      transferableHint:
        'Acquises ailleurs, elles répondent en partie au besoin. Expliquez le lien explicitement.',
      experienceGap: 'Écart d’expérience',
      recommendedActions: 'Actions recommandées',
      questionsToResearch: 'À rechercher avant de postuler',
      examplesToPrepare: 'Exemples à préparer',
      noProfileTitle: 'Votre profil n’est pas encore renseigné',
      noProfileBody:
        'Sans profil, nous n’affichons que l’extraction de l’offre. Répondez au questionnaire pour obtenir la comparaison.',
      noProfileCta: 'Renseigner mon profil',
    },

    readiness: {
      title: 'Indice de préparation',
      scoreOf: '{score} sur 100',
      disclaimer:
        'Cet indice mesure votre préparation à cette candidature. Il ne prédit pas et ne garantit pas un recrutement. Un employeur décide sur bien d’autres critères.',
      howItWorks: 'Comment cet indice est calculé',
      breakdown: 'Détail du calcul',
      componentSkills: 'Compétences exigées couvertes',
      componentLanguages: 'Exigences linguistiques',
      componentTools: 'Logiciels et outils',
      componentExperience: 'Expérience',
      componentEducation: 'Formation',
      componentPreparation: 'Travail de préparation effectué',
      weight: 'Poids',
      bands: {
        low: 'Préparation à construire',
        lowBody:
          'Des écarts importants subsistent. Ce poste reste possible, mais préparez-le sérieusement ou visez d’abord un poste voisin.',
        medium: 'Préparation en cours',
        mediumBody:
          'Vous avez de vrais atouts et des écarts identifiables. Travaillez les points manquants et préparez vos exemples.',
        high: 'Bien préparé',
        highBody:
          'Votre profil correspond largement. Concentrez-vous sur vos exemples concrets et vos réponses aux questions difficiles.',
      },
    },

    sixQuestionsTitle: 'Préparez vos réponses',
    sixQuestions: {
      whyRole: 'Pourquoi ce poste ?',
      whyRoleHint: 'Ce qui vous attire dans les missions elles-mêmes, pas seulement le salaire.',
      whyCompany: 'Pourquoi cette entreprise ?',
      whyCompanyHint: 'Ce que vous avez appris sur elle et pourquoi cela vous parle.',
      whyMe: 'Pourquoi mon profil ?',
      whyMeHint: 'Deux ou trois éléments précis qui répondent au besoin de l’offre.',
      myGaps: 'Quels sont mes écarts ?',
      myGapsHint: 'Nommez-les honnêtement : un recruteur les verra de toute façon.',
      howCompensate: 'Comment vais-je les compenser ?',
      howCompensateHint: 'Un plan concret : formation en cours, compétence proche, apprentissage rapide démontré.',
      whatValue: 'Quelle valeur puis-je apporter ?',
      whatValueHint: 'Exprimée du point de vue de l’employeur.',
      saveAnswers: 'Enregistrer mes réponses',
      answersSaved: 'Réponses enregistrées.',
    },
  },

  valueProp: {
    metaTitle: 'Ma proposition de valeur',
    title: 'Ma proposition de valeur',
    intro:
      'Beaucoup de candidats savent faire des choses, mais ne savent pas les dire. Répondez à six questions et nous en tirons des formulations que vous pourrez réutiliser.',
    honestyNotice:
      'Nous construisons vos textes uniquement à partir de ce que vous écrivez. Aucune expérience, aucun diplôme et aucun résultat ne sera inventé.',
    q: {
      problem: 'Quel problème savez-vous aider à résoudre ?',
      problemHint: 'Exemple : « aider un commerce à retrouver des clients qui ne reviennent plus ».',
      skills: 'Quelles compétences mobilisez-vous pour cela ?',
      skillsHint: 'Trois maximum, les plus solides.',
      results: 'Quels résultats avez-vous déjà obtenus ?',
      resultsHint:
        'Même modestes et même hors emploi. Un chiffre, une durée ou une quantité rend le propos crédible.',
      proof: 'Qu’est-ce qui le démontre ?',
      proofHint: 'Projet, bénévolat, travail scolaire, activité familiale, expérience personnelle.',
      approach: 'Qu’est-ce qui rend votre façon de travailler utile ?',
      approachHint: 'Rigueur, écoute, débrouillardise, langues, connaissance du terrain…',
      motivation: 'Pourquoi ce secteur ou cette entreprise vous intéresse-t-il ?',
      motivationHint: 'Une raison sincère vaut mieux qu’une formule impressionnante.',
      targetRole: 'Poste ou secteur visé',
      targetRoleHint: 'Facultatif. Permet d’adapter la formulation.',
    },
    generateAction: 'Générer mes formulations',
    regenerateAction: 'Régénérer',
    generating: 'Génération…',
    outputs: {
      title: 'Vos formulations',
      intro:
        'Relisez-les, corrigez-les et appropriez-vous-les. Un texte que vous ne pouvez pas défendre ne vous sert à rien.',
      pitch: 'Présentation courte (30 secondes)',
      pitchHint: 'Pour une rencontre, un appel ou un salon de l’emploi.',
      cvSummary: 'Accroche de CV',
      cvSummaryHint: 'Trois à quatre lignes en haut de votre CV.',
      tellMeAboutYou: '« Parlez-moi de vous »',
      tellMeAboutYouHint: 'Structure : qui vous êtes, ce que vous savez faire, ce que vous cherchez.',
      whyHireYou: '« Pourquoi devrions-nous vous recruter ? »',
      whyHireYouHint: 'Répondez par le besoin de l’employeur, pas par vos qualités générales.',
      roleStatement: 'Phrase de valeur pour ce poste',
      copyAll: 'Tout copier',
      editable: 'Vous pouvez modifier chaque texte avant de l’enregistrer.',
    },
    emptyTitle: 'Commencez par répondre aux questions',
    emptyBody: 'Vos formulations apparaîtront ici.',
    savedOn: 'Enregistrée le',
  },

  interview: {
    metaTitle: 'Préparer l’entretien',
    title: 'Préparer l’entretien',
    intro:
      'Un entretien se prépare. Travaillez vos réponses à l’écrit : à l’oral, elles viendront plus facilement.',
    tabs: {
      checklist: 'Check-lists',
      questions: 'Questions',
      star: 'Méthode STAR',
      confidence: 'Confiance',
      askThem: 'Vos questions',
      followUp: 'Après l’entretien',
    },
    checklists: {
      preparationTitle: 'Préparation générale',
      cvMasteryTitle: 'Maîtrise de mon CV',
      cvMasteryIntro:
        'Un recruteur peut interroger n’importe quelle ligne de votre CV. Vous devez pouvoir défendre chacune d’elles.',
      companyResearchTitle: 'Recherche sur l’entreprise',
      logisticsTitle: 'Aspects pratiques',
      itemsDone: '{done} / {total}',
    },
    questions: {
      title: 'Questions d’entretien',
      filterCategory: 'Catégorie',
      filterAll: 'Toutes',
      categories: {
        generale: 'Questions générales',
        comportementale: 'Questions comportementales',
        commerciale: 'Commercial et vente',
        minier: 'Secteur minier et support',
        administrative: 'Administration et bureau',
        technique: 'Technique et numérique',
        motivation: 'Motivation et projet',
        difficile: 'Questions difficiles',
        entrepreneuriat: 'Entrepreneuriat et freelance',
      },
      whyAsked: 'Pourquoi cette question est posée',
      whatTheyListenFor: 'Ce que le recruteur écoute',
      trap: 'Le piège à éviter',
      structure: 'Structure de réponse conseillée',
      myAnswer: 'Ma réponse',
      myAnswerPlaceholder: 'Écrivez votre réponse comme vous la diriez à voix haute…',
      answerSaved: 'Réponse enregistrée',
      answeredCount: { one: '1 réponse préparée', other: '{n} réponses préparées' },
      practiceHint:
        'Écrivez d’abord, puis lisez à voix haute. Chronométrez : une bonne réponse dure une à deux minutes.',
      noAudioNotice:
        'Aucun enregistrement audio ou vidéo n’est demandé ni possible sur cette plateforme.',
    },
    star: {
      title: 'La méthode STAR',
      intro:
        'Pour toute question du type « racontez une situation où… », structurez votre réponse en quatre temps. C’est ce qui distingue une réponse vague d’une réponse crédible.',
      steps: [
        {
          letter: 'S',
          name: 'Situation',
          body: 'Le contexte, en deux phrases. Où, quand, avec qui.',
          example: 'Pendant la saison des pluies, la boutique de mon oncle perdait des clients réguliers.',
        },
        {
          letter: 'T',
          name: 'Tâche',
          body: 'Ce dont vous étiez responsable, précisément.',
          example: 'Il m’a demandé de comprendre pourquoi et de proposer une solution.',
        },
        {
          letter: 'A',
          name: 'Action',
          body: 'Ce que vous avez fait, vous. Utilisez « j’ai », pas « nous avons ».',
          example: 'J’ai appelé quinze clients habituels, noté leurs raisons, puis mis en place un carnet de suivi.',
        },
        {
          letter: 'R',
          name: 'Résultat',
          body: 'Ce que cela a produit. Un chiffre si possible, même approximatif et honnête.',
          example: 'Huit clients sur quinze sont revenus le mois suivant, et le carnet est toujours utilisé.',
        },
      ],
      commonMistakes: 'Erreurs fréquentes',
      mistakes: [
        'Rester dans la théorie sans jamais raconter une situation réelle.',
        'Dire « nous » en permanence : le recruteur veut savoir ce que vous avez fait vous.',
        'Oublier le résultat, qui est justement la partie qui convainc.',
        'Choisir un exemple trop long : deux minutes suffisent.',
      ],
      builderTitle: 'Construire un exemple STAR',
      builderIntro:
        'Préparez trois exemples réutilisables : une réussite, une difficulté surmontée, un travail en équipe.',
      builderSaved: 'Exemple enregistré.',
    },
    confidence: {
      title: 'Confiance et posture',
      intro:
        'Le manque de confiance est l’une des premières causes d’échec en entretien. La confiance se prépare, elle ne se décrète pas.',
      notTherapy:
        'Ces exercices sont des outils de préparation professionnelle. Ils ne constituent ni un diagnostic ni un accompagnement psychologique.',
      exercisesTitle: 'Exercices de préparation',
      exercises: [
        {
          title: 'L’inventaire des preuves',
          body: 'Écrivez dix choses que vous avez déjà réussies, même hors travail : un examen, une réparation, une médiation familiale, une récolte, une vente. La confiance vient de faits, pas d’encouragements.',
        },
        {
          title: 'La réponse au doute',
          body: 'Notez la phrase que vous vous dites quand vous doutez, puis écrivez une réponse factuelle. « Je n’ai pas d’expérience » devient « Je n’ai pas encore travaillé en entreprise, et j’ai mené ces trois projets ».',
        },
        {
          title: 'La répétition à voix haute',
          body: 'Lisez vos réponses debout, à voix haute, trois fois. Le but n’est pas d’apprendre par cœur mais d’habituer votre voix.',
        },
        {
          title: 'La question redoutée',
          body: 'Identifiez la question qui vous fait peur et rédigez-la en entier. Ce qui est écrit fait moins peur que ce qui est imaginé.',
        },
        {
          title: 'Confiance et arrogance',
          body: 'La confiance dit « je sais faire ceci, je ne sais pas encore cela, voici comment j’apprends ». L’arrogance prétend tout savoir. Les recruteurs distinguent immédiatement les deux.',
        },
      ],
      fearedQuestionLabel: 'La question que je redoute',
      fearedAnswerLabel: 'Ma réponse préparée',
      evidenceLabel: 'Mes preuves de capacité',
      evidencePlaceholder: 'Une réussite par ligne…',
    },
    askThem: {
      title: 'Les questions à poser',
      intro:
        'Ne jamais poser de question est interprété comme un manque d’intérêt. Préparez-en trois, posez-en deux.',
      avoid: 'À éviter en premier entretien',
      avoidItems: [
        'Commencer par le salaire et les congés.',
        'Poser une question dont la réponse est sur la première page du site de l’entreprise.',
        'Demander « combien de temps avant une promotion ? » avant même d’avoir le poste.',
      ],
    },
    followUp: {
      title: 'Après l’entretien',
      intro: 'Ce que vous faites après compte plus que ce que la plupart des candidats imaginent.',
      templateTitle: 'Modèle de message de remerciement',
      templateHint:
        'Adaptez-le. Un message générique se repère immédiatement. Mentionnez un point précis de l’échange.',
      rejectionTitle: 'Apprendre d’un refus',
      rejectionBody:
        'Un refus n’est pas un verdict sur votre valeur. Demandez poliment un retour, notez ce que vous auriez pu mieux préparer, et réutilisez-le pour la candidature suivante.',
      rejectionQuestions: [
        'Quelle question m’a le plus déstabilisé ?',
        'Quelle exigence de l’offre n’ai-je pas su traiter ?',
        'Qu’aurais-je dû préparer et que je n’avais pas préparé ?',
        'Quelle est la seule chose à améliorer avant la prochaine fois ?',
      ],
    },
  },

  cv: {
    metaTitle: 'Mon CV',
    title: 'Mon CV',
    intro:
      'Cet espace ne fabrique pas un CV à votre place. Il vous aide à rassembler les bons éléments, à les formuler correctement et à savoir en défendre chaque ligne.',
    sections: {
      identity: 'Identité et contact',
      headline: 'Titre et accroche',
      experience: 'Expériences',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      tools: 'Logiciels et outils',
      projects: 'Projets et réalisations',
      extras: 'Bénévolat et centres d’intérêt',
    },
    fields: {
      fullName: 'Nom complet',
      headline: 'Titre professionnel',
      headlineHint: 'Exemple : « Assistant commercial — prospection et suivi client ».',
      summary: 'Accroche',
      summaryHint: 'Trois à quatre lignes. Reprenez votre proposition de valeur.',
      phone: 'Téléphone',
      city: 'Ville',
      role: 'Intitulé',
      organisation: 'Organisation',
      period: 'Période',
      description: 'Ce que vous avez fait',
      descriptionHint:
        'Une ligne par action, commençant par un verbe. Ajoutez un résultat chiffré si vous en avez un.',
      diploma: 'Diplôme ou formation',
      institution: 'Établissement',
      year: 'Année',
      languageName: 'Langue',
      languageLevel: 'Niveau',
    },
    addExperience: 'Ajouter une expérience',
    addEducation: 'Ajouter une formation',
    addLanguage: 'Ajouter une langue',
    noExperienceTitle: 'Aucune expérience professionnelle ?',
    noExperienceBody:
      'C’est le cas de la plupart des candidats au premier emploi. Renseignez plutôt vos projets pratiques, votre bénévolat, vos travaux scolaires et le travail réalisé en famille. Ce sont des expériences, à condition de les décrire précisément.',
    importProjects: 'Importer mes projets pratiques',
    importedProjects: {
      one: '1 projet ajouté depuis votre portfolio.',
      other: '{n} projets ajoutés depuis votre portfolio.',
    },
    masteryTitle: 'Maîtriser mon CV',
    masteryIntro:
      'Pour chaque ligne de votre CV, vous devez pouvoir répondre à trois questions. Entraînez-vous ici.',
    masteryQuestions: [
      'Que faisiez-vous exactement ?',
      'Quel résultat ou quelle difficulté cela a-t-il produit ?',
      'Qu’en avez-vous appris qui serve à ce poste ?',
    ],
    previewTitle: 'Aperçu',
    printCv: 'Imprimer / enregistrer en PDF',
    printHint:
      'Utilisez l’impression du navigateur puis « Enregistrer au format PDF ». Aucun logiciel supplémentaire n’est nécessaire.',
    honestyNotice:
      'N’indiquez jamais un diplôme, une expérience ou un niveau de langue que vous n’avez pas. Une vérification suffit à faire échouer la candidature.',
  },

  employer: {
    metaTitle: 'Étudier l’employeur',
    title: 'Étudier l’employeur',
    intro:
      'Ne pas se renseigner sur l’entreprise est l’une des erreurs les plus fréquentes — et l’une des plus simples à éviter.',
    companyLabel: 'Entreprise étudiée',
    checklistTitle: 'Ce qu’il faut savoir',
    whereToLookTitle: 'Où chercher l’information',
    whereToLook: [
      'Le site officiel de l’entreprise : activités, implantations, actualités.',
      'Les pages de recrutement : le vocabulaire employé vous indique la culture.',
      'La presse économique locale et régionale.',
      'Les personnes que vous connaissez qui y travaillent ou y ont travaillé.',
      'Les rapports publics du secteur, notamment pour les entreprises minières.',
    ],
    notesLabel: 'Mes notes de recherche',
    notesPlaceholder:
      'Activité, taille, implantations, clients, actualités récentes, concurrents, ce qui vous intéresse…',
    offlineNotice:
      'Cette recherche nécessite une connexion. Préparez la liste des questions maintenant, cherchez les réponses quand vous serez connecté.',
  },

  checklist: {
    metaTitle: 'Check-list de candidature',
    title: 'Check-list de candidature',
    intro: 'À parcourir avant chaque envoi. Dix minutes qui changent le résultat.',
    completedTitle: 'Candidature prête',
    completedBody:
      'Vous avez couvert l’essentiel. Envoyez, notez la date, et préparez la relance.',
  },

  gaps: {
    metaTitle: 'Mes écarts de compétences',
    title: 'Mes écarts de compétences',
    intro:
      'Regroupe les exigences non couvertes détectées dans les offres que vous avez analysées, et ce que vous pouvez faire pour chacune.',
    empty: 'Analysez une offre pour identifier vos écarts.',
    fromAnalyses: { one: 'Issu de 1 offre analysée', other: 'Issu de {n} offres analysées' },
    frequency: { one: 'Demandé dans 1 offre', other: 'Demandé dans {n} offres' },
    actionLearn: 'Apprendre',
    actionExplain: 'Préparer une explication',
    statusTodo: 'À traiter',
    statusLearning: 'En cours d’apprentissage',
    statusAddressed: 'Traité',
    linkedPath: 'Parcours qui traite ce point',
  },

  communication: {
    metaTitle: 'Communication professionnelle',
    title: 'Communication professionnelle',
    intro:
      'Savoir communiquer est une compétence évaluée en soi. Un e-mail clair, un appel préparé et une relance polie vous distinguent.',
    templatesTitle: 'Modèles',
    templatesHint:
      'Adaptez chaque modèle. Un message copié tel quel se reconnaît immédiatement.',
    rulesTitle: 'Règles de base',
    rules: [
      'Un objet d’e-mail explicite : « Candidature — Assistant commercial — Awa Traoré ».',
      'Vouvoyez, ouvrez et fermez le message correctement.',
      'Un message court est un message lu. Cinq lignes suffisent souvent.',
      'Relisez avant d’envoyer : les fautes se remarquent.',
      'Une adresse e-mail sérieuse : prenom.nom, pas un pseudonyme.',
      'Répondez sous 24 heures quand un employeur vous écrit.',
      'Relancez une fois après sept à dix jours, poliment, puis passez à autre chose.',
    ],
    listeningTitle: 'L’écoute active',
    listeningBody:
      'En entretien comme au travail, reformuler ce que l’on vient de vous dire prouve que vous avez compris et vous laisse le temps de réfléchir : « Si je comprends bien, vous cherchez quelqu’un capable de… ».',
  },
};
