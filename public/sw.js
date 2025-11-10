const CACHE_NAME = 'walletplus-cache-v8';
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
  event.waitUntil((async () => {
    // Enable navigation preload for faster responses when online
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (_) {}
    }
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// Allow clients to trigger SW behaviors (e.g., skipWaiting)
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Handle navigation requests or direct document fetches (SPA offline-first App Shell)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        // Serve the cached app shell immediately if present
        const cachedIndex = await cache.match('/index.html');
        if (cachedIndex) {
          // In the background, try to update the cache with the latest index
          fetch('/index.html').then((res) => {
            if (res && res.ok) {
              cache.put('/index.html', res.clone());
            }
          }).catch(() => {});
          return cachedIndex;
        }

        // If not cached yet, attempt network; fallback to offline page
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            cache.put('/index.html', networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const offlinePage = await cache.match('/offline.html');
          return offlinePage || new Response('Offline - Please check your connection', { status: 503 });
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
