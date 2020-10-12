const FILES_TO_CACHE = [
    '/',
    '/index.js',
    '/style.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/db.js'
  ];
  
  const CACHE1 = 'cache-v1';
  const RUNTIME = 'runtime_cache';
  
  self.addEventListener('install', (e) => {
    e.waitUntil(
      caches
        .open(CACHE1)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
  self.addEventListener('activate', (e) => {
    const currentCaches = [CACHE1, RUNTIME];
    e.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', (e) => {
    if (e.request.url.startsWith(self.location.origin)) {
      e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(e.request).then((response) => {
              return cache.put(e.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
  