// AMT portal service worker.
//
// Scope of what this file is allowed to touch: static, public assets only
// (the built JS/CSS bundles, images, icons, the app shell HTML). It must
// NEVER cache anything under /api/ — that is where the Sala de Controlo
// access code, session cookies and system credentials travel — nor any
// non-GET request. See the fetch handler below for the explicit bypass.

const CACHE_NAME = "amt-portal-static-v2";
const OFFLINE_URL = "/offline.html";

// Bypass entirely: no cache read, no cache write, no interception logic
// beyond handing the request straight to the network.
function isNeverCached(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/sw.js" ||
    url.pathname === "/manifest.webmanifest"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  // Do not self.skipWaiting() here — activation of a new version is
  // deliberately held until the app tells us to (see the "message"
  // listener below), so an in-progress Sala de Controlo session is never
  // interrupted by a silent reload.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return; // never touch POST/PUT/DELETE (login, logout, etc.)
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || isNeverCached(url)) {
    return; // let the browser handle it natively — no caching, ever.
  }

  if (request.mode === "navigate") {
    // App shell navigations: always prefer the network (so a rebuilt
    // index.html referencing new hashed assets is picked up immediately);
    // fall back to a cached shell, then to the offline page.
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match(request)) ||
            (await cache.match(OFFLINE_URL))
          );
        }
      })()
    );
    return;
  }

  // Static, public, content-hashed assets (JS/CSS bundles, images, icons):
  // stale-while-revalidate. Instant from cache when available, while a
  // background fetch keeps the cache fresh for next time.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => undefined);
      return cached || (await networkFetch) || Response.error();
    })()
  );
});
