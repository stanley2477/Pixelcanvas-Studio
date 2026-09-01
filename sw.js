const CACHE_NAME = "pixelcanvas-studio-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/all-tools.html",
  "/how-it-works.html",
  "/guides.html",
  "/about.html",
  "/contact.html",
  "/privacy.html",
  "/terms.html",

  "/image-compressor.html",
  "/image-resizer.html",
  "/image-format-converter.html",
  "/ai-background-remover.html",
  "/passport-photo-maker.html",
  "/social-media-image-resizer.html",
  "/image-cropper.html",
  "/image-rotator.html",
  "/image-to-text.html",
  "/heic-converter.html",

  "/photo-to-pdf.html",
  "/pdf-to-jpg.html",
  "/jpg-to-pdf.html",
  "/png-to-pdf.html",
  "/pdf-merger.html",
  "/pdf-splitter.html",
  "/pdf-compressor.html",
  "/pdf-page-extractor.html",

  "/favicon.png",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then(response => {
          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});