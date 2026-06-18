// Banque complète d'exercices — 100+ exercices Navigate A1-B1
// Système de répétition espacée intégré

// ─── Algorithme répétition espacée (SM-2 simplifié) ─────────
export const spacedRepetition = {
  getNextInterval(quality, interval = 1, easiness = 2.5) {
    // quality: 0-5 (0=mauvais, 5=parfait)
    if (quality < 3) return { interval: 1, easiness: Math.max(1.3, easiness - 0.2) }
    const newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    const newInterval = interval <= 1 ? 6 : Math.round(interval * newEasiness)
    return { interval: newInterval, easiness: Math.max(1.3, newEasiness) }
  },

  getQueue(exercises, history) {
    const now = Date.now()
    return exercises
      .map(ex => {
        const h = history[ex.id] || { interval: 1, easiness: 2.5, nextReview: now, reviews: 0 }
        return { ...ex, history: h, overdue: now >= h.nextReview }
      })
      .filter(ex => ex.overdue)
      .sort((a, b) => a.history.nextReview - b.history.nextReview)
  },

  updateHistory(history, exerciseId, correct, responseTime) {
    const h = history[exerciseId] || { interval: 1, easiness: 2.5, nextReview: Date.now(), reviews: 0 }
    // Quality 0-5 basée sur la correction et le temps de réponse
    const quality = correct ? (responseTime < 5000 ? 5 : responseTime < 10000 ? 4 : 3) : (responseTime < 5000 ? 2 : 1)
    const { interval, easiness } = spacedRepetition.getNextInterval(quality, h.interval, h.easiness)
    return {
      ...history,
      [exerciseId]: {
        interval,
        easiness,
        nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
        reviews: h.reviews + 1,
        lastQuality: quality,
        lastCorrect: correct,
      }
    }
  }
}

