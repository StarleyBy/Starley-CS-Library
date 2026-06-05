const CACHE_STATIC = 'static-v3';
const CACHE_DYNAMIC = 'dynamic-v3';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.json'
];

// Установка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch стратегия
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  // 📚 PDF и документы → cache first
  if (req.url.includes('.pdf')) {
    event.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(res => {
          return caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(req, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  // 🌐 HTML → network first
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_DYNAMIC).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => {
          return caches.match(req).then(res => {
            return res || caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // 📦 Остальное → cache fallback
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req);
    })
  );
});
