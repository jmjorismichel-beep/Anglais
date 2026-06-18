// Programme Navigate A1-B1 — extrait du tableur Google Sheets
// COURSEBOOK + WORKBOOK + Grammar Reference + MP3 + Vidéos

export const LEVELS = ['A1', 'A2', 'B1', 'B1+', 'TELC'];

export const UNITS = {
  A1: [
    {
      id: 1,
      title: 'First meetings',
      grammar: 'To be + question words',
      chapters: [
        { id: '1.1', title: 'On business or on holiday?', mp3_wb: ['1-01.mp3','1-02.mp3'], mp3_cb: ['01-01.mp3','01-02.mp3','01-03.mp3','01-04.mp3'], corrige: 'unit 1 - 1.1.png' },
        { id: '1.2', title: 'Where are you from?', mp3_wb: ['1-02.mp3','1-03.mp3'], mp3_cb: ['01-09.mp3','01-10.mp3'], corrige: 'Unit 1-2.png' },
        { id: '1.3', title: 'How do you spell that?', mp3_wb: ['1-04.mp3','1-05.mp3','1-06.mp3','1-07.mp3','1-08.mp3'], mp3_cb: ['01-17.mp3','01-18.mp3'], corrige: 'Unit 1-3.png' },
        { id: '1.4', title: 'Speaking and writing', mp3_cb: ['01-27.mp3','01-28.mp3'], corrige: 'Unit 1-4.png' },
        { id: '1.5', title: 'Listening for pleasure', mp3_wb: ['1-09.mp3','1-10.mp3'], corrige: 'Unit 1-5.png' },
        { id: '1.5v', title: 'Video', video: 'Vidéo 01.mp4' },
        { id: '1.6', title: 'Review', mp3_cb: ['01-30.mp3','01-31.mp3'] },
      ],
      grammar_ref_pdf: '01 To be + question words.pdf',
      grammar_ref_mp3: ['01-01.mp3','01-02.mp3'],
      corrige_complet: 'Corrigés.pdf',
      teachers_guide: 'navigate-a1--teachers-guide.pdf',
    },
    {
      id: 2,
      title: 'Questions',
      grammar: "This/that/these/those + To be + Subject pronouns",
      chapters: [
        { id: '2.1', title: "What's this in English?", mp3_wb: ['2-01.mp3','2-02.mp3'], mp3_cb: ['02-01.mp3','02-02.mp3'], corrige: 'Unit 2-1.png' },
        { id: '2.2', title: "What's your job?", mp3_wb: ['2-03.mp3','2-04.mp3'], mp3_cb: ['02-13.mp3','02-14.mp3'], voxpops: 'Voxpops Unit 1&2.mp4', corrige: 'Unit 2-2.png' },
        { id: '2.3', title: 'Where are they?', mp3_wb: ['2-05.mp3'], mp3_cb: ['02-16.mp3','02-17.mp3'], corrige: 'Unit 2-3.png' },
        { id: '2.4', title: 'Speaking and writing', mp3_wb: ['2-06.mp3','2-07.mp3'], mp3_cb: ['02-20.mp3','02-21.mp3'], corrige: 'Unit 2-4.png' },
        { id: '2.5', title: 'Review (Units 1 & 2)' },
        { id: '2.5v', title: 'Video', video: 'Vidéo 02.mp4' },
        { id: '2.6', title: 'Review', mp3_cb: ['02-24.mp3','02-25.mp3'] },
      ],
      grammar_ref_pdf: '02 This/that/these/those + To be + Subject pronouns.pdf',
      grammar_ref_mp3: ['02-01A.mp3','02-01B.mp3','02-02.mp3','02-03.mp3'],
    },
    {
      id: 3,
      title: 'People and possessions',
      grammar: "Have got/had got + possessive determiners and 's",
      chapters: [
        { id: '3.1', title: 'My neighbours', mp3_wb: ['3-01.mp3','3-02.mp3'], mp3_cb: ['03-01.mp3','03-02.mp3','03-03.mp3'], corrige: 'Unit 3-1.png' },
        { id: '3.2', title: 'Possessions', mp3_wb: ['3-03.mp3','3-04.mp3'], mp3_cb: ['03-04.mp3','03-05.mp3','03-06.mp3'], corrige: 'Unit3-2.png' },
        { id: '3.3', title: 'Family', mp3_wb: ['3-06.mp3'], mp3_cb: ['03-12.mp3','03-13.mp3'], voxpops: 'Voxpops Unit 3.mp4', corrige: 'Unit3-3.png' },
        { id: '3.4', title: 'Speaking and writing', mp3_wb: ['3-09.mp3'], mp3_cb: ['03-21.mp3','03-22.mp3'], corrige: 'Unit 3-4 .png' },
        { id: '3.5', title: 'Listening for pleasure', mp3_wb: ['3-10.mp3'], corrige: 'Unit 3-5.png' },
        { id: '3.5v', title: 'Video', video: 'Vidéo 03.mp4' },
        { id: '3.6', title: 'Review', mp3_cb: ['03-24.mp3','03-25.mp3'] },
      ],
      grammar_ref_pdf: '03 Have got/had got + have got (negatives & questions) + possessive determiners and \'s.pdf',
      grammar_ref_mp3: ['03-01.mp3','03-02A.mp3','03-02B.mp3','03-03A.mp3','03-03B.mp3'],
    },
    {
      id: 4,
      title: 'My life',
      grammar: 'Present simple (positive/negative/yes-no questions)',
      chapters: [
        { id: '4.1', title: 'About me', mp3_wb: ['4-01.mp3','4-02.mp3'], mp3_cb: ['04-01.mp3','04-02.mp3'], corrige: 'Unit 4-1.png' },
        { id: '4.2', title: 'Journeys', mp3_wb: ['4-03.mp3','4-04.mp3'], mp3_cb: ['04-04.mp3','04-05.mp3'], corrige: 'Unit 4-2.png' },
        { id: '4.3', title: 'My day', mp3_wb: ['4-05.mp3','4-06.mp3'], mp3_cb: ['04-09.mp3','04-10.mp3'], voxpops: 'Voxpops Unit 4.mp4', corrige: 'Unit 4-3.png' },
        { id: '4.4', title: 'Speaking and writing', mp3_wb: ['4-07.mp3'], mp3_cb: ['04-13.mp3','04-14.mp3'], corrige: 'Unit 4-4.png' },
        { id: '4.5', title: 'Review (Units 3 & 4)' },
        { id: '4.5v', title: 'Video', video: 'Vidéo 04.mp4' },
        { id: '4.6', title: 'Review', mp3_cb: ['04-16.mp3','04-17.mp3'] },
      ],
      grammar_ref_pdf: '04 Present simple (positive) + present simple (negative) + present simple (yes/no questions).pdf',
      grammar_ref_mp3: ['04-01.mp3','04-02.mp3','04-03.mp3'],
    },
    {
      id: 5,
      title: 'Style and design',
      grammar: 'Adverbs of frequency + Wh- questions + present simple',
      chapters: [
        { id: '5.1', title: 'Clothes style', mp3_wb: ['5-01.mp3','5-02.mp3'], mp3_cb: ['05-01.mp3','05-02.mp3'], corrige: 'Unit 5-1.png' },
        { id: '5.2', title: 'Amazing architecture', mp3_wb: ['5-03.mp3','5-04.mp3'], mp3_cb: ['05-05.mp3','05-06.mp3'], corrige: 'Unit 5-2.png' },
        { id: '5.3', title: 'Styles around the world', mp3_cb: ['05-12.mp3','05-13.mp3'], voxpops: 'Voxpops Unit 5.mp4' },
        { id: '5.4', title: 'Speaking and writing', mp3_cb: ['05-14.mp3','05-15.mp3'] },
        { id: '5.5v', title: 'Video', video: 'Vidéo 05.mp4' },
        { id: '5.6', title: 'Review' },
      ],
      grammar_ref_pdf: '05 Adverbs of frequency + Wh- questions + present simple.pdf',
      grammar_ref_mp3: ['05-01.mp3','05-02.mp3','05-03.mp3'],
    },
  ],
  A2: [
    { id: 6, title: 'Going places', grammar: 'Past simple (be)', chapters: [], locked: false },
    { id: 7, title: 'Everyday life', grammar: 'Present continuous', chapters: [], locked: false },
    { id: 8, title: 'Food and drink', grammar: 'Countable/uncountable nouns', chapters: [], locked: false },
    { id: 9, title: 'City life', grammar: 'Comparatives and superlatives', chapters: [], locked: false },
  ],
  B1: [
    { id: 10, title: 'Work and study', grammar: 'Present perfect', chapters: [], locked: false },
    { id: 11, title: 'Travel', grammar: 'Past continuous', chapters: [], locked: false },
    { id: 12, title: 'Communication', grammar: 'Future forms', chapters: [], locked: false },
  ],
};

