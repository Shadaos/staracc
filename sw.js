// Service worker volontairement simple : le réseau d'abord (le site reste toujours à jour),
// le cache seulement en secours hors connexion. Les photos et icônes sont servies depuis le cache.
const CACHE = 'pronos-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // Firebase, polices, CDN : pas touché
  const img = /\/(photos|icons)\//.test(url.pathname);
  if (img) {                                               // images : cache d'abord
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
    return;
  }
  e.respondWith(fetch(req).then(res => {                   // le reste : réseau d'abord
    if (res.ok && !url.pathname.endsWith('recaps.json')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('./'))));
});

// Notifications (envoyées par Firebase Cloud Messaging au début du prime).
self.addEventListener('push', e => {
  let j = {}; try { j = e.data ? e.data.json() : {}; } catch (err) { j = { notification: { body: e.data && e.data.text() } }; }
  const n = j.notification || {}, d = j.data || {};
  const title = n.title || d.title || "Pronos Star Ac'";
  const link = (j.fcmOptions && j.fcmOptions.link) || d.link || './';
  e.waitUntil(self.registration.showNotification(title, {
    body: n.body || d.body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
    tag: d.tag || 'prime', data: { link }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.navigate(link).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(link);
  }));
});
