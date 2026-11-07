// Service worker : garde toute l'application dans le téléphone pour lire sans internet.
const VERSION = 'ma-bible-d9796343b0';
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "css/app.css", "js/app.js", "js/illustrations.js", "data/bible.js", "data/lecons.js", "data/general.js", "icones/icone-192.png", "icones/icone-512.png", "icones/apple-touch-icon.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request).then((rep) => {
    if (rep.ok && new URL(e.request.url).origin === location.origin) { const copie = rep.clone(); caches.open(VERSION).then((c) => c.put(e.request, copie)); }
    return rep;
  }).catch(() => caches.match('index.html'))));
});
