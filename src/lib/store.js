import { create } from 'zustand';

// Helpers localStorage
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const load = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };

const useStore = create((set, get) => ({
  // AUTH
  user: load('ep_user', null),
  isAuthenticated: !!load('ep_user', null),

  login: (userData) => {
    const user = { ...userData, loginAt: Date.now() };
    save('ep_user', user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('ep_user');
    set({ user: null, isAuthenticated: false, currentPage: 'home' });
  },
  register: (data) => {
    const user = {
      id: Date.now(),
      ...data,
      role: 'learner',
      level: null,
      currentUnit: 1,
      currentChapter: '1.1',
      xp: 0,
      streak: 0,
      lastActive: Date.now(),
      badges: [],
      progress: {},
      favorites: [],
      createdAt: Date.now(),
    };
    save('ep_user', user);
    set({ user, isAuthenticated: true });
  },

  // NAVIGATION
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),

  // PROGRESS
  progress: load('ep_progress', {}),
  updateProgress: (unitId, chapterId, score) => {
    const p = { ...get().progress, [`${unitId}_${chapterId}`]: { score, completedAt: Date.now() } };
    save('ep_progress', p);
    set({ progress: p });
    // XP reward
    get().addXP(score >= 80 ? 15 : score >= 60 ? 10 : 5);
  },

  // XP & GAMIFICATION
  xp: load('ep_xp', 0),
  streak: load('ep_streak', 7),
  badges: load('ep_badges', ['first_lesson', 'streak_7', 'exercises_10', 'pronunciation']),
  addXP: (amount) => {
    const xp = get().xp + amount;
    save('ep_xp', xp);
    set({ xp });
  },

  // SETTINGS
  settings: load('ep_settings', {
    lang: 'fr',
    fontSize: 'normal',
    dyslexia: false,
    highContrast: false,
    audioSpeed: 1,
    offlineMode: false,
  }),
  updateSettings: (updates) => {
    const s = { ...get().settings, ...updates };
    save('ep_settings', s);
    set({ settings: s });
    // Apply body classes
    document.body.classList.toggle('dyslexia', s.dyslexia);
    document.body.classList.toggle('high-contrast', s.highContrast);
    document.body.classList.remove('font-large', 'font-xl');
    if (s.fontSize === 'large') document.body.classList.add('font-large');
    if (s.fontSize === 'xl') document.body.classList.add('font-xl');
  },

  // POSITIONING TEST
  positioningResult: load('ep_position', null),
  setPositioningResult: (level) => {
    save('ep_position', level);
    set({ positioningResult: level });
  },

  // CHAT AI
  chatMessages: [
    { role: 'bot', content: 'Bonjour ! Je suis votre assistant pédagogique EnglishPath. Je peux vous expliquer la grammaire, corriger vos phrases, vous proposer des exercices, ou traduire. Comment puis-je vous aider ?' },
  ],
  addChatMessage: (msg) => set(s => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [{ role: 'bot', content: 'Nouvelle conversation démarrée. Comment puis-je vous aider ?' }] }),

  // FAVORITES
  favorites: load('ep_favorites', []),
  toggleFavorite: (id) => {
    const favs = get().favorites.includes(id)
      ? get().favorites.filter(f => f !== id)
      : [...get().favorites, id];
    save('ep_favorites', favs);
    set({ favorites: favs });
  },

  // NOTIFICATION
  notification: null,
  showNotif: (msg, type = 'success') => {
    set({ notification: { msg, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));

export default useStore;