// Exercices par type (QCM, trous, association, audio)
export const EXERCISES = {
  A1_unit1: [
    {
      id: 'u1_q1', type: 'qcm', level: 'A1', unit: 1,
      audio: '01-01.mp3',
      question: 'Complete: "My name _____ Sarah."',
      options: ['A. are', 'B. is', 'C. am', 'D. be'],
      answer: 1,
      explanation: '"Is" est utilisé avec he/she/it et les noms propres. "My name" = he/she/it → is.',
    },
    {
      id: 'u1_q2', type: 'qcm', level: 'A1', unit: 1,
      question: 'What _____ your surname?',
      options: ['A. are', 'B. is', 'C. am', 'D. do'],
      answer: 1,
      explanation: 'Avec "what", on utilise "is" pour poser une question sur un nom singulier.',
    },
    {
      id: 'u1_fill1', type: 'fill', level: 'A1', unit: 1,
      sentence: "Hello, I ___ Tom. ___ are you from?",
      blanks: ['am', 'Where'],
      hint: 'Utilisez "am" avec I et un mot interrogatif pour "d\'où viens-tu"',
    },
  ],
  A1_unit2: [
    {
      id: 'u2_q1', type: 'qcm', level: 'A1', unit: 2,
      question: 'What is _____? — It\'s a pen.',
      options: ['A. these', 'B. this', 'C. those', 'D. that'],
      answer: 1,
      explanation: '"This" pour un objet singulier proche de vous. "That" pour un objet éloigné.',
    },
    {
      id: 'u2_match1', type: 'match', level: 'A1', unit: 2,
      pairs: [
        { en: 'teacher', fr: 'professeur' },
        { en: 'doctor', fr: 'médecin' },
        { en: 'engineer', fr: 'ingénieur' },
        { en: 'nurse', fr: 'infirmier/ère' },
      ],
    },
  ],
  A1_unit3: [
    {
      id: 'u3_q1', type: 'qcm', level: 'A1', unit: 3,
      audio: '03-04.mp3',
      question: 'She _____ a red car and two bicycles.',
      options: ['A. have got', 'B. has got', 'C. have', 'D. is got'],
      answer: 1,
      explanation: '"Has got" avec he/she/it (3e personne singulier). "Have got" avec I/you/we/they.',
    },
    {
      id: 'u3_q2', type: 'qcm', level: 'A1', unit: 3,
      question: "_____ you got a sister?",
      options: ['A. Do', 'B. Has', 'C. Have', 'D. Are'],
      answer: 2,
      explanation: 'Question avec "have got" → "Have you got...?" (inversez have et le sujet).',
    },
    {
      id: 'u3_fill1', type: 'fill', level: 'A1', unit: 3,
      sentence: "This is ___ book. (belonging to Marie) / John and ___ sister live in London. / We love ___ new flat.",
      blanks: ['her', 'his', 'our'],
      hint: 'Déterminants possessifs : my / your / his / her / our / their',
    },
    {
      id: 'u3_match1', type: 'match', level: 'A1', unit: 3,
      pairs: [
        { en: 'neighbour', fr: 'voisin' },
        { en: 'flat', fr: 'appartement' },
        { en: 'garden', fr: 'jardin' },
        { en: 'bedroom', fr: 'chambre' },
      ],
    },
  ],
  A1_unit4: [
    {
      id: 'u4_q1', type: 'qcm', level: 'A1', unit: 4,
      audio: '04-01.mp3',
      question: 'She _____ to work by bus every day.',
      options: ['A. go', 'B. goes', 'C. going', 'D. is go'],
      answer: 1,
      explanation: 'Present simple avec he/she/it : on ajoute -s ou -es au verbe.',
    },
    {
      id: 'u4_q2', type: 'qcm', level: 'A1', unit: 4,
      question: "I _____ eat meat. I'm vegetarian.",
      options: ["A. don't", "B. doesn't", "C. not", "D. isn't"],
      answer: 0,
      explanation: 'Négation présent simple avec I/you/we/they : don\'t + verbe.',
    },
  ],
  A1_unit5: [
    {
      id: 'u5_q1', type: 'qcm', level: 'A1', unit: 5,
      audio: '05-01.mp3',
      question: 'He _____ goes to the gym — maybe once a month.',
      options: ['A. always', 'B. usually', 'C. rarely', 'D. never'],
      answer: 2,
      explanation: 'Adverbes de fréquence : always > usually > often > sometimes > rarely > never.',
    },
  ],
};

