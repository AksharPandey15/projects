// public/sw.js
const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/' // Cache the main page too if needed
];

// Install event: cache the offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, caching offline page');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => console.error('Caching failed', err))
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if it's a navigation request
  // that fails
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If fetch fails, return the offline page from the cache
        return caches.match(OFFLINE_URL);
      })
    );
  }
  // For other requests (images, scripts), you can implement a different caching strategy
});

// Activate event: clean up old caches (optional but recommended)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
