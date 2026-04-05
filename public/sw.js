// Stellar Math — Service Worker (manual fallback for non-PWA-plugin builds)
// The vite-plugin-pwa generates a better one at build time; this is a dev fallback.

const CACHE_NAME = 'stellar-math-v1'
const ASSETS = [
  '/',
  '/index.html',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))
        return response
      }).catch(() => caches.match('/'))
    })
  )
})