// Vocabulaire thématique
export const VOCABULARY = {
  unit3_possessions: [
    { en: 'house', fr: 'maison', example: 'They have a big house.' },
    { en: 'flat/apartment', fr: 'appartement', example: 'She lives in a flat in Paris.' },
    { en: 'garden', fr: 'jardin', example: 'Our garden has got flowers.' },
    { en: 'bedroom', fr: 'chambre', example: 'The flat has got two bedrooms.' },
    { en: 'neighbour', fr: 'voisin', example: 'My neighbour is very friendly.' },
    { en: 'car', fr: 'voiture', example: "He's got a red car." },
    { en: 'bike', fr: 'vélo', example: "I've got a new bike." },
    { en: 'phone', fr: 'téléphone', example: "Have you got your phone?" },
  ],
  unit1_greetings: [
    { en: 'Hello', fr: 'Bonjour', example: 'Hello, my name is Tom.' },
    { en: 'Goodbye', fr: 'Au revoir', example: 'Goodbye, see you tomorrow!' },
    { en: 'surname', fr: 'nom de famille', example: 'What is your surname?' },
    { en: 'first name', fr: 'prénom', example: 'My first name is Marie.' },
    { en: 'nationality', fr: 'nationalité', example: "I'm French." },
    { en: 'job/occupation', fr: 'métier', example: "What's your job?" },
  ],
};

