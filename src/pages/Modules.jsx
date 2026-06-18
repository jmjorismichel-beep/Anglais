import { useState } from 'react'
import { UNITS, PRO_PATHS } from '../data/courseData.js'
import { B1PLUS_UNITS, B1PLUS_RESOURCES } from '../data/b1plusData.js'
import { Tabs, LevelBadge, ProgressBar, AudioPlayer, Card, LockedMessage, FavoriteBtn } from '../components/UI.jsx'
import { Lock, Check, Volume2, Video, FileText, ChevronDown, ChevronRight, Play, BookOpen, Headphones } from 'lucide-react'
import useStore from '../lib/store.js'

const LEVEL_TABS = [
  { id: 'A1', label: 'A1 — Débutant' },
  { id: 'A2', label: 'A2 — Élémentaire' },
  { id: 'B1', label: 'B1 — Intermédiaire' },
  { id: 'B1+', label: 'B1+ — Intermédiaire+' },
  { id: 'pro', label: '💼 Parcours pro' },
]

export function ModulesPage() {
  const [level, setLevel] = useState('A1')
  const [openUnit, setOpenUnit] = useState(3)
  const { setPage } = useStore()

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Modules pédagogiques</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Programme Navigate A1–B1+ · Oxford University Press · Coursebook + Workbook + Vidéos
        </p>
      </div>

      <Tabs tabs={LEVEL_TABS} active={level} onChange={setLevel} />

      {level === 'A1' && <A1Modules openUnit={openUnit} setOpenUnit={setOpenUnit} setPage={setPage} />}
      {level === 'A2' && <A2LockedView />}
      {level === 'B1' && <LockedMessage message="Terminez les niveaux A1 et A2 pour débloquer le niveau B1" />}
      {level === 'B1+' && <B1PlusModules />}
      {level === 'pro' && <ProPaths />}
    </div>
  )
}


// ─── A2 Locked View ───────────────────────────────────────────
function A2LockedView() {
  const { setPage } = useStore ? (() => { try { return require('../lib/store.js').default() } catch { return { setPage: () => {} } } })() : { setPage: () => {} }
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Niveau A2 — Élémentaire</h3>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
        Pour accéder au niveau A2, vous devez d'abord valider le niveau A1 en réussissant le test de fin de niveau.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('ep-navigate', { detail: 'validation' }))}>
          🏆 Passer le test de validation A1
        </button>
        <button className="btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('ep-navigate', { detail: 'modules' }))}>
          Réviser le niveau A1
        </button>
      </div>
    </div>
  )
}

