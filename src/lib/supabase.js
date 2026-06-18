import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isConfigured = SUPABASE_URL.length > 10 && SUPABASE_ANON_KEY.length > 10

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkxNTYzODQwMH0.placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    }
  }
)

export const authHelpers = {
  async register({ email, password, firstName, lastName }) {
    if (!isConfigured) throw new Error('Supabase non configuré.')
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (error) throw error
    if (data.user) {
      await supabase.from('learners').upsert({
        id: data.user.id, email,
        first_name: firstName, last_name: lastName,
      }, { onConflict: 'id' }).then(() => {})
    }
    return data
  },

  async login({ email, password }) {
    if (!isConfigured) throw new Error('Supabase non configuré.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async logout() {
    if (isConfigured) await supabase.auth.signOut()
  },

  async forgotPassword(email) {
    if (!isConfigured) throw new Error('Supabase non configuré.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },

  async getSession() {
    if (!isConfigured) return null
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  onAuthChange(callback) {
    if (!isConfigured) {
      setTimeout(() => callback('SIGNED_OUT', null), 100)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },
}

export const learnerHelpers = {
  async getProfile(userId) {
    if (!isConfigured) return null
    const { data } = await supabase.from('learners').select('*').eq('id', userId).single()
    return data
  },
  async updateProfile(userId, updates) {
    if (!isConfigured) return
    await supabase.from('learners').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId)
  },
  async addXP(userId, amount) {
    if (!isConfigured) return
    await supabase.rpc('add_xp', { user_id: userId, xp_amount: amount }).then(() => {})
  },
}

export const progressHelpers = {
  async saveProgress(learnerId, { unitId, chapterId, score, timeSpent }) {
    if (!isConfigured) return
    await supabase.from('progress').upsert({
      learner_id: learnerId, unit_id: unitId, chapter_id: chapterId,
      score, time_spent: timeSpent, completed_at: new Date().toISOString(),
    }, { onConflict: 'learner_id,unit_id,chapter_id' })
  },
  async getProgress(learnerId) {
    if (!isConfigured) return []
    const { data } = await supabase.from('progress').select('*').eq('learner_id', learnerId).order('completed_at', { ascending: false })
    return data || []
  },
}

export const trainerHelpers = {
  async sendMessage(fromId, toId, content) {
    if (!isConfigured) return
    await supabase.from('messages').insert({ from_id: fromId, to_id: toId, content })
  },
  async getMessages(userId) {
    if (!isConfigured) return []
    const { data } = await supabase.from('messages').select('*').or(`from_id.eq.${userId},to_id.eq.${userId}`).order('sent_at', { ascending: false })
    return data || []
  },
}

export const favoritesHelpers = {
  async toggle(learnerId, exerciseId) {
    if (!isConfigured) return false
    const { data } = await supabase.from('favorites').select('id').eq('learner_id', learnerId).eq('exercise_id', exerciseId).single()
    if (data) { await supabase.from('favorites').delete().eq('id', data.id); return false }
    await supabase.from('favorites').insert({ learner_id: learnerId, exercise_id: exerciseId })
    return true
  },
  async getAll(learnerId) {
    if (!isConfigured) return []
    const { data } = await supabase.from('favorites').select('exercise_id').eq('learner_id', learnerId)
    return (data || []).map(f => f.exercise_id)
  },
}
