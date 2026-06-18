import { createClient } from '@supabase/supabase-js'

// Variables d'environnement Netlify / .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://VOTRE-ID.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'VOTRE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ─── Auth helpers ────────────────────────────────────────────────────────────
export const authHelpers = {
  async register({ email, password, firstName, lastName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (error) throw error

    // Créer le profil dans la table learners
    if (data.user) {
      await supabase.from('learners').insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      })
    }
    return data
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async logout() {
    await supabase.auth.signOut()
  },

  async forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ─── Learner helpers ─────────────────────────────────────────────────────────
export const learnerHelpers = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('learners')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data
  },

  async updateProfile(userId, updates) {
    const { error } = await supabase
      .from('learners')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
    if (error) throw error
  },

  async addXP(userId, amount) {
    const { data } = await supabase.rpc('add_xp', { user_id: userId, xp_amount: amount })
    return data
  },

  async updateStreak(userId) {
    const { data } = await supabase.rpc('update_streak', { user_id: userId })
    return data
  },

  async deleteAccount(userId) {
    // Suppression RGPD — cascade grâce aux FK
    await supabase.from('learners').delete().eq('id', userId)
    await supabase.auth.admin.deleteUser(userId)
  },

  async exportData(userId) {
    const [learner, progress, messages] = await Promise.all([
      supabase.from('learners').select('*').eq('id', userId).single(),
      supabase.from('progress').select('*').eq('learner_id', userId),
      supabase.from('messages').select('*').eq('to_id', userId),
    ])
    return { learner: learner.data, progress: progress.data, messages: messages.data }
  },
}

// ─── Progress helpers ─────────────────────────────────────────────────────────
export const progressHelpers = {
  async saveProgress(learnerId, { unitId, chapterId, score, timeSpent }) {
    const { error } = await supabase.from('progress').upsert({
      learner_id: learnerId,
      unit_id: unitId,
      chapter_id: chapterId,
      score,
      time_spent: timeSpent,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'learner_id,unit_id,chapter_id' })
    if (error) throw error
  },

  async getProgress(learnerId) {
    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('learner_id', learnerId)
      .order('completed_at', { ascending: false })
    return data || []
  },

  async getStats(learnerId) {
    const { data } = await supabase.rpc('get_learner_stats', { p_learner_id: learnerId })
    return data
  },
}

// ─── Groups & Trainer helpers ────────────────────────────────────────────────
export const trainerHelpers = {
  async getGroups(trainerId) {
    const { data } = await supabase
      .from('groups')
      .select(`*, group_members(learner_id, learners(*))`)
      .eq('trainer_id', trainerId)
    return data || []
  },

  async createGroup(trainerId, { name, level }) {
    const { data, error } = await supabase
      .from('groups')
      .insert({ trainer_id: trainerId, name, level })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async addLearnerToGroup(groupId, learnerId) {
    await supabase.from('group_members').insert({ group_id: groupId, learner_id: learnerId })
  },

  async getGroupProgress(groupId) {
    const { data } = await supabase.rpc('get_group_progress', { p_group_id: groupId })
    return data || []
  },

  async assignExercise(groupId, exerciseId, dueDate) {
    await supabase.from('assignments').insert({ group_id: groupId, exercise_id: exerciseId, due_date: dueDate })
  },

  async sendMessage(fromId, toId, content) {
    await supabase.from('messages').insert({ from_id: fromId, to_id: toId, content })
  },

  async getMessages(userId) {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:from_id(first_name, last_name)')
      .or(`from_id.eq.${userId},to_id.eq.${userId}`)
      .order('sent_at', { ascending: false })
    return data || []
  },
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export const favoritesHelpers = {
  async toggle(learnerId, exerciseId) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('learner_id', learnerId)
      .eq('exercise_id', exerciseId)
      .single()

    if (data) {
      await supabase.from('favorites').delete().eq('id', data.id)
      return false
    } else {
      await supabase.from('favorites').insert({ learner_id: learnerId, exercise_id: exerciseId })
      return true
    }
  },

  async getAll(learnerId) {
    const { data } = await supabase
      .from('favorites')
      .select('exercise_id')
      .eq('learner_id', learnerId)
    return (data || []).map(f => f.exercise_id)
  },
}