// ─── A1 Modules ──────────────────────────────────────────────
function A1Modules({ openUnit, setOpenUnit, setPage }) {
  return (
    <div>
      {/* Ressources globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 16 }}>
        <ResourceCard icon="🎧" title="Compréhension orale" desc="31 fichiers MP3 Units 1–5" color="#E6F1FB" textColor="#185FA5" progress={55} />
        <ResourceCard icon="📖" title="Grammar Reference"   desc="5 PDF + MP3 explicatifs"   color="#EEEDFE" textColor="#534AB7" progress={40} />
        <ResourceCard icon="🎬" title="Vidéos & Voxpops"   desc="5 vidéos + témoignages"     color="#E1F5EE" textColor="#1D9E75" progress={20} />
        <ResourceCard icon="📝" title="Corrigés formateur" desc="Workbook + Coursebook"        color="#FAEEDA" textColor="#BA7517" progress={65} />
      </div>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Unités A1 — Navigate</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>Cliquez pour développer les chapitres</p>
        {UNITS.A1.map(unit => (
          <UnitAccordion key={unit.id} unit={unit} open={openUnit === unit.id}
            onToggle={() => setOpenUnit(openUnit === unit.id ? null : unit.id)} currentUnit={3} />
        ))}
      </Card>
    </div>
  )
}

// ─── B1+ Modules ─────────────────────────────────────────────
function B1PlusModules() {
  const [openUnit, setOpenUnit] = useState(1)

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #534AB7 0%, #7C3AED 100%)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: 16, color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>
              Navigate B1+ — Intermediate
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Oxford University Press</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Rachael Roberts · Heather Buchanan · Emma Pathare
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: '📚', label: '12 unités', sub: '215 pages' },
              { icon: '🎬', label: '12 vidéos', sub: 'MP4 inclus' },
              { icon: '📝', label: 'Workbook', sub: 'exercices' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 10, opacity: 0.75 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ressources globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 16 }}>
        <ResourceCard icon="📖" title="Coursebook PDF"  desc="215 pages · Unités 1–12"    color="#EEEDFE" textColor="#534AB7" progress={0} />
        <ResourceCard icon="📝" title="Workbook PDF"    desc="Exercices complémentaires"    color="#E6F1FB" textColor="#185FA5" progress={0} />
        <ResourceCard icon="🎬" title="12 Vidéos MP4"   desc="Navigate B1+ Video Unit 1–12" color="#E1F5EE" textColor="#1D9E75" progress={0} />
        <ResourceCard icon="📋" title="Fiches vidéo"    desc="12 PDF · Scripts + exercices" color="#FAEEDA" textColor="#BA7517" progress={0} />
      </div>

      {/* Grammar overview */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Points de grammaire — B1+</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 6 }}>
          {[
            { unit: 1,  grammar: 'Present simple, continuous and perfect · State verbs' },
            { unit: 2,  grammar: 'Narrative forms · Sequencing events' },
            { unit: 3,  grammar: 'Ability · Obligation, permission and possibility' },
            { unit: 4,  grammar: 'will/be going to · Probability' },
            { unit: 5,  grammar: '-ing form and infinitive with to · Present perfect simple & past simple' },
            { unit: 6,  grammar: 'Defining & non-defining relative clauses · Present perfect continuous' },
            { unit: 7,  grammar: 'used to and would · Question forms' },
            { unit: 8,  grammar: 'Real conditionals · Unreal conditionals (2nd)' },
            { unit: 9,  grammar: 'Comparison · Deduction and speculation' },
            { unit: 10, grammar: 'Passives · Using articles' },
            { unit: 11, grammar: 'Unreal past conditional (3rd) · should/shouldn\'t have' },
            { unit: 12, grammar: 'Reported speech · Reported questions' },
          ].map(g => (
            <div key={g.unit} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '0.5px solid #f3f4f6' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#534AB7', width: 24, flexShrink: 0 }}>U{g.unit}</span>
              <span style={{ fontSize: 12, color: '#374151' }}>{g.grammar}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Unités accordéon */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Unités B1+ — Navigate</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
          12 unités · Cliquez pour voir les chapitres, objectifs et vidéos
        </p>
        {B1PLUS_UNITS.map(unit => (
          <B1PlusUnitAccordion
            key={unit.id}
            unit={unit}
            open={openUnit === unit.id}
            onToggle={() => setOpenUnit(openUnit === unit.id ? null : unit.id)}
          />
        ))}
      </Card>
    </div>
  )
}

function B1PlusUnitAccordion({ unit, open, onToggle }) {
  const hasVideo = unit.chapters.some(c => c.video_mp4)

  return (
    <div style={{ borderBottom: '0.5px solid #f3f4f6' }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer' }}>
        {/* Numéro */}
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {unit.id}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Unit {unit.id} — {unit.title}</span>
            <LevelBadge level="B1+" />
            {hasVideo && (
              <span style={{ fontSize: 10, background: '#E1F5EE', color: '#1D9E75', padding: '2px 7px', borderRadius: 8, fontWeight: 600 }}>
                🎬 vidéo
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
            p.{unit.page} · {unit.chapters.length} chapitres · WB p.{unit.workbook_pages}
          </div>
        </div>

        <div style={{ color: '#9ca3af' }}>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>

      {open && (
        <div style={{ paddingLeft: 48, paddingBottom: 16 }}>
          {/* Objectifs */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Objectifs de l'unité
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {unit.goals.map((g, i) => (
                <span key={i} style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: 6 }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Chapitres */}
          {unit.chapters.map((ch, i) => (
            <B1PlusChapterRow key={ch.id} chapter={ch} index={i} unitId={unit.id} />
          ))}
        </div>
      )}
    </div>
  )
}

function B1PlusChapterRow({ chapter, index }) {
  const [expanded, setExpanded] = useState(false)
  const isVideo = !!chapter.video_mp4
  const isReview = chapter.id.endsWith('.R')

  return (
    <div style={{ marginBottom: 4 }}>
      <div onClick={() => setExpanded(e => !e)} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
        borderRadius: 6, cursor: 'pointer',
        background: expanded ? '#f9fafb' : 'transparent',
        transition: 'background 0.12s',
      }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: isVideo ? '#E1F5EE' : isReview ? '#FAEEDA' : '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isVideo ? <Video size={10} color="#1D9E75" /> : isReview ? <span style={{ fontSize: 9 }}>R</span> : <span style={{ fontSize: 9, color: '#534AB7', fontWeight: 700 }}>{index + 1}</span>}
        </div>

        <span style={{ flex: 1, fontSize: 13, color: '#374151' }}>
          {chapter.id} — {chapter.title}
          {chapter.page && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>p.{chapter.page}</span>}
        </span>

        {chapter.grammar && <BookOpen size={12} color="#534AB7" title="Grammaire" />}
        {chapter.audio && <Headphones size={12} color="#185FA5" title="Audio" />}
        {chapter.video_mp4 && <Video size={12} color="#1D9E75" title="Vidéo MP4" />}
        <FavoriteBtn id={`b1p_${chapter.id}`} />
      </div>

      {expanded && !isReview && (
        <div style={{ paddingLeft: 30, paddingBottom: 10, paddingTop: 4 }}>
          {chapter.grammar && (
            <div style={{ fontSize: 12, color: '#534AB7', background: '#EEEDFE', padding: '6px 10px', borderRadius: 6, marginBottom: 6 }}>
              📐 <strong>Grammaire :</strong> {chapter.grammar}
            </div>
          )}
          {chapter.vocabulary && (
            <div style={{ fontSize: 12, color: '#185FA5', background: '#E6F1FB', padding: '6px 10px', borderRadius: 6, marginBottom: 6 }}>
              📚 <strong>Vocabulaire :</strong> {chapter.vocabulary}
            </div>
          )}
          {chapter.skills && (
            <div style={{ fontSize: 12, color: '#1D9E75', background: '#E1F5EE', padding: '6px 10px', borderRadius: 6, marginBottom: 6 }}>
              🎯 <strong>Compétences :</strong> {chapter.skills}
            </div>
          )}
          {chapter.pronunciation && (
            <div style={{ fontSize: 12, color: '#D85A30', background: '#FAECE7', padding: '6px 10px', borderRadius: 6, marginBottom: 6 }}>
              🗣️ <strong>Prononciation :</strong> {chapter.pronunciation}
            </div>
          )}
          {chapter.video_mp4 && (
            <div style={{ background: '#E1F5EE', border: '1px solid #1D9E75', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Video size={16} color="#1D9E75" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#085041' }}>{chapter.video_title}</span>
              </div>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{chapter.video_topic}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, background: '#fff', border: '0.5px solid #1D9E75', color: '#1D9E75', padding: '3px 8px', borderRadius: 6 }}>
                  📹 {chapter.video_mp4}
                </span>
                {chapter.video_pdf && (
                  <span style={{ fontSize: 11, background: '#fff', border: '0.5px solid #BA7517', color: '#BA7517', padding: '3px 8px', borderRadius: 6 }}>
                    📋 {chapter.video_pdf}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── A1 Unit Accordion (version précédente conservée) ─────────
function UnitAccordion({ unit, open, onToggle, currentUnit }) {
  const isCompleted = unit.id < currentUnit
  const isCurrent   = unit.id === currentUnit
  const isLocked    = unit.id > currentUnit + 1

  return (
    <div style={{ borderBottom: '0.5px solid #f3f4f6' }}>
      <div onClick={isLocked ? null : onToggle} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
          background: isCompleted ? '#E1F5EE' : isCurrent ? '#185FA5' : '#f3f4f6',
          color:      isCompleted ? '#1D9E75'  : isCurrent ? 'white'   : '#9ca3af',
        }}>
          {isCompleted ? <Check size={16} /> : isLocked ? <Lock size={14} /> : unit.id}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Unit {unit.id} — {unit.title}</span>
            {isCurrent && <span style={{ fontSize: 10, background: '#E6F1FB', color: '#185FA5', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>EN COURS</span>}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            {unit.grammar} · {unit.chapters.length} chapitres
          </div>
        </div>
        <div style={{ fontSize: 12, color: isCompleted ? '#1D9E75' : isCurrent ? '#185FA5' : '#9ca3af', fontWeight: 500 }}>
          {isCompleted ? '✓ Terminé' : isCurrent ? 'En cours' : '🔒'}
        </div>
      </div>

      {open && !isLocked && (
        <div style={{ paddingLeft: 48, paddingBottom: 12 }}>
          {unit.grammar_ref_pdf && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, color: '#534AB7' }}>
              <FileText size={14} /> Grammar Reference · {unit.grammar}
            </div>
          )}
          {unit.chapters.map((ch, i) => (
            <ChapterRow key={ch.id} chapter={ch} index={i} unitId={unit.id} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChapterRow({ chapter, index, unitId }) {
  const [expanded, setExpanded] = useState(false)
  const isDone   = index < 2
  const hasAudio = (chapter.mp3_cb?.length || 0) + (chapter.mp3_wb?.length || 0) > 0

  return (
    <div style={{ marginBottom: 4 }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', background: expanded ? '#f9fafb' : 'transparent' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDone ? '#E1F5EE' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDone ? <Check size={10} color="#1D9E75" /> : <span style={{ fontSize: 9, color: '#9ca3af' }}>{index + 1}</span>}
        </div>
        <span style={{ flex: 1, fontSize: 13, color: isDone ? '#374151' : '#6b7280' }}>{chapter.id} — {chapter.title}</span>
        {hasAudio  && <Volume2 size={12} color="#185FA5" />}
        {chapter.video && <Video size={12} color="#534AB7" />}
        {chapter.voxpops && <span style={{ fontSize: 10, background: '#FAEEDA', color: '#BA7517', padding: '1px 6px', borderRadius: 8 }}>Voxpops</span>}
        <FavoriteBtn id={`unit${unitId}_${chapter.id}`} />
      </div>
      {expanded && (
        <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
          {chapter.mp3_cb?.slice(0, 2).map(mp3 => (
            <AudioPlayer key={mp3} filename={mp3} title={`${chapter.title} — Coursebook`} subtitle={mp3} />
          ))}
          {chapter.mp3_wb?.slice(0, 1).map(mp3 => (
            <AudioPlayer key={mp3} filename={mp3} title={`${chapter.title} — Workbook`} subtitle={mp3} />
          ))}
          {chapter.video && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#EEEDFE', borderRadius: 8, fontSize: 13, color: '#534AB7' }}>
              <Video size={16} /> {chapter.video}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────
function ResourceCard({ icon, title, desc, color, textColor, progress }) {
  return (
    <div style={{ background: color, borderRadius: 12, padding: '1rem', cursor: 'pointer' }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 11, color: textColor + 'BB', marginBottom: 8 }}>{desc}</div>
      {progress > 0 && (
        <>
          <div style={{ height: 4, background: textColor + '33', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: textColor }} />
          </div>
          <div style={{ fontSize: 10, color: textColor, marginTop: 3, fontWeight: 500 }}>{progress}%</div>
        </>
      )}
    </div>
  )
}

function ProPaths() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Parcours professionnels</h3>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Anglais adapté à votre secteur d'activité</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        {PRO_PATHS.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, padding: '1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#185FA5'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{p.desc}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.units} modules · A1–B1</div>
          </div>
        ))}
      </div>
    </div>
  )
}
