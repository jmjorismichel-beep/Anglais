import { useState } from 'react';
import { UNITS, PRO_PATHS } from '../data/courseData.js';
import { Tabs, LevelBadge, ProgressBar, AudioPlayer, Card, LockedMessage, FavoriteBtn } from '../components/UI.jsx';
import { Lock, Check, Play, FileText, Volume2, Video, BookOpen, ChevronRight } from 'lucide-react';
import useStore from '../lib/store.js';

const LEVEL_TABS = [
  { id: 'A1', label: 'A1 — Débutant' },
  { id: 'A2', label: 'A2 — Élémentaire' },
  { id: 'B1', label: 'B1 — Intermédiaire' },
  { id: 'pro', label: '💼 Parcours pro' },
];

export function ModulesPage() {
  const [level, setLevel] = useState('A1');
  const [openUnit, setOpenUnit] = useState(3);
  const { setPage, progress, favorites } = useStore();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Modules pédagogiques</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Programme Navigate A1–B1 · Coursebook + Workbook + Grammar Reference + Vidéos
        </p>
      </div>

      <Tabs tabs={LEVEL_TABS} active={level} onChange={setLevel} />

      {level === 'A1' && (
        <div>
          {/* Ressources globales A1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            <ResourceCard icon="🎧" title="Compréhension orale" desc="31 fichiers MP3 units 1–5" color="#E6F1FB" textColor="#185FA5" progress={55} />
            <ResourceCard icon="📖" title="Grammar Reference" desc="5 PDF + 8 MP3 explicatifs" color="#EEEDFE" textColor="#534AB7" progress={40} />
            <ResourceCard icon="🎬" title="Vidéos & Voxpops" desc="5 vidéos + témoignages authentiques" color="#E1F5EE" textColor="#1D9E75" progress={20} />
            <ResourceCard icon="📝" title="Corrigés formateur" desc="Workbook + Coursebook" color="#FAEEDA" textColor="#BA7517" progress={65} />
          </div>

          {/* Unités */}
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Unités A1 — Navigate</h3>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>Cliquez sur une unité pour voir les chapitres</p>
            {UNITS.A1.map(unit => (
              <UnitAccordion key={unit.id} unit={unit} open={openUnit === unit.id} onToggle={() => setOpenUnit(openUnit === unit.id ? null : unit.id)} currentUnit={3} />
            ))}
          </Card>
        </div>
      )}

      {level === 'A2' && <LockedMessage message="Terminez toutes les unités A1 pour débloquer le niveau A2" />}
      {level === 'B1' && <LockedMessage message="Terminez les niveaux A1 et A2 pour débloquer le niveau B1" />}
      {level === 'pro' && <ProPaths />}
    </div>
  );
}

function ResourceCard({ icon, title, desc, color, textColor, progress }) {
  return (
    <div style={{ background: color, borderRadius: 12, padding: '1rem', cursor: 'pointer' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: textColor, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11, color: textColor + 'BB', marginBottom: 8 }}>{desc}</div>
      <div style={{ height: 4, background: textColor + '33', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: textColor, transition: 'width 0.4s' }} />
      </div>
      <div style={{ fontSize: 10, color: textColor, marginTop: 3, fontWeight: 500 }}>{progress}%</div>
    </div>
  );
}

function UnitAccordion({ unit, open, onToggle, currentUnit }) {
  const isCompleted = unit.id < currentUnit;
  const isCurrent = unit.id === currentUnit;
  const isLocked = unit.id > currentUnit + 1;

  return (
    <div style={{ borderBottom: '0.5px solid #f3f4f6' }}>
      <div onClick={isLocked ? null : onToggle} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: isLocked ? 'not-allowed' : 'pointer' }}>
        {/* Status circle */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
          background: isCompleted ? '#E1F5EE' : isCurrent ? '#185FA5' : '#f3f4f6',
          color: isCompleted ? '#1D9E75' : isCurrent ? 'white' : '#9ca3af',
        }}>
          {isCompleted ? <Check size={16} /> : isLocked ? <Lock size={14} /> : unit.id}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Unit {unit.id} — {unit.title}</span>
            {isCurrent && <span style={{ fontSize: 10, background: '#E6F1FB', color: '#185FA5', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>EN COURS</span>}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            {unit.grammar} · {unit.chapters.length} chapitres
          </div>
        </div>

        <div style={{ fontSize: 12, color: isCompleted ? '#1D9E75' : isCurrent ? '#185FA5' : '#9ca3af', fontWeight: 500 }}>
          {isCompleted ? '✓ Terminé' : isCurrent ? `${[...Array(unit.chapters.length)].filter((_,i)=>i<2).length}/${unit.chapters.length}` : '🔒'}
        </div>
      </div>

      {open && !isLocked && (
        <div style={{ paddingLeft: 48, paddingBottom: 12 }}>
          {/* Grammar reference */}
          {unit.grammar_ref_pdf && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, color: '#534AB7' }}>
              <FileText size={14} /> Grammar Reference PDF · {unit.grammar}
            </div>
          )}
          {/* Chapters */}
          {unit.chapters.map((ch, i) => (
            <ChapterRow key={ch.id} chapter={ch} index={i} unitId={unit.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChapterRow({ chapter, index, unitId }) {
  const [expanded, setExpanded] = useState(false);
  const isDone = index < 2;
  const hasAudio = (chapter.mp3_cb?.length || 0) + (chapter.mp3_wb?.length || 0) > 0;

  return (
    <div style={{ marginBottom: 4 }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, cursor: 'pointer', background: expanded ? '#f9fafb' : 'transparent', transition: 'background 0.12s' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDone ? '#E1F5EE' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDone ? <Check size={10} color="#1D9E75" /> : <span style={{ fontSize: 9, color: '#9ca3af' }}>{index+1}</span>}
        </div>
        <span style={{ flex: 1, fontSize: 13, color: isDone ? '#374151' : '#6b7280' }}>{chapter.id} — {chapter.title}</span>
        {hasAudio && <Volume2 size={12} color="#185FA5" />}
        {chapter.video && <Video size={12} color="#534AB7" />}
        {chapter.voxpops && <span style={{ fontSize: 10, background: '#FAEEDA', color: '#BA7517', padding: '1px 6px', borderRadius: 8 }}>Voxpops</span>}
        <FavoriteBtn id={`unit${unitId}_${chapter.id}`} />
      </div>
      {expanded && (
        <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
          {chapter.mp3_cb?.slice(0,2).map(mp3 => (
            <AudioPlayer key={mp3} filename={mp3} title={`${chapter.title} — Coursebook`} subtitle={mp3} />
          ))}
          {chapter.mp3_wb?.slice(0,1).map(mp3 => (
            <AudioPlayer key={mp3} filename={mp3} title={`${chapter.title} — Workbook`} subtitle={mp3} />
          ))}
          {chapter.video && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#EEEDFE', borderRadius: 8, fontSize: 13, color: '#534AB7' }}>
              <Video size={16} /> {chapter.video} — Vidéo pédagogique
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProPaths() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Parcours professionnels</h3>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Anglais adapté à votre secteur d'activité</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {PRO_PATHS.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, padding: '1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#185FA5'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{p.desc}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.units} modules · Niveau A1–B1</div>
          </div>
        ))}
      </div>
    </div>
  );
}
