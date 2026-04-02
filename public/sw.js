const CACHE_NAME = 'Dicte mon image-v1';
const urlsToCache = ['/manifest.json']; // on retire '/' du cache

self.addEventListener('install', (event) => {
  self.skipWaiting(); // active le nouveau SW immédiatement
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Supprime les vieux caches à chaque nouvelle version
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ne jamais intercepter les appels API ni les fichiers Next.js
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('/_next/')
  ) return;

  // Pour les pages HTML, toujours aller chercher sur le réseau en priorité
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Pour le reste (SVG, images...), cache en priorité
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});