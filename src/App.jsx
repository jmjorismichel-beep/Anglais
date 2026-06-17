import useStore from './lib/store.js';
import { Layout } from './components/Layout.jsx';
import { Notification } from './components/UI.jsx';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/Auth.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { ModulesPage } from './pages/Modules.jsx';
import { ExercisesPage } from './pages/Exercises.jsx';
import {
  PositioningPage, ProgressPage, AIPage,
  TrainerPage, PrintPage, StatsPage, SettingsPage, HelpPage
} from './pages/OtherPages.jsx';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function AppContent() {
  const { currentPage } = useStore();

  const pages = {
    dashboard: <DashboardPage />,
    modules: <ModulesPage />,
    exercises: <ExercisesPage />,
    positioning: <PositioningPage />,
    progress: <ProgressPage />,
    ai: <AIPage />,
    trainer: <TrainerPage />,
    print: <PrintPage />,
    stats: <StatsPage />,
    settings: <SettingsPage />,
    help: <HelpPage />,
  };

  return (
    <Layout>
      {pages[currentPage] || <DashboardPage />}
    </Layout>
  );
}

export default function App() {
  const { isAuthenticated, currentPage } = useStore();

  // Auth pages (no layout)
  if (!isAuthenticated) {
    if (currentPage === 'register') return <RegisterPage />;
    if (currentPage === 'forgot') return <ForgotPasswordPage />;
    return <LoginPage />;
  }

  return (
    <>
      <Notification />
      <AppContent />
    </>
  );
}
