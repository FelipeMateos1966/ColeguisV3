const CACHE_NAME = 'coleguis-cache-v1';
const URLS_TO_CACHE = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'images/icon-192x192.svg',
  'images/icon-512x512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  // No cachear la petición del iframe a la web externa
  if (event.request.url.startsWith('https://coleguis-7621540317.us-west1.run.app/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, lo devuelve
        if (response) {
          return response;
        }
        // Si no, hace fetch a la red
        return fetch(event.request)
          .then(networkResponse => {
            // No cachear respuestas que no sean OK, sean opacas o de tipo 'basic'
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Clonar la respuesta para poder guardarla en cache y devolverla
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});