import { useState, useEffect, useRef, useCallback } from 'react'
import { EXERCISE_BANK, getAllExercises, getByUnit, spacedRepetition, EXERCISE_TYPES } from '../data/exercises/exerciseBank.js'
import { Tabs, AudioPlayer, Card, ProgressBar, LevelBadge } from '../components/UI.jsx'
import { Check, X, RefreshCw, ChevronRight, Lightbulb, Mic, MicOff, Volume2, Star, Clock, Zap } from 'lucide-react'
import useStore from '../lib/store.js'
import { useTTS, useSpeechRecognition } from '../lib/useAI.js'

const EX_TABS = [
  { id: 'smart', label: '⚡ Smart' },
  { id: 'qcm', label: '📝 QCM' },
  { id: 'fill', label: '✏️ Trous' },
  { id: 'match', label: '🔗 Association' },
  { id: 'pronunciation', label: '🗣️ Prononciation' },
  { id: 'vocab', label: '🗂️ Vocabulaire' },
]

export function ExercisesPage() {
  const [tab, setTab] = useState('smart')
  const { startSession, sessionScore, sessionTotal, getSessionPct } = useStore()

  useEffect(() => { startSession() }, [])

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Exercices interactifs</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
          <LevelBadge level="A1" />
          <span style={{ fontSize: 13, color: '#6b7280' }}>Unit 3 — People and possessions</span>
          {sessionTotal > 0 && (
            <span style={{ fontSize: 12, color: getSessionPct() >= 70 ? '#1D9E75' : '#BA7517', fontWeight: 600, marginLeft: 'auto' }}>
              Session : {sessionScore}/{sessionTotal} ({getSessionPct()}%)
            </span>
          )}
        </div>
      </div>
      <Tabs tabs={EX_TABS} active={tab} onChange={setTab} />
      {tab === 'smart' && <SmartQueue />}
      {tab === 'qcm' && <QCMExercise exercises={Object.values(EXERCISE_BANK).flat().filter(e => e.type === 'qcm')} />}
      {tab === 'fill' && <FillExercise exercises={Object.values(EXERCISE_BANK).flat().filter(e => e.type === 'fill')} />}
      {tab === 'match' && <MatchExercise exercises={Object.values(EXERCISE_BANK).flat().filter(e => e.type === 'match')} />}
      {tab === 'pronunciation' && <PronunciationExercise />}
      {tab === 'vocab' && <VocabCards />}
    </div>
  )
}

