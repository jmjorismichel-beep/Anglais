import { create } from 'zustand'
import { supabase, authHelpers, learnerHelpers, progressHelpers, favoritesHelpers, isConfigured } from './supabase.js'

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

  initAuth: () => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        try {
          if (session?.user) {
            const profile = await learnerHelpers.getProfile(session.user.id)
            set({ user: session.user, profile, isAuthenticated: true, authLoading: false })
            if (profile?.settings) get().applySettings(profile.settings)
          } else {
            set({ user: null, profile: null, isAuthenticated: false, authLoading: false })
          }
        } catch {
          set({ authLoading: false })
        }
      })

      // Vérifier session existante
      supabase.auth.getSession().then(({ data }) => {
        if (!data?.session) set({ authLoading: false })
      }).catch(() => set({ authLoading: false }))

      return () => subscription?.unsubscribe()
    } catch (e) {
      console.error('Auth init error:', e)
      set({ authLoading: false })
      return () => {}
    }
  },

  // Mode démo (sans Supabase)
  demoLogin: (userData) => {
    const profile = {
      first_name: userData.firstName || 'Marie',
      last_name:  userData.lastName  || 'Dupont',
      email: userData.email,
      level: 'A1', xp: 1240, streak: 7, current_unit: 3,
    }
    ls.set('ep_demo_user', profile)
    set({ user: { id: 'demo', email: userData.email }, profile, isAuthenticated: true, authLoading: false })
  },

  logout: async () => {
    try { await authHelpers.logout() } catch {}
    ls.set('ep_demo_user', null)
    set({ user: null, profile: null, isAuthenticated: false, currentPage: 'dashboard' })
  },

  // ── NAVIGATION ────────────────────────────────────────────
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),

  // ── PROGRESSION ───────────────────────────────────────────
  progress: ls.get('ep_progress', {}),

  saveProgress: async (unitId, chapterId, score, timeSpent = 0) => {
    const p = { ...get().progress, [`${unitId}_${chapterId}`]: { score, timeSpent, completedAt: Date.now() } }
    ls.set('ep_progress', p)
    set({ progress: p })
    get().addXP(score >= 80 ? 15 : score >= 60 ? 10 : 5)
    const { user } = get()
    if (user?.id && user.id !== 'demo') {
      try { await progressHelpers.saveProgress(user.id, { unitId, chapterId, score, timeSpent }) }
      catch {
        const queue = ls.get('ep_offline_queue', [])
        ls.set('ep_offline_queue', [...queue, { unitId, chapterId, score, timeSpent }])
      }
    }
  },

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

  // ── XP & GAMIFICATION ─────────────────────────────────────
  xp:     ls.get('ep_xp', 1240),
  streak: ls.get('ep_streak', 7),
  badges: ls.get('ep_badges', ['first_lesson','streak_7','exercises_10','pronunciation']),

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
      const nb = [...badges, badgeId]
      ls.set('ep_badges', nb)
      set({ badges: nb })
      get().showNotif(`🏆 Nouveau badge : ${badgeId} !`, 'success')
    }
  },

  // ── SETTINGS ──────────────────────────────────────────────
  settings: ls.get('ep_settings', {
    lang: 'fr', fontSize: 'normal', dyslexia: false,
    highContrast: false, audioSpeed: 1, offlineMode: false, readInstructions: false,
  }),

  updateSettings: async (updates) => {
    const s = { ...get().settings, ...updates }
    ls.set('ep_settings', s)
    set({ settings: s })
    get().applySettings(s)
    const { user } = get()
    if (user?.id && user.id !== 'demo') {
      try { await learnerHelpers.updateProfile(user.id, { settings: s }) } catch {}
    }
  },

  applySettings: (s) => {
    document.body.classList.toggle('dyslexia', !!s.dyslexia)
    document.body.classList.toggle('high-contrast', !!s.highContrast)
    document.body.classList.remove('font-large', 'font-xl')
    if (s.fontSize === 'large') document.body.classList.add('font-large')
    if (s.fontSize === 'xl')    document.body.classList.add('font-xl')
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
    content: 'Bonjour ! Je suis votre assistant pédagogique EnglishPath 🤖\n\nJe peux vous aider avec la grammaire, la correction, des exercices et la traduction.\n\nComment puis-je vous aider ?',
  }],
  addChatMessage: (msg) => set(s => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [{ role: 'bot', content: 'Nouvelle conversation. Comment puis-je vous aider ?' }] }),

  // ── FAVORITES ─────────────────────────────────────────────
  favorites: ls.get('ep_favorites', []),
  toggleFavorite: async (id) => {
    const { favorites, user } = get()
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    ls.set('ep_favorites', newFavs)
    set({ favorites: newFavs })
    if (user?.id && user.id !== 'demo') {
      try { await favoritesHelpers.toggle(user.id, id) } catch {}
    }
  },

  // ── NOTIFICATIONS ─────────────────────────────────────────
  notification: null,
  showNotif: (msg, type = 'success') => {
    set({ notification: { msg, type, id: Date.now() } })
    setTimeout(() => set({ notification: null }), 3500)
  },

  // ── SESSION EXERCICES ──────────────────────────────────────
  sessionScore: 0, sessionTotal: 0, sessionStart: null,
  startSession: () => set({ sessionScore: 0, sessionTotal: 0, sessionStart: Date.now() }),
  recordAnswer: (correct) => set(s => ({
    sessionScore: s.sessionScore + (correct ? 1 : 0),
    sessionTotal: s.sessionTotal + 1,
  })),
  getSessionPct: () => {
    const { sessionScore, sessionTotal } = get()
    return sessionTotal > 0 ? Math.round((sessionScore / sessionTotal) * 100) : 0
  },

  // ── CONFIG STATUS ──────────────────────────────────────────
  isConfigured,
}))

export default useStore
