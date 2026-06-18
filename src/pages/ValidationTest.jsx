import { useState, useEffect, useRef } from 'react'
import { A1_VALIDATION_TEST } from '../data/courseData.js'
import { Card, ProgressBar, LevelBadge, Alert } from '../components/UI.jsx'
import { Check, X, ChevronRight, Award, Lock, Unlock, RefreshCw, Clock } from 'lucide-react'
import useStore from '../lib/store.js'

export function ValidationTestPage({ level = 'A1', onComplete }) {
  const { addXP, earnBadge, showNotif, saveProgress, setPage } = useStore()
  const test     = A1_VALIDATION_TEST
  const [phase, setPhase]     = useState('intro')  // intro | test | result
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timer, setTimer]     = useState(0)
  const [showExplain, setShowExplain] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (phase === 'test') {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [phase])

  const q        = test.questions[current]
  const total    = test.questions.length
  const answered = Object.keys(answers).length
  const pct      = Math.round((answered / total) * 100)

  const formatTime = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  const selectAnswer = (idx) => {
    if (answers[q.id] !== undefined) return
    setAnswers(prev => ({ ...prev, [q.id]: idx }))
    setShowExplain(true)
  }

  const next = () => {
    setShowExplain(false)
    if (current < total - 1) setCurrent(c => c + 1)
    else {
      clearInterval(intervalRef.current)
      setPhase('result')
    }
  }

  const score = () => {
    let pts = 0, max = 0
    test.questions.forEach(q => {
      max += (q.points || 5)
      if (q.type === 'qcm' && answers[q.id] === q.answer) pts += (q.points || 5)
      if (q.type === 'fill' && answers[q.id] !== undefined) pts += Math.round((q.points || 5) * 0.8)
    })
    return { pts, max, pct: Math.round((pts / max) * 100) }
  }

  const restart = () => {
    setPhase('intro'); setCurrent(0); setAnswers({}); setTimer(0); setShowExplain(false)
  }

  // ── INTRO ──────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="animate-fade-in">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🏆</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{test.title}</h2>
          <p style={{ fontSize: 15, color: '#6b7280' }}>{test.description}</p>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📋 Informations sur le test</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '❓', label: 'Questions',     value: `${total} questions` },
              { icon: '⏱️', label: 'Durée estimée', value: '~20 minutes'        },
              { icon: '✅', label: 'Score requis',  value: `${test.passMark}%`  },
              { icon: '🎯', label: 'Compétences',   value: 'Grammaire, Vocab, Comm.' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', background: '#f9fafb', borderRadius: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ marginBottom: 16, background: '#E1F5EE', border: '1px solid #1D9E75' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#085041', marginBottom: 8 }}>🎁 Récompenses si vous réussissez</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['🏆 Badge "A1 Complet"', '🚀 Déblocage du niveau A2', '⭐ +200 XP bonus'].map(r => (
              <span key={r} style={{ background: '#fff', color: '#1D9E75', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>{r}</span>
            ))}
          </div>
        </Card>

        <button onClick={() => setPhase('test')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 16 }}>
          🚀 Commencer le test
        </button>
        <button onClick={() => setPage('modules')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
          ← Retour aux modules
        </button>
      </div>
    </div>
  )

  // ── TEST ───────────────────────────────────────────────────
  if (phase === 'test') return (
    <div className="animate-fade-in">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Question <strong>{current + 1}</strong> / {total}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#185FA5', fontWeight: 500 }}>
            <Clock size={14} /> {formatTime(timer)}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Grammaire',     color: '#534AB7' },
              { label: 'Vocabulaire',   color: '#1D9E75' },
              { label: 'Communication', color: '#185FA5' },
            ].map(t => {
              const count = test.questions.filter(q => q.skill === t.label.toLowerCase() && answers[q.id] !== undefined).length
              const total_skill = test.questions.filter(q => q.skill === t.label.toLowerCase()).length
              return <div key={t.label} style={{ fontSize: 10, background: t.color + '20', color: t.color, padding: '2px 8px', borderRadius: 10 }}>{t.label} {count}/{total_skill}</div>
            })}
          </div>
        </div>

        {/* Barre progression */}
        <div style={{ marginBottom: 16 }}>
          <ProgressBar value={pct} color="blue" />
        </div>

        {/* Question */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {q.skill} · {q.points || 5} points
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, lineHeight: 1.4 }}>{q.question}</h3>

          {q.type === 'qcm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const chosen   = answers[q.id] === i
                const correct  = q.answer === i
                const revealed = answers[q.id] !== undefined
                let bg = '#f9fafb', border = '#e5e7eb', color = '#374151'
                if (revealed && correct)                 { bg = '#E1F5EE'; border = '#1D9E75'; color = '#085041' }
                else if (revealed && chosen && !correct) { bg = '#FAECE7'; border = '#D85A30'; color = '#7C1A0A' }
                return (
                  <button key={i} onClick={() => selectAnswer(i)} disabled={revealed} style={{ padding: '12px 16px', border: `2px solid ${border}`, borderRadius: 10, background: bg, color, fontSize: 14, cursor: revealed ? 'default' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}>
                    {revealed && correct && <Check size={16} color="#1D9E75" />}
                    {revealed && chosen && !correct && <X size={16} color="#D85A30" />}
                    {!revealed && <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{String.fromCharCode(65+i)}</span>}
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'fill' && (
            <div style={{ fontSize: 14, color: '#6b7280', background: '#f9fafb', padding: '12px 16px', borderRadius: 8 }}>
              <p style={{ marginBottom: 8 }}>Réponse correcte :</p>
              {q.blanks.map((b, i) => (
                <span key={i} style={{ display: 'inline-block', background: '#E1F5EE', color: '#085041', padding: '3px 10px', borderRadius: 6, fontWeight: 600, marginRight: 8 }}>{b}</span>
              ))}
              <button onClick={() => selectAnswer(0)} style={{ display: 'block', marginTop: 10, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                ✓ Compris, continuer
              </button>
            </div>
          )}

          {/* Explication */}
          {showExplain && q.explanation && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#EEF2FF', borderRadius: 8, fontSize: 13, color: '#534AB7', borderLeft: '3px solid #534AB7' }}>
              💡 <strong>Explication :</strong> {q.explanation}
            </div>
          )}

          {/* Bouton suivant */}
          {(answers[q.id] !== undefined) && (
            <button onClick={next} className="btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
              {current < total - 1 ? <>Question suivante <ChevronRight size={16} /></> : '🏁 Terminer le test'}
            </button>
          )}
        </Card>
      </div>
    </div>
  )

  // ── RÉSULTAT ────────────────────────────────────────────────
  if (phase === 'result') {
    const s = score()
    const passed = s.pct >= test.passMark

    if (passed) {
      addXP(200)
      earnBadge('a1_complete')
      saveProgress('A1', 'final_test', s.pct, timer)
      showNotif('🏆 Félicitations ! Niveau A2 débloqué !', 'success')
    }

    return (
      <div className="animate-fade-in">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Card style={{ textAlign: 'center', padding: '2rem', marginBottom: 16, background: passed ? 'linear-gradient(135deg, #E1F5EE, #f0fdf4)' : 'linear-gradient(135deg, #FAECE7, #fff7f5)' }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{passed ? '🎉' : '💪'}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: passed ? '#1D9E75' : '#D85A30', marginBottom: 8 }}>
              {passed ? 'Félicitations !' : 'Continuez vos efforts !'}
            </h2>
            <div style={{ fontSize: 48, fontWeight: 800, color: passed ? '#1D9E75' : '#D85A30', marginBottom: 8 }}>
              {s.pct}%
            </div>
            <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 16 }}>
              {s.pts} / {s.max} points · ⏱️ {formatTime(timer)}
            </div>

            {passed ? (
              <div style={{ background: '#fff', borderRadius: 10, padding: '1rem', marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#085041' }}>Récompenses obtenues :</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ background: '#E1F5EE', color: '#1D9E75', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>🏆 Badge A1 Complet</span>
                  <span style={{ background: '#E6F1FB', color: '#185FA5', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>🚀 Niveau A2 débloqué</span>
                  <span style={{ background: '#FAEEDA', color: '#BA7517', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>⭐ +200 XP</span>
                </div>
              </div>
            ) : (
              <Alert type="info">
                Score requis : {test.passMark}% — Il vous manque {test.passMark - s.pct}%. Révisez les unités A1 et repassez le test !
              </Alert>
            )}

            {/* Détail par compétence */}
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#374151' }}>Résultats par compétence :</h4>
              {['grammaire', 'vocabulaire', 'communication'].map(skill => {
                const qs = test.questions.filter(q => q.skill === skill)
                const correct = qs.filter(q => answers[q.id] === q.answer).length
                const pct_skill = Math.round((correct / qs.length) * 100)
                return (
                  <div key={skill} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 3 }}>
                      <span style={{ textTransform: 'capitalize' }}>{skill}</span>
                      <span style={{ fontWeight: 600 }}>{correct}/{qs.length} ({pct_skill}%)</span>
                    </div>
                    <ProgressBar value={pct_skill} color={pct_skill >= 70 ? 'teal' : pct_skill >= 50 ? 'amber' : 'coral'} />
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {passed ? (
                <button onClick={() => setPage('modules')} className="btn-primary">
                  🚀 Commencer le niveau A2
                </button>
              ) : (
                <>
                  <button onClick={restart} className="btn-primary">
                    <RefreshCw size={14} /> Reprendre le test
                  </button>
                  <button onClick={() => setPage('modules')} className="btn-secondary">
                    Réviser le niveau A1
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
