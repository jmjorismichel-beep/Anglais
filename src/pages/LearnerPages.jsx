import { useState, useEffect, useRef } from 'react'
import useStore from '../lib/store.js'
import { Card, MetricCard, ProgressBar, LevelBadge, Alert, Spinner, AudioPlayer, XPBar } from '../components/UI.jsx'
import { Flame, BookOpen, Play, Award, Target, Clock, TrendingUp, Star, Download, Wifi, WifiOff, CheckCircle, Lock, RefreshCw } from 'lucide-react'
import { UNITS } from '../data/courseData.js'
import { B1PLUS_UNITS } from '../data/b1plusData.js'

// ════════════════════════════════════════════════════════════════
// DASHBOARD APPRENANT COMPLET
// ════════════════════════════════════════════════════════════════
export function DashboardPage() {
  const { user, profile, xp, streak, badges, progress, setPage } = useStore()
  const firstName = profile?.first_name || user?.firstName || 'apprenant·e'
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const level = profile?.level || 'A1'
  const unit  = profile?.current_unit || 3
  const completedChapters = Object.keys(progress).length
  const avgScore = completedChapters > 0
    ? Math.round(Object.values(progress).reduce((a, p) => a + (p.score || 0), 0) / completedChapters)
    : 0

  const BADGE_LIST = [
    { id: 'first_lesson',   label: 'Première leçon',  icon: '🌟' },
    { id: 'streak_7',       label: '7 jours 🔥',      icon: '🔥' },
    { id: 'exercises_10',   label: '10 exercices',     icon: '🎯' },
    { id: 'pronunciation',  label: 'Prononciation',    icon: '🗣️' },
    { id: 'a1_complete',    label: 'A1 complet',       icon: '🏆' },
    { id: 'level_a2',       label: 'Niveau A2',        icon: '🚀' },
    { id: 'streak_30',      label: '30 jours',         icon: '💎' },
    { id: 'pro_path',       label: 'Parcours pro',     icon: '💼' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Bonjour, {firstName} 👋</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <LevelBadge level={level} />
            <span style={{ fontSize: 13, color: '#6b7280' }}>Unité {unit} — People and possessions</span>
            <span style={{ fontSize: 12, color: online ? '#1D9E75' : '#D85A30', display: 'flex', alignItems: 'center', gap: 4 }}>
              {online ? <Wifi size={12} /> : <WifiOff size={12} />}
              {online ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </div>
        <button onClick={() => setPage('positioning')} className="btn-secondary" style={{ fontSize: 13 }}>
          <Target size={14} /> Refaire le test de niveau
        </button>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FAEEDA', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <Flame size={22} color="#BA7517" />
          <span style={{ fontSize: 22, fontWeight: 700, color: '#BA7517' }}>{streak}</span>
          <div>
            <div style={{ fontSize: 14, color: '#412402', fontWeight: 500 }}>
              {streak >= 30 ? 'Incroyable !' : streak >= 7 ? 'Excellent !' : 'Continuez !'} {streak} jour{streak > 1 ? 's' : ''} consécutif{streak > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 11, color: '#BA7517' }}>
              {streak < 7 ? `Plus que ${7 - streak} jour${7 - streak > 1 ? 's' : ''} pour le badge 🔥` : 'Badge streak actif !'}
            </div>
          </div>
        </div>
      )}

      {/* Mode hors ligne actif */}
      {!online && (
        <Alert type="info">
          📱 Vous travaillez <strong>hors ligne</strong>. Votre progression est sauvegardée localement et sera synchronisée dès que vous retrouverez internet.
        </Alert>
      )}

      {/* Métriques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Niveau actuel"      value={level}         sub={`Unité ${unit} / 5`}       color="#185FA5" />
        <MetricCard label="XP total"           value={xp.toLocaleString()} sub="+80 aujourd'hui"   color="#BA7517" />
        <MetricCard label="Chapitres terminés" value={completedChapters || 47} sub="exercices réussis" color="#1D9E75" />
        <MetricCard label="Score moyen"        value={`${avgScore || 85}%`} sub="de réussite"      color="#639922" />
      </div>

      {/* Progression + Calendrier */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#185FA5" /> Progression A1–B1+
          </h3>
          {[
            { level: 'A1',  pct: 65, color: 'teal',   active: true  },
            { level: 'A2',  pct: 0,  color: 'blue',   active: false },
            { level: 'B1',  pct: 0,  color: 'purple', active: false },
            { level: 'B1+', pct: 0,  color: 'amber',  active: false },
          ].map(r => (
            <div key={r.level} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <LevelBadge level={r.level} />
                <span style={{ fontSize: 12, color: r.active ? '#1D9E75' : '#9ca3af', fontWeight: r.active ? 600 : 400 }}>
                  {r.active ? `${r.pct}%` : <><Lock size={11} style={{ display: 'inline', marginRight: 3 }} />Verrouillé</>}
                </span>
              </div>
              <ProgressBar value={r.pct} color={r.color} />
            </div>
          ))}
          <button onClick={() => setPage('progress')} className="btn-secondary" style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: 12 }}>
            Voir ma progression détaillée
          </button>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📅 Cette semaine</h3>
          <WeekCalendar />
          <div style={{ marginTop: 12 }}>
            <XPBar xp={xp} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            <span>Objectif quotidien</span>
            <span style={{ color: '#185FA5', fontWeight: 600 }}>80 / 100 XP</span>
          </div>
          <ProgressBar value={80} color="blue" />
        </Card>
      </div>

      {/* Reprendre */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Play size={16} color="#185FA5" /> Reprendre là où vous vous êtes arrêté·e
        </h3>
        <div style={{ background: '#E6F1FB', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#185FA5', marginBottom: 2 }}>
            Unit 3 — 3.2 Possessions — Dialogue
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>03-04.mp3 · Leçon en cours · 60% complété</div>
          <ProgressBar value={60} color="blue" height={4} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => setPage('exercises')}>
            ✏️ Continuer les exercices
          </button>
          <button className="btn-secondary" onClick={() => setPage('modules')}>
            📚 Voir tous les modules
          </button>
          <button className="btn-secondary" onClick={() => setPage('ai')}>
            🤖 Aide IA
          </button>
        </div>
      </Card>

      {/* Badges */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={16} color="#BA7517" /> Mes badges ({badges.length}/{BADGE_LIST.length})
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {BADGE_LIST.map(b => {
            const earned = badges.includes(b.id)
            return (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 56 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: earned ? '#FAEEDA' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, filter: earned ? 'none' : 'grayscale(1) opacity(0.35)', transition: 'all 0.2s' }}>
                  {b.icon}
                </div>
                <span style={{ fontSize: 10, color: earned ? '#374151' : '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>{b.label}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Télécharger pour mode hors ligne */}
      <Card style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#0ea5e9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Download size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0c4a6e' }}>Mode hors ligne disponible</div>
            <div style={{ fontSize: 12, color: '#075985' }}>Téléchargez vos modules pour travailler sans internet</div>
          </div>
          <button className="btn-primary" style={{ background: '#0ea5e9', fontSize: 12, flexShrink: 0 }}
            onClick={() => {
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'CACHE_MODULES', urls: ['/', '/index.html'] })
                useStore.getState().showNotif('📱 Modules téléchargés !', 'success')
              }
            }}>
            <Download size={13} /> Télécharger
          </button>
        </div>
      </Card>
    </div>
  )
}

function WeekCalendar() {
  const days = ['L','M','M','J','V','S','D']
  const dates = [10,11,12,13,14,15,16]
  const done  = [10,11,12,13,14,15]
  const today = 16
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {days.map((d, i) => <div key={i} style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {dates.map(d => (
          <div key={d} style={{ width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: d === today || done.includes(d) ? 600 : 400, background: d === today ? '#185FA5' : done.includes(d) ? '#E1F5EE' : 'transparent', color: d === today ? 'white' : done.includes(d) ? '#1D9E75' : '#9ca3af' }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// PROGRESSION DÉTAILLÉE
// ════════════════════════════════════════════════════════════════
export function ProgressPage() {
  const { xp, streak, progress } = useStore()
  const [activeTab, setActiveTab] = useState('skills')

  const SKILLS = [
    { label: 'Compréhension orale', val: 70, color: 'teal',   icon: '🎧' },
    { label: 'Compréhension écrite', val: 65, color: 'blue',  icon: '📖' },
    { label: 'Grammaire',            val: 55, color: 'amber', icon: '📐' },
    { label: 'Vocabulaire',          val: 80, color: 'green', icon: '📚' },
    { label: 'Expression écrite',    val: 45, color: 'purple',icon: '✍️' },
    { label: 'Prononciation',        val: 60, color: 'coral', icon: '🗣️' },
  ]

  const HISTORY = [
    { date: '18 juin', unit: 'Unit 3.2 — Possessions', score: 90, time: '22 min', type: 'QCM' },
    { date: '17 juin', unit: 'Unit 3.1 — My neighbours', score: 75, time: '18 min', type: 'Écoute' },
    { date: '16 juin', unit: 'Grammar Ref — Have got', score: 85, time: '15 min', type: 'Grammaire' },
    { date: '15 juin', unit: 'Unit 2.4 — Speaking', score: 80, time: '25 min', type: 'Expression' },
    { date: '14 juin', unit: 'Unit 2.3 — Where are they?', score: 70, time: '20 min', type: 'QCM' },
    { date: '13 juin', unit: 'Unit 2.2 — What\'s your job?', score: 95, time: '12 min', type: 'Vocabulaire' },
    { date: '12 juin', unit: 'Unit 2.1 — What\'s this?', score: 88, time: '16 min', type: 'Association' },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Ma progression</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Vue complète de votre parcours d'apprentissage</p>
      </div>

      {/* Stats globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="XP total"      value={xp.toLocaleString()} sub="+80 aujourd'hui" color="#BA7517" />
        <MetricCard label="Streak"        value={`${streak} 🔥`}       sub="jours consécutifs" color="#BA7517" />
        <MetricCard label="Taux réussite" value="85%"                  sub="47 exercices"   color="#1D9E75" />
        <MetricCard label="Temps total"   value="14h 22min"            sub="Ce mois"        color="#185FA5" />
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', padding: 3, borderRadius: 8, marginBottom: 14, width: 'fit-content' }}>
        {[
          { id: 'skills',  label: '📊 Compétences' },
          { id: 'history', label: '📋 Historique'  },
          { id: 'goals',   label: '🎯 Objectifs'   },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '7px 14px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', background: activeTab === t.id ? '#fff' : 'none', color: activeTab === t.id ? '#1a1a1a' : '#6b7280', fontWeight: activeTab === t.id ? 500 : 400, boxShadow: activeTab === t.id ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Compétences CECRL</h3>
            {SKILLS.map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#374151' }}>{s.icon} {s.label}</span>
                  <span style={{ fontWeight: 600 }}>{s.val}%</span>
                </div>
                <ProgressBar value={s.val} color={s.color} />
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Niveaux CECRL</h3>
            {['A1','A2','B1','B1+'].map((l, i) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <LevelBadge level={l} />
                  <span style={{ fontSize: 12, color: i === 0 ? '#1D9E75' : '#9ca3af' }}>
                    {i === 0 ? '65% — En cours' : 'Verrouillé 🔒'}
                  </span>
                </div>
                <ProgressBar value={i === 0 ? 65 : 0} color={i === 0 ? 'teal' : 'gray'} />
              </div>
            ))}
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#E6F1FB', borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: '#185FA5' }}>💡 Terminez les 5 unités A1 pour débloquer le niveau A2</p>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Historique des séances</h3>
          {HISTORY.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < HISTORY.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
              <div style={{ width: 44, fontSize: 10, color: '#9ca3af', textAlign: 'center', lineHeight: 1.4, flexShrink: 0 }}>
                {h.date.split(' ')[0]}<br/><span style={{ fontWeight: 600 }}>{h.date.split(' ')[1]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{h.unit}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  <span style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>{h.type}</span>
                  {' '}· {h.time}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: h.score >= 80 ? '#1D9E75' : '#BA7517' }}>{h.score}%</div>
                <ProgressBar value={h.score} color={h.score >= 80 ? 'teal' : 'amber'} height={3} />
              </div>
            </div>
          ))}
          <button className="btn-secondary" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 13 }}>
            <Download size={14} /> Télécharger mon attestation PDF
          </button>
        </Card>
      )}

      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🎯 Objectifs de la semaine</h3>
            {[
              { label: 'Faire 5 exercices par jour',    done: true,  progress: 100 },
              { label: 'Terminer Unit 3',               done: false, progress: 60  },
              { label: 'Score ≥ 80% sur 3 exercices',   done: true,  progress: 100 },
              { label: 'Utiliser l\'assistant IA',      done: false, progress: 0   },
            ].map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: g.done ? '#E1F5EE' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {g.done ? <CheckCircle size={14} color="#1D9E75" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: g.done ? '#374151' : '#6b7280', textDecoration: g.done ? 'line-through' : 'none', marginBottom: 4 }}>{g.label}</div>
                  <ProgressBar value={g.progress} color={g.done ? 'teal' : 'blue'} height={4} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🏆 Prochain badge</h3>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>A1 Complet</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Terminez toutes les unités du niveau A1</div>
              <ProgressBar value={65} color="amber" />
              <div style={{ fontSize: 12, color: '#BA7517', marginTop: 6, fontWeight: 500 }}>65% — 2 unités restantes</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}


