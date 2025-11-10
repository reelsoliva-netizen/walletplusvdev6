const CACHE_NAME = 'walletplus-cache-v6';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-512.png',
  '/icon.svg',
  '/index.css',
  '/privacy-policy.html',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(CORE_ASSETS);
    } catch (err) {
      console.warn('Some core resources failed to cache:', err);
    }

    // Pre-cache hashed build assets by parsing index.html
    try {
      const res = await fetch('/index.html', { cache: 'no-cache' });
      const html = await res.text();
      const assetMatches = Array.from(html.matchAll(/(?:src|href)=\"(\/assets\/[^\"]+)\"/g));
      const assetUrls = assetMatches.map(m => m[1]).filter(Boolean);
      await Promise.all(assetUrls.map(async (u) => {
        try {
          await cache.add(u);
        } catch (e) {
          // Ignore failures for optional assets
        }
      }));
    } catch (e) {
      console.warn('Asset pre-cache skipped:', e);
    }

    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Handle navigation requests (SPA fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          // Try network first for navigation
          const networkResponse = await fetch(request);
          // Cache successful navigation responses
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch {
          // Fallback to cached index.html for offline SPA routing
          const cachedIndex = await cache.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const offlinePage = await cache.match('/offline.html');
          return offlinePage || new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      })()
    );
    return;
  }

  // Cache-first strategy for assets (JS, CSS, images, etc.)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font' ||
      url.pathname.includes('/assets/') ||
      url.pathname.includes('/src/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        
        try {
          const networkResponse = await fetch(request);
          // Only cache successful responses
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached || new Response('Resource not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      })()
    );
    return;
  }

  // Network-first for other requests (API calls, etc.)
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch {
        // For other requests, try cache as fallback
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        return cached || new Response('Service unavailable offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});
