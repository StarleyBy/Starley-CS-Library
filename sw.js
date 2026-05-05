const CACHE_NAME = 'cs-library-v1';

const APP_SHELL = [
  './',
  './index.html',
  './offline.html'
];

// Установка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch логика
self.addEventListener('fetch', event => {
  const request = event.request;

  // Только GET
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // Кешируем страницы (но не всё подряд)
        if (request.headers.get('accept')?.includes('text/html')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(res => {
          return res || caches.match('./offline.html');
        });
      })
  );
});
