import { useState, useEffect, useCallback } from 'react'
import { DEMO_LEARNERS, GROUPS } from '../data/courseData.js'
import { Card, MetricCard, ProgressBar, LevelBadge, Alert, Avatar, Spinner } from '../components/UI.jsx'
import { Download, MessageSquare, AlertTriangle, UserPlus, Send, X, Check, RefreshCw, BarChart2, Eye, FileText, Bell, Search, Filter, ChevronDown, ChevronUp, Clock, Award } from 'lucide-react'
import { useExcelExport } from '../hooks/usePDF.js'
import { supabase, isConfigured } from '../lib/supabase.js'
import useStore from '../lib/store.js'

// ════════════════════════════════════════════════════════════════
// ESPACE FORMATEUR COMPLET
// ════════════════════════════════════════════════════════════════
export function TrainerPage() {
  const { user, showNotif } = useStore()
  const { exportGroupResults } = useExcelExport()
  const [groupIdx, setGroupIdx]   = useState(0)
  const [search, setSearch]       = useState('')
  const [sortBy, setSortBy]       = useState('name')
  const [msgModal, setMsgModal]   = useState(null)
  const [msgText, setMsgText]     = useState('')
  const [sending, setSending]     = useState(false)
  const [view, setView]           = useState('list')
  const [loading, setLoading]     = useState(false)
  const [realLearners, setRealLearners] = useState(null)
  const [selectedLearner, setSelectedLearner] = useState(null)

  // Charger les vrais apprenants depuis Supabase si connecté
  useEffect(() => {
    if (!isConfigured || !user?.id) return
    setLoading(true)
    supabase
      .from('learners')
      .select('*')
      .then(({ data }) => {
        if (data && data.length > 0) setRealLearners(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user?.id])

  const group    = GROUPS[groupIdx]
  const rawLearn = realLearners || DEMO_LEARNERS
  const learners = rawLearn
    .filter(l => {
      const inGroup = realLearners ? true : group.learnerIds.includes(l.id || l.id)
      const matchSearch = !search || (l.first_name || l.name || '').toLowerCase().includes(search.toLowerCase()) || (l.last_name || '').toLowerCase().includes(search.toLowerCase())
      return inGroup && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0)
      if (sortBy === 'xp')       return (b.xp || 0) - (a.xp || 0)
      if (sortBy === 'alert')    return (b.alert ? 1 : 0) - (a.alert ? 1 : 0)
      return ((a.first_name || a.name || '')).localeCompare(b.first_name || b.name || '')
    })

  const alerts      = learners.filter(l => l.alert || (l.streak === 0 && l.xp < 100))
  const avgProgress = learners.length ? Math.round(learners.reduce((a, l) => a + (l.progress || 0), 0) / learners.length) : 0
  const activeCount = learners.filter(l => !l.alert).length

  const handleExport = () => {
    exportGroupResults(
      learners.map(l => ({
        first_name:   l.first_name || l.name?.split(' ')[0] || '',
        last_name:    l.last_name  || l.name?.split(' ')[1] || '',
        email:        l.email || '',
        level:        l.level || 'A1',
        current_unit: l.current_unit || l.unit || 1,
        xp:           l.xp || 0,
        streak:       l.streak || 0,
        progress:     l.progress || 0,
        last_active:  l.last_active || l.lastSeen || '-',
        alert:        l.alert || false,
      })),
      group.name
    )
    showNotif('📊 Export Excel téléchargé', 'success')
  }

  const sendMessage = async () => {
    if (!msgText.trim()) return
    setSending(true)
    await new Promise(r => setTimeout(r, 600))
    setSending(false)
    setMsgModal(null)
    setMsgText('')
    showNotif(`✉️ Message envoyé à ${msgModal.first_name || msgModal.name}`, 'success')
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>Espace formateur</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Suivi pédagogique · {learners.length} apprenant{learners.length > 1 ? 's' : ''} · {GROUPS.length} groupe{GROUPS.length > 1 ? 's' : ''}
            {realLearners && <span style={{ marginLeft: 8, fontSize: 11, color: '#1D9E75', fontWeight: 500 }}>● Données réelles</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000) }} className="btn-secondary" style={{ fontSize: 12 }}>
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>
      </div>

      {/* Métriques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Apprenants"       value={learners.length}  sub={`${GROUPS.length} groupes`}    color="#185FA5" />
        <MetricCard label="Progression moy." value={`${avgProgress}%`} sub="Ce groupe"                   color="#1D9E75" />
        <MetricCard label="Actifs"           value={activeCount}      sub="Sans alerte décrochage"        color="#639922" />
        <MetricCard label="Alertes"          value={alerts.length}    sub="Nécessitent attention"         color="#D85A30" />
      </div>

      {/* Alertes décrochage */}
      {alerts.length > 0 && (
        <Alert type="warning">
          ⚠️ <strong>{alerts.length} apprenant{alerts.length > 1 ? 's' : ''} en risque de décrochage</strong> :{' '}
          {alerts.map(a => a.first_name || a.name).join(', ')}.
          <button onClick={() => setMsgModal({ first_name: 'Groupe', mass: true })} style={{ marginLeft: 8, color: '#BA7517', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, textDecoration: 'underline' }}>
            Envoyer un message de motivation →
          </button>
        </Alert>
      )}

      {/* Sélection groupe */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {GROUPS.map((g, i) => (
          <button key={i} onClick={() => setGroupIdx(i)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: `1px solid ${groupIdx === i ? '#185FA5' : '#e5e7eb'}`, background: groupIdx === i ? '#E6F1FB' : '#fff', color: groupIdx === i ? '#185FA5' : '#6b7280', fontWeight: groupIdx === i ? 500 : 400 }}>
            {g.name}
          </button>
        ))}
        <button className="btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <UserPlus size={13} /> Créer un groupe
        </button>
      </div>

      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un apprenant…"
            style={{ width: '100%', padding: '8px 12px 8px 30px', border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 13 }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
          <option value="name">Trier : Nom</option>
          <option value="progress">Trier : Progression</option>
          <option value="xp">Trier : XP</option>
          <option value="alert">Trier : Alertes d'abord</option>
        </select>
        <button onClick={() => setMsgModal({ first_name: 'le groupe', mass: true })} className="btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <MessageSquare size={13} /> Message groupe
        </button>
        <button onClick={handleExport} className="btn-secondary" style={{ fontSize: 12, padding: '7px 12px' }}>
          <Download size={13} /> Export Excel
        </button>
      </div>

      {/* Vue toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', padding: 3, borderRadius: 8, marginBottom: 14, width: 'fit-content' }}>
        {[
          { id: 'list',   label: '👥 Liste'       },
          { id: 'stats',  label: '📊 Statistiques' },
          { id: 'assign', label: '📋 Devoirs'      },
          { id: 'msg',    label: '✉️ Messages'     },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', background: view === v.id ? '#fff' : 'none', color: view === v.id ? '#1a1a1a' : '#6b7280', fontWeight: view === v.id ? 500 : 400, boxShadow: view === v.id ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Contenu selon vue */}
      {view === 'list' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{group.name}</h3>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{learners.length} apprenant{learners.length > 1 ? 's' : ''}</span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><Spinner /></div>
          ) : learners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Aucun apprenant trouvé</div>
          ) : (
            learners.map((l, i) => (
              <LearnerRow
                key={l.id || i}
                learner={l}
                last={i === learners.length - 1}
                onMessage={() => setMsgModal(l)}
                onView={() => setSelectedLearner(selectedLearner?.id === l.id ? null : l)}
                expanded={selectedLearner?.id === l.id}
              />
            ))
          )}
        </Card>
      )}

      {view === 'stats'  && <GroupStats  learners={learners} />}
      {view === 'assign' && <AssignExercises showNotif={showNotif} />}
      {view === 'msg'    && <MessagesPanel userId={user?.id} showNotif={showNotif} />}

      {/* Modal message */}
      {msgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', width: 440, maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                {msgModal.mass ? 'Message au groupe' : `Message à ${msgModal.first_name || msgModal.name}`}
              </h3>
              <button onClick={() => setMsgModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {msgModal.mass && (
              <div style={{ background: '#FAEEDA', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 13, color: '#412402' }}>
                📢 Ce message sera envoyé à tous les apprenants du groupe
              </div>
            )}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                {['Continuez vos efforts, vous progressez bien !', 'N\'oubliez pas de vous connecter aujourd\'hui 😊', 'Un nouvel exercice vous attend !'].map(t => (
                  <button key={t} onClick={() => setMsgText(t)} style={{ fontSize: 11, padding: '4px 8px', border: '0.5px solid #e5e7eb', borderRadius: 6, background: '#f9fafb', cursor: 'pointer', color: '#6b7280' }}>
                    {t.slice(0, 30)}…
                  </button>
                ))}
              </div>
              <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
                placeholder="Votre message d'encouragement ou de suivi…"
                rows={4} style={{ width: '100%', padding: '10px 14px', border: '0.5px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
            </div>
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

function LearnerRow({ learner: l, last, onMessage, onView, expanded }) {
  const name = l.first_name ? `${l.first_name} ${l.last_name || ''}`.trim() : (l.name || 'Apprenant')
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const isAlert = l.alert || (l.streak === 0 && (l.xp || 0) < 100)

  return (
    <div style={{ borderBottom: last ? 'none' : '0.5px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer' }} onClick={onView}>
        <Avatar initials={initials} color={isAlert ? '#FAECE7' : '#E6F1FB'} textColor={isAlert ? '#D85A30' : '#185FA5'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
            <LevelBadge level={l.level || 'A1'} />
            {isAlert && <AlertTriangle size={13} color="#D85A30" />}
          </div>
          <div style={{ fontSize: 11, color: isAlert ? '#D85A30' : '#9ca3af', marginTop: 1 }}>
            Unité {l.current_unit || l.unit || 1} · {l.last_active || l.lastSeen || 'N/C'} · 🔥 {l.streak || 0} j · {(l.xp || 0).toLocaleString()} XP
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: (l.progress || 0) >= 70 ? '#1D9E75' : (l.progress || 0) >= 40 ? '#BA7517' : '#D85A30' }}>
            {l.progress || 0}%
          </div>
          <ProgressBar value={l.progress || 0} color={(l.progress || 0) >= 70 ? 'teal' : (l.progress || 0) >= 40 ? 'amber' : 'coral'} height={3} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={e => { e.stopPropagation(); onMessage() }} style={{ padding: '5px 8px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 11, cursor: 'pointer', background: '#fff', color: '#185FA5' }} title="Envoyer un message">
            <MessageSquare size={13} />
          </button>
          {expanded ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '10px 12px 14px 44px', background: '#f9fafb', borderRadius: 8, margin: '0 0 10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
            {[
              { label: 'Comp. orale',  val: Math.round(40 + (l.progress || 0) * 0.4) },
              { label: 'Grammaire',    val: Math.round(35 + (l.progress || 0) * 0.35) },
              { label: 'Vocabulaire',  val: Math.round(55 + (l.progress || 0) * 0.3)  },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>{s.label}</div>
                <ProgressBar value={s.val} color="blue" height={4} />
                <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2 }}>{s.val}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }} onClick={onMessage}>
              <MessageSquare size={12} /> Message
            </button>
            <button className="btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }}>
              <Eye size={12} /> Voir la progression
            </button>
            <button className="btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }}>
              <FileText size={12} /> Générer rapport
            </button>
          </div>
          {isAlert && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#D85A30', background: '#FAECE7', padding: '8px 12px', borderRadius: 6 }}>
              ⚠️ Apprenant en risque de décrochage — dernière connexion : {l.last_active || l.lastSeen || 'inconnue'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GroupStats({ learners }) {
  const sorted = [...learners].sort((a, b) => (b.progress || 0) - (a.progress || 0))
  const avgXP = learners.length ? Math.round(learners.reduce((a, l) => a + (l.xp || 0), 0) / learners.length) : 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Classement progression</h3>
        {sorted.map((l, i) => {
          const name = l.first_name ? `${l.first_name} ${l.last_name || ''}`.trim() : (l.name || 'Apprenant')
          const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          return (
            <div key={l.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, width: 24, color: i < 3 ? '#BA7517' : '#9ca3af', textAlign: 'center' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </span>
              <Avatar initials={initials} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{name}</div>
                <ProgressBar value={l.progress || 0} color={(l.progress || 0) >= 70 ? 'teal' : 'amber'} height={4} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', minWidth: 36 }}>{l.progress || 0}%</span>
            </div>
          )
        })}
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Vue globale</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'XP moyen du groupe',     value: `${avgXP.toLocaleString()} XP`,  color: '#BA7517' },
            { label: 'Taux de participation',  value: `${Math.round((learners.filter(l => !l.alert).length / Math.max(learners.length, 1)) * 100)}%`, color: '#1D9E75' },
            { label: 'Apprenants en alerte',   value: `${learners.filter(l => l.alert).length} / ${learners.length}`, color: '#D85A30' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #f3f4f6' }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Répartition par niveau</div>
            {['A1','A2','B1'].map(lv => {
              const count = learners.filter(l => (l.level || 'A1') === lv).length
              return (
                <div key={lv} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <LevelBadge level={lv} />
                  <ProgressBar value={learners.length ? (count / learners.length) * 100 : 0} color="blue" />
                  <span style={{ fontSize: 12, color: '#6b7280', minWidth: 40 }}>{count} appr.</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}

function AssignExercises({ showNotif }) {
  const [selected, setSelected] = useState([])
  const [due, setDue]           = useState('')
  const [note, setNote]         = useState('')

  const EXERCISES = [
    { id: 'u3_qcm',    label: 'Unit 3 — QCM Have got / Has got',     type: 'QCM',        level: 'A1', duration: '10 min' },
    { id: 'u3_fill',   label: 'Unit 3 — Possessifs (trous)',          type: 'Trous',      level: 'A1', duration: '8 min'  },
    { id: 'u3_match',  label: 'Unit 3 — Vocabulaire maison',          type: 'Association',level: 'A1', duration: '6 min'  },
    { id: 'u4_qcm',    label: 'Unit 4 — Présent simple (positif)',    type: 'QCM',        level: 'A1', duration: '12 min' },
    { id: 'u4_neg',    label: 'Unit 4 — Présent simple (négatif)',    type: 'Trous',      level: 'A1', duration: '10 min' },
    { id: 'u5_freq',   label: 'Unit 5 — Adverbes de fréquence',       type: 'QCM',        level: 'A1', duration: '8 min'  },
    { id: 'b1p_u1_01', label: 'B1+ Unit 1 — State verbs',             type: 'QCM',        level: 'B1+','duration': '10 min' },
  ]

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Assigner des exercices</h3>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Sélectionnez les exercices à envoyer au groupe</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {EXERCISES.map(ex => (
          <label key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${selected.includes(ex.id) ? '#185FA5' : '#e5e7eb'}`, borderRadius: 8, cursor: 'pointer', background: selected.includes(ex.id) ? '#E6F1FB' : '#fff', transition: 'all 0.12s' }}>
            <input type="checkbox" checked={selected.includes(ex.id)} onChange={() => toggle(ex.id)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.label}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>
                <span style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>{ex.type}</span>
                {' · '}<LevelBadge level={ex.level} />{' · '}⏱️ {ex.duration}
              </div>
            </div>
            {selected.includes(ex.id) && <Check size={16} color="#185FA5" />}
          </label>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Date limite (optionnel)</label>
          <input type="date" value={due} onChange={e => setDue(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Note pour les apprenants</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Instructions…"
            style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
        </div>
      </div>

      <button onClick={() => {
        if (selected.length) showNotif(`✅ ${selected.length} exercice(s) assigné(s) au groupe`, 'success')
      }} disabled={!selected.length} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        <Send size={14} /> Assigner {selected.length > 0 ? `(${selected.length})` : ''}
      </button>
    </Card>
  )
}

function MessagesPanel({ userId, showNotif }) {
  const DEMO_MESSAGES = [
    { from: 'Marie Dupont',  date: 'Aujourd\'hui 21:30', content: 'Bonjour, je n\'arrive pas à faire l\'exercice 3 de l\'unité 3.', unread: true  },
    { from: 'Ahmed Bouali',  date: 'Hier 18:45',         content: 'Est-ce que je peux refaire le test de positionnement ?',        unread: true  },
    { from: 'Luis Martinez', date: 'Lundi 09:12',        content: 'Merci pour le message d\'encouragement !',                      unread: false },
  ]
  const [reply, setReply]   = useState('')
  const [active, setActive] = useState(0)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, height: 480 }}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #f3f4f6', fontWeight: 600, fontSize: 14 }}>
          Messages {DEMO_MESSAGES.filter(m => m.unread).length > 0 && <span style={{ background: '#D85A30', color: 'white', fontSize: 10, padding: '1px 6px', borderRadius: 10, marginLeft: 6 }}>{DEMO_MESSAGES.filter(m => m.unread).length}</span>}
        </div>
        {DEMO_MESSAGES.map((m, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ padding: '10px 14px', borderBottom: '0.5px solid #f3f4f6', cursor: 'pointer', background: active === i ? '#E6F1FB' : m.unread ? '#fffbf0' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: m.unread ? 600 : 400 }}>{m.from}</span>
              {m.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#185FA5', flexShrink: 0, marginTop: 4 }} />}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.content}</div>
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{m.date}</div>
          </div>
        ))}
      </Card>
      <Card style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f3f4f6', fontWeight: 600, fontSize: 14 }}>
          {DEMO_MESSAGES[active]?.from}
        </div>
        <div style={{ flex: 1, padding: '14px 16px', overflow: 'auto' }}>
          <div style={{ background: '#f3f4f6', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 12, maxWidth: '80%' }}>
            {DEMO_MESSAGES[active]?.content}
            <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{DEMO_MESSAGES[active]?.date}</div>
          </div>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '0.5px solid #f3f4f6', display: 'flex', gap: 8 }}>
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Votre réponse…"
            style={{ flex: 1, padding: '8px 12px', border: '0.5px solid #d1d5db', borderRadius: 20, fontSize: 13 }}
            onKeyDown={e => e.key === 'Enter' && reply.trim() && (showNotif('✉️ Réponse envoyée', 'success'), setReply(''))} />
          <button onClick={() => { if (reply.trim()) { showNotif('✉️ Réponse envoyée', 'success'); setReply('') } }}
            style={{ width: 36, height: 36, borderRadius: '50%', background: '#185FA5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={14} color="white" />
          </button>
        </div>
      </Card>
    </div>
  )
}
