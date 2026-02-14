// Nuclear Service Worker
// Designed to fix the 404 index.tsx loop by deleting old caches

const CACHE_NAME = 'mathgenius-cleanup-v2';

self.addEventListener('install', (event) => {
  // Activate immediately, do not wait
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // DELETE EVERYTHING
        console.log('[SW] Removing old cache', key);
        return caches.delete(key);
      }));
    }).then(() => {
      // Unregister self to ensure fresh start on next reload
      return self.registration.unregister();
    }).then(() => {
      // Force client reload
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
});