// ─── BANQUE D'EXERCICES ──────────────────────────────────────
export const EXERCISE_BANK = {

  // ════════ A1 — UNIT 1 : First meetings ════════
  A1_U1: [
    { id: 'a1u1_01', type: 'qcm', skill: 'grammaire', unit: 1, chapter: '1.1', level: 'A1',
      question: 'My name _____ Sarah.', options: ['A. are', 'B. is', 'C. am', 'D. be'], answer: 1,
      explanation: '"Is" avec he/she/it et les noms. "My name" = nom singulier → is.' },

    { id: 'a1u1_02', type: 'qcm', skill: 'grammaire', unit: 1, chapter: '1.1', level: 'A1',
      question: 'What _____ your name?', options: ['A. are', 'B. is', 'C. am', 'D. do'], answer: 1,
      explanation: 'Question avec "what" + nom singulier → "is".' },

    { id: 'a1u1_03', type: 'qcm', skill: 'grammaire', unit: 1, chapter: '1.1', level: 'A1',
      question: 'Hello! I _____ Tom.', options: ['A. are', 'B. is', 'C. am', 'D. be'], answer: 2,
      explanation: '"Am" uniquement avec "I". Je suis = I am.' },

    { id: 'a1u1_04', type: 'qcm', skill: 'vocabulaire', unit: 1, chapter: '1.1', level: 'A1',
      question: 'How do you say "prénom" in English?', options: ['A. last name', 'B. first name', 'C. surname', 'D. nickname'], answer: 1,
      explanation: '"First name" = prénom. "Last name / surname" = nom de famille.' },

    { id: 'a1u1_05', type: 'qcm', skill: 'grammaire', unit: 1, chapter: '1.2', level: 'A1',
      question: 'Where _____ you from?', options: ['A. is', 'B. am', 'C. are', 'D. do'], answer: 2,
      explanation: '"Are" avec you/we/they. Where are you from? = D\'où venez-vous?' },

    { id: 'a1u1_06', type: 'qcm', skill: 'vocabulaire', unit: 1, chapter: '1.2', level: 'A1',
      question: '"I am French." What does this mean?', options: ['A. Je parle français', 'B. Je suis français(e)', 'C. J\'apprends le français', 'D. J\'aime la France'], answer: 1,
      explanation: '"I am French" = Je suis français(e). Nationalité = être + adjectif.' },

    { id: 'a1u1_07', type: 'qcm', skill: 'grammaire', unit: 1, chapter: '1.3', level: 'A1',
      question: 'How do you _____ your name?', options: ['A. spell', 'B. say', 'C. write', 'D. read'], answer: 0,
      explanation: '"How do you spell...?" = Comment ça s\'écrit ? Épeler = spell.' },

    { id: 'a1u1_08', type: 'fill', skill: 'grammaire', unit: 1, chapter: '1.1', level: 'A1',
      sentence: 'Hi! My name ___ Anna. I ___ from Poland.',
      blanks: ['is', 'am'],
      hint: 'My name → is / I → am' },

    { id: 'a1u1_09', type: 'fill', skill: 'grammaire', unit: 1, chapter: '1.2', level: 'A1',
      sentence: 'Where ___ he from? He ___ from Italy.',
      blanks: ['is', 'is'],
      hint: 'He → is (toujours)' },

    { id: 'a1u1_10', type: 'match', skill: 'vocabulaire', unit: 1, chapter: '1.1', level: 'A1',
      pairs: [
        { en: 'name', fr: 'nom' }, { en: 'job', fr: 'métier' },
        { en: 'nationality', fr: 'nationalité' }, { en: 'country', fr: 'pays' },
      ]},

    { id: 'a1u1_11', type: 'pronunciation', skill: 'prononciation', unit: 1, chapter: '1.3', level: 'A1',
      word: 'Hello', phonetic: '/həˈloʊ/', tip: 'Prononcez "heu-LO" — accent sur la 2e syllabe.',
      target: 'Hello my name is Anna' },

    { id: 'a1u1_12', type: 'qcm', skill: 'vocabulaire', unit: 1, chapter: '1.2', level: 'A1',
      question: 'She is a _____ from Spain.', options: ['A. Spanish', 'B. Spain', 'C. Spaniard', 'D. Spanisher'], answer: 0,
      explanation: 'Adjectif de nationalité espagnol = "Spanish". Attention : pas de majuscule en français mais OUI en anglais !' },
  ],

  // ════════ A1 — UNIT 2 : Questions ════════
  A1_U2: [
    { id: 'a1u2_01', type: 'qcm', skill: 'grammaire', unit: 2, chapter: '2.1', level: 'A1',
      question: 'What is _____? — It\'s a pen.', options: ['A. these', 'B. this', 'C. those', 'D. that'], answer: 1,
      explanation: '"This" = cet objet proche de moi (singulier). "That" = cet objet là-bas. "These/Those" = pluriel.' },

    { id: 'a1u2_02', type: 'qcm', skill: 'grammaire', unit: 2, chapter: '2.1', level: 'A1',
      question: '_____ are my keys! (les clés sont loin)', options: ['A. This', 'B. That', 'C. Those', 'D. These'], answer: 2,
      explanation: '"Those" = ces objets là-bas (pluriel, éloigné). "These" = ces objets ici (pluriel, proche).' },

    { id: 'a1u2_03', type: 'qcm', skill: 'vocabulaire', unit: 2, chapter: '2.2', level: 'A1',
      question: '"What\'s your job?" means:', options: ['A. Quel est ton prénom ?', 'B. Quel est ton métier ?', 'C. Où travailles-tu ?', 'D. Tu aimes ton travail ?'], answer: 1,
      explanation: '"Job" = métier/profession. "What\'s your job?" = "Qu\'est-ce que vous faites comme métier ?"' },

    { id: 'a1u2_04', type: 'qcm', skill: 'grammaire', unit: 2, chapter: '2.2', level: 'A1',
      question: 'She is _____ engineer.', options: ['A. a', 'B. an', 'C. the', 'D. -'], answer: 1,
      explanation: '"An" avant une voyelle (a, e, i, o, u). Engineer commence par E → "an engineer".' },

    { id: 'a1u2_05', type: 'qcm', skill: 'grammaire', unit: 2, chapter: '2.3', level: 'A1',
      question: 'The books _____ on the table.', options: ['A. is', 'B. am', 'C. are', 'D. be'], answer: 2,
      explanation: '"The books" = pluriel → "are". Singulier → is. I → am.' },

    { id: 'a1u2_06', type: 'match', skill: 'vocabulaire', unit: 2, chapter: '2.2', level: 'A1',
      pairs: [
        { en: 'teacher', fr: 'professeur' }, { en: 'doctor', fr: 'médecin' },
        { en: 'engineer', fr: 'ingénieur' }, { en: 'nurse', fr: 'infirmier/ère' },
      ]},

    { id: 'a1u2_07', type: 'fill', skill: 'grammaire', unit: 2, chapter: '2.1', level: 'A1',
      sentence: '_____ is a laptop. _____ are my books.',
      blanks: ['This', 'These'],
      hint: 'Singulier proche → This / Pluriel proche → These' },

    { id: 'a1u2_08', type: 'qcm', skill: 'vocabulaire', unit: 2, chapter: '2.2', level: 'A1',
      question: 'He is _____ actor.', options: ['A. a', 'B. an', 'C. the', 'D. -'], answer: 1,
      explanation: '"Actor" commence par une voyelle A → "an actor".' },

    { id: 'a1u2_09', type: 'qcm', skill: 'grammaire', unit: 2, chapter: '2.3', level: 'A1',
      question: 'Where _____ the restaurant?', options: ['A. are', 'B. am', 'C. is', 'D. be'], answer: 2,
      explanation: '"The restaurant" = singulier → "is". Where is the restaurant?' },

    { id: 'a1u2_10', type: 'pronunciation', skill: 'prononciation', unit: 2, chapter: '2.2', level: 'A1',
      word: 'engineer', phonetic: '/ˌendʒɪˈnɪər/', tip: '"in-dji-NIEUR" — accent sur la 3e syllabe.',
      target: 'I am an engineer' },
  ],

  // ════════ A1 — UNIT 3 : People and possessions ════════
  A1_U3: [
    { id: 'a1u3_01', type: 'qcm', skill: 'grammaire', unit: 3, chapter: '3.1', level: 'A1',
      audio: '03-04.mp3',
      question: 'She _____ a red car and two bicycles.',
      options: ['A. have got', 'B. has got', 'C. have', 'D. is got'], answer: 1,
      explanation: '"Has got" avec he/she/it. "Have got" avec I/you/we/they.' },

    { id: 'a1u3_02', type: 'qcm', skill: 'grammaire', unit: 3, chapter: '3.1', level: 'A1',
      question: '_____ you got a sister?', options: ['A. Do', 'B. Has', 'C. Have', 'D. Are'], answer: 2,
      explanation: 'Question avec "have got" : "Have you got...?" (inversion have + sujet).' },

    { id: 'a1u3_03', type: 'qcm', skill: 'grammaire', unit: 3, chapter: '3.1', level: 'A1',
      question: 'I _____ a car. (négatif)', options: ["A. haven't got", "B. hasn't got", "C. don't have got", "D. not have got"], answer: 0,
      explanation: 'Négatif avec I → "haven\'t got". Avec he/she/it → "hasn\'t got".' },

    { id: 'a1u3_04', type: 'fill', skill: 'grammaire', unit: 3, chapter: '3.2', level: 'A1',
      sentence: 'This is ___ book. (Marie) / John and ___ sister are French. / We love ___ new flat.',
      blanks: ['her', 'his', 'our'],
      hint: 'my/your/his/her/our/their — accord avec le possesseur, pas l\'objet !' },

    { id: 'a1u3_05', type: 'match', skill: 'vocabulaire', unit: 3, chapter: '3.2', level: 'A1',
      pairs: [
        { en: 'neighbour', fr: 'voisin(e)' }, { en: 'flat', fr: 'appartement' },
        { en: 'garden', fr: 'jardin' }, { en: 'bedroom', fr: 'chambre' },
      ]},

    { id: 'a1u3_06', type: 'match', skill: 'vocabulaire', unit: 3, chapter: '3.3', level: 'A1',
      pairs: [
        { en: 'mother', fr: 'mère' }, { en: 'father', fr: 'père' },
        { en: 'sister', fr: 'sœur' }, { en: 'brother', fr: 'frère' },
      ]},

    { id: 'a1u3_07', type: 'qcm', skill: 'vocabulaire', unit: 3, chapter: '3.3', level: 'A1',
      question: '"My parents have got three children." How many kids?',
      options: ['A. Two', 'B. Three', 'C. One', 'D. Four'], answer: 1,
      explanation: '"Three children" = trois enfants. Children = pluriel irrégulier de child.' },

    { id: 'a1u3_08', type: 'fill', skill: 'grammaire', unit: 3, chapter: '3.1', level: 'A1',
      sentence: "My parents ___ got a big house. ___ your brother got a car?",
      blanks: ['have', 'Has'],
      hint: 'parents → have / your brother (he) → Has' },

    { id: 'a1u3_09', type: 'pronunciation', skill: 'prononciation', unit: 3, chapter: '3.2', level: 'A1',
      word: 'neighbour', phonetic: '/ˈneɪbər/', tip: '"NAY-ber" — le GH est muet !',
      target: 'My neighbour has got a garden' },

    { id: 'a1u3_10', type: 'qcm', skill: 'grammaire', unit: 3, chapter: '3.2', level: 'A1',
      question: 'This is _____ car. (belonging to Tom)',
      options: ["A. his", "B. her", "C. their", "D. its"], answer: 0,
      explanation: '"His" pour un possesseur masculin. "Her" pour un possesseur féminin. Tom = masculin → his.' },

    { id: 'a1u3_11', type: 'qcm', skill: 'vocabulaire', unit: 3, chapter: '3.1', level: 'A1',
      question: 'What does "have got" mean?', options: ['A. avoir besoin', 'B. avoir (possession)', 'C. avoir faim', 'D. avoir froid'], answer: 1,
      explanation: '"Have got" = avoir (possession). "I\'ve got a car" = J\'ai une voiture.' },

    { id: 'a1u3_12', type: 'fill', skill: 'vocabulaire', unit: 3, chapter: '3.3', level: 'A1',
      sentence: "My ___ is my father's wife. My ___ is my mother's son.",
      blanks: ['mother', 'brother'],
      hint: 'La famille : pères/mères, sœurs/frères' },
  ],

  // ════════ A1 — UNIT 4 : My life ════════
  A1_U4: [
    { id: 'a1u4_01', type: 'qcm', skill: 'grammaire', unit: 4, chapter: '4.1', level: 'A1',
      audio: '04-01.mp3',
      question: 'She _____ to work by bus every day.',
      options: ['A. go', 'B. goes', 'C. going', 'D. is go'], answer: 1,
      explanation: 'Présent simple avec he/she/it : on ajoute -s. go → goes.' },

    { id: 'a1u4_02', type: 'qcm', skill: 'grammaire', unit: 4, chapter: '4.1', level: 'A1',
      question: "I _____ eat meat. I'm vegetarian.",
      options: ["A. don't", "B. doesn't", "C. not", "D. isn't"], answer: 0,
      explanation: 'Négation présent simple I/you/we/they → "don\'t". He/she/it → "doesn\'t".' },

    { id: 'a1u4_03', type: 'qcm', skill: 'grammaire', unit: 4, chapter: '4.2', level: 'A1',
      question: '_____ she live in Paris?', options: ['A. Do', 'B. Does', 'C. Is', 'D. Has'], answer: 1,
      explanation: 'Question présent simple she → "Does she...?" Attention : le verbe reste à l\'infinitif.' },

    { id: 'a1u4_04', type: 'fill', skill: 'grammaire', unit: 4, chapter: '4.1', level: 'A1',
      sentence: "He ___ in London. He ___ by car to work.",
      blanks: ['lives', 'goes'],
      hint: 'He → verbe + s : live→lives / go→goes' },

    { id: 'a1u4_05', type: 'match', skill: 'vocabulaire', unit: 4, chapter: '4.3', level: 'A1',
      pairs: [
        { en: 'wake up', fr: 'se réveiller' }, { en: 'have breakfast', fr: 'prendre le petit-déjeuner' },
        { en: 'go to work', fr: 'aller au travail' }, { en: 'come home', fr: 'rentrer à la maison' },
      ]},

    { id: 'a1u4_06', type: 'qcm', skill: 'vocabulaire', unit: 4, chapter: '4.3', level: 'A1',
      question: 'What time _____ you get up?', options: ['A. is', 'B. do', 'C. are', 'D. have'], answer: 1,
      explanation: '"What time do you...?" Question au présent simple avec you → do.' },

    { id: 'a1u4_07', type: 'qcm', skill: 'grammaire', unit: 4, chapter: '4.2', level: 'A1',
      question: 'The train _____ at 8:30.', options: ['A. leave', 'B. leaves', 'C. is leave', 'D. go'], answer: 1,
      explanation: '"The train" = he/she/it → verbe + s. leave → leaves.' },

    { id: 'a1u4_08', type: 'pronunciation', skill: 'prononciation', unit: 4, chapter: '4.3', level: 'A1',
      word: 'breakfast', phonetic: '/ˈbrekfəst/', tip: '"BREK-feust" — le A se prononce comme dans "bet".',
      target: 'I have breakfast at seven' },

    { id: 'a1u4_09', type: 'fill', skill: 'grammaire', unit: 4, chapter: '4.1', level: 'A1',
      sentence: "___ your sister work in Paris? No, she ___ in Lyon.",
      blanks: ['Does', 'works'],
      hint: 'Question → Does / Affirmatif she → works' },

    { id: 'a1u4_10', type: 'qcm', skill: 'grammaire', unit: 4, chapter: '4.1', level: 'A1',
      question: 'My brother _____ coffee every morning.',
      options: ['A. drink', 'B. drinks', 'C. is drink', 'D. drinking'], answer: 1,
      explanation: '"My brother" = he → présent simple + s. drink → drinks.' },
  ],

  // ════════ A1 — UNIT 5 : Style and design ════════
  A1_U5: [
    { id: 'a1u5_01', type: 'qcm', skill: 'grammaire', unit: 5, chapter: '5.1', level: 'A1',
      audio: '05-01.mp3',
      question: 'He _____ goes to the gym — maybe once a month.',
      options: ['A. always', 'B. usually', 'C. rarely', 'D. never'], answer: 2,
      explanation: 'Adverbes de fréquence : always (100%) > usually > often > sometimes > rarely (rarement) > never (0%).' },

    { id: 'a1u5_02', type: 'qcm', skill: 'grammaire', unit: 5, chapter: '5.1', level: 'A1',
      question: 'She _____ wears jeans — every day!',
      options: ['A. never', 'B. rarely', 'C. always', 'D. sometimes'], answer: 2,
      explanation: '"Always" = toujours. Position : avant le verbe principal mais après "be".' },

    { id: 'a1u5_03', type: 'match', skill: 'vocabulaire', unit: 5, chapter: '5.1', level: 'A1',
      pairs: [
        { en: 'clothes', fr: 'vêtements' }, { en: 'dress', fr: 'robe' },
        { en: 'jacket', fr: 'veste' }, { en: 'shoes', fr: 'chaussures' },
      ]},

    { id: 'a1u5_04', type: 'fill', skill: 'grammaire', unit: 5, chapter: '5.1', level: 'A1',
      sentence: "He ___ goes to work by bus (every day). She ___ goes shopping (once a year).",
      blanks: ['always', 'rarely'],
      hint: 'every day = always / once a year = rarely' },

    { id: 'a1u5_05', type: 'qcm', skill: 'grammaire', unit: 5, chapter: '5.2', level: 'A1',
      question: 'This building is _____ than that one. (grand)', options: ['A. big', 'B. bigger', 'C. biggest', 'D. more big'], answer: 1,
      explanation: 'Comparatif court (1-2 syllabes) : adjectif + -er. big → bigger (doublement de la consonne finale).' },

    { id: 'a1u5_06', type: 'qcm', skill: 'vocabulaire', unit: 5, chapter: '5.2', level: 'A1',
      question: 'The Eiffel Tower is _____ building in Paris. (célèbre)',
      options: ['A. more famous', 'B. the most famous', 'C. most famous', 'D. famousest'], answer: 1,
      explanation: 'Superlatif : "the most + adjectif" pour les adjectifs longs. famous → the most famous.' },

    { id: 'a1u5_07', type: 'fill', skill: 'grammaire', unit: 5, chapter: '5.2', level: 'A1',
      sentence: "This dress is ___ (cheap) than that one. That hotel is the ___ (expensive) in the city.",
      blanks: ['cheaper', 'most expensive'],
      hint: 'cheap (court) → cheaper / expensive (long) → most expensive' },

    { id: 'a1u5_08', type: 'pronunciation', skill: 'prononciation', unit: 5, chapter: '5.1', level: 'A1',
      word: 'clothes', phonetic: '/kloʊðz/', tip: '"KLOZ" — le TH se prononce comme le Z anglais. Attention : le E est muet !',
      target: 'I always wear smart clothes' },
  ],

  // ════════ A2 — UNIT 6 : Going places ════════
  A2_U6: [
    { id: 'a2u6_01', type: 'qcm', skill: 'grammaire', unit: 6, chapter: '6.1', level: 'A2',
      question: 'Last summer, she _____ to Spain.', options: ['A. go', 'B. goes', 'C. went', 'D. going'], answer: 2,
      explanation: '"Went" est le passé irrégulier de "go". Last summer = passé → past simple.' },

    { id: 'a2u6_02', type: 'qcm', skill: 'grammaire', unit: 6, chapter: '6.1', level: 'A2',
      question: 'They _____ the museum yesterday.', options: ['A. visit', 'B. visited', 'C. visits', 'D. visiting'], answer: 1,
      explanation: 'Passé simple régulier : infinitif + -ed. visit → visited. Yesterday = passé.' },

    { id: 'a2u6_03', type: 'qcm', skill: 'grammaire', unit: 6, chapter: '6.2', level: 'A2',
      question: 'He _____ at the hotel two nights ago.', options: ['A. stay', 'B. stayed', 'C. was stay', 'D. staying'], answer: 1,
      explanation: '"Two nights ago" indique le passé. stay → stayed (régulier).' },

    { id: 'a2u6_04', type: 'fill', skill: 'grammaire', unit: 6, chapter: '6.1', level: 'A2',
      sentence: "We ___ (go) to London last week. We ___ (visit) the British Museum.",
      blanks: ['went', 'visited'],
      hint: 'go → went (irrégulier) / visit → visited (régulier)' },

    { id: 'a2u6_05', type: 'match', skill: 'vocabulaire', unit: 6, chapter: '6.1', level: 'A2',
      pairs: [
        { en: 'airport', fr: 'aéroport' }, { en: 'passport', fr: 'passeport' },
        { en: 'flight', fr: 'vol' }, { en: 'luggage', fr: 'bagages' },
      ]},

    { id: 'a2u6_06', type: 'qcm', skill: 'grammaire', unit: 6, chapter: '6.2', level: 'A2',
      question: 'What _____ the weather like?', options: ['A. was', 'B. were', 'C. did', 'D. is'], answer: 0,
      explanation: '"Was" = passé de "is". The weather (singulier) → was. What was the weather like? = C\'était comment, le temps ?' },
  ],

  // ════════ A2 — UNIT 7 : Everyday life ════════
  A2_U7: [
    { id: 'a2u7_01', type: 'qcm', skill: 'grammaire', unit: 7, chapter: '7.1', level: 'A2',
      question: 'Look! It _____ right now.', options: ['A. rains', 'B. is raining', 'C. rain', 'D. rained'], answer: 1,
      explanation: '"Right now" → présent continu (en train de). is + verbe + -ing.' },

    { id: 'a2u7_02', type: 'qcm', skill: 'grammaire', unit: 7, chapter: '7.1', level: 'A2',
      question: 'She _____ her homework at the moment.',
      options: ['A. does', 'B. is doing', 'C. do', 'D. did'], answer: 1,
      explanation: '"At the moment" → présent continu. she is + doing.' },

    { id: 'a2u7_03', type: 'fill', skill: 'grammaire', unit: 7, chapter: '7.1', level: 'A2',
      sentence: "They ___ (watch) TV right now. He ___ (not listen) to music — he's reading.",
      blanks: ['are watching', "isn't listening"],
      hint: 'Présent continu : be + verbe-ing / négatif : be + not + verbe-ing' },

    { id: 'a2u7_04', type: 'match', skill: 'vocabulaire', unit: 7, chapter: '7.2', level: 'A2',
      pairs: [
        { en: 'shopping centre', fr: 'centre commercial' }, { en: 'library', fr: 'bibliothèque' },
        { en: 'chemist', fr: 'pharmacie' }, { en: 'post office', fr: 'bureau de poste' },
      ]},
  ],

  // ════════ B1 — UNIT 10 : Work and study ════════
  B1_U10: [
    { id: 'b1u10_01', type: 'qcm', skill: 'grammaire', unit: 10, chapter: '10.1', level: 'B1',
      question: 'I _____ never been to Japan.', options: ['A. have', 'B. has', 'C. am', 'D. did'], answer: 0,
      explanation: 'Présent parfait (expériences de vie) : have/has + participe passé. I → have. Never → jamais.' },

    { id: 'b1u10_02', type: 'qcm', skill: 'grammaire', unit: 10, chapter: '10.1', level: 'B1',
      question: 'She _____ worked here for 10 years.', options: ['A. have', 'B. has', 'C. had', 'D. is'], answer: 1,
      explanation: '"For 10 years" avec le présent parfait → she has. For + durée = depuis combien de temps.' },

    { id: 'b1u10_03', type: 'fill', skill: 'grammaire', unit: 10, chapter: '10.1', level: 'B1',
      sentence: "I ___ (already/finish) my homework. They ___ (not/see) this film yet.",
      blanks: ['have already finished', "haven't seen"],
      hint: 'Already → avant le participe. Yet → en fin de phrase (négatif/question)' },

    { id: 'b1u10_04', type: 'qcm', skill: 'grammaire', unit: 10, chapter: '10.2', level: 'B1',
      question: 'If I _____ more time, I would study more.', options: ['A. have', 'B. had', 'C. has', 'D. will have'], answer: 1,
      explanation: 'Conditionnel 2 : If + past simple, would + infinitif. Situation hypothétique (non réelle).' },

    { id: 'b1u10_05', type: 'match', skill: 'vocabulaire', unit: 10, chapter: '10.1', level: 'B1',
      pairs: [
        { en: 'promotion', fr: 'promotion/avancement' }, { en: 'colleague', fr: 'collègue' },
        { en: 'deadline', fr: 'date limite' }, { en: 'meeting', fr: 'réunion' },
      ]},
  ],

  // ════════ PARCOURS PRO — Logistique ════════
  PRO_LOGISTIQUE: [
    { id: 'pro_log_01', type: 'qcm', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A1',
      question: 'What does "delivery" mean?', options: ['A. Commande', 'B. Livraison', 'C. Entrepôt', 'D. Retour'], answer: 1,
      explanation: '"Delivery" = livraison. "Order" = commande. "Warehouse" = entrepôt.' },

    { id: 'pro_log_02', type: 'match', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A1',
      pairs: [
        { en: 'warehouse', fr: 'entrepôt' }, { en: 'shipment', fr: 'expédition' },
        { en: 'invoice', fr: 'facture' }, { en: 'forklift', fr: 'chariot élévateur' },
      ]},

    { id: 'pro_log_03', type: 'fill', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A2',
      sentence: "The ___ will arrive tomorrow. Please check the ___ before signing.",
      blanks: ['delivery', 'invoice'],
      hint: 'livraison = delivery / facture = invoice' },
  ],

  // ════════ PARCOURS PRO — Restauration ════════
  PRO_RESTAURATION: [
    { id: 'pro_rest_01', type: 'qcm', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A1',
      question: 'A customer says "Can I have the bill, please?" What do they want?',
      options: ['A. Le menu', 'B. L\'addition', 'C. Un verre d\'eau', 'D. La carte des desserts'], answer: 1,
      explanation: '"The bill" = l\'addition. "The menu" = le menu. "A glass of water" = un verre d\'eau.' },

    { id: 'pro_rest_02', type: 'match', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A1',
      pairs: [
        { en: 'starter', fr: 'entrée' }, { en: 'main course', fr: 'plat principal' },
        { en: 'dessert', fr: 'dessert' }, { en: 'tip', fr: 'pourboire' },
      ]},

    { id: 'pro_rest_03', type: 'fill', skill: 'vocabulaire', unit: 0, chapter: 'pro', level: 'A1',
      sentence: 'Welcome! Here is your ___. Are you ready to ___?',
      blanks: ['menu', 'order'],
      hint: 'menu = menu / passer commande = to order' },
  ],
}