// Parcours professionnels
export const PRO_PATHS = [
  { id: 'industrie', title: 'Industrie', icon: '🏭', color: 'blue', desc: 'Vocabulaire technique, sécurité, production, outils', units: 6 },
  { id: 'logistique', title: 'Logistique', icon: '🚛', color: 'teal', desc: 'Transport, commandes, livraisons, entrepôt', units: 5 },
  { id: 'restauration', title: 'Restauration', icon: '🍽️', color: 'amber', desc: 'Service, menus, clients, cuisine', units: 5 },
  { id: 'commerce', title: 'Commerce & Vente', icon: '🛒', color: 'purple', desc: 'Vente, accueil, caisse, relation client', units: 4 },
  { id: 'sante', title: 'Santé', icon: '🏥', color: 'coral', desc: 'Soins, patients, instructions médicales', units: 4 },
  { id: 'batiment', title: 'Bâtiment & BTP', icon: '🏗️', color: 'green', desc: 'Chantier, matériaux, sécurité, équipes', units: 5 },
  { id: 'nettoyage', title: 'Nettoyage', icon: '🧹', color: 'blue', desc: 'Produits, protocoles, communication', units: 3 },
  { id: 'secretariat', title: 'Secrétariat', icon: '📋', color: 'teal', desc: 'Courrier, réunions, téléphone, agenda', units: 4 },
];

