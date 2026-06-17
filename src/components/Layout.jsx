import useStore from '../lib/store.js';
import { BookOpen, LayoutDashboard, BookMarked, Pencil, Users, BarChart3, Printer, Bot, Target, Settings, LogOut, HelpCircle, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, section: 'learner' },
  { id: 'modules', label: 'Mes modules', icon: BookMarked, section: 'learner' },
  { id: 'exercises', label: 'Exercices', icon: Pencil, badge: '3', section: 'learner' },
  { id: 'positioning', label: 'Test de positionnement', icon: Target, section: 'learner' },
  { id: 'progress', label: 'Ma progression', icon: BarChart3, section: 'learner' },
  { id: 'ai', label: 'Assistant IA', icon: Bot, section: 'learner' },
  { id: 'trainer', label: 'Mes groupes', icon: Users, badge: '2', badgeColor: '#BA7517', section: 'trainer' },
  { id: 'print', label: 'Imprimer', icon: Printer, section: 'trainer' },
  { id: 'stats', label: 'Statistiques', icon: BarChart3, section: 'trainer' },
  { id: 'settings', label: 'Paramètres', icon: Settings, section: 'settings' },
];

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'modules', label: 'Modules', icon: BookMarked },
  { id: 'exercises', label: 'Exercices', icon: Pencil },
  { id: 'ai', label: 'IA', icon: Bot },
  { id: 'trainer', label: 'Formateur', icon: Users },
];

export function Layout({ children }) {
  const { currentPage, setPage, user, logout } = useStore();
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e5e7eb', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#185FA5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#185FA5' }}>EnglishPath</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>Programme Navigate A1–B1</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Online/Offline indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: online ? '#1D9E75' : '#D85A30' }}>
            {online ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="hide-mobile">{online ? 'En ligne' : 'Hors ligne'}</span>
          </div>

          {user && (
            <>
              <span style={{ fontSize: 13, color: '#6b7280' }} className="hide-mobile">
                {user.firstName} {user.lastName}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB', color: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => setPage('settings')}>
                {initials}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar desktop */}
        <aside className="sidebar" style={{ width: 220, minWidth: 220, background: '#fff', borderRight: '0.5px solid #e5e7eb', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>

          <SidebarSection label="Apprenant" />
          {NAV_ITEMS.filter(i => i.section === 'learner').map(item => (
            <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} />
          ))}

          <SidebarSection label="Formateur" />
          {NAV_ITEMS.filter(i => i.section === 'trainer').map(item => (
            <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} />
          ))}

          <SidebarSection label="Compte" />
          {NAV_ITEMS.filter(i => i.section === 'settings').map(item => (
            <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} />
          ))}

          <button onClick={() => { setPage('help'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13, color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            <HelpCircle size={16} /> J'ai besoin d'aide
          </button>

          {user && (
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13, color: '#D85A30', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', marginTop: 8 }}>
              <LogOut size={16} /> Déconnexion
            </button>
          )}
        </aside>

        {/* Main content */}
        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', paddingBottom: '2rem' }}>
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="bottom-nav">
        {BOTTOM_NAV.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`bottom-nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)} aria-label={item.label}>
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarSection({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem 0.5rem 0.4rem' }}>{label}</div>;
}

function SidebarItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8, fontSize: 13,
      cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
      background: active ? '#E6F1FB' : 'none',
      color: active ? '#185FA5' : '#6b7280',
      fontWeight: active ? 500 : 400,
      transition: 'background 0.12s',
    }}>
      <Icon size={16} style={{ width: 18, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{ background: item.badgeColor || '#185FA5', color: 'white', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}
