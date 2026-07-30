const CACHE = 's-korean-v1';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './css/style.css',
  './css/flower.css',
  './js/data.js',
  './js/app.js',
  './js/phonics.js',
  './js/vocabulary.js',
  './js/speaking.js',
  './js/dialogue.js',
  './js/drama.js',
  './js/flower.js',
  './js/dashboard.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // 同源资源：缓存优先，缺失再网络并回填
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // 跨域资源（如 Chart.js）：网络优先，失败回退缓存
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
