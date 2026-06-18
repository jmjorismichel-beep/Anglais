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