// Données démo apprenants
export const DEMO_LEARNERS = [
  { id: 1, name: 'Marie Dupont', initials: 'MD', level: 'A1', unit: 3, progress: 65, lastSeen: "il y a 2h", streak: 7, xp: 1240, alert: false },
  { id: 2, name: 'Ahmed Bouali', initials: 'AB', level: 'A1', unit: 2, progress: 42, lastSeen: "hier", streak: 3, xp: 680, alert: false },
  { id: 3, name: 'Fatou Kouyaté', initials: 'FK', level: 'A1', unit: 1, progress: 18, lastSeen: "il y a 5 jours", streak: 0, xp: 220, alert: true },
  { id: 4, name: 'Luis Martinez', initials: 'LM', level: 'A1', unit: 4, progress: 78, lastSeen: "aujourd'hui", streak: 12, xp: 1580, alert: false },
  { id: 5, name: 'Nguyen Van Anh', initials: 'NA', level: 'A1', unit: 2, progress: 35, lastSeen: "il y a 3 jours", streak: 1, xp: 440, alert: true },
  { id: 6, name: 'Petra Kovač', initials: 'PK', level: 'A1', unit: 3, progress: 55, lastSeen: "hier", streak: 5, xp: 890, alert: false },
  { id: 7, name: 'Amara Diallo', initials: 'AD', level: 'A2', unit: 6, progress: 20, lastSeen: "il y a 2 jours", streak: 2, xp: 2100, alert: false },
  { id: 8, name: 'Elena Popescu', initials: 'EP', level: 'A1', unit: 5, progress: 90, lastSeen: "aujourd'hui", streak: 18, xp: 1920, alert: false },
];

export const GROUPS = [
  { id: 1, name: 'Groupe #AVENIR — Le Havre · A1', level: 'A1', learnerIds: [1,2,3,4,5,6], trainer: 'Joris Michel' },
  { id: 2, name: 'Groupe Savoirs Essentiels · A1-A2', level: 'A1-A2', learnerIds: [7,8], trainer: 'Joris Michel' },
];

// Questions test de positionnement
export const POSITIONING_TEST = [
  { id: 'pt1', type: 'qcm', skill: 'grammaire', question: 'My name _____ John.', options: ['A. are', 'B. is', 'C. am', 'D. be'], answer: 1, level_needed: 'A1' },
  { id: 'pt2', type: 'qcm', skill: 'vocabulaire', question: 'How do you say "maison" in English?', options: ['A. car', 'B. house', 'C. street', 'D. flat'], answer: 1, level_needed: 'A1' },
  { id: 'pt3', type: 'qcm', skill: 'grammaire', question: 'She _____ to the gym every Monday.', options: ['A. go', 'B. goes', 'C. going', 'D. is go'], answer: 1, level_needed: 'A1' },
  { id: 'pt4', type: 'qcm', skill: 'vocabulaire', question: 'What does "voyage" mean?', options: ['A. voyage', 'B. trip / journey', 'C. car', 'D. plane'], answer: 1, level_needed: 'A2' },
  { id: 'pt5', type: 'qcm', skill: 'grammaire', question: 'I _____ never been to London.', options: ['A. have', 'B. has', 'C. am', 'D. did'], answer: 0, level_needed: 'B1' },
  { id: 'pt6', type: 'qcm', skill: 'grammaire', question: 'If I _____ more money, I would travel more.', options: ['A. have', 'B. had', 'C. has', 'D. will have'], answer: 1, level_needed: 'B1' },
];