// ─── Smart Queue (répétition espacée) ───────────────────────
function SmartQueue() {
  const { addXP, showNotif, recordAnswer } = useStore()
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ep_sr_history') || '{}') } catch { return {} }
  })
  const allExercises = Object.values(EXERCISE_BANK).flat()
  const queue = spacedRepetition.getQueue(allExercises, history)
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [startTime] = useState(Date.now())
  const ex = queue[idx]

  if (!queue.length) return (
    <Card style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Tout est à jour !</h3>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>Vous avez révisé tous les exercices dus. Revenez demain pour la suite.</p>
      <p style={{ fontSize: 13, color: '#185FA5' }}>{Object.keys(history).length} exercices mémorisés dans votre système de répétition</p>
    </Card>
  )

  const handleAnswer = (correct) => {
    const responseTime = Date.now() - startTime
    const newHistory = spacedRepetition.updateHistory(history, ex.id, correct, responseTime)
    setHistory(newHistory)
    localStorage.setItem('ep_sr_history', JSON.stringify(newHistory))
    setAnswered(true)
    recordAnswer(correct)
    if (correct) { addXP(10); showNotif('✅ +10 XP', 'success') }
    else showNotif('❌ Réessayez !', 'error')
  }

  const next = () => { setAnswered(false); setIdx(i => i + 1) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} color="#BA7517" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#BA7517' }}>Répétition espacée</span>
        </div>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{queue.length} exercices à réviser</span>
      </div>
      <ProgressBar value={(idx / queue.length) * 100} color="amber" />
      <div style={{ marginTop: 14 }}>
        {ex.type === 'qcm' && <QCMCard ex={ex} onAnswer={handleAnswer} answered={answered} />}
        {ex.type === 'fill' && <FillCard ex={ex} onAnswer={handleAnswer} answered={answered} />}
        {ex.type === 'match' && <MatchCard ex={ex} onAnswer={handleAnswer} answered={answered} />}
      </div>
      {answered && (
        <button onClick={next} className="btn-primary" style={{ marginTop: 12 }}>
          {idx < queue.length - 1 ? 'Suivant' : 'Terminer'} <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

// ─── QCM ─────────────────────────────────────────────────────
function QCMExercise({ exercises }) {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const { addXP, showNotif, recordAnswer, toggleFavorite, favorites } = useStore()
  const { speak } = useTTS()
  const ex = exercises[idx % exercises.length]
  const isFav = favorites.includes(ex.id)

  const answer = (i) => {
    if (answered) return
    setSelected(i); setAnswered(true)
    const correct = i === ex.answer
    recordAnswer(correct)
    if (correct) { addXP(10); showNotif('✅ Correct ! +10 XP', 'success') }
    else showNotif('❌ Pas tout à fait…', 'error')
  }

  const next = () => { setSelected(null); setAnswered(false); setShowHint(false); setIdx(i => i + 1) }
  const reset = () => { setSelected(null); setAnswered(false); setShowHint(false) }

  return (
    <div>
      <ExerciseHeader current={(idx % exercises.length) + 1} total={exercises.length} level={ex.level} exerciseId={ex.id} />
      <Card style={{ marginTop: 14 }}>
        {ex.audio && <AudioPlayer filename={ex.audio} title="Écoutez avant de répondre" subtitle={ex.audio} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{ex.question}</p>
          <button onClick={() => speak(ex.question)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#185FA5', marginLeft: 8 }} aria-label="Écouter la question">
            <Volume2 size={18} />
          </button>
        </div>
        <QCMOptions options={ex.options} answer={ex.answer} selected={selected} onSelect={answer} />
        {answered && <Explanation correct={selected === ex.answer} text={ex.explanation} />}
        {!answered && (
          <button onClick={() => setShowHint(h => !h)} style={{ marginTop: 10, fontSize: 12, color: '#BA7517', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Lightbulb size={14} /> {showHint ? 'Masquer l\'indice' : 'Voir un indice'}
          </button>
        )}
        {showHint && <div style={{ fontSize: 12, color: '#412402', background: '#FAEEDA', padding: '8px 12px', borderRadius: 6, marginTop: 6 }}>💡 {ex.explanation?.split('.')[0]}.</div>}
      </Card>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={reset} className="btn-secondary"><RefreshCw size={14} /> Recommencer</button>
        <button onClick={next} className="btn-primary" disabled={!answered}>Suivant <ChevronRight size={14} /></button>
      </div>
    </div>
  )
}

function QCMCard({ ex, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)
  const { speak } = useTTS()
  const pick = (i) => { if (answered) return; setSelected(i); onAnswer(i === ex.answer) }
  return (
    <Card>
      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 14 }}>{ex.question}</p>
      <QCMOptions options={ex.options} answer={ex.answer} selected={selected} onSelect={pick} />
      {answered && selected !== null && <Explanation correct={selected === ex.answer} text={ex.explanation} />}
    </Card>
  )
}

function QCMOptions({ options, answer, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt, i) => {
        let border = '#e5e7eb', bg = '#fff', color = '#374151'
        if (selected !== null) {
          if (i === answer) { border = '#1D9E75'; bg = '#E1F5EE'; color = '#04342C' }
          else if (i === selected && i !== answer) { border = '#D85A30'; bg = '#FAECE7'; color = '#4A1B0C' }
        }
        return (
          <button key={i} onClick={() => onSelect(i)} style={{ padding: '11px 16px', border: `1px solid ${border}`, background: bg, borderRadius: 8, fontSize: 14, textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer', color, transition: 'all 0.12s', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: bg === '#fff' ? '#f9fafb' : bg, border: `1px solid ${border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {['A','B','C','D'][i]}
            </span>
            <span style={{ flex: 1 }}>{opt.replace(/^[A-D]\.\s*/, '')}</span>
            {selected !== null && i === answer && <Check size={16} color="#1D9E75" />}
            {selected !== null && i === selected && i !== answer && <X size={16} color="#D85A30" />}
          </button>
        )
      })}
    </div>
  )
}

// ─── Fill ─────────────────────────────────────────────────────
function FillExercise({ exercises }) {
  const [idx, setIdx] = useState(0)
  const ex = exercises[idx % exercises.length]
  const [answered, setAnswered] = useState(false)
  const { addXP, showNotif, recordAnswer } = useStore()

  const handleAnswer = (correct) => {
    setAnswered(true)
    recordAnswer(correct)
    if (correct) { addXP(15); showNotif('🎉 Parfait ! +15 XP', 'success') }
  }

  return (
    <div>
      <ExerciseHeader current={(idx % exercises.length) + 1} total={exercises.length} level={ex.level} exerciseId={ex.id} />
      <div style={{ marginTop: 14 }}>
        <FillCard ex={ex} onAnswer={handleAnswer} answered={answered} />
      </div>
      {answered && (
        <button onClick={() => { setAnswered(false); setIdx(i => i + 1) }} className="btn-primary" style={{ marginTop: 12 }}>
          Suivant <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

function FillCard({ ex, onAnswer, answered: extAnswered }) {
  const [answers, setAnswers] = useState([])
  const [checked, setChecked] = useState(false)
  const blanks = ex?.blanks || []

  const check = () => {
    setChecked(true)
    const correct = answers.filter((a, i) => a?.trim().toLowerCase() === blanks[i]?.toLowerCase()).length
    onAnswer(correct === blanks.length)
  }

  const isCorrect = (i) => answers[i]?.trim().toLowerCase() === blanks[i]?.toLowerCase()

  return (
    <Card>
      {ex.hint && <div style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontStyle: 'italic' }}>💡 {ex.hint}</div>}
      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>{ex.sentence?.split('___')[0]}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blanks.map((blank, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, color: '#9ca3af', width: 20, flexShrink: 0 }}>{i+1}.</span>
            <input type="text" value={answers[i] || ''} onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a) }}
              disabled={checked} placeholder={`Réponse ${i+1}…`}
              style={{ flex: 1, padding: '9px 12px', border: `1px solid ${checked ? (isCorrect(i) ? '#1D9E75' : '#D85A30') : '#d1d5db'}`, borderRadius: 8, fontSize: 14, background: checked ? (isCorrect(i) ? '#E1F5EE' : '#FAECE7') : '#fff' }} />
            {checked && (isCorrect(i)
              ? <Check size={18} color="#1D9E75" />
              : <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 700 }}>→ {blank}</span>
            )}
          </div>
        ))}
      </div>
      {!checked && <button onClick={check} className="btn-primary" style={{ marginTop: 12 }}><Check size={14} /> Vérifier</button>}
      {checked && (
        <div style={{ marginTop: 10, padding: '10px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 12, color: '#374151' }}>
          📚 Corrigés : <strong>{blanks.join(' · ')}</strong>
        </div>
      )}
    </Card>
  )
}

