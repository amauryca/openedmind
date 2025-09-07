const CACHE_NAME = 'openedmind-v1';
const STATIC_CACHE = 'openedmind-static-v1';
const DYNAMIC_CACHE = 'openedmind-dynamic-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/therapy-hero.jpg',
  '/src/assets/therapy-office.jpg',
  '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png'
];

// Cache API responses for offline support
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName.startsWith('openedmind-')
            )
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/interventions') || url.pathname === '/' || url.pathname.includes('.html')) {
      // Cache app shell and intervention pages for offline access
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else if (url.pathname.includes('.js') || url.pathname.includes('.css') || url.pathname.includes('/assets/')) {
      // Cache static assets
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else if (url.hostname.includes('supabase.co') || url.pathname.includes('/api/')) {
      // Network first for API calls with fallback
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
  }
});

// Cache first strategy for static assets
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version and update in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return createOfflineFallback(request);
  }
}

// Network first strategy for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error.message);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cached response is still fresh
      const dateHeader = cachedResponse.headers.get('date');
      const cachedTime = dateHeader ? new Date(dateHeader).getTime() : 0;
      const now = Date.now();
      
      if (now - cachedTime < API_CACHE_DURATION) {
        return cachedResponse;
      }
    }
    
    return createOfflineFallback(request);
  }
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    console.log('Background cache update failed:', error.message);
  }
}

// Create offline fallback response
function createOfflineFallback(request) {
  const url = new URL(request.url);
  
  // For HTML pages, return offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Offline - OpenedMind</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: linear-gradient(180deg, #f8fffe, #e6f7ff);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
            }
            .offline-content {
              max-width: 400px;
              padding: 2rem;
              background: white;
              border-radius: 1rem;
              box-shadow: 0 4px 20px rgba(77, 166, 224, 0.1);
            }
            h1 { color: #4da6e0; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 1.5rem; }
            button {
              background: #4da6e0;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            }
            button:hover { background: #3d8bc0; }
          </style>
        </head>
        <body>
          <div class="offline-content">
            <h1>You're Offline</h1>
            <p>It looks like you've lost your internet connection. Some features may be limited, but you can still access cached content.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // For API calls, return offline message
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase.co')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'Unable to connect to server. Please check your internet connection.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default offline response
  return new Response('Offline', { status: 503 });
}

// Handle background sync for when connection returns
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Background sync triggered');
  // Implement any background sync logic here
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png',
      badge: '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Open App',
          icon: '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('OpenedMind', options)
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});