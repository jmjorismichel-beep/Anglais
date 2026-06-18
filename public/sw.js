// EnglishPath Service Worker v3 — Mode hors ligne complet
const CACHE_VERSION = 'ep-v3'
const STATIC_CACHE  = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`
const API_CACHE     = `${CACHE_VERSION}-api`

// Fichiers essentiels mis en cache à l'installation
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
]

// ── Installation ──────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  )
})

// ── Activation — supprime les vieux caches ────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('ep-') && k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Stratégie de fetch ────────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Ignorer les requêtes non-GET et les extensions browser
  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  // Requêtes Supabase → Network first, fallback cache
  if (url.hostname.includes('supabase.co')) {
    e.respondWith(networkFirstWithCache(request, API_CACHE, 30))
    return
  }

  // Assets statiques (JS, CSS, fonts) → Cache first
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Pages HTML → Network first, fallback index.html
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(DYNAMIC_CACHE).then(c => c.put(request, clone))
          return res
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // Autres requêtes → Stale while revalidate
  e.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

// ── Helpers ───────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
    return response
  } catch {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirstWithCache(request, cacheName, timeoutSec) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutSec * 1000)
  try {
    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timeout)
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
    return response
  } catch {
    clearTimeout(timeout)
    const cached = await caches.match(request)
    return cached || new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetch(request).then(response => {
    cache.put(request, response.clone())
    return response
  }).catch(() => null)
  return cached || await networkPromise || new Response('Offline', { status: 503 })
}

// ── Sync en arrière-plan (Background Sync) ───────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'sync-progress') {
    e.waitUntil(syncOfflineQueue())
  }
})

async function syncOfflineQueue() {
  // Notifier les clients de synchroniser
  const clients = await self.clients.matchAll()
  clients.forEach(client => client.postMessage({ type: 'SYNC_PROGRESS' }))
}

// ── Push notifications ────────────────────────────────────────
self.addEventListener('push', e => {
  if (!e.data) return
  const data = e.data.json()
  e.waitUntil(
    self.registration.showNotification(data.title || 'EnglishPath', {
      body: data.body || 'Continuez votre apprentissage !',
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      tag: 'englishpath-reminder',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(
    clients.openWindow(e.notification.data?.url || '/')
  )
})

// ── Message depuis l'app ──────────────────────────────────────
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting()
  if (e.data?.type === 'CACHE_MODULES') {
    // Pré-cacher les modules demandés pour mode hors ligne
    const urls = e.data.urls || []
    caches.open(DYNAMIC_CACHE).then(cache => cache.addAll(urls))
  }
})
