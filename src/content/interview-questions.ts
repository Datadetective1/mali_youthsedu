import type { InterviewQuestion } from '@/lib/types';

/**
 * Interview question bank.
 *
 * Each entry says why the question is asked and what the recruiter is actually
 * listening for — that is the part candidates almost never get told, and it is
 * what turns rote answers into credible ones.
 */
export const interviewQuestions: InterviewQuestion[] = [
  // ===========================================================================
  // Générales
  // ===========================================================================
  {
    id: 'q-gen-parlez-de-vous',
    category: 'generale',
    question: 'Parlez-moi de vous.',
    whyAsked:
      'C’est presque toujours la première question. Elle sert à ouvrir l’entretien et à vérifier que vous savez structurer un propos sans vous perdre.',
    whatTheyListenFor: [
      'Une réponse structurée et courte, entre une et deux minutes',
      'Un lien explicite entre votre parcours et le poste',
      'Des faits plutôt que des adjectifs',
    ],
    trap: 'Raconter toute sa vie depuis l’enfance, ou répondre en trois phrases vagues.',
    structure: [
      'Qui vous êtes professionnellement, en une phrase',
      'Deux ou trois éléments de parcours utiles pour ce poste',
      'Ce que vous savez faire concrètement, avec un exemple',
      'Ce que vous cherchez et pourquoi ce poste',
    ],
  },
  {
    id: 'q-gen-pourquoi-poste',
    category: 'motivation',
    question: 'Pourquoi ce poste vous intéresse-t-il ?',
    whyAsked:
      'Pour distinguer une candidature ciblée d’un envoi massif. Un candidat qui postule partout coûte cher à recruter, car il partira à la première autre proposition.',
    whatTheyListenFor: [
      'Une référence précise aux missions décrites dans l’offre',
      'Une raison personnelle crédible, pas une formule creuse',
      'Une cohérence avec votre parcours et votre projet',
    ],
    trap: 'Répondre « parce que je cherche du travail » ou parler d’abord du salaire.',
    structure: [
      'Ce qui vous attire dans les missions elles-mêmes',
      'Le lien avec ce que vous savez déjà faire',
      'Ce que ce poste vous permettrait d’apprendre',
    ],
  },
  {
    id: 'q-gen-pourquoi-entreprise',
    category: 'motivation',
    question: 'Pourquoi notre entreprise ?',
    whyAsked:
      'C’est le test de préparation le plus simple et le plus discriminant. Ne pas s’être renseigné est interprété comme un manque d’intérêt réel.',
    whatTheyListenFor: [
      'Une information exacte sur l’entreprise',
      'Une actualité ou une particularité que vous avez cherchée',
      'Un lien entre ce qu’elle fait et ce qui vous intéresse',
    ],
    trap: 'Réciter la phrase d’accueil du site internet, ou dire « parce que c’est une grande entreprise ».',
    structure: [
      'Ce que vous avez compris de son activité',
      'Un élément précis que vous avez trouvé en vous renseignant',
      'Pourquoi cela vous parle personnellement',
    ],
  },
  {
    id: 'q-gen-pourquoi-vous',
    category: 'generale',
    question: 'Pourquoi devrions-nous vous recruter plutôt qu’un autre ?',
    whyAsked:
      'Pour voir si vous savez formuler votre valeur du point de vue de l’employeur, et non du vôtre.',
    whatTheyListenFor: [
      'Deux ou trois éléments précis répondant aux exigences de l’offre',
      'Une preuve associée à chacun',
      'De l’assurance sans arrogance',
    ],
    trap: 'Dénigrer les autres candidats, ou répondre par des qualités générales que tout le monde revendique.',
    structure: [
      'La principale exigence du poste telle que vous l’avez comprise',
      'Ce que vous apportez précisément sur ce point, avec une preuve',
      'Un second point différenciant',
      'Une phrase de conclusion tournée vers le besoin de l’employeur',
    ],
  },
  {
    id: 'q-gen-qualites-defauts',
    category: 'generale',
    question: 'Quelles sont vos qualités et vos défauts ?',
    whyAsked:
      'Pour évaluer votre lucidité. Un candidat incapable de nommer une vraie limite inquiète plus qu’il ne rassure.',
    whatTheyListenFor: [
      'Une qualité illustrée par un fait',
      'Un défaut réel, avec sa conséquence concrète',
      'Ce que vous avez mis en place pour le corriger',
    ],
    trap: 'Le faux défaut déguisé en qualité : « je suis trop perfectionniste », « je travaille trop ».',
    structure: [
      'Une qualité, un exemple précis qui la démontre',
      'Un défaut réel',
      'Une situation où il vous a posé problème',
      'La mesure concrète que vous avez prise depuis',
    ],
  },
  {
    id: 'q-gen-cinq-ans',
    category: 'motivation',
    question: 'Où vous voyez-vous dans cinq ans ?',
    whyAsked:
      'Pour évaluer votre projet et la probabilité que vous restiez assez longtemps pour que le recrutement soit rentable.',
    whatTheyListenFor: [
      'Une direction cohérente avec le poste proposé',
      'Une ambition réaliste',
      'Une envie de progresser plutôt qu’une envie de partir',
    ],
    trap: 'Annoncer un projet sans rapport avec le poste, ou répondre « je ne sais pas ».',
    structure: [
      'La compétence que vous voulez maîtriser d’ici là',
      'Le niveau de responsabilité visé',
      'En quoi ce poste est une étape logique vers cela',
    ],
  },
  {
    id: 'q-gen-salaire',
    category: 'difficile',
    question: 'Quelles sont vos prétentions salariales ?',
    whyAsked:
      'Pour vérifier que vos attentes et le budget du poste sont compatibles, et pour observer si vous vous êtes renseigné.',
    whatTheyListenFor: [
      'Une fourchette réaliste au regard du marché local',
      'Une réponse assumée, sans gêne excessive',
      'Une ouverture à la discussion',
    ],
    trap: 'Annoncer un chiffre au hasard, ou refuser catégoriquement de répondre.',
    structure: [
      'Renseignez-vous avant l’entretien sur les niveaux pratiqués pour ce poste',
      'Annoncez une fourchette plutôt qu’un chiffre unique',
      'Précisez que la fourchette est ouverte selon les responsabilités exactes',
    ],
  },
  {
    id: 'q-gen-questions-a-poser',
    category: 'generale',
    question: 'Avez-vous des questions ?',
    whyAsked:
      'Pour mesurer votre intérêt réel. Ne poser aucune question est presque toujours interprété négativement.',
    whatTheyListenFor: [
      'Des questions qui montrent que vous avez travaillé le sujet',
      'De l’intérêt pour le travail lui-même, pas seulement pour les conditions',
      'Une écoute de ce qui a été dit pendant l’entretien',
    ],
    trap: 'Répondre « non, tout est clair », ou commencer par les congés et le salaire.',
    structure: [
      'Une question sur le contenu du poste ou les priorités des premiers mois',
      'Une question sur l’équipe ou l’organisation',
      'Une question sur la suite du processus de recrutement',
    ],
  },

  // ===========================================================================
  // Comportementales
  // ===========================================================================
  {
    id: 'q-comp-difficulte',
    category: 'comportementale',
    question: 'Racontez-moi une situation difficile que vous avez gérée.',
    whyAsked:
      'Le comportement passé est le meilleur indicateur disponible du comportement futur. C’est le principe des questions comportementales.',
    whatTheyListenFor: [
      'Une situation réelle et précise, pas une généralité',
      'Votre rôle personnel, décrit avec « j’ai »',
      'Un résultat, même imparfait',
    ],
    trap: 'Rester dans le général, ou dire « nous » du début à la fin.',
    structure: [
      'Situation : le contexte en deux phrases',
      'Tâche : ce dont vous étiez responsable',
      'Action : ce que vous avez fait personnellement',
      'Résultat : ce que cela a produit',
    ],
  },
  {
    id: 'q-comp-echec',
    category: 'comportementale',
    question: 'Parlez-moi d’un échec.',
    whyAsked:
      'Pour évaluer votre honnêteté et votre capacité à apprendre. Un candidat sans aucun échec n’a rien tenté ou ne dit pas la vérité.',
    whatTheyListenFor: [
      'Un échec réel, assumé sans excuse',
      'Votre part de responsabilité',
      'Ce que vous avez changé ensuite',
    ],
    trap: 'Rejeter la faute sur les autres, ou présenter un faux échec sans conséquence.',
    structure: [
      'La situation et l’objectif visé',
      'Ce qui a échoué, et votre part dans cet échec',
      'Ce que vous en avez tiré',
      'Une situation ultérieure où vous avez fait autrement',
    ],
  },
  {
    id: 'q-comp-conflit',
    category: 'comportementale',
    question: 'Comment avez-vous géré un désaccord avec un collègue ou un responsable ?',
    whyAsked:
      'Les conflits mal gérés coûtent cher. Le recruteur veut savoir si vous savez traiter un désaccord sans l’envenimer.',
    whatTheyListenFor: [
      'Une approche centrée sur le problème, non sur la personne',
      'De l’écoute avant la réponse',
      'Une issue acceptable pour les deux parties',
    ],
    trap: 'Affirmer que vous n’avez jamais eu de désaccord, ou raconter une victoire écrasante.',
    structure: [
      'Le désaccord et son enjeu réel',
      'Ce que vous avez fait pour comprendre l’autre position',
      'Comment vous avez cherché une issue',
      'Le résultat et la relation ensuite',
    ],
  },
  {
    id: 'q-comp-equipe',
    category: 'comportementale',
    question: 'Décrivez un travail réalisé en équipe.',
    whyAsked:
      'Presque tous les postes impliquent de dépendre d’autres personnes. Le recruteur veut voir votre place réelle dans un collectif.',
    whatTheyListenFor: [
      'Votre contribution personnelle, identifiable',
      'La façon dont vous avez aidé les autres',
      'Le résultat collectif',
    ],
    trap: 'Décrire uniquement ce que l’équipe a fait, sans jamais dire ce que vous, vous avez fait.',
    structure: [
      'Le projet et la composition de l’équipe',
      'Votre rôle précis',
      'Une difficulté de coordination et comment vous l’avez traitée',
      'Le résultat',
    ],
  },
  {
    id: 'q-comp-initiative',
    category: 'comportementale',
    question: 'Donnez un exemple d’initiative que vous avez prise.',
    whyAsked:
      'Pour distinguer ceux qui exécutent de ceux qui améliorent. L’initiative est très recherchée dans les structures où l’encadrement est mince.',
    whatTheyListenFor: [
      'Un problème que vous avez repéré vous-même',
      'Une action entreprise sans qu’on vous le demande',
      'Un résultat mesurable',
    ],
    trap: 'Présenter comme une initiative une tâche qui vous avait été confiée.',
    structure: [
      'Le problème que personne ne traitait',
      'Ce que vous avez proposé et à qui',
      'Ce que vous avez fait concrètement',
      'Le résultat et sa pérennité',
    ],
  },
  {
    id: 'q-comp-pression',
    category: 'comportementale',
    question: 'Comment réagissez-vous sous pression ou face à un imprévu ?',
    whyAsked:
      'Sur le terrain, l’imprévu est la norme. Le recruteur cherche une méthode, pas une affirmation de calme.',
    whatTheyListenFor: [
      'Une méthode explicite : prioriser, alerter, ajuster',
      'La capacité à prévenir plutôt qu’à subir',
      'Un exemple concret',
    ],
    trap: 'Dire simplement « je reste calme » sans jamais donner d’exemple.',
    structure: [
      'La situation imprévue',
      'Comment vous avez trié l’urgent et l’important',
      'Qui vous avez prévenu, et quand',
      'Le résultat',
    ],
  },
  {
    id: 'q-comp-apprentissage',
    category: 'comportementale',
    question: 'Racontez une fois où vous avez dû apprendre quelque chose rapidement.',
    whyAsked:
      'C’est la question qui compense un manque d’expérience. Un employeur accepte souvent une lacune s’il est convaincu que vous apprenez vite.',
    whatTheyListenFor: [
      'Une méthode d’apprentissage explicite',
      'Un délai court et réel',
      'Une mise en pratique effective',
    ],
    trap: 'Répondre « j’apprends vite » sans démontrer comment.',
    structure: [
      'Ce que vous ne saviez pas faire et pourquoi il le fallait',
      'Comment vous vous y êtes pris concrètement',
      'En combien de temps',
      'Ce que vous avez pu faire ensuite',
    ],
  },

  // ===========================================================================
  // Commerciales
  // ===========================================================================
  {
    id: 'q-com-vendez-moi',
    category: 'commerciale',
    question: 'Vendez-moi ce stylo.',
    whyAsked:
      'Le test le plus courant en recrutement commercial. Il n’évalue pas votre argumentaire mais votre réflexe : posez-vous des questions avant de vendre ?',
    whatTheyListenFor: [
      'Des questions de découverte avant tout argument',
      'Un argument fondé sur le besoin exprimé',
      'Une tentative de conclusion',
    ],
    trap: 'Réciter immédiatement les qualités de l’objet sans avoir rien demandé.',
    structure: [
      'Posez trois questions : usage, fréquence, ce qui manque aujourd’hui',
      'Reformulez le besoin entendu',
      'Argumentez uniquement sur ce besoin',
      'Concluez en demandant la décision',
    ],
    sectorIds: ['commerce'],
  },
  {
    id: 'q-com-objection-prix',
    category: 'commerciale',
    question: 'Un client vous dit que c’est trop cher. Que faites-vous ?',
    whyAsked:
      'C’est l’objection la plus fréquente. Le recruteur veut voir si vous cédez immédiatement sur le prix.',
    whatTheyListenFor: [
      'Une exploration avant toute remise',
      'Une reformulation en valeur',
      'La capacité à tenir un prix',
    ],
    trap: 'Proposer une réduction dès la première objection.',
    structure: [
      'Demander par rapport à quoi la comparaison est faite',
      'Reformuler le bénéfice au regard du coût réel',
      'Proposer un ajustement de périmètre plutôt qu’une baisse sèche',
      'Vérifier si l’objection est levée',
    ],
    sectorIds: ['commerce'],
  },
  {
    id: 'q-com-prospection',
    category: 'commerciale',
    question: 'Comment organisez-vous votre prospection ?',
    whyAsked:
      'Le talent commercial sans méthode ne tient pas dans la durée. Le recruteur cherche de la discipline.',
    whatTheyListenFor: [
      'Une cible définie',
      'Un rythme de contacts régulier',
      'Un outil de suivi, même simple',
    ],
    trap: 'Répondre « au feeling » ou « je vais voir les gens ».',
    structure: [
      'Comment vous définissez votre cible',
      'Comment vous constituez votre liste',
      'Votre rythme hebdomadaire de contacts',
      'Comment vous suivez les relances',
    ],
    sectorIds: ['commerce'],
  },
  {
    id: 'q-com-objectifs',
    category: 'commerciale',
    question: 'Comment réagissez-vous si vous n’atteignez pas vos objectifs ?',
    whyAsked:
      'Pour évaluer votre rapport au résultat et votre capacité à analyser plutôt qu’à subir.',
    whatTheyListenFor: [
      'Une analyse chiffrée des causes',
      'Une action corrective concrète',
      'Aucune fuite de responsabilité',
    ],
    trap: 'Invoquer uniquement des causes externes : la concurrence, le marché, la saison.',
    structure: [
      'Comment vous mesurez l’écart',
      'Comment vous identifiez la cause : volume de contacts, taux de transformation, offre',
      'L’action corrective',
      'Comment vous en rendez compte à votre responsable',
    ],
    sectorIds: ['commerce'],
  },
  {
    id: 'q-com-client-mecontent',
    category: 'commerciale',
    question: 'Un client est mécontent et élève la voix. Comment réagissez-vous ?',
    whyAsked:
      'La relation client sous tension est le quotidien de nombreux postes. Le recruteur cherche du sang-froid et une méthode.',
    whatTheyListenFor: [
      'Écoute complète avant toute réponse',
      'Reconnaissance du problème sans promesse impossible',
      'Une solution ou une échéance claire',
    ],
    trap: 'Se justifier immédiatement ou répondre sur le même ton.',
    structure: [
      'Laisser parler jusqu’au bout',
      'Reformuler pour montrer que vous avez compris',
      'Dire ce que vous pouvez faire, et quand',
      'Faire ce que vous avez annoncé, puis rappeler',
    ],
    sectorIds: ['commerce', 'communication'],
  },

  // ===========================================================================
  // Secteur minier et support
  // ===========================================================================
  {
    id: 'q-min-securite',
    category: 'minier',
    question: 'Que signifie la sécurité au travail pour vous ?',
    whyAsked:
      'Sur un site industriel, c’est une question éliminatoire. Une réponse désinvolte met fin à la candidature.',
    whatTheyListenFor: [
      'La sécurité comme priorité, y compris avant la production',
      'La connaissance des règles de base et des équipements',
      'Le réflexe de signaler plutôt que de dissimuler',
    ],
    trap: 'Traiter le sujet comme une formalité administrative.',
    structure: [
      'La sécurité passe avant le rendement, sans exception',
      'Ce que vous connaissez : dangers, risques, prévention, équipements',
      'Le signalement d’un presque-accident est un devoir, pas une dénonciation',
      'Un exemple où vous avez appliqué ou fait appliquer une règle',
    ],
    sectorIds: ['mines', 'logistique'],
  },
  {
    id: 'q-min-anglais',
    category: 'minier',
    question: 'Quel est votre niveau d’anglais ? Pouvez-vous vous présenter en anglais ?',
    whyAsked:
      'Beaucoup de sociétés minières et de sous-traitants travaillent avec un encadrement anglophone. La demande est fréquente et la vérification immédiate.',
    whatTheyListenFor: [
      'Une évaluation honnête de votre niveau',
      'Une capacité réelle à produire quelques phrases',
      'Une démarche de progression en cours',
    ],
    trap: 'Annoncer « anglais courant » sur son CV et rester bloqué à la première phrase.',
    structure: [
      'Annoncez un niveau exact et vérifiable',
      'Enchaînez immédiatement en anglais si on vous le propose',
      'Indiquez comment vous progressez actuellement',
    ],
    sectorIds: ['mines', 'langues'],
  },
  {
    id: 'q-min-rotation',
    category: 'minier',
    question: 'Êtes-vous prêt à travailler en rotation, loin de votre famille ?',
    whyAsked:
      'Beaucoup de départs précoces s’expliquent par un éloignement mal anticipé. L’employeur préfère le savoir avant.',
    whatTheyListenFor: [
      'Une réponse réfléchie, pas un oui automatique',
      'La conscience des contraintes réelles',
      'Une organisation personnelle crédible',
    ],
    trap: 'Dire oui à tout sans y avoir réfléchi, puis démissionner après deux mois.',
    structure: [
      'Dites si vous avez déjà vécu un éloignement, et comment cela s’est passé',
      'Expliquez votre organisation familiale',
      'Posez vos questions sur le rythme de rotation exact',
    ],
    sectorIds: ['mines'],
  },
  {
    id: 'q-min-excel-reporting',
    category: 'minier',
    question: 'Décrivez un tableau de suivi que vous avez construit.',
    whyAsked:
      'Le tableur est l’outil quotidien des fonctions support. La question vérifie une pratique réelle, pas une ligne sur un CV.',
    whatTheyListenFor: [
      'Un cas concret et son objectif',
      'Les formules et fonctions réellement utilisées',
      'Ce que le tableau a permis de décider',
    ],
    trap: 'Répondre « je maîtrise Excel » sans pouvoir citer une seule formule.',
    structure: [
      'Le besoin auquel le tableau répondait',
      'Sa structure : colonnes, sources de données',
      'Les fonctions employées',
      'Ce que cela a changé concrètement',
    ],
    sectorIds: ['mines', 'administration', 'logistique'],
  },
  {
    id: 'q-min-procedure',
    category: 'minier',
    question: 'On vous demande de suivre une procédure que vous trouvez inutile. Que faites-vous ?',
    whyAsked:
      'Dans l’industrie, les procédures existent souvent à cause d’un accident passé. Le recruteur teste votre discipline et votre façon de contester.',
    whatTheyListenFor: [
      'Application de la procédure en attendant',
      'Une contestation par le canal approprié',
      'La compréhension que certaines règles protègent des vies',
    ],
    trap: 'Dire que vous feriez autrement parce que c’est plus rapide.',
    structure: [
      'J’applique la procédure telle qu’elle est',
      'Je cherche à comprendre sa raison d’être',
      'Si elle me paraît toujours inutile, je propose une amélioration à mon responsable, par écrit',
    ],
    sectorIds: ['mines', 'logistique'],
  },

  // ===========================================================================
  // Administratives
  // ===========================================================================
  {
    id: 'q-adm-organisation',
    category: 'administrative',
    question: 'Comment organisez-vous votre travail quand plusieurs urgences arrivent ensemble ?',
    whyAsked:
      'Un poste administratif est fait d’interruptions. Le recruteur cherche une méthode de priorisation.',
    whatTheyListenFor: [
      'Un critère de priorisation explicite',
      'La communication avec les demandeurs',
      'Un outil de suivi',
    ],
    trap: 'Répondre « je fais tout » ou « je gère au fur et à mesure ».',
    structure: [
      'Le critère que vous utilisez : échéance, impact, dépendance',
      'Comment vous informez ceux qui devront attendre',
      'Comment vous suivez ce qui reste à faire',
    ],
    sectorIds: ['administration'],
  },
  {
    id: 'q-adm-confidentialite',
    category: 'administrative',
    question: 'Un collègue vous demande une information confidentielle. Que faites-vous ?',
    whyAsked:
      'Les fonctions administratives accèdent à des données sensibles : salaires, dossiers du personnel, contrats. Une seule indiscrétion suffit à rompre la confiance.',
    whatTheyListenFor: [
      'Un refus clair et sans agressivité',
      'Le renvoi vers la personne habilitée',
      'Aucune hésitation sur le principe',
    ],
    trap: 'Nuancer, ou expliquer que cela dépend de la personne qui demande.',
    structure: [
      'Je n’en parle pas, quelle que soit la personne',
      'Je l’oriente vers son responsable ou vers le service concerné',
      'J’en informe ma hiérarchie si la demande se répète',
    ],
    sectorIds: ['administration', 'finance'],
  },
  {
    id: 'q-adm-erreur',
    category: 'administrative',
    question: 'Vous découvrez une erreur que vous avez commise il y a une semaine. Que faites-vous ?',
    whyAsked:
      'Pour évaluer votre intégrité. Une erreur signalée coûte toujours moins cher qu’une erreur découverte plus tard.',
    whatTheyListenFor: [
      'Un signalement immédiat',
      'Une évaluation des conséquences',
      'Une mesure pour que cela ne se reproduise pas',
    ],
    trap: 'Laisser entendre que vous corrigeriez discrètement sans en parler.',
    structure: [
      'Je vérifie l’ampleur de l’erreur',
      'Je préviens immédiatement mon responsable, avec les faits',
      'Je propose la correction',
      'Je modifie ma façon de travailler pour éviter la récidive',
    ],
    sectorIds: ['administration', 'finance'],
  },
  {
    id: 'q-adm-logiciels',
    category: 'technique',
    question: 'Quels logiciels maîtrisez-vous ?',
    whyAsked:
      'Pour vérifier une compétence facilement testable. Beaucoup de candidats surestiment leur niveau sur cette question.',
    whatTheyListenFor: [
      'Une évaluation honnête par outil',
      'Des exemples d’usage réel',
      'La capacité à apprendre un nouvel outil',
    ],
    trap: 'Annoncer une maîtrise que trois minutes de test suffiront à démentir.',
    structure: [
      'Citez chaque outil avec votre niveau réel',
      'Donnez un exemple concret d’usage pour les principaux',
      'Mentionnez un outil que vous avez appris seul récemment',
    ],
    sectorIds: ['administration', 'numerique'],
  },

  // ===========================================================================
  // Techniques et numériques
  // ===========================================================================
  {
    id: 'q-tec-probleme-inconnu',
    category: 'technique',
    question: 'Comment abordez-vous un problème que vous n’avez jamais rencontré ?',
    whyAsked:
      'C’est la question qui évalue la capacité de réflexion, troisième dimension du recrutement. Elle compte souvent plus que le savoir technique.',
    whatTheyListenFor: [
      'Une méthode explicite en étapes',
      'La distinction entre faits et suppositions',
      'La capacité à demander de l’aide au bon moment',
    ],
    trap: 'Répondre « je cherche sur internet » et s’arrêter là.',
    structure: [
      'Je reformule le problème pour être sûr de ce qu’on me demande',
      'Je liste ce que je sais et ce que je suppose',
      'Je vérifie mes suppositions',
      'J’envisage plusieurs options avant d’en choisir une',
      'Si je bloque, je demande de l’aide en expliquant ce que j’ai déjà essayé',
    ],
  },
  {
    id: 'q-tec-donnees',
    category: 'technique',
    question: 'Comment vérifiez-vous la fiabilité d’une information trouvée en ligne ?',
    whyAsked:
      'Pour évaluer l’esprit critique, de plus en plus recherché avec la multiplication des contenus générés automatiquement.',
    whatTheyListenFor: [
      'Le recoupement des sources',
      'L’attention à l’auteur et à la date',
      'La distinction entre fait et opinion',
    ],
    trap: 'Répondre que le premier résultat de recherche suffit.',
    structure: [
      'Qui publie cette information et dans quel intérêt',
      'De quand date-t-elle',
      'Est-elle confirmée par une seconde source indépendante',
      'S’agit-il d’un fait vérifiable ou d’une opinion',
    ],
    sectorIds: ['numerique'],
  },
  {
    id: 'q-tec-ia',
    category: 'technique',
    question: 'Utilisez-vous des outils d’intelligence artificielle dans votre travail ?',
    whyAsked:
      'Question de plus en plus fréquente. L’employeur veut savoir si vous les utilisez avec discernement ou aveuglément.',
    whatTheyListenFor: [
      'Un usage assumé et raisonné',
      'La vérification systématique des résultats',
      'La conscience des risques de confidentialité',
    ],
    trap: 'Prétendre ne jamais les utiliser, ou avouer y recopier des données confidentielles.',
    structure: [
      'Ce pour quoi vous les utilisez concrètement',
      'Comment vous vérifiez ce qu’ils produisent',
      'Ce que vous n’y mettez jamais : données clients, informations internes',
    ],
    sectorIds: ['numerique'],
  },

  // ===========================================================================
  // Difficiles
  // ===========================================================================
  {
    id: 'q-dif-sans-experience',
    category: 'difficile',
    question: 'Vous n’avez aucune expérience professionnelle. Pourquoi vous recruterions-nous ?',
    whyAsked:
      'Question fréquente pour un premier emploi. Elle teste autant votre préparation que votre sang-froid.',
    whatTheyListenFor: [
      'Une reconnaissance de la lacune, sans effondrement',
      'Des expériences non salariées mais réelles',
      'Une preuve de capacité d’apprentissage',
    ],
    trap: 'S’excuser longuement, ou prétendre que ce n’est pas un problème.',
    structure: [
      'Reconnaissez l’absence d’expérience salariée',
      'Citez immédiatement ce que vous avez fait : projets, bénévolat, travail familial, réalisations',
      'Donnez un exemple d’apprentissage rapide',
      'Proposez une preuve concrète : un projet réalisé que vous pouvez montrer',
    ],
  },
  {
    id: 'q-dif-trou-parcours',
    category: 'difficile',
    question: 'Que faisiez-vous pendant cette période sans activité ?',
    whyAsked:
      'Pour combler une zone d’ombre du CV. La question n’est pas hostile : le silence l’est davantage.',
    whatTheyListenFor: [
      'Une réponse directe, sans gêne',
      'Ce que vous avez fait de cette période',
      'Une continuité de projet',
    ],
    trap: 'Rester vague ou mentir sur les dates : les dates se vérifient.',
    structure: [
      'Dites la vérité, simplement',
      'Ce que vous avez fait pendant ce temps : formation, recherche, aide familiale, santé',
      'Ce que vous en avez retiré d’utile',
      'Revenez au poste',
    ],
  },
  {
    id: 'q-dif-surqualifie',
    category: 'difficile',
    question: 'Votre profil semble trop qualifié pour ce poste. Pourquoi postulez-vous ?',
    whyAsked:
      'L’employeur craint que vous partiez rapidement, ce qui lui ferait perdre son investissement de formation.',
    whatTheyListenFor: [
      'Une raison sincère et cohérente',
      'Une envie réelle pour ce poste précis',
      'Un projet à moyen terme compatible',
    ],
    trap: 'Laisser entendre que c’est un poste d’attente.',
    structure: [
      'Ce qui vous intéresse spécifiquement dans ce poste',
      'Pourquoi ce niveau de responsabilité vous convient maintenant',
      'Ce que vous comptez y construire',
    ],
  },
  {
    id: 'q-dif-autres-candidatures',
    category: 'difficile',
    question: 'Avez-vous d’autres candidatures en cours ?',
    whyAsked: 'Pour évaluer votre situation et le délai dont dispose l’employeur pour décider.',
    whatTheyListenFor: ['De l’honnêteté', 'Une recherche cohérente', 'Aucun bluff'],
    trap: 'Inventer une offre concurrente pour faire pression : le bluff se retourne souvent.',
    structure: [
      'Répondez honnêtement, sans détailler les noms',
      'Montrez que vos candidatures suivent une logique',
      'Réaffirmez votre intérêt pour ce poste-ci',
    ],
  },
  {
    id: 'q-dif-critique',
    category: 'difficile',
    question: 'Qu’est-ce qui vous a le plus déplu dans votre poste précédent ?',
    whyAsked:
      'Pour observer comment vous parlez de votre ancien employeur. C’est un test de loyauté autant que de recul.',
    whatTheyListenFor: [
      'Une critique factuelle, jamais personnelle',
      'Aucun dénigrement',
      'Une conclusion tournée vers ce que vous cherchez',
    ],
    trap: 'Critiquer nommément un ancien responsable : le recruteur imagine aussitôt ce que vous direz de lui.',
    structure: [
      'Un aspect factuel qui ne vous convenait pas',
      'Ce que vous avez tenté pour l’améliorer',
      'Ce que vous recherchez maintenant',
    ],
  },

  // ===========================================================================
  // Entrepreneuriat et freelance
  // ===========================================================================
  {
    id: 'q-ent-idee',
    category: 'entrepreneuriat',
    question: 'Comment avez-vous validé que votre idée répondait à un vrai besoin ?',
    whyAsked:
      'Question posée par les financeurs, les incubateurs et les jurys de concours. C’est le premier filtre de sérieux.',
    whatTheyListenFor: [
      'Des entretiens avec de vrais clients potentiels',
      'Des chiffres, même modestes',
      'Une remise en question de l’idée initiale',
    ],
    trap: 'Répondre « tout le monde m’a dit que c’était une bonne idée ».',
    structure: [
      'Combien de personnes vous avez interrogées et lesquelles',
      'Ce que vous leur avez demandé sans présenter votre solution',
      'Ce que vous avez appris et qui a modifié votre idée',
      'Le test réalisé et son résultat',
    ],
    sectorIds: ['entrepreneuriat'],
  },
  {
    id: 'q-ent-rentabilite',
    category: 'entrepreneuriat',
    question: 'Votre activité est-elle rentable ? Comment le savez-vous ?',
    whyAsked:
      'Beaucoup de porteurs de projet ne savent pas répondre, ce qui révèle immédiatement l’absence de gestion.',
    whatTheyListenFor: [
      'Un coût de revient calculé',
      'Un seuil de rentabilité connu',
      'La valorisation du temps de travail',
    ],
    trap: 'Confondre chiffre d’affaires et bénéfice.',
    structure: [
      'Vos coûts fixes et variables',
      'Votre coût de revient unitaire, temps de travail compris',
      'Votre seuil de rentabilité mensuel',
      'Votre résultat réel du dernier mois',
    ],
    sectorIds: ['entrepreneuriat', 'finance'],
  },
  {
    id: 'q-fre-fiabilite-distance',
    category: 'entrepreneuriat',
    question: 'Comment un client peut-il vous faire confiance sans vous avoir rencontré ?',
    whyAsked:
      'C’est l’objection centrale du travail à distance, et particulièrement pour un prestataire situé loin du client.',
    whatTheyListenFor: [
      'Des preuves montrables',
      'Une méthode de travail explicite',
      'Une proposition qui réduit le risque du client',
    ],
    trap: 'Répondre uniquement « je suis sérieux ».',
    structure: [
      'Le portfolio et les témoignages que vous pouvez montrer',
      'Votre méthode : périmètre écrit, points d’avancement, jalons',
      'Une proposition qui limite le risque : première étape courte, paiement échelonné',
    ],
    sectorIds: ['numerique', 'entrepreneuriat'],
  },
];

export const interviewQuestionById = new Map(
  interviewQuestions.map((question) => [question.id, question]),
);

export function questionsByCategory(category: InterviewQuestion['category']): InterviewQuestion[] {
  return interviewQuestions.filter((question) => question.category === category);
}
