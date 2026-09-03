const CACHE_STATIC = 'static-v11';
const CACHE_DYNAMIC = 'dynamic-v11';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './quiz.html',
  './highlights.html',
  './search/index.html',
  './search/search.html',
  './assets/css/binder.css',
  './assets/js/binder-shelf.js',
  './assets/css/quiz.css',
  './assets/js/quiz.js',
  './assets/css/toc-hud.css',
  './assets/js/toc-hud.js',
  './assets/css/highlighter.css',
  './assets/js/db.js',
  './assets/js/highlighter-engine.js',
  './assets/js/highlighter-toolbar.js',
  './assets/js/highlights-page.js',
  './assets/js/exporter.js',
  './assets/css/overlay-tools.css',
  './assets/js/overlay-tools.js',
  './search/search-worker.js',
  './search/thesaurus.json',
  './search/search-ui.js',
  './search/search.css'
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
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
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