// ─── Helpers ────────────────────────────────────────────────
export const getAllExercises = () => Object.values(EXERCISE_BANK).flat()

export const getByUnit = (unitId) =>
  getAllExercises().filter(ex => ex.unit === unitId)

export const getByLevel = (level) =>
  getAllExercises().filter(ex => ex.level === level)

export const getByType = (type) =>
  getAllExercises().filter(ex => ex.type === type)

export const getBySkill = (skill) =>
  getAllExercises().filter(ex => ex.skill === skill)

export const getDueExercises = (history) =>
  spacedRepetition.getQueue(getAllExercises(), history)

export const getTotalCount = () => getAllExercises().length

export const EXERCISE_TYPES = {
  qcm: { label: 'QCM', icon: '📝', color: '#185FA5' },
  fill: { label: 'Texte à trous', icon: '✏️', color: '#1D9E75' },
  match: { label: 'Association', icon: '🔗', color: '#534AB7' },
  pronunciation: { label: 'Prononciation', icon: '🗣️', color: '#D85A30' },
  audio: { label: 'Écoute', icon: '🎧', color: '#BA7517' },
}

// ─── Exercices A2 ─────────────────────────────────────────────
export const A2_EXERCISES = [

  // ── UNIT 6 : Going places ──
  { id: 'a2_u6_01', type: 'qcm', level: 'A2', unit: 6, chapter: '6.1', skill: 'grammaire',
    question: 'Last summer, we ___ to Spain by plane.',
    options: ['A. go', 'B. went', 'C. gone', 'D. going'], answer: 1,
    explanation: '"Last summer" → passé → past simple. "go" est irrégulier : go → went' },

  { id: 'a2_u6_02', type: 'qcm', level: 'A2', unit: 6, chapter: '6.1', skill: 'grammaire',
    question: 'She ___ enjoy the flight — it was too long.',
    options: ["A. didn't", "B. doesn't", "C. wasn't", "D. hadn't"], answer: 0,
    explanation: 'Négatif au past simple → did + not → didn\'t + infinitif' },

  { id: 'a2_u6_03', type: 'qcm', level: 'A2', unit: 6, chapter: '6.1', skill: 'vocabulaire',
    question: 'You take this at an airport to fly to another country:',
    options: ['A. a bus', 'B. a train', 'C. a flight', 'D. a taxi'], answer: 2,
    explanation: '"A flight" = un vol en avion' },

  { id: 'a2_u6_04', type: 'fill', level: 'A2', unit: 6, chapter: '6.2', skill: 'grammaire',
    sentence: '___ you ___ (visit) the Eiffel Tower when you were in Paris?',
    blanks: ['Did', 'visit'],
    hint: 'Question au past simple → Did + sujet + infinitif ?' },

  { id: 'a2_u6_05', type: 'match', level: 'A2', unit: 6, chapter: '6.2', skill: 'vocabulaire',
    pairs: [
      { en: 'go → went',   fr: 'aller (irrégulier)' },
      { en: 'see → saw',   fr: 'voir (irrégulier)'  },
      { en: 'eat → ate',   fr: 'manger (irrégulier)'},
      { en: 'buy → bought',fr: 'acheter (irrégulier)'},
    ]},

  // ── UNIT 7 : Everyday life ──
  { id: 'a2_u7_01', type: 'qcm', level: 'A2', unit: 7, chapter: '7.1', skill: 'grammaire',
    question: 'Look! The cat ___ on my laptop again!',
    options: ['A. sits', 'B. is sitting', 'C. sat', 'D. sit'], answer: 1,
    explanation: '"Look!" = action en ce moment précis → présent continu "is sitting"' },

  { id: 'a2_u7_02', type: 'qcm', level: 'A2', unit: 7, chapter: '7.1', skill: 'grammaire',
    question: 'I ___ (always/play) football on Sundays.',
    options: ['A. am always playing', 'B. always play', 'C. always plays', 'D. played always'], answer: 1,
    explanation: 'Habitude régulière → présent simple. Position de "always" : avant le verbe principal' },

  { id: 'a2_u7_03', type: 'qcm', level: 'A2', unit: 7, chapter: '7.2', skill: 'grammaire',
    question: 'How ___ do you go to the gym?',
    options: ['A. much', 'B. many', 'C. often', 'D. long'], answer: 2,
    explanation: '"How often?" = À quelle fréquence ? (pour demander la fréquence d\'une action)' },

  { id: 'a2_u7_04', type: 'match', level: 'A2', unit: 7, chapter: '7.2', skill: 'vocabulaire',
    pairs: [
      { en: 'once a week',    fr: 'une fois par semaine'  },
      { en: 'twice a month',  fr: 'deux fois par mois'    },
      { en: 'every day',      fr: 'tous les jours'        },
      { en: 'rarely',         fr: 'rarement'              },
    ]},

  { id: 'a2_u7_05', type: 'fill', level: 'A2', unit: 7, chapter: '7.1', skill: 'grammaire',
    sentence: 'She ___ (not/watch) TV right now — she ___ (read) a book.',
    blanks: ["isn't watching", 'is reading'],
    hint: 'Présent continu négatif et affirmatif' },

  // ── UNIT 8 : Food and drink ──
  { id: 'a2_u8_01', type: 'qcm', level: 'A2', unit: 8, chapter: '8.1', skill: 'grammaire',
    question: 'Can I have ___ water, please? I\'m very thirsty.',
    options: ['A. a', 'B. any', 'C. some', 'D. many'], answer: 2,
    explanation: '"Some" s\'utilise dans les phrases affirmatives et les demandes polies avec les indénombrables (water)' },

  { id: 'a2_u8_02', type: 'qcm', level: 'A2', unit: 8, chapter: '8.1', skill: 'grammaire',
    question: 'There aren\'t ___ eggs in the fridge.',
    options: ['A. some', 'B. any', 'C. much', 'D. a'], answer: 1,
    explanation: '"Any" dans les phrases négatives avec les dénombrables pluriels' },

  { id: 'a2_u8_03', type: 'qcm', level: 'A2', unit: 8, chapter: '8.2', skill: 'grammaire',
    question: 'How ___ sugar do you take in your coffee?',
    options: ['A. many', 'B. much', 'C. any', 'D. some'], answer: 1,
    explanation: '"How much" pour les indénombrables (sugar, water, money, time)' },

  { id: 'a2_u8_04', type: 'match', level: 'A2', unit: 8, chapter: '8.3', skill: 'vocabulaire',
    pairs: [
      { en: 'boil',  fr: 'faire bouillir' },
      { en: 'bake',  fr: 'cuire au four'  },
      { en: 'fry',   fr: 'frire'          },
      { en: 'chop',  fr: 'couper/hacher'  },
    ]},

  { id: 'a2_u8_05', type: 'qcm', level: 'A2', unit: 8, chapter: '8.1', skill: 'vocabulaire',
    question: 'Which is an UNCOUNTABLE noun?',
    options: ['A. apple', 'B. egg', 'C. milk', 'D. sandwich'], answer: 2,
    explanation: '"Milk" (lait) est indénombrable — on ne peut pas dire "one milk, two milks"' },

  // ── UNIT 9 : City life ──
  { id: 'a2_u9_01', type: 'qcm', level: 'A2', unit: 9, chapter: '9.1', skill: 'grammaire',
    question: 'Paris is ___ than my hometown.',
    options: ['A. more big', 'B. bigger', 'C. biggest', 'D. most big'], answer: 1,
    explanation: 'Comparatif d\'un adjectif court (1 syllabe) → + er. big → bigger (double g car: consonne + voyelle + consonne)' },

  { id: 'a2_u9_02', type: 'qcm', level: 'A2', unit: 9, chapter: '9.1', skill: 'grammaire',
    question: 'London is ___ expensive city in the UK.',
    options: ['A. most', 'B. more', 'C. the most', 'D. the more'], answer: 2,
    explanation: 'Superlatif → "the most" + adjectif long (2+ syllabes). expensive → the most expensive' },

  { id: 'a2_u9_03', type: 'fill', level: 'A2', unit: 9, chapter: '9.2', skill: 'grammaire',
    sentence: 'Tokyo is ___ (big) city in Japan. It\'s also ___ (expensive) than London.',
    blanks: ['the biggest', 'more expensive'],
    hint: 'big → comparatif: bigger / superlatif: the biggest' },

  { id: 'a2_u9_04', type: 'match', level: 'A2', unit: 9, chapter: '9.3', skill: 'vocabulaire',
    pairs: [
      { en: 'Turn left',   fr: 'Tournez à gauche' },
      { en: 'Turn right',  fr: 'Tournez à droite' },
      { en: 'Go straight', fr: 'Allez tout droit'  },
      { en: 'Opposite',    fr: 'En face de'        },
    ]},

  { id: 'a2_u9_05', type: 'qcm', level: 'A2', unit: 9, chapter: '9.1', skill: 'grammaire',
    question: 'Good → better → ___',
    options: ['A. the goodest', 'B. the most good', 'C. the best', 'D. the betterer'], answer: 2,
    explanation: '"Good" est irrégulier : good → better → the best' },
]
