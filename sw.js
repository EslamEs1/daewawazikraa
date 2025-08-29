const CACHE_NAME = 'memorial-page-v2';
const STATIC_CACHE = 'static-cache-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './bootstrap.rtl.min.css',
  './bootstrap.bundle.min.js',
  './manifest.json',
  './local-storage.js',
  './hesn_buttons.js',
  './hesn_audio_files.js',
  './images/11111.jpg',
  './images/fekD2AlzZmCJuF6KWCFe9NOfBA0TIF2wLg9HyNL9.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation completed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network and cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For HTML requests - use network-first strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match('./index.html');
            });
        })
    );
    return;
  }
  
  // For image, CSS, JS - use cache-first strategy
  if (
    event.request.destination === 'image' || 
    event.request.destination === 'style' || 
    event.request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Clone the response
              const responseToCache = response.clone();
              
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
    return;
  }
  
  // For all other requests - use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update the cache
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.log('[Service Worker] Fetch failed:', error);
          });
        
        // Return the cached response immediately, or wait for network
        return cachedResponse || fetchPromise;
      })
  );
}); 