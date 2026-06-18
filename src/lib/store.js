import { create } from 'zustand'
import { supabase, authHelpers, learnerHelpers, progressHelpers, favoritesHelpers } from './supabase.js'

// Fallback localStorage si pas de connexion
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

const useStore = create((set, get) => ({
  // ── AUTH ──────────────────────────────────────────────────
  user: null,
  profile: null,
  isAuthenticated: false,
  authLoading: true,

  initAuth: async () => {
    // Écouter les changements d'auth Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await learnerHelpers.getProfile(session.user.id)
        set({ user: session.user, profile, isAuthenticated: true, authLoading: false })
        // Appliquer les paramètres sauvegardés
        if (profile?.settings) get().applySettings(profile.settings)
      } else {
        set({ user: null, profile: null, isAuthenticated: false, authLoading: false })
      }
    })

    // Vérifier session existante
    const session = await authHelpers.getSession()
    if (!session) set({ authLoading: false })

    return () => subscription?.unsubscribe()
  },

  register: async ({ firstName, lastName, email, password }) => {
    const data = await authHelpers.register({ firstName, lastName, email, password })
    return data
  },

  login: async ({ email, password }) => {
    const data = await authHelpers.login({ email, password })
    return data
  },

  logout: async () => {
    await authHelpers.logout()
    set({ user: null, profile: null, isAuthenticated: false, currentPage: 'home' })
  },

  forgotPassword: async (email) => {
    await authHelpers.forgotPassword(email)
  },

  // Mode démo (sans Supabase configuré)
  demoLogin: (userData) => {
    const profile = {
      first_name: userData.firstName || 'Marie',
      last_name: userData.lastName || 'Dupont',
      email: userData.email,
      level: 'A1',
      xp: 1240,
      streak: 7,
      current_unit: 3,
      settings: get().settings,
    }
    ls.set('ep_demo_user', profile)
    set({ user: { id: 'demo', email: userData.email }, profile, isAuthenticated: true, authLoading: false })
  },

  // ── NAVIGATION ────────────────────────────────────────────
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),

  // ── PROGRESSION ───────────────────────────────────────────
  progress: ls.get('ep_progress', {}),

  saveProgress: async (unitId, chapterId, score, timeSpent = 0) => {
    const { user, profile } = get()
    // Sauvegarder localement d'abord (offline-first)
    const key = `${unitId}_${chapterId}`
    const p = { ...get().progress, [key]: { score, timeSpent, completedAt: Date.now() } }
    ls.set('ep_progress', p)
    set({ progress: p })

    // XP
    get().addXP(score >= 80 ? 15 : score >= 60 ? 10 : 5)

    // Sync Supabase si connecté
    if (user?.id && user.id !== 'demo') {
      try {
        await progressHelpers.saveProgress(user.id, { unitId, chapterId, score, timeSpent })
      } catch (e) {
        // Garder en queue offline
        const queue = ls.get('ep_offline_queue', [])
        ls.set('ep_offline_queue', [...queue, { unitId, chapterId, score, timeSpent, savedAt: Date.now() }])
      }
    }
  },

  // Synchroniser la queue offline quand on revient en ligne
  syncOfflineQueue: async () => {
    const { user } = get()
    if (!user?.id || user.id === 'demo') return
    const queue = ls.get('ep_offline_queue', [])
    if (!queue.length) return
    for (const item of queue) {
      try { await progressHelpers.saveProgress(user.id, item) } catch {}
    }
    ls.set('ep_offline_queue', [])
  },

  // ── XP & GAMIFICATION ────────────────────────────────────
  xp: ls.get('ep_xp', 1240),
  streak: ls.get('ep_streak', 7),
  badges: ls.get('ep_badges', ['first_lesson', 'streak_7', 'exercises_10', 'pronunciation']),

  addXP: async (amount) => {
    const xp = get().xp + amount
    ls.set('ep_xp', xp)
    set({ xp })
    const { user } = get()
    if (user?.id && user.id !== 'demo') {
      try { await learnerHelpers.addXP(user.id, amount) } catch {}
    }
  },

  earnBadge: (badgeId) => {
    const { badges } = get()
    if (!badges.includes(badgeId)) {
      const newBadges = [...badges, badgeId]
      ls.set('ep_badges', newBadges)
      set({ badges: newBadges })
      get().showNotif(`🏆 Nouveau badge : ${badgeId} !`, 'success')
    }
  },

  // ── SETTINGS & ACCESSIBILITÉ ──────────────────────────────
  settings: ls.get('ep_settings', {
    lang: 'fr',
    fontSize: 'normal',
    dyslexia: false,
    highContrast: false,
    audioSpeed: 1,
    offlineMode: false,
    readInstructions: false, // Lecture automatique des consignes
    showPhonetics: true,
  }),

  updateSettings: async (updates) => {
    const s = { ...get().settings, ...updates }
    ls.set('ep_settings', s)
    set({ settings: s })
    get().applySettings(s)

    // Sync Supabase
    const { user } = get()
    if (user?.id && user.id !== 'demo') {
      try { await learnerHelpers.updateProfile(user.id, { settings: s }) } catch {}
    }
  },

  applySettings: (s) => {
    document.body.classList.toggle('dyslexia', s.dyslexia)
    document.body.classList.toggle('high-contrast', s.highContrast)
    document.body.classList.remove('font-large', 'font-xl')
    if (s.fontSize === 'large') document.body.classList.add('font-large')
    if (s.fontSize === 'xl') document.body.classList.add('font-xl')
  },

  // ── POSITIONING ───────────────────────────────────────────
  positioningResult: ls.get('ep_position', null),
  setPositioningResult: async (level) => {
    ls.set('ep_position', level)
    set({ positioningResult: level })
    const { user } = get()
    if (user?.id && user.id !== 'demo') {
      try { await learnerHelpers.updateProfile(user.id, { positioning_level: level }) } catch {}
    }
  },

  // ── CHAT AI ───────────────────────────────────────────────
  chatMessages: [{
    role: 'bot',
    content: 'Bonjour ! Je suis votre assistant pédagogique EnglishPath 🤖\n\nJe peux vous aider avec :\n• La grammaire anglaise\n• La correction de vos phrases\n• Des exercices personnalisés\n• La traduction et la prononciation\n\nComment puis-je vous aider aujourd\'hui ?',
  }],
  addChatMessage: (msg) => set(s => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [{ role: 'bot', content: 'Nouvelle conversation. Comment puis-je vous aider ?' }] }),

  // ── FAVORITES ─────────────────────────────────────────────
  favorites: ls.get('ep_favorites', []),
  toggleFavorite: async (id) => {
    const { favorites, user } = get()
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    ls.set('ep_favorites', newFavs)
    set({ favorites: newFavs })
    if (user?.id && user.id !== 'demo') {
      try { await favoritesHelpers.toggle(user.id, id) } catch {}
    }
  },

  // ── MESSAGES ──────────────────────────────────────────────
  messages: [],
  unreadCount: 0,
  loadMessages: async () => {
    const { user } = get()
    if (!user?.id) return
    try {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:from_id(first_name, last_name)')
        .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
        .order('sent_at', { ascending: false })
      set({ messages: data || [], unreadCount: (data || []).filter(m => !m.read && m.to_id === user.id).length })
    } catch {}
  },

  // ── NOTIFICATIONS ─────────────────────────────────────────
  notification: null,
  showNotif: (msg, type = 'success') => {
    set({ notification: { msg, type, id: Date.now() } })
    setTimeout(() => set({ notification: null }), 3500)
  },

  // ── CURRENT EXERCISE SESSION ──────────────────────────────
  sessionScore: 0,
  sessionTotal: 0,
  sessionStart: null,
  startSession: () => set({ sessionScore: 0, sessionTotal: 0, sessionStart: Date.now() }),
  recordAnswer: (correct) => set(s => ({
    sessionScore: s.sessionScore + (correct ? 1 : 0),
    sessionTotal: s.sessionTotal + 1,
  })),
  getSessionPct: () => {
    const { sessionScore, sessionTotal } = get()
    return sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0
  },
}))

export default useStore
