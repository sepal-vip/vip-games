const CACHE_NAME = 'vip-offline-v2';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
   '/',
   '/index.html',
   '/offline.html',
   '/vip-icon.png',
   '/monoploy-icon.png'
];

// Install: Cache critical assets and offline fallback
self.addEventListener('install', (event) => {
   event.waitUntil(
     caches.open(CACHE_NAME).then((cache) => {
       return cache.addAll(ASSETS_TO_CACHE);
     })
   );
   self.skipWaiting();
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
   event.waitUntil(
     caches.keys().then((keys) => {
       return Promise.all(
         keys.map((key) => {
           if (key !== CACHE_NAME) {
             return caches.delete(key);
           }
         })
       );
     })
   );
   self.clients.claim();
});

// Fetch: Try network first; if connection drops, load offline.html
self.addEventListener('fetch', (event) => {
   if (event.request.mode === 'navigate') {
     event.respondWith(
       fetch(event.request).catch(() => {
         return caches.match(OFFLINE_URL);
       })
     );
   } else {
     event.respondWith(
       caches.match(event.request).then((cachedResponse) => {
         return cachedResponse || fetch(event.request);
       })
     );
   }
});