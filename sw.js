const storageId = "static-shell-1";
const shellAssets = [
    '/',
    '/index.html',
    './manifest.json',
    './assets/logo/16x16.png',
    './assets/logo/96x96.png',
    './assets/logo/144x144.png',
    './assets/logo/128x128.png',
    './assets/logo/280x280.png',
    './assets/logo/512x512.png',
    'https://fonts.googleapis.com/css2?family=Questrial&display=swap',
    './app.js',
    './style.css'
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(storageId).then((cache) => {
            cache.addAll(shellAssets);
        })
    );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== storageId)
        .map((key) => caches.delete(key))
      )
    })
  );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => {
            return res || fetch(event.request);
        })
    );
})
