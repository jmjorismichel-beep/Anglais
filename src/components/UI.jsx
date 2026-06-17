import { useState } from 'react';
import { Check, X, Star, Lock, ChevronRight, Volume2, Heart, BookOpen } from 'lucide-react';
import useStore from '../lib/store.js';

// ─── ProgressBar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#185FA5', height = 6, className = '' }) {
  const colors = { blue: '#185FA5', teal: '#1D9E75', amber: '#BA7517', coral: '#D85A30', green: '#639922', purple: '#534AB7' };
  const fill = colors[color] || color;
  return (
    <div className={`progress-bar ${className}`} style={{ height }}>
      <div className="progress-fill" style={{ width: `${Math.min(100, value)}%`, background: fill }} />
    </div>
  );
}

// ─── Badge niveau ────────────────────────────────────────────────────────────
export function LevelBadge({ level }) {
  const map = { A1: 'badge-a1', A2: 'badge-a2', B1: 'badge-b1', 'B1+': 'badge-b1plus', TELC: 'badge-telc' };
  return <span className={`badge ${map[level] || 'badge-a1'}`}>{level}</span>;
}

// ─── Notification toast ──────────────────────────────────────────────────────
export function Notification() {
  const { notification } = useStore();
  if (!notification) return null;
  const colors = { success: '#1D9E75', error: '#D85A30', info: '#185FA5', warning: '#BA7517' };
  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 1000,
      background: colors[notification.type] || colors.success,
      color: 'white', padding: '10px 18px', borderRadius: 10,
      fontSize: 14, fontWeight: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      animation: 'fadeIn 0.2s ease',
    }}>
      {notification.msg}
    </div>
  );
}

// ─── MetricCard ──────────────────────────────────────────────────────────────
export function MetricCard({ label, value, sub, color = '#185FA5' }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color }}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', style = {} }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

// ─── AudioPlayer ─────────────────────────────────────────────────────────────
export function AudioPlayer({ filename, title, subtitle }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const toggle = () => {
    setPlaying(p => !p);
    if (!playing) {
      const iv = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(iv); setPlaying(false); return 0; }
          return p + 2;
        });
      }, 150);
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#E6F1FB', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
      <button onClick={toggle} aria-label={playing ? 'Pause' : 'Lire'} style={{ width: 36, height: 36, borderRadius: '50%', background: '#185FA5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
        {playing ? '⏸' : '▶'}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#185FA5' }}>{title || filename}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#6b7280' }}>{subtitle}</div>}
        <div style={{ height: 3, background: 'rgba(24,95,165,0.2)', borderRadius: 2, marginTop: 6 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#185FA5', borderRadius: 2, transition: 'width 0.15s' }} />
        </div>
      </div>
      <Volume2 size={16} style={{ color: '#185FA5', flexShrink: 0 }} />
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: '#f3f4f6', padding: 3, borderRadius: 8, marginBottom: 16 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: '8px 4px', textAlign: 'center', fontSize: 13, borderRadius: 6,
          cursor: 'pointer', border: 'none', transition: 'all 0.12s',
          background: active === t.id ? '#fff' : 'none',
          color: active === t.id ? '#1a1a1a' : '#6b7280',
          fontWeight: active === t.id ? 500 : 400,
          boxShadow: active === t.id ? '0 0.5px 2px rgba(0,0,0,0.08)' : 'none',
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ initials, size = 32, color = '#E6F1FB', textColor = '#185FA5' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 500, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  const colors = {
    info: { bg: '#E6F1FB', border: '#185FA5', text: '#042C53' },
    warning: { bg: '#FAEEDA', border: '#BA7517', text: '#412402' },
    danger: { bg: '#FAECE7', border: '#D85A30', text: '#4A1B0C' },
    success: { bg: '#E1F5EE', border: '#1D9E75', text: '#04342C' },
  };
  const c = colors[type];
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: c.bg, borderLeft: `3px solid ${c.border}`, marginBottom: 12 }}>
      <div style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 24, color = '#185FA5' }) {
  return (
    <div style={{ width: size, height: size, border: `2px solid ${color}22`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── StarRating ──────────────────────────────────────────────────────────────
export function StarRating({ score }) {
  const stars = Math.round(score / 20);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} fill={i <= stars ? '#BA7517' : 'none'} color={i <= stars ? '#BA7517' : '#d1d5db'} />
      ))}
    </div>
  );
}

// ─── FavoriteBtn ─────────────────────────────────────────────────────────────
export function FavoriteBtn({ id }) {
  const { favorites, toggleFavorite } = useStore();
  const isFav = favorites.includes(id);
  return (
    <button onClick={() => toggleFavorite(id)} aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
      <Heart size={18} fill={isFav ? '#D85A30' : 'none'} color={isFav ? '#D85A30' : '#9ca3af'} />
    </button>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{description}</div>
      {action}
    </div>
  );
}

// ─── LockedOverlay ───────────────────────────────────────────────────────────
export function LockedMessage({ message = 'Terminez le niveau précédent pour débloquer ce contenu' }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 12, padding: '2.5rem', textAlign: 'center' }}>
      <Lock size={32} style={{ color: '#9ca3af', marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Contenu verrouillé</div>
      <div style={{ fontSize: 13, color: '#6b7280' }}>{message}</div>
    </div>
  );
}

// ─── XP Bar ──────────────────────────────────────────────────────────────────
export function XPBar({ xp }) {
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const pct = Math.round((xpInLevel / 200) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
        <span>Niveau {level}</span>
        <span>{xpInLevel} / 200 XP</span>
      </div>
      <ProgressBar value={pct} color="blue" />
    </div>
  );
}
