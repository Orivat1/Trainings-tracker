// Service Worker: Offline zuerst. Die App startet sofort aus dem Cache, auch ohne Netz im Gym,
// und holt sich Aktualisierungen still im Hintergrund.
// Bei Änderungen an der App die Versionsnummer erhöhen: Dann lädt der neue Worker alles frisch
// und die geöffnete App wechselt beim nächsten ruhigen Moment auf die neue Version.
// Alles kommt von der eigenen Adresse (auch die Schrift), es werden keine fremden Server abgefragt.
const CACHE = 'training-v38';
const FILES = [
  './',
  './index.html',
  './manifest.json?v=2',
  './icons/icon-192.png?v=2',
  './icons/icon-512.png?v=2',
  './icons/apple-touch-icon.png?v=2',
  './fonts/geist-latin.woff2',
  './fonts/geist-latin-ext.woff2',
  './fonts/geist-mono-latin.woff2',
  './fonts/geist-mono-latin-ext.woff2'
];

self.addEventListener('install', e => {
  // cache: 'reload' umgeht den HTTP-Cache, damit wirklich die neue Version gespeichert wird
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.endsWith('/sw.js')) return;

  // Seitenaufrufe immer auf die gespeicherte App abbilden
  const key = req.mode === 'navigate' ? './index.html' : req;

  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const fresh = fetch(req).then(res => {
      if (res.ok) cache.put(key, res.clone());
      return res;
    });
    if (cached) {
      e.waitUntil(fresh.catch(() => {}));   // im Hintergrund aktualisieren
      return cached;
    }
    return fresh.catch(() => cache.match('./index.html'));
  }));
});
