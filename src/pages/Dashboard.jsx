import useStore from '../lib/store.js';
import { MetricCard, ProgressBar, AudioPlayer, Alert, XPBar, LevelBadge, Card } from '../components/UI.jsx';
import { Flame, BookOpen, Play, ChevronRight, Award } from 'lucide-react';

export function DashboardPage() {
  const { user, profile, xp, streak, setPage } = useStore();
  const firstName = profile?.first_name || user?.firstName || 'apprenant·e';

  // Données réelles du profil (avec valeurs par défaut à zéro pour un nouveau compte)
  const exercisesDone   = profile?.exercises_done   ?? 0;
  const successRate     = profile?.success_rate     ?? 0;
  const totalTimeHours  = profile?.total_time_hours ?? 0;
  const currentLevel    = profile?.level            ?? 'A1';
  const currentUnit     = profile?.current_unit     ?? 1;
  const a1Progress      = profile?.a1_progress      ?? 0;
  const a2Progress      = profile?.a2_progress      ?? 0;
  const b1Progress      = profile?.b1_progress      ?? 0;
  const recentResults   = profile?.recent_results   ?? [];
  const earnedBadgeIds  = profile?.badges           ?? [];
  const doneDays        = profile?.done_days        ?? []; // jours du mois où l'utilisateur a été actif

  const BADGES = [
    { id: 'first_lesson', label: 'Première leçon', icon: '🌟' },
    { id: 'streak_7', label: '7 jours', icon: '🔥' },
    { id: 'exercises_10', label: '10 exercices', icon: '🎯' },
    { id: 'pronunciation', label: 'Prononciation', icon: '🗣️' },
    { id: 'a1_complete', label: 'A1 complet', icon: '🏆' },
    { id: 'level_a2', label: 'Niveau A2', icon: '🚀' },
    { id: 'streak_30', label: '30 jours', icon: '💎' },
    { id: 'pro_path', label: 'Parcours pro', icon: '💼' },
  ].map(b => ({ ...b, earned: earnedBadgeIds.includes(b.id) }));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600 }}>Bonjour, {firstName} 👋</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          Vous êtes au niveau <LevelBadge level={currentLevel} /> — Unité {currentUnit}
        </p>
      </div>

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FAEEDA', borderRadius: 10, padding: '12px 16px', marginBottom: '1.5rem' }}>
        <Flame size={22} color="#BA7517" />
        <span style={{ fontSize: 22, fontWeight: 700, color: '#BA7517' }}>{streak}</span>
        <span style={{ fontSize: 14, color: '#412402' }}>
          {streak > 0 ? 'jours consécutifs — continuez comme ça !' : "Commencez votre première leçon aujourd'hui !"}
        </span>
      </div>

      {/* Métriques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        <MetricCard label="Niveau actuel" value={currentLevel} sub={`Unité ${currentUnit} / 5`} color="#185FA5" />
        <MetricCard label="XP total" value={xp.toLocaleString()} sub={xp > 0 ? "Continuez !" : "Démarrez votre parcours"} color="#BA7517" />
        <MetricCard label="Exercices réussis" value={String(exercisesDone)} sub={exercisesDone > 0 ? `${successRate}% de réussite` : "Aucun exercice encore"} color="#1D9E75" />
        <MetricCard label="Temps total" value={`${totalTimeHours}h`} sub="Ce mois" color="#639922" />
      </div>

      {/* Progression A1-B1 + Calendrier */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={16} color="#185FA5" /> Progression A1–B1
          </h3>
          {[
            { level: 'A1', pct: a1Progress, color: '#1D9E75', active: currentLevel === 'A1' || a1Progress > 0 },
            { level: 'A2', pct: a2Progress, color: '#185FA5', active: currentLevel === 'A2' || a2Progress > 0 },
            { level: 'B1', pct: b1Progress, color: '#534AB7', active: currentLevel === 'B1' || b1Progress > 0 },
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
          <MiniCalendar doneDays={doneDays} />
          <div style={{ marginTop: 12 }}>
            <XPBar xp={xp} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginTop: 6 }}>
              <span>Objectif quotidien</span>
              <span style={{ color: '#185FA5', fontWeight: 500 }}>{Math.min(xp, 100)} / 100 XP</span>
            </div>
            <ProgressBar value={Math.min(xp, 100)} color="blue" />
          </div>
        </Card>
      </div>

      {/* Reprendre */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Play size={16} color="#185FA5" /> {exercisesDone > 0 ? 'Reprendre là où vous vous êtes arrêté·e' : 'Commencer votre apprentissage'}
        </h3>
        {exercisesDone > 0 ? (
          <AudioPlayer filename="03-04.mp3" title="Unit 3 — 3.2 Possessions — Dialogue" subtitle="Durée : 2 min 18 s · Leçon en cours" />
        ) : (
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
            Vous n'avez pas encore commencé d'exercice. C'est le moment idéal pour démarrer !
          </p>
        )}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => useStore.getState().setPage('exercises')}>
            ✏️ {exercisesDone > 0 ? 'Continuer les exercices' : 'Commencer les exercices'}
          </button>
          <button className="btn-secondary" onClick={() => useStore.getState().setPage('modules')}>
            📚 Voir les modules
          </button>
        </div>
      </Card>

      {/* Résultats récents */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📊 Résultats récents</h3>
        {recentResults.length === 0 ? (
          <p style={{ fontSize: 13, color: '#9ca3af' }}>Aucun résultat pour le moment. Vos derniers exercices apparaîtront ici.</p>
        ) : (
          recentResults.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < recentResults.length - 1 ? '0.5px solid #f3f4f6' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: r.score >= 80 ? '#1D9E75' : '#BA7517' }}>{r.score}%</div>
                <ProgressBar value={r.score} color={r.score >= 80 ? 'teal' : 'amber'} height={3} />
              </div>
            </div>
          ))
        )}
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

function MiniCalendar({ doneDays = [] }) {
  const days = ['L','M','M','J','V','S','D'];
  const today = new Date().getDate();
  // Génère les 7 jours autour d'aujourd'hui pour l'affichage
  const dates = Array.from({ length: 7 }, (_, i) => today - (today % 7) + i + 1).filter(d => d > 0 && d <= 31);

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
          const isDone = doneDays.includes(d);
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
