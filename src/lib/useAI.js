import { useState, useCallback, useRef } from 'react'

// Appel via la fonction Netlify serverless (clé API jamais côté client)
const callAI = async (messages, mode = 'chat') => {
  const endpoint = import.meta.env.DEV
    ? 'https://api.anthropic.com/v1/messages'  // direct en dev (claude.ai gère la clé)
    : '/.netlify/functions/ai-chat'             // serverless en production

  if (import.meta.env.DEV) {
    // En dev sur claude.ai — appel direct
    const SYSTEM = `Tu es un assistant pédagogique expert en anglais A1-B1. Réponds en français, sois bienveillant, clair et concis. Donne des exemples anglais toujours traduits.`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages: messages.map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    })
    const data = await res.json()
    return data.content?.find(b => b.type === 'text')?.text || ''
  } else {
    // En production — passe par la fonction serverless
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, mode }),
    })
    const data = await res.json()
    return data.text || ''
  }
}

// ─── Hook principal ─────────────────────────────────────────
export function useAI() {
  const [loading, setLoading] = useState(false)

  const ask = useCallback(async (userMessage, history = []) => {
    setLoading(true)
    try {
      const messages = [
        ...history.filter(m => m.role !== 'system'),
        { role: 'user', content: userMessage },
      ]
      return await callAI(messages, 'chat')
    } catch (e) {
      console.error(e)
      return "Connexion temporairement indisponible. Vérifiez votre connexion internet."
    } finally {
      setLoading(false)
    }
  }, [])

  const correctSentence = useCallback(async (sentence) => {
    setLoading(true)
    try {
      const msg = [{ role: 'user', content: `Corrige cette phrase en anglais et explique les erreurs en français de façon encourageante : "${sentence}"` }]
      return await callAI(msg, 'correct')
    } finally { setLoading(false) }
  }, [])

  const translate = useCallback(async (text, dir = 'fr-en') => {
    setLoading(true)
    try {
      const prompt = dir === 'fr-en'
        ? `Traduis en anglais avec un exemple d'utilisation : "${text}"`
        : `Traduis en français avec un exemple : "${text}"`
      return await callAI([{ role: 'user', content: prompt }], 'chat')
    } finally { setLoading(false) }
  }, [])

  const generateExercise = useCallback(async (unit, type = 'qcm', level = 'A1') => {
    setLoading(true)
    try {
      const prompt = `Génère un exercice de type ${type} niveau ${level} pour l'unité ${unit} du programme Navigate anglais.
Format JSON strict sans markdown : {"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"answer":0,"explanation":"..."}`
      const result = await callAI([{ role: 'user', content: prompt }], 'exercise')
      return JSON.parse(result.replace(/```json?|```/g, '').trim())
    } catch { return null }
    finally { setLoading(false) }
  }, [])

  const getPronunciation = useCallback(async (word) => {
    setLoading(true)
    try {
      const prompt = `Donne la prononciation de "${word}" en phonétique IPA et explique simplement comment le prononcer en français. Ajoute les erreurs fréquentes des francophones.`
      return await callAI([{ role: 'user', content: prompt }], 'tts')
    } finally { setLoading(false) }
  }, [])

  return { ask, correctSentence, translate, generateExercise, getPronunciation, loading }
}

// ─── Text-to-Speech (Web Speech API) ───────────────────────
export function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  const speak = useCallback((text, lang = 'en-GB', rate = 1) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance

    // Choisir une voix anglaise de qualité
    const voices = window.speechSynthesis.getVoices()
    const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang === 'en-GB')
      || voices.find(v => v.lang.startsWith('en'))
    if (enVoice) utterance.voice = enVoice

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  const speakInstruction = useCallback((text, lang = 'fr-FR') => {
    speak(text, lang, 0.9) // Consignes en français, plus lent
  }, [speak])

  return { speak, stop, speakInstruction, speaking, supported: 'speechSynthesis' in window }
}

// ─── Speech Recognition (exercices de prononciation) ────────
export function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const supported = !!SpeechRecognition

  const start = useCallback((lang = 'en-US') => {
    if (!supported) { setError('Reconnaissance vocale non supportée sur ce navigateur'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => { setListening(true); setError(null); setTranscript('') }
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
    }
    recognition.onerror = (e) => { setError(e.error); setListening(false) }
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [supported])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  // Comparer la prononciation avec le texte cible
  const compareWithTarget = (userSaid, target) => {
    const normalize = s => s.toLowerCase().trim().replace(/[^a-z\s]/g, '')
    const u = normalize(userSaid)
    const t = normalize(target)
    if (u === t) return { score: 100, feedback: '✅ Parfait !' }
    const words = t.split(' ')
    const said = u.split(' ')
    const correct = words.filter((w, i) => said[i] === w).length
    const score = Math.round((correct / words.length) * 100)
    return {
      score,
      feedback: score >= 80 ? '👍 Très bien !' : score >= 50 ? '🔄 Essayez encore' : '❌ Réessayez lentement',
    }
  }

  return { start, stop, listening, transcript, error, supported, compareWithTarget }
}
