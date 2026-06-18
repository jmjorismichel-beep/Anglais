import { useState, useEffect } from 'react'
import { DEMO_LEARNERS, GROUPS } from '../data/courseData.js'
import { Card, MetricCard, ProgressBar, LevelBadge, Alert, Avatar, Spinner } from '../components/UI.jsx'
import { Download, MessageSquare, AlertTriangle, UserPlus, BarChart2, Send, X, Check, RefreshCw } from 'lucide-react'
import { useExcelExport } from '../hooks/usePDF.js'
import { trainerHelpers } from '../lib/supabase.js'
import useStore from '../lib/store.js'

export function TrainerPage() {
  const { user, showNotif } = useStore()
  const { exportGroupResults } = useExcelExport()
  const [groupIdx, setGroupIdx] = useState(0)
  const [search, setSearch] = useState('')
  const [msgModal, setMsgModal] = useState(null) // learner object
  const [msgText, setMsgText] = useState('')
  const [sending, setSending] = useState(false)
  const [view, setView] = useState('list') // 'list' | 'stats' | 'assign'

  const group = GROUPS[groupIdx]
  const learners = DEMO_LEARNERS
    .filter(l => group.learnerIds.includes(l.id))
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()))

  const alerts = learners.filter(l => l.alert)
  const avgProgress = Math.round(learners.reduce((a, l) => a + l.progress, 0) / learners.length)

  const handleExport = () => {
    exportGroupResults(
      learners.map(l => ({
        first_name: l.name.split(' ')[0],
        last_name: l.name.split(' ')[1] || '',
        email: `${l.name.toLowerCase().replace(' ', '.')}@exemple.fr`,
        level: l.level,
        current_unit: l.unit,
        xp: l.xp,
        streak: l.streak,
        progress: l.progress,
        avg_score: Math.round(65 + Math.random() * 30),
        exercises_done: Math.round(l.xp / 20),
        last_active: l.lastSeen,
        alert: l.alert,
      })),
      group.name
    )
    showNotif('📊 Fichier Excel téléchargé', 'success')
  }

  const sendMessage = async () => {
    if (!msgText.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 600)) // Simulation
    setSending(false)
    setMsgModal(null)
    setMsgText('')
    showNotif(`✉️ Message envoyé à ${msgModal.name}`, 'success')
  }

  const sendGroupMessage = async () => {
    showNotif('✉️ Message envoyé au groupe', 'success')
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Espace formateur</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Suivi pédagogique · {DEMO_LEARNERS.length} apprenants · {GROUPS.length} groupes
        </p>
      </div>

      {/* Métriques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Apprenants" value={learners.length} sub={`${GROUPS.length} groupes`} color="#185FA5" />
        <MetricCard label="Progression moy." value={`${avgProgress}%`} sub="Ce groupe" color="#1D9E75" />
        <MetricCard label="Alertes" value={alerts.length} sub="Décrochage" color="#D85A30" />
        <MetricCard label="Actifs (7j)" value={learners.filter(l => !l.alert).length} sub="Ce groupe" color="#BA7517" />
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <Alert type="warning">
          ⚠️ <strong>{alerts.length} apprenant{alerts.length > 1 ? 's' : ''} sans activité depuis +5 jours :</strong>{' '}
          {alerts.map(a => a.name).join(', ')}.{' '}
          Envoyez un message de motivation ou contactez leur conseiller.
        </Alert>
      )}

      {/* Sélection groupe */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {GROUPS.map((g, i) => (
          <button key={i} onClick={() => setGroupIdx(i)} style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
            border: `1px solid ${groupIdx === i ? '#185FA5' : '#e5e7eb'}`,
            background: groupIdx === i ? '#E6F1FB' : '#fff',
            color: groupIdx === i ? '#185FA5' : '#6b7280',
            fontWeight: groupIdx === i ? 500 : 400,
          }}>
            {g.name}
          </button>
        ))}
      </div>

      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
          style={{ padding: '8px 12px', border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, width: 200 }} />
        <div style={{ flex: 1 }} />
        <button onClick={sendGroupMessage} className="btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <MessageSquare size={13} /> Message groupe
        </button>
        <button onClick={handleExport} className="btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <Download size={13} /> Export Excel
        </button>
        <button className="btn-primary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <UserPlus size={13} /> Ajouter
        </button>
      </div>

      {/* Vue toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', padding: 3, borderRadius: 8, marginBottom: 14, width: 'fit-content' }}>
        {[{ id: 'list', label: 'Liste' }, { id: 'stats', label: 'Statistiques' }, { id: 'assign', label: 'Devoirs' }].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer',
            background: view === v.id ? '#fff' : 'none',
            color: view === v.id ? '#1a1a1a' : '#6b7280',
            fontWeight: view === v.id ? 500 : 400,
            boxShadow: view === v.id ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none',
          }}>{v.label}</button>
        ))}
      </div>

      {view === 'list' && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{group.name}</h3>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>Formateur : {group.trainer}</p>
          {learners.length === 0
            ? <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>Aucun apprenant trouvé.</p>
            : learners.map((l, i) => (
              <LearnerRow key={l.id} learner={l} last={i === learners.length - 1}
                onMessage={() => setMsgModal(l)} />
            ))
          }
        </Card>
      )}

      {view === 'stats' && <GroupStats learners={learners} />}
      {view === 'assign' && <AssignExercises groupId={group.id} showNotif={showNotif} />}

      {/* Message modal */}
      {msgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', width: 420, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Message à {msgModal.name}</h3>
              <button onClick={() => setMsgModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
              placeholder="Écrivez votre message d'encouragement ou de suivi…"
              rows={5} style={{ width: '100%', padding: '10px 14px', border: '0.5px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setMsgModal(null)} className="btn-secondary">Annuler</button>
              <button onClick={sendMessage} disabled={sending || !msgText.trim()} className="btn-primary">
                {sending ? <Spinner size={14} /> : <Send size={14} />} Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LearnerRow({ learner: l, last, onMessage }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ borderBottom: last ? 'none' : '0.5px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <Avatar initials={l.initials}
          color={l.alert ? '#FAECE7' : '#E6F1FB'}
          textColor={l.alert ? '#D85A30' : '#185FA5'} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{l.name}</span>
            <LevelBadge level={l.level} />
            {l.alert && <AlertTriangle size={13} color="#D85A30" />}
          </div>
          <div style={{ fontSize: 11, color: l.alert ? '#D85A30' : '#9ca3af' }}>
            Unité {l.unit} · {l.lastSeen} · 🔥 {l.streak} jours · {l.xp} XP
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: l.progress >= 70 ? '#1D9E75' : l.progress >= 40 ? '#BA7517' : '#D85A30' }}>
            {l.progress}%
          </div>
          <ProgressBar value={l.progress} color={l.progress >= 70 ? 'teal' : l.progress >= 40 ? 'amber' : 'coral'} />
        </div>
        <button onClick={e => { e.stopPropagation(); onMessage() }} style={{ padding: '5px 8px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: '#fff', color: '#185FA5', marginLeft: 4 }}>
          <MessageSquare size={13} />
        </button>
      </div>
      {expanded && (
        <div style={{ padding: '10px 12px 14px 44px', background: '#f9fafb', borderRadius: 8, margin: '0 0 10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Compréhension orale', val: Math.round(50 + l.progress * 0.4) },
              { label: 'Grammaire', val: Math.round(40 + l.progress * 0.35) },
              { label: 'Vocabulaire', val: Math.round(60 + l.progress * 0.3) },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>{s.label}</div>
                <ProgressBar value={s.val} color="blue" height={4} />
                <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>{s.val}%</div>
              </div>
            ))}
          </div>
          {l.alert && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#D85A30', background: '#FAECE7', padding: '8px 12px', borderRadius: 6 }}>
              ⚠️ Apprenant en risque de décrochage — dernière connexion : {l.lastSeen}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GroupStats({ learners }) {
  const sorted = [...learners].sort((a, b) => b.progress - a.progress)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Classement progression</h3>
        {sorted.map((l, i) => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, width: 20, color: i < 3 ? '#BA7517' : '#9ca3af' }}>{i + 1}</span>
            <Avatar initials={l.initials} size={28} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{l.name}</div>
              <ProgressBar value={l.progress} color={l.progress >= 70 ? 'teal' : 'amber'} height={4} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75' }}>{l.progress}%</span>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Répartition XP</h3>
        {[...learners].sort((a, b) => b.xp - a.xp).map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '0.5px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar initials={l.initials} size={24} />
              <span style={{ fontSize: 12 }}>{l.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#BA7517' }}>{l.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

function AssignExercises({ showNotif }) {
  const [selected, setSelected] = useState([])
  const [due, setDue] = useState('')
  const exercises = [
    { id: 'u3_qcm', label: 'Unit 3 — QCM Have got / Has got', type: 'QCM', level: 'A1' },
    { id: 'u3_fill', label: 'Unit 3 — Possessifs (trous)', type: 'Trous', level: 'A1' },
    { id: 'u3_match', label: 'Unit 3 — Vocabulaire maison', type: 'Association', level: 'A1' },
    { id: 'u4_qcm', label: 'Unit 4 — Présent simple', type: 'QCM', level: 'A1' },
    { id: 'u5_freq', label: 'Unit 5 — Adverbes fréquence', type: 'QCM', level: 'A1' },
  ]
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Assigner des exercices au groupe</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {exercises.map(ex => (
          <label key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${selected.includes(ex.id) ? '#185FA5' : '#e5e7eb'}`, borderRadius: 8, cursor: 'pointer', background: selected.includes(ex.id) ? '#E6F1FB' : '#fff', transition: 'all 0.12s' }}>
            <input type="checkbox" checked={selected.includes(ex.id)} onChange={() => toggle(ex.id)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.label}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{ex.type} · {ex.level}</div>
            </div>
            {selected.includes(ex.id) && <Check size={16} color="#185FA5" />}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Date limite (optionnel)</label>
          <input type="date" value={due} onChange={e => setDue(e.target.value)}
            style={{ padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
        </div>
        <button onClick={() => { if (selected.length) showNotif(`✅ ${selected.length} exercice(s) assigné(s) au groupe`, 'success') }}
          disabled={!selected.length} className="btn-primary" style={{ alignSelf: 'flex-end' }}>
          <Send size={14} /> Assigner ({selected.length})
        </button>
      </div>
    </Card>
  )
}
