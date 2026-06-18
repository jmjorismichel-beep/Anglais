import { useEffect } from 'react'
import useStore from './lib/store.js'
import { Layout } from './components/Layout.jsx'
import { Notification } from './components/UI.jsx'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/Auth.jsx'
import { DashboardPage } from './pages/Dashboard.jsx'
import { ModulesPage } from './pages/Modules.jsx'
import { ExercisesPage } from './pages/Exercises.jsx'
import { PrintPage } from './pages/PrintPage.jsx'
import { TrainerPage } from './pages/TrainerPage.jsx'
import { PositioningPage, ProgressPage, AIPage, StatsPage, SettingsPage, HelpPage } from './pages/OtherPages.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}

const PAGES = {
  dashboard: DashboardPage, modules: ModulesPage, exercises: ExercisesPage,
  positioning: PositioningPage, progress: ProgressPage, ai: AIPage,
  trainer: TrainerPage, print: PrintPage, stats: StatsPage,
  settings: SettingsPage, help: HelpPage,
}

function AppContent() {
  const { currentPage } = useStore()
  const Page = PAGES[currentPage] || DashboardPage
  return <Layout><Page /></Layout>
}

export default function App() {
  const { isAuthenticated, authLoading, currentPage, initAuth, syncOfflineQueue, applySettings, settings } = useStore()

  useEffect(() => {
    const unsub = initAuth()
    return () => { if (typeof unsub === 'function') unsub() }
  }, [])

  useEffect(() => { if (settings) applySettings(settings) }, [])

  useEffect(() => {
    // Détecter le hash #access_token dans l'URL après clic sur lien email
    const hash = window.location.hash
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      // Supabase gère automatiquement la session via onAuthStateChange
      window.history.replaceState(null, '', window.location.pathname)
    }
    const handle = () => syncOfflineQueue()
    window.addEventListener('online', handle)
    return () => window.removeEventListener('online', handle)
  }, [])

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: '#185FA5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <span style={{ fontSize: 26, color: 'white' }}>📚</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#185FA5', marginBottom: 4 }}>EnglishPath</div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>Chargement…</div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E6F1FB', borderTop: '3px solid #185FA5', animation: 'spin 0.8s linear infinite', margin: '16px auto 0' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (!isAuthenticated) {
    // Détecter un lien de reset password
    if (window.location.hash.includes('type=recovery')) return <ResetPasswordPage />
    if (currentPage === 'register')     return <RegisterPage />
    if (currentPage === 'forgot')       return <ForgotPasswordPage />
    if (currentPage === 'reset')        return <ResetPasswordPage />
    return <LoginPage />
  }

  return <><Notification /><AppContent /></>
}
