import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// Vider l'ancien cache Service Worker au démarrage
// C'est ce qui causait la page blanche hors navigation privée
async function clearOldCaches() {
  if ('caches' in window) {
    const keys = await caches.keys()
    // Supprimer tous les anciens caches (pas la version actuelle)
    const CURRENT = 'ep-v3'
    await Promise.all(
      keys
        .filter(k => !k.startsWith(CURRENT))
        .map(k => {
          console.log('[SW] Suppression ancien cache:', k)
          return caches.delete(k)
        })
    )
  }
}

// Demander au SW de se mettre à jour immédiatement
async function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      // Forcer la mise à jour
      await reg.update()
      // Si un nouveau SW attend, l'activer immédiatement
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        // Recharger après activation
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        }, { once: true })
      }
    }
  }
}

// Initialiser
clearOldCaches()
updateServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
