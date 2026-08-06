import { buildPath } from './builder';

export const anglaisEmploi = buildPath({
  slug: 'anglais-emploi',
  name: 'Anglais pour l’emploi',
  summary:
    'L’anglais professionnel attendu dans les mines, la logistique et les entreprises internationales.',
  description:
    'De nombreuses offres au Mali, en particulier dans le secteur minier et chez les sous-traitants internationaux, exigent un niveau d’anglais. Ce parcours ne vise pas la maîtrise littéraire : il vise ce qui est réellement demandé au travail — se présenter, comprendre une consigne, écrire un e-mail, tenir un échange simple et passer un entretien.',
  audience: [
    'Vous visez une entreprise minière, industrielle ou internationale',
    'Une offre vous a échappé parce qu’elle demandait de l’anglais',
    'Vous comprenez quelques mots mais n’osez pas parler',
  ],
  outcomes: [
    'Vous présenter en anglais pendant deux minutes sans hésiter',
    'Comprendre et écrire un e-mail professionnel simple',
    'Comprendre une consigne de sécurité ou une instruction de travail',
    'Répondre aux questions d’entretien les plus courantes en anglais',
    'Utiliser le vocabulaire commercial et minier de base',
  ],
  prerequisites: ['Savoir lire et écrire en français'],
  sectorIds: ['langues', 'mines', 'commerce'],
  skillIds: ['anglais-pro', 'anglais-entretien', 'communication-orale', 'ecoute-active'],
  level: 'debutant',
  featured: true,
  order: 2,
  icon: 'Languages',
  projectIds: ['proj-ang-presentation', 'proj-ang-email-pro'],
  stages: [
    {
      name: 'Repartir des bases utiles',
      objective:
        'Poser les fondations strictement nécessaires au travail : présent, passé simple, questions, nombres, heures.',
      skillIds: ['anglais-pro'],
      estimatedMinutes: 240,
      resourceIds: ['res-bbc-learning-english', 'res-british-council', 'res-duolingo'],
      items: [
        {
          title: 'Évaluer votre niveau réel',
          description: 'Un test rapide évite de perdre des semaines sur un contenu trop facile ou trop dur.',
          minutes: 30,
          kind: 'evaluation',
          resourceIds: ['res-british-council'],
        },
        {
          title: 'Le présent simple et le présent continu',
          minutes: 60,
          kind: 'lecture',
          resourceIds: ['res-bbc-learning-english'],
        },
        {
          title: 'Poser une question correctement',
          description: 'Do you… ? / Can you… ? / Where is… ? — trois structures couvrent l’essentiel du quotidien.',
          minutes: 50,
          kind: 'pratique',
          resourceIds: ['res-british-council'],
        },
        {
          title: 'Nombres, dates, heures et quantités',
          description: 'Indispensable pour un stock, un planning ou un rapport.',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Prendre l’habitude quotidienne',
          description: 'Quinze minutes chaque jour valent mieux que trois heures le dimanche.',
          minutes: 60,
          kind: 'pratique',
          resourceIds: ['res-duolingo'],
        },
      ],
      practicalExercise: {
        title: 'Votre carnet de vingt phrases',
        instructions: [
          'Écrivez vingt phrases en anglais décrivant votre quotidien réel.',
          'Chaque phrase doit être vraie et utile : ce que vous faites, où vous habitez, ce que vous étudiez.',
          'Lisez-les à voix haute chaque jour pendant une semaine.',
        ],
        deliverable: 'Un carnet de vingt phrases justes, mémorisées et prononcées à voix haute.',
      },
      checklist: [
        'Je sais construire une phrase au présent',
        'Je sais poser trois types de questions',
        'Je sais dire les nombres et les dates',
        'J’ai pratiqué au moins cinq jours cette semaine',
      ],
      reflection:
        'Qu’est-ce qui vous empêche le plus de parler anglais : le vocabulaire, la grammaire ou la peur de vous tromper ?',
      evidence: 'Un carnet de vingt phrases personnelles en anglais.',
      knowledgeCheck: [
        {
          question: 'Quelle phrase est correcte ?',
          options: ['I am work in a shop.', 'I work in a shop.', 'I working in a shop.'],
          answerIndex: 1,
          explanation:
            'Au présent simple, le verbe se met directement après le sujet, sans auxiliaire « to be ». « I am working » existe aussi, mais décrit une action en cours maintenant.',
        },
      ],
    },
    {
      name: 'Se présenter et parler de son parcours',
      objective:
        'Produire une présentation personnelle de deux minutes, fluide et réutilisable en entretien.',
      skillIds: ['anglais-pro', 'anglais-entretien', 'confiance'],
      estimatedMinutes: 210,
      resourceIds: ['res-british-council', 'res-esl-lab'],
      items: [
        {
          title: 'Le vocabulaire du parcours : études, expérience, compétences',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-british-council'],
        },
        {
          title: 'La structure d’une présentation professionnelle',
          description: 'Qui je suis → ce que j’ai fait → ce que je sais faire → ce que je cherche.',
          minutes: 30,
          kind: 'lecture',
        },
        {
          title: 'Rédiger votre présentation',
          minutes: 60,
          kind: 'pratique',
        },
        {
          title: 'Travailler la prononciation',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-esl-lab'],
        },
        {
          title: 'Répéter jusqu’à ne plus lire',
          minutes: 40,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Votre présentation de deux minutes',
        instructions: [
          'Rédigez une présentation de deux minutes en anglais, entièrement vraie.',
          'Faites-la corriger par quelqu’un dont l’anglais est meilleur que le vôtre, ou comparez-la à des modèles.',
          'Répétez-la debout, à voix haute, dix fois sur plusieurs jours.',
          'Présentez-la enfin à une personne réelle, sans lire vos notes.',
        ],
        deliverable:
          'Un texte de présentation en anglais, corrigé, et la capacité de le dire sans notes.',
      },
      checklist: [
        'Ma présentation dure entre 90 secondes et 2 minutes',
        'Tout ce que je dis est exact',
        'Je peux la dire sans lire',
        'Je l’ai dite au moins une fois à une vraie personne',
      ],
      reflection:
        'Quelle partie de votre présentation vous met le plus mal à l’aise ? Est-ce la langue ou le contenu ?',
      evidence:
        'Une présentation personnelle de deux minutes en anglais, prête pour un entretien.',
    },
    {
      name: 'Écrire en anglais au travail',
      objective: 'Rédiger un e-mail professionnel simple, correct et poli.',
      skillIds: ['anglais-pro', 'communication-ecrite', 'email-pro'],
      estimatedMinutes: 180,
      resourceIds: ['res-business-english-pod', 'res-bbc-learning-english'],
      items: [
        {
          title: 'Les formules d’ouverture et de clôture',
          description: 'Dear… / Hello… / Best regards / Kind regards — et quand utiliser chacune.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-business-english-pod'],
        },
        {
          title: 'Écrire un objet d’e-mail efficace',
          minutes: 20,
          kind: 'pratique',
        },
        {
          title: 'Demander, confirmer, relancer poliment',
          description:
            'Could you please… / I would like to confirm… / I am following up on… — trois structures suffisent.',
          minutes: 50,
          kind: 'pratique',
        },
        {
          title: 'Répondre à une offre d’emploi en anglais',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Éviter les erreurs les plus fréquentes des francophones',
          description: 'Faux amis, ordre des mots, majuscules, ponctuation.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-bbc-learning-english'],
        },
      ],
      practicalExercise: {
        title: 'Quatre e-mails en anglais',
        instructions: [
          'Écrivez une candidature à une offre en anglais.',
          'Écrivez une demande d’information à une entreprise.',
          'Écrivez une relance après un entretien.',
          'Écrivez une réponse confirmant un rendez-vous.',
          'Chaque e-mail doit tenir en huit lignes maximum.',
        ],
        deliverable: 'Quatre modèles d’e-mails en anglais, réutilisables.',
      },
      checklist: [
        'Chaque e-mail a un objet clair',
        'J’utilise une formule d’ouverture et de clôture adaptée',
        'Aucun e-mail ne dépasse huit lignes',
        'J’ai vérifié l’orthographe',
      ],
      reflection: 'Comparez un de vos e-mails en français et son équivalent en anglais. Lequel est le plus direct ? Pourquoi ?',
      evidence: 'Quatre modèles d’e-mails professionnels en anglais.',
      knowledgeCheck: [
        {
          question: 'Quel objet d’e-mail est le plus efficace pour une candidature ?',
          options: [
            'Hello',
            'Application — Logistics Assistant — Awa Traoré',
            'Please read this important message',
          ],
          answerIndex: 1,
          explanation:
            'Un objet doit permettre de classer et de retrouver le message immédiatement : nature, poste, nom. Un recruteur reçoit des centaines de messages.',
        },
      ],
    },
    {
      name: 'Comprendre à l’oral',
      objective:
        'Comprendre une consigne, une réunion simple et un interlocuteur qui parle vite.',
      skillIds: ['anglais-pro', 'ecoute-active'],
      estimatedMinutes: 240,
      resourceIds: ['res-voa-learning-english', 'res-esl-lab', 'res-bbc-learning-english'],
      items: [
        {
          title: 'Écouter des actualités lues lentement',
          description:
            'Téléchargez plusieurs épisodes quand vous avez du wifi, écoutez ensuite hors ligne.',
          minutes: 80,
          kind: 'pratique',
          resourceIds: ['res-voa-learning-english'],
        },
        {
          title: 'Exercices de compréhension avec questions',
          minutes: 60,
          kind: 'pratique',
          resourceIds: ['res-esl-lab'],
        },
        {
          title: 'Comprendre une consigne de travail',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-esl-lab'],
        },
        {
          title: 'Demander de répéter sans se bloquer',
          description:
            'Sorry, could you repeat that please? / Could you speak a bit more slowly? — deux phrases qui sauvent un entretien.',
          minutes: 20,
          kind: 'pratique',
        },
        {
          title: 'Écoute quotidienne pendant deux semaines',
          minutes: 40,
          kind: 'pratique',
          resourceIds: ['res-bbc-learning-english'],
        },
      ],
      practicalExercise: {
        title: 'Journal d’écoute',
        instructions: [
          'Pendant dix jours, écoutez dix minutes d’anglais par jour.',
          'Après chaque écoute, écrivez trois phrases en anglais résumant ce que vous avez compris.',
          'Notez cinq mots nouveaux par jour et réutilisez-les le lendemain.',
        ],
        deliverable: 'Un journal d’écoute de dix jours avec résumés et vocabulaire.',
      },
      checklist: [
        'J’ai écouté au moins dix jours',
        'Je comprends le sujet général sans transcription',
        'J’ai constitué une liste de cinquante mots nouveaux',
        'Je sais demander de répéter poliment',
      ],
      reflection:
        'Comparez votre compréhension du premier jour et du dixième. Qu’est-ce qui a changé concrètement ?',
      evidence: 'Un journal d’écoute de dix jours.',
    },
    {
      name: 'Le vocabulaire de votre secteur',
      objective:
        'Maîtriser les termes anglais réellement utilisés dans le commerce, la logistique et les mines.',
      skillIds: ['anglais-pro', 'mines-connaissance', 'hse'],
      estimatedMinutes: 180,
      resourceIds: ['res-icmm', 'res-business-english-pod', 'res-exceleasy'],
      items: [
        {
          title: 'Vocabulaire commercial',
          description:
            'customer, quotation, invoice, discount, target, lead, follow-up, deadline.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-business-english-pod'],
        },
        {
          title: 'Vocabulaire minier et industriel',
          description:
            'site, shift, contractor, supervisor, equipment, maintenance, output, compliance.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-icmm'],
        },
        {
          title: 'Vocabulaire de la sécurité (HSE)',
          description:
            'hazard, risk, PPE, incident, near miss, induction, toolbox talk, safety briefing.',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-icmm'],
        },
        {
          title: 'Vocabulaire du tableur et du reporting',
          description:
            'spreadsheet, row, column, formula, chart, weekly report, summary.',
          minutes: 30,
          kind: 'lecture',
          resourceIds: ['res-exceleasy'],
        },
        {
          title: 'Construire votre lexique personnel',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Lexique de cent termes',
        instructions: [
          'Choisissez le secteur que vous visez réellement.',
          'Constituez un lexique de cent termes anglais avec leur traduction et une phrase d’exemple.',
          'Prenez au moins vingt termes dans une vraie offre d’emploi en anglais de ce secteur.',
          'Révisez vingt termes par jour pendant cinq jours.',
        ],
        deliverable: 'Un lexique personnel de cent termes du secteur visé.',
      },
      checklist: [
        'Mon lexique contient cent termes',
        'Chaque terme a une phrase d’exemple',
        'Vingt termes viennent d’une vraie offre d’emploi',
        'Je peux en restituer la majorité de mémoire',
      ],
      reflection:
        'Quels termes reviennent dans presque toutes les offres de votre secteur ? Que vous apprennent-ils sur ce que l’employeur attend vraiment ?',
      evidence: 'Un lexique professionnel de cent termes anglais.',
    },
    {
      name: 'L’entretien en anglais',
      objective: 'Répondre aux questions d’entretien les plus fréquentes en anglais.',
      skillIds: ['anglais-entretien', 'confiance', 'communication-orale'],
      estimatedMinutes: 210,
      resourceIds: ['res-business-english-pod', 'res-british-council'],
      items: [
        {
          title: 'Les dix questions les plus fréquentes en anglais',
          description:
            'Tell me about yourself. / Why this company? / What are your strengths? / Where do you see yourself…?',
          minutes: 40,
          kind: 'lecture',
          resourceIds: ['res-business-english-pod'],
        },
        {
          title: 'Rédiger vos réponses',
          minutes: 70,
          kind: 'pratique',
        },
        {
          title: 'La méthode STAR en anglais',
          minutes: 40,
          kind: 'pratique',
        },
        {
          title: 'Poser des questions à l’employeur en anglais',
          minutes: 30,
          kind: 'pratique',
          resourceIds: ['res-british-council'],
        },
        {
          title: 'Simulation complète',
          minutes: 30,
          kind: 'pratique',
        },
      ],
      practicalExercise: {
        title: 'Entretien blanc en anglais',
        instructions: [
          'Préparez par écrit vos réponses aux dix questions les plus fréquentes.',
          'Demandez à quelqu’un de vous poser les questions dans le désordre.',
          'Répondez sans vos notes, même imparfaitement.',
          'Notez les trois questions où vous avez le plus buté et retravaillez-les.',
        ],
        deliverable: 'Dix réponses d’entretien rédigées en anglais et testées à l’oral.',
      },
      checklist: [
        'J’ai préparé dix réponses écrites',
        'J’ai fait au moins une simulation avec une autre personne',
        'Je sais poser deux questions à l’employeur en anglais',
        'Je sais dire poliment que je n’ai pas compris',
      ],
      reflection:
        'Quelle question vous a le plus déstabilisé en anglais ? Était-ce la langue ou le contenu de la réponse ?',
      evidence: 'Un jeu de dix réponses d’entretien en anglais, testées à l’oral.',
      knowledgeCheck: [
        {
          question: 'En entretien, vous ne comprenez pas une question en anglais. Que faites-vous ?',
          options: [
            'Vous répondez au hasard pour ne pas paraître faible',
            'Vous demandez poliment de répéter ou de reformuler',
            'Vous restez silencieux',
          ],
          answerIndex: 1,
          explanation:
            'Demander de répéter est parfaitement professionnel et montre que vous préférez comprendre plutôt que deviner. Répondre à côté est bien plus pénalisant.',
        },
      ],
    },
  ],
});
