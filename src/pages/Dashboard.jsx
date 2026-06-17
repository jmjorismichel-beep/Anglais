import useStore from '../lib/store.js';
import { MetricCard, ProgressBar, AudioPlayer, Alert, XPBar, LevelBadge, Card } from '../components/UI.jsx';
import { Flame, BookOpen, Play, ChevronRight, Award } from 'lucide-react';

const BADGES = [
  { id: 'first_lesson', label: 'Première leçon', icon: '🌟', earned: true },
  { id: 'streak_7', label: '7 jours', icon: '🔥', earned: true },
  { id: 'exercises_10', label: '10 exercices', icon: '🎯', earned: true },
  { id: 'pronunciation', label: 'Prononciation', icon: '🗣️', earned: true },
  { id: 'a1_complete', label: 'A1 complet', icon: '🏆', earned: false },
  { id: 'level_a2', label: 'Niveau A2', icon: '🚀', earned: false },
  { id: 'streak_30', label: '30 jours', icon: '💎', earned: false },
  { id: 'pro_path', label: 'Parcours pro', icon: '💼', earned: false },
];

const RECENT = [
  { label: 'Unit 3.2 — Possessions QCM', score: 90, date: "il y a 2h" },
  { label: 'Unit 3.1 — Grammaire fills', score: 75, date: "hier" },
  { label: 'Unit 2.4 — Speaking', score: 85, date: "il y a 2 jours" },
];

export function DashboardPage() {
  const { user, xp, streak, setPage } = useStore();
  const firstName = user?.firstName || 'apprenant·e';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Bonjour, {firstName} 👋</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Vous êtes au niveau <LevelBadge level="A1" /> — Unité 3 : People and possessions
        </p>
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FAEEDA', borderRadius: 10, padding: '12px 16px', marginBottom: '1.5rem' }}>
        <Flame size={22} color="#BA7517" />
        <span style={{ fontSize: 22, fontWeight: 700, color: '#BA7517' }}>{streak}</span>
        <span style={{ fontSize: 14, color: '#412402' }}>jours consécutifs — continuez comme ça !</span>
      </div>

      {/* Métriques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        <MetricCard label="Niveau actuel" value="A1" sub="Unité 3 / 5" color="#185FA5" />
        <MetricCard label="XP total" value={xp.toLocaleString()} sub="+80 aujourd'hui" color="#BA7517" />
        <MetricCard label="Exercices réussis" value="47" sub="85% de réussite" color="#1D9E75" />
        <MetricCard label="Temps total" value="14h" sub="Ce mois" color="#639922" />
      </div>

      {/* Progression A1-B1 + Calendrier */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={16} color="#185FA5" /> Progression A1–B1
          </h3>
          {[
            { level: 'A1', pct: 65, color: '#1D9E75', active: true },
            { level: 'A2', pct: 0, color: '#185FA5', active: false },
            { level: 'B1', pct: 0, color: '#534AB7', active: false },
          ].map(({ level, pct, color, active }) => (
            <div key={level} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <LevelBadge level={level} />
                <span style={{ color: active ? color : '#9ca3af', fontWeight: active ? 600 : 400 }}>
                  {active ? `${pct}%` : 'Verrouillé 🔒'}
                </span>
              </div>
              <ProgressBar value={active ? pct : 0} color={active ? (level==='A1'?'teal':level==='A2'?'blue':'purple') : 'gray'} />
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📅 Cette semaine</h3>
          <MiniCalendar />
          <div style={{ marginTop: 12 }}>
            <XPBar xp={xp} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              <span>Objectif quotidien</span>
              <span style={{ color: '#185FA5', fontWeight: 500 }}>80 / 100 XP</span>
            </div>
            <ProgressBar value={80} color="blue" />
          </div>
        </Card>
      </div>

      {/* Reprendre */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Play size={16} color="#185FA5" /> Reprendre là où vous vous êtes arrêté·e
        </h3>
        <AudioPlayer filename="03-04.mp3" title="Unit 3 — 3.2 Possessions — Dialogue" subtitle="Durée : 2 min 18 s · Leçon en cours" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => useStore.getState().setPage('exercises')}>
            ✏️ Continuer les exercices
          </button>
          <button className="btn-secondary" onClick={() => useStore.getState().setPage('modules')}>
            📚 Voir les modules
          </button>
        </div>
      </Card>

      {/* Résultats récents */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📊 Résultats récents</h3>
        {RECENT.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < RECENT.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: r.score >= 80 ? '#1D9E75' : '#BA7517' }}>{r.score}%</div>
              <ProgressBar value={r.score} color={r.score >= 80 ? 'teal' : 'amber'} height={3} />
            </div>
          </div>
        ))}
      </Card>

      {/* Badges */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Award size={16} color="#BA7517" /> Mes badges
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {BADGES.map(b => (
            <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 56 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: b.earned ? '#FAEEDA' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, filter: b.earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                {b.icon}
              </div>
              <span style={{ fontSize: 10, color: b.earned ? '#374151' : '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MiniCalendar() {
  const days = ['L','M','M','J','V','S','D'];
  const dates = [10,11,12,13,14,15,16];
  const today = 16;
  const done = [10,11,12,13,14,15];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6 }}>
        {days.map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', padding: '2px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {dates.map(d => {
          const isToday = d === today;
          const isDone = done.includes(d);
          return (
            <div key={d} style={{
              width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: isToday || isDone ? 600 : 400,
              background: isToday ? '#185FA5' : isDone ? '#E1F5EE' : 'transparent',
              color: isToday ? 'white' : isDone ? '#1D9E75' : '#9ca3af',
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}
