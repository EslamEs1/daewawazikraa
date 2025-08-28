const CACHE_NAME = 'memorial-page-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/bootstrap.rtl.min.css',
    '/bootstrap.bundle.min.js',
  '/manifest.json',
    '/images/background.jpg',
  '/images/fekD2AlzZmCJuF6KWCFe9NOfBA0TIF2wLg9HyNL9.jpg',
    '/images/11111.jpg',
  '/images/holy-quran.jpg',
  '/images/learn.png',
  '/images/البحث في الكتب الإسلامية والتراث الإسلامي.jpg',
  '/images/blanket-near-books-leaves (1).jpg',
  '/images/Tajweed rules.jpg',
  '/images/Hajj and Umrah.jpg',
  '/images/تفسير القرآن.jpg',
  '/images/الفقه الميسر في ضوء الكتاب والسنة.jpg',
  '/images/صم.png',
    '/audios/llmyt-__-alda-aldhy-swf-ysd-kl-myt-mn-ahbayk-__-sdqt-jaryt-__-alqary-bdaljlyl-alznaty-192-kbps.lite.mp3',
    '/audios/azkar-morning.lite.mp3',
    '/audios/azkar-night.lite.mp3'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
                return fetch(event.request);
            }
        )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 