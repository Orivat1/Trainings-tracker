// Service Worker: Offline zuerst. Die App startet sofort aus dem Cache, auch ohne Netz im Gym,
// und holt sich Aktualisierungen still im Hintergrund.
// Bei Änderungen an der App die Versionsnummer erhöhen: Dann lädt der neue Worker alles frisch
// und die geöffnete App wechselt beim nächsten ruhigen Moment auf die neue Version.
const CACHE = 'training-v34';
const FILES = [
  './',
  './index.html',
  './manifest.json?v=2',
  './icons/icon-192.png?v=2',
  './icons/icon-512.png?v=2',
  './icons/apple-touch-icon.png?v=2'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

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

const cacheable = (req, res) => {
  const url = new URL(req.url);
  if (url.origin === location.origin) return res.ok;
  return FONT_HOSTS.some(h => url.hostname.endsWith(h)) && (res.ok || res.type === 'opaque');
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && !FONT_HOSTS.some(h => url.hostname.endsWith(h))) return;
  if (url.pathname.endsWith('/sw.js')) return;

  // Seitenaufrufe immer auf die gespeicherte App abbilden
  const key = req.mode === 'navigate' ? './index.html' : req;

  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const fresh = fetch(req).then(res => {
      if (cacheable(req, res)) cache.put(key, res.clone());
      return res;
    });
    if (cached) {
      e.waitUntil(fresh.catch(() => {}));   // im Hintergrund aktualisieren
      return cached;
    }
    return fresh.catch(() => cache.match('./index.html'));
  }));
});
