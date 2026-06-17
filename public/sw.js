const CACHE_NAME = 'englishpath-v1';
const STATIC = ['/', '/index.html'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))));