// ─── Contenu A2 complet ───────────────────────────────────────
export const A2_UNITS = [
  {
    id: 6, title: 'Going places', level: 'A2', page: 6,
    grammar: 'Past simple (regular & irregular verbs)',
    goals: ['Talk about past journeys','Describe places you\'ve visited','Buy tickets and ask for information','Use past simple affirmative and negative','Understand travel announcements'],
    chapters: [
      { id: '6.1', title: 'Where did you go?',          grammar: 'Past simple (affirmative)', vocabulary: 'Transport & travel (flight, train, boat, taxi)', mp3_cb: ['06-01.mp3','06-02.mp3','06-03.mp3'], mp3_wb: ['6-01.mp3','6-02.mp3'] },
      { id: '6.2', title: 'I didn\'t enjoy it!',        grammar: 'Past simple (negative & questions)', vocabulary: 'Holiday activities (swim, visit, eat, see)', mp3_cb: ['06-07.mp3','06-08.mp3'], mp3_wb: ['6-04.mp3'] },
      { id: '6.3', title: 'Vocabulary & skills',        vocabulary: 'Irregular verbs (go/went, see/saw, eat/ate, buy/bought)', skills: 'Reading: travel blog · Listening: airport announcements' },
      { id: '6.4', title: 'Speaking & writing',         skills: 'Speaking: buying a train ticket · Writing: a postcard from holiday' },
      { id: '6.5', title: 'Video',                      video: 'Vidéo 06.mp4', video_topic: 'A trip to Edinburgh — past simple in context' },
      { id: '6.R', title: 'Review' },
    ],
  },
  {
    id: 7, title: 'Everyday life', level: 'A2', page: 16,
    grammar: 'Present continuous + frequency adverbs',
    goals: ['Talk about daily routines','Describe what people are doing right now','Express frequency','Talk about health and lifestyle','Write a personal email'],
    chapters: [
      { id: '7.1', title: 'My typical day',             grammar: 'Present continuous (now vs always)', vocabulary: 'Daily routines (wake up, have breakfast, commute)', mp3_cb: ['07-01.mp3','07-02.mp3'], mp3_wb: ['7-01.mp3'] },
      { id: '7.2', title: 'How often do you...?',       grammar: 'Frequency adverbs & expressions', vocabulary: 'Health & lifestyle (exercise, sleep, diet)', mp3_cb: ['07-06.mp3','07-07.mp3'], mp3_wb: ['7-04.mp3'] },
      { id: '7.3', title: 'Vocabulary & skills',        vocabulary: 'Collocations with do/make/have/go', skills: 'Listening: radio interview about healthy habits · Reading: tips for better sleep' },
      { id: '7.4', title: 'Speaking & writing',         skills: 'Speaking: talking about your routine · Writing: a personal email to a friend' },
      { id: '7.5', title: 'Video',                      video: 'Vidéo 07.mp4', video_topic: 'A day in the life of a chef in Paris' },
      { id: '7.R', title: 'Review' },
    ],
  },
  {
    id: 8, title: 'Food and drink', level: 'A2', page: 26,
    grammar: 'Countable/uncountable nouns · some/any/much/many',
    goals: ['Talk about food and cooking','Order food in a restaurant','Describe quantities','Use some/any/much/many correctly','Write a simple recipe'],
    chapters: [
      { id: '8.1', title: 'What\'s in the fridge?',    grammar: 'Countable & uncountable nouns', vocabulary: 'Food & drink (fruit, vegetables, dairy, meat)', mp3_cb: ['08-01.mp3','08-02.mp3'], mp3_wb: ['8-01.mp3'] },
      { id: '8.2', title: 'How much? How many?',       grammar: 'some/any/much/many/a lot of', vocabulary: 'Quantities & recipes (a cup of, a slice of)', mp3_cb: ['08-06.mp3','08-07.mp3'], mp3_wb: ['8-04.mp3'] },
      { id: '8.3', title: 'Vocabulary & skills',       vocabulary: 'Cooking verbs (boil, fry, bake, chop, mix)', skills: 'Listening: restaurant conversation · Reading: world food quiz' },
      { id: '8.4', title: 'Speaking & writing',        skills: 'Speaking: ordering in a restaurant · Writing: a simple recipe' },
      { id: '8.5', title: 'Video',                     video: 'Vidéo 08.mp4', video_topic: 'Street food around the world' },
      { id: '8.R', title: 'Review' },
    ],
  },
  {
    id: 9, title: 'City life', level: 'A2', page: 36,
    grammar: 'Comparatives & superlatives',
    goals: ['Describe cities and places','Compare different cities','Ask for and give directions','Talk about transport in the city','Write a short description of your town'],
    chapters: [
      { id: '9.1', title: 'Which city is bigger?',     grammar: 'Comparatives (bigger, more expensive, better)', vocabulary: 'City features (population, transport, climate, culture)', mp3_cb: ['09-01.mp3','09-02.mp3'], mp3_wb: ['9-01.mp3'] },
      { id: '9.2', title: 'The best place to live',    grammar: 'Superlatives (the biggest, the most expensive, the best)', vocabulary: 'Urban life (traffic, pollution, nightlife, facilities)', mp3_cb: ['09-06.mp3','09-07.mp3'], mp3_wb: ['9-04.mp3'] },
      { id: '9.3', title: 'Vocabulary & skills',       vocabulary: 'Prepositions of place & direction (next to, opposite, turn left)', skills: 'Listening: asking for directions · Reading: London vs Paris comparison' },
      { id: '9.4', title: 'Speaking & writing',        skills: 'Speaking: giving directions · Writing: a short description of your city' },
      { id: '9.5', title: 'Video',                     video: 'Vidéo 09.mp4', video_topic: 'Living in the city vs the countryside' },
      { id: '9.R', title: 'Review' },
    ],
  },
]

