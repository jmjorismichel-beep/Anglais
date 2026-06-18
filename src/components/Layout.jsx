import { useState, useEffect } from 'react'
import useStore from '../lib/store.js'
import {
  BookOpen, LayoutDashboard, BookMarked, Pencil, Users, BarChart3,
  Printer, Bot, Target, Settings, LogOut, HelpCircle, Wifi, WifiOff,
  Bell, MessageSquare, ChevronRight, Award, TrendingUp
} from 'lucide-react'

// Navigation stagiaire
const LEARNER_NAV = [
  { id: 'dashboard',   label: 'Tableau de bord',       icon: LayoutDashboard, section: 'main'     },
  { id: 'modules',     label: 'Mes modules',            icon: BookMarked,      section: 'main'     },
  { id: 'exercises',   label: 'Exercices',              icon: Pencil,          section: 'main', badge: '3' },
  { id: 'positioning', label: 'Test de positionnement', icon: Target,          section: 'main'     },
  { id: 'progress',    label: 'Ma progression',         icon: TrendingUp,      section: 'main'     },
  { id: 'ai',          label: 'Assistant IA',           icon: Bot,             section: 'main'     },
  { id: 'settings',    label: 'Paramètres',             icon: Settings,        section: 'account'  },
  { id: 'help',        label: 'J\'ai besoin d\'aide',   icon: HelpCircle,      section: 'account'  },
]

// Navigation formateur
const TRAINER_NAV = [
  { id: 'trainer',   label: 'Mes groupes',    icon: Users,       section: 'main', badge: null },
  { id: 'stats',     label: 'Statistiques',   icon: BarChart3,   section: 'main'             },
  { id: 'print',     label: 'Imprimer',       icon: Printer,     section: 'main'             },
  { id: 'ai',        label: 'Assistant IA',   icon: Bot,         section: 'main'             },
  { id: 'modules',   label: 'Bibliothèque',   icon: BookMarked,  section: 'resources'        },
  { id: 'exercises', label: 'Exercices',      icon: Pencil,      section: 'resources'        },
  { id: 'settings',  label: 'Paramètres',     icon: Settings,    section: 'account'          },
  { id: 'help',      label: 'Aide',           icon: HelpCircle,  section: 'account'          },
]

// Nav mobile stagiaire
const LEARNER_BOTTOM = [
  { id: 'dashboard', label: 'Accueil',   icon: LayoutDashboard },
  { id: 'modules',   label: 'Modules',   icon: BookMarked      },
  { id: 'exercises', label: 'Exercices', icon: Pencil          },
  { id: 'progress',  label: 'Progrès',   icon: TrendingUp      },
  { id: 'ai',        label: 'IA',        icon: Bot             },
]

// Nav mobile formateur
const TRAINER_BOTTOM = [
  { id: 'trainer',  label: 'Groupes',  icon: Users      },
  { id: 'stats',    label: 'Stats',    icon: BarChart3  },
  { id: 'print',    label: 'Imprimer', icon: Printer    },
  { id: 'ai',       label: 'IA',       icon: Bot        },
  { id: 'settings', label: 'Compte',   icon: Settings   },
]

export function Layout({ children }) {
  const { currentPage, setPage, user, profile, logout } = useStore()
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  // Déterminer le rôle
  const role      = profile?.role || 'learner'
  const isTrainer = role === 'trainer'
  const navItems  = isTrainer ? TRAINER_NAV  : LEARNER_NAV
  const bottomNav = isTrainer ? TRAINER_BOTTOM : LEARNER_BOTTOM

  const firstName = profile?.first_name || user?.firstName || ''
  const lastName  = profile?.last_name  || user?.lastName  || ''
  const initials  = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U'
  const center    = profile?.center || ''

  // Couleur selon rôle
  const roleColor  = isTrainer ? '#185FA5' : '#1D9E75'
  const roleBg     = isTrainer ? '#E6F1FB' : '#E1F5EE'
  const roleLabel  = isTrainer ? '👨‍🏫 Formateur' : '🎓 Stagiaire'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e5e7eb', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: roleColor, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: roleColor }}>EnglishPath</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>
              {isTrainer ? (center || 'Espace formateur') : 'Programme Navigate A1–B1+'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Badge rôle */}
          <div style={{ display: 'none', alignItems: 'center', gap: 4, background: roleBg, color: roleColor, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }} className="hide-mobile">
            {roleLabel}
          </div>

          {/* Statut connexion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: online ? '#1D9E75' : '#D85A30' }}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span className="hide-mobile">{online ? 'En ligne' : 'Hors ligne'}</span>
          </div>

          {/* Avatar */}
          {user && (
            <div onClick={() => setPage('settings')} style={{ width: 32, height: 32, borderRadius: '50%', background: roleBg, color: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `2px solid ${roleColor}22` }}>
              {initials}
            </div>
          )}
        </div>
      </nav>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar desktop */}
        <aside className="sidebar" style={{ width: 220, minWidth: 220, background: '#fff', borderRight: '0.5px solid #e5e7eb', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>

          {/* Profil utilisateur */}
          <div style={{ padding: '8px 10px 14px', marginBottom: 4, borderBottom: '0.5px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: roleBg, color: roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {firstName} {lastName}
                </div>
                <div style={{ fontSize: 10, background: roleBg, color: roleColor, padding: '1px 6px', borderRadius: 8, display: 'inline-block', fontWeight: 600, marginTop: 2 }}>
                  {roleLabel}
                </div>
              </div>
            </div>
            {isTrainer && center && (
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 6, paddingLeft: 44 }}>{center}</div>
            )}
          </div>

          {/* Navigation principale */}
          <SidebarSection label={isTrainer ? 'Mes apprenants' : 'Mon apprentissage'} />
          {navItems.filter(i => i.section === 'main').map(item => (
            <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} roleColor={roleColor} />
          ))}

          {isTrainer && (
            <>
              <SidebarSection label="Ressources" />
              {navItems.filter(i => i.section === 'resources').map(item => (
                <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} roleColor={roleColor} />
              ))}
            </>
          )}

          <SidebarSection label="Compte" />
          {navItems.filter(i => i.section === 'account').map(item => (
            <SidebarItem key={item.id} item={item} active={currentPage === item.id} onClick={() => setPage(item.id)} roleColor={roleColor} />
          ))}

          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, fontSize: 13, color: '#D85A30', cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', marginTop: 8 }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </aside>

        {/* Contenu principal */}
        <main className="content" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', paddingBottom: '5rem' }}>
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="bottom-nav">
        {bottomNav.map(item => {
          const Icon = item.icon
          return (
            <button key={item.id} className={`bottom-nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)} aria-label={item.label}
              style={{ '--role-color': roleColor }}>
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function SidebarSection({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 10px 4px' }}>{label}</div>
}

function SidebarItem({ item, active, onClick, roleColor }) {
  const Icon = item.icon
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8, fontSize: 13,
      cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left',
      background: active ? `${roleColor}18` : 'none',
      color: active ? roleColor : '#6b7280',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.12s',
    }}>
      <Icon size={16} style={{ width: 18, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{ background: roleColor, color: 'white', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>
          {item.badge}
        </span>
      )}
    </button>
  )
}