// ─── Match ────────────────────────────────────────────────────
function MatchExercise({ exercises }) {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const ex = exercises[idx % exercises.length]
  const { addXP, showNotif, recordAnswer } = useStore()

  return (
    <div>
      <ExerciseHeader current={(idx % exercises.length) + 1} total={exercises.length} level={ex.level} exerciseId={ex.id} />
      <div style={{ marginTop: 14 }}>
        <MatchCard ex={ex} onAnswer={(correct) => { setAnswered(true); recordAnswer(correct); if (correct) { addXP(20); showNotif('🎉 +20 XP !', 'success') } }} answered={answered} />
      </div>
      {answered && <button onClick={() => { setAnswered(false); setIdx(i => i + 1) }} className="btn-primary" style={{ marginTop: 12 }}>Suivant <ChevronRight size={14} /></button>}
    </div>
  )
}

function MatchCard({ ex, onAnswer, answered }) {
  const [selectedEn, setSelectedEn] = useState(null)
  const [matched, setMatched] = useState({})
  const [wrong, setWrong] = useState(null)
  const pairs = ex?.pairs || []
  const [shuffledFr] = useState(() => [...pairs].sort(() => Math.random() - 0.5))

  const selectFr = (fr) => {
    if (!selectedEn) return
    const correct = pairs.find(p => p.en === selectedEn)?.fr === fr
    if (correct) {
      const m = { ...matched, [selectedEn]: fr }
      setMatched(m)
      setSelectedEn(null)
      if (Object.keys(m).length === pairs.length) onAnswer(true)
    } else {
      setWrong(fr)
      setTimeout(() => setWrong(null), 600)
      setSelectedEn(null)
    }
  }

  return (
    <Card>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>Associez le mot anglais à sa traduction française.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pairs.map(p => (
            <button key={p.en} onClick={() => !matched[p.en] && setSelectedEn(p.en)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${matched[p.en] ? '#1D9E75' : selectedEn === p.en ? '#185FA5' : '#e5e7eb'}`, background: matched[p.en] ? '#E1F5EE' : selectedEn === p.en ? '#E6F1FB' : '#fff', color: matched[p.en] ? '#085041' : selectedEn === p.en ? '#185FA5' : '#374151', fontSize: 14, fontWeight: 500, cursor: matched[p.en] ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.12s' }}>
              {p.en} {matched[p.en] && <Check size={14} style={{ float: 'right', color: '#1D9E75' }} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shuffledFr.map(p => {
            const isMatched = Object.values(matched).includes(p.fr)
            const isWrong = wrong === p.fr
            return (
              <button key={p.fr} onClick={() => !isMatched && selectFr(p.fr)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${isMatched ? '#1D9E75' : isWrong ? '#D85A30' : '#e5e7eb'}`, background: isMatched ? '#E1F5EE' : isWrong ? '#FAECE7' : '#f9fafb', color: isMatched ? '#085041' : isWrong ? '#4A1B0C' : '#374151', fontSize: 14, cursor: isMatched ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                {p.fr}
              </button>
            )
          })}
        </div>
      </div>
      {Object.keys(matched).length === pairs.length && (
        <div style={{ marginTop: 14, textAlign: 'center', padding: '14px', background: '#E1F5EE', borderRadius: 8 }}>
          <div style={{ fontSize: 24 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#085041' }}>Parfait ! Toutes les associations sont correctes !</div>
        </div>
      )}
    </Card>
  )
}

// ─── Prononciation ────────────────────────────────────────────
function PronunciationExercise() {
  const pronExercises = Object.values(EXERCISE_BANK).flat().filter(e => e.type === 'pronunciation')
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState(null)
  const { speak, speaking } = useTTS()
  const { start, stop, listening, transcript, supported, compareWithTarget } = useSpeechRecognition()
  const { addXP, showNotif } = useStore()
  const ex = pronExercises[idx % pronExercises.length]

  const handleListen = () => {
    if (listening) { stop(); if (transcript) { const r = compareWithTarget(transcript, ex.target || ex.word); setResult(r); if (r.score >= 80) { addXP(15); showNotif('🎤 Excellente prononciation ! +15 XP', 'success') } } }
    else { setResult(null); start('en-US') }
  }

  return (
    <div>
      <ExerciseHeader current={(idx % pronExercises.length) + 1} total={pronExercises.length} level="A1" exerciseId={ex?.id} />
      <Card style={{ marginTop: 14 }}>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#185FA5', marginBottom: 8 }}>{ex?.word}</div>
          <div style={{ fontSize: 16, color: '#6b7280', fontStyle: 'italic', marginBottom: 12 }}>{ex?.phonetic}</div>
          <div style={{ background: '#FAEEDA', borderRadius: 8, padding: '10px 16px', display: 'inline-block', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#412402' }}>💡 {ex?.tip}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <button onClick={() => speak(ex?.word, 'en-GB', 0.7)} className="btn-secondary" style={{ gap: 6 }}>
            <Volume2 size={16} color="#185FA5" /> Écouter (lent)
          </button>
          <button onClick={() => speak(ex?.word, 'en-GB', 1)} className="btn-secondary">
            <Volume2 size={16} /> Normal
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Lisez à voix haute :</p>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#185FA5', background: '#E6F1FB', padding: '12px 20px', borderRadius: 8, display: 'inline-block' }}>
            "{ex?.target || ex?.word}"
          </div>
        </div>

        {supported ? (
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleListen} style={{ width: 64, height: 64, borderRadius: '50%', background: listening ? '#D85A30' : '#185FA5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', transition: 'background 0.2s' }}>
              {listening ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
            </button>
            <p style={{ fontSize: 13, color: '#6b7280' }}>{listening ? '🔴 En cours d\'écoute… Parlez !' : 'Cliquez pour parler'}</p>
            {transcript && <p style={{ marginTop: 8, fontSize: 14, color: '#374151', fontStyle: 'italic' }}>"{transcript}"</p>}
            {result && (
              <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: result.score >= 80 ? '#E1F5EE' : '#FAEEDA', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: result.score >= 80 ? '#1D9E75' : '#BA7517' }}>{result.score}%</div>
                <div style={{ fontSize: 14 }}>{result.feedback}</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
            🎤 La reconnaissance vocale n'est pas disponible sur ce navigateur.<br/>Utilisez Chrome ou Edge pour cet exercice.
          </div>
        )}
      </Card>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => { setResult(null); setIdx(i => i + 1) }} className="btn-primary">
          Mot suivant <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Vocab Cards ──────────────────────────────────────────────
function VocabCards() {
  const WORDS = [
    { en: 'neighbour', fr: 'voisin(e)', phonetic: 'ˈneɪbər', ex: 'My neighbour is friendly.' },
    { en: 'flat', fr: 'appartement', phonetic: 'flæt', ex: 'She lives in a flat.' },
    { en: 'garden', fr: 'jardin', phonetic: 'ˈɡɑːrdən', ex: 'Our garden has flowers.' },
    { en: 'bedroom', fr: 'chambre', phonetic: 'ˈbedruːm', ex: 'The flat has two bedrooms.' },
    { en: 'have got', fr: 'avoir (possession)', phonetic: 'hæv ɡɒt', ex: "I've got a new bike." },
    { en: 'house', fr: 'maison', phonetic: 'haʊs', ex: 'They have a big house.' },
    { en: 'mother', fr: 'mère', phonetic: 'ˈmʌðər', ex: 'My mother works in a school.' },
    { en: 'father', fr: 'père', phonetic: 'ˈfɑːðər', ex: 'Her father has a car.' },
    { en: 'sister', fr: 'sœur', phonetic: 'ˈsɪstər', ex: 'Have you got a sister?' },
    { en: 'brother', fr: 'frère', phonetic: 'ˈbrʌðər', ex: 'My brother lives in Paris.' },
    { en: 'car', fr: 'voiture', phonetic: 'kɑːr', ex: "He's got a red car." },
    { en: 'phone', fr: 'téléphone', phonetic: 'foʊn', ex: "Have you got your phone?" },
  ]
  const [flip, setFlip] = useState({})
  const [known, setKnown] = useState({})
  const { speak } = useTTS()
  const knownCount = Object.values(known).filter(Boolean).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Cliquez pour voir la traduction · 🔊 pour écouter</p>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1D9E75' }}>{knownCount}/{WORDS.length} mémorisés</span>
      </div>
      <ProgressBar value={(knownCount / WORDS.length) * 100} color="teal" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginTop: 14 }}>
        {WORDS.map((w, i) => (
          <div key={i} onClick={() => setFlip(f => ({...f,[i]:!f[i]}))} style={{ background: known[i] ? '#E1F5EE' : flip[i] ? '#E6F1FB' : '#fff', border: `1px solid ${known[i] ? '#1D9E75' : flip[i] ? '#185FA5' : '#e5e7eb'}`, borderRadius: 12, padding: '1rem', cursor: 'pointer', minHeight: 110, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: flip[i] ? '#185FA5' : '#1a1a1a' }}>
                  {flip[i] ? w.fr : w.en}
                </div>
                <button onClick={e => { e.stopPropagation(); speak(w.en, 'en-GB') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#185FA5', padding: 2 }}>
                  <Volume2 size={14} />
                </button>
              </div>
              {flip[i] && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic', marginTop: 2 }}>/{w.phonetic}/</div>}
              {flip[i] && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' }}>{w.ex}</div>}
              {!flip[i] && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Cliquez pour voir</div>}
            </div>
            {flip[i] && (
              <button onClick={e => { e.stopPropagation(); setKnown(k => ({...k,[i]:!k[i]})) }} style={{ marginTop: 8, fontSize: 11, padding: '4px 8px', borderRadius: 6, border: 'none', background: known[i] ? '#1D9E75' : '#f3f4f6', color: known[i] ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500 }}>
                {known[i] ? '✓ Mémorisé' : '★ Je sais'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────
function ExerciseHeader({ current, total, level, exerciseId }) {
  const { toggleFavorite, favorites } = useStore()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={(current / total) * 100} color="blue" />
        <span style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>{current}/{total}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <LevelBadge level={level} />
        {exerciseId && (
          <button onClick={() => toggleFavorite(exerciseId)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label="Favori">
            <Star size={16} fill={favorites.includes(exerciseId) ? '#BA7517' : 'none'} color={favorites.includes(exerciseId) ? '#BA7517' : '#9ca3af'} />
          </button>
        )}
      </div>
    </div>
  )
}

function Explanation({ correct, text }) {
  return (
    <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, background: correct ? '#E1F5EE' : '#FAECE7', borderLeft: `3px solid ${correct ? '#1D9E75' : '#D85A30'}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: correct ? '#04342C' : '#4A1B0C' }}>
        {correct ? '✅ Bravo !' : '❌ Pas tout à fait…'}
      </div>
      <div style={{ fontSize: 13, color: correct ? '#085041' : '#712B13', lineHeight: 1.5 }}>{text}</div>
    </div>
  )
}