// ─── Test de validation fin de niveau A1 ─────────────────────
export const A1_VALIDATION_TEST = {
  id: 'a1_final',
  title: 'Test de validation — Niveau A1',
  description: 'Réussissez ce test pour débloquer le niveau A2 !',
  passMark: 70,
  questions: [
    { id: 'vt1', type: 'qcm', skill: 'grammaire', question: 'She ___ two brothers and one sister.', options: ['A. have', 'B. has', 'C. is', 'D. are'], answer: 1, points: 5, explanation: '"She" → 3ème personne → "has"' },
    { id: 'vt2', type: 'qcm', skill: 'grammaire', question: 'Where ___ you from?', options: ['A. is', 'B. does', 'C. are', 'D. do'], answer: 2, points: 5, explanation: '"Where are you from?" = forme standard pour demander l\'origine' },
    { id: 'vt3', type: 'qcm', skill: 'vocabulaire', question: 'What is the opposite of "expensive"?', options: ['A. big', 'B. cheap', 'C. small', 'D. old'], answer: 1, points: 5, explanation: '"Cheap" = bon marché, contraire de "expensive"' },
    { id: 'vt4', type: 'qcm', skill: 'grammaire', question: 'I ___ TV every evening.', options: ['A. am watching', 'B. watches', 'C. watch', 'D. watching'], answer: 2, points: 5, explanation: 'Habitude régulière → présent simple. "I watch" (pas de -s avec I)' },
    { id: 'vt5', type: 'qcm', skill: 'vocabulaire', question: 'Which word is a number?', options: ['A. table', 'B. fifteen', 'C. blue', 'D. happy'], answer: 1, points: 5, explanation: '"Fifteen" (15) est un nombre cardinal' },
    { id: 'vt6', type: 'qcm', skill: 'grammaire', question: 'There ___ a lot of people in the park.', options: ['A. is', 'B. are', 'C. be', 'D. am'], answer: 1, points: 5, explanation: '"A lot of people" est pluriel → "there are"' },
    { id: 'vt7', type: 'qcm', skill: 'vocabulaire', question: 'What do you say when you meet someone for the first time?', options: ['A. Goodbye!', 'B. Nice to meet you!', 'C. See you later!', 'D. How are you?'], answer: 1, points: 5, explanation: '"Nice to meet you!" s\'utilise lors d\'une première rencontre' },
    { id: 'vt8', type: 'qcm', skill: 'grammaire', question: '___ she like coffee?', options: ['A. Is', 'B. Have', 'C. Does', 'D. Do'], answer: 2, points: 5, explanation: 'Question au présent simple avec "she" → "Does she..."' },
    { id: 'vt9', type: 'qcm', skill: 'vocabulaire', question: 'My mother\'s mother is my...', options: ['A. aunt', 'B. sister', 'C. grandmother', 'D. cousin'], answer: 2, points: 5, explanation: 'La mère de ma mère = ma grand-mère (grandmother)' },
    { id: 'vt10', type: 'qcm', skill: 'grammaire', question: 'I ___ a teacher. I work in a school.', options: ["A. 'm", 'B. is', 'C. are', 'D. be'], answer: 0, points: 5, explanation: '"I am" = je suis. Forme contractée : "I\'m"' },
    { id: 'vt11', type: 'fill', skill: 'grammaire', question: 'Complete: "This is ___ (my/mine) book. That one is ___ (your/yours)."', blanks: ['my', 'yours'], points: 5, explanation: '"My" + nom / "yours" seul (sans nom)' },
    { id: 'vt12', type: 'qcm', skill: 'vocabulaire', question: 'What time does the film start? — It starts ___ 8 o\'clock.', options: ['A. in', 'B. on', 'C. at', 'D. by'], answer: 2, points: 5, explanation: 'Heure précise → préposition "at" (at 8 o\'clock)' },
    { id: 'vt13', type: 'qcm', skill: 'grammaire', question: 'They ___ football yesterday.', options: ["A. play", "B. plays", "C. played", "D. playing"], answer: 2, points: 5, explanation: '"Yesterday" → passé → past simple. "play" → "played" (régulier)' },
    { id: 'vt14', type: 'qcm', skill: 'vocabulaire', question: 'Which word is a colour?', options: ['A. square', 'B. purple', 'C. happy', 'D. quickly'], answer: 1, points: 5, explanation: '"Purple" = violet, une couleur' },
    { id: 'vt15', type: 'qcm', skill: 'communication', question: 'How do you ask for the price of something?', options: ['A. What time is it?', 'B. Where is it?', 'C. How much is it?', 'D. How many are there?'], answer: 2, points: 5, explanation: '"How much is it?" = Combien ça coûte ?' },
    { id: 'vt16', type: 'qcm', skill: 'grammaire', question: 'I ___ my keys. I can\'t find them!', options: ["A. lose", "B. am losing", "C. have lost", "D. lost"], answer: 2, points: 5, explanation: 'Situation actuelle avec conséquence présente → present perfect "have lost"' },
    { id: 'vt17', type: 'qcm', skill: 'vocabulaire', question: 'Which word means "very tired"?', options: ['A. hungry', 'B. exhausted', 'C. thirsty', 'D. bored'], answer: 1, points: 5, explanation: '"Exhausted" = épuisé, très fatigué' },
    { id: 'vt18', type: 'qcm', skill: 'grammaire', question: 'She is taller ___ her brother.', options: ['A. that', 'B. as', 'C. than', 'D. then'], answer: 2, points: 5, explanation: 'Comparatif de supériorité → "taller than"' },
    { id: 'vt19', type: 'qcm', skill: 'communication', question: 'You want to ask if the seat is free. You say:', options: ['A. Is this seat taken?', 'B. Do you sit here?', 'C. Can I take your seat?', 'D. Where is your seat?'], answer: 0, points: 5, explanation: '"Is this seat taken?" = formule polie pour demander si une place est libre' },
    { id: 'vt20', type: 'qcm', skill: 'vocabulaire', question: 'What do you call the room where you sleep?', options: ['A. kitchen', 'B. bathroom', 'C. bedroom', 'D. living room'], answer: 2, points: 5, explanation: '"Bedroom" = chambre à coucher (room where you sleep)' },
  ]
}
