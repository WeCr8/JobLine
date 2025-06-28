// Service Worker for JobLine.ai PWA
const CACHE_NAME = 'jobline-ai-v1.0.0';
const STATIC_CACHE = 'jobline-static-v1';
const DYNAMIC_CACHE = 'jobline-dynamic-v1';
const API_CACHE = 'jobline-api-v1';
const IMAGE_CACHE = 'jobline-images-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Helper function to determine cache strategy based on request
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // API requests - Network first, then cache
  if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
    return 'api';
  }
  
  // Image requests - Cache first, then network
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return 'image';
  }
  
  // Static assets - Cache first, then network
  if (
    request.destination === 'style' || 
    request.destination === 'script' || 
    request.destination === 'font' ||
    url.pathname.match(/\.(css|js|woff2?)$/)
  ) {
    return 'static';
  }
  
  // HTML navigation - Network first, then cache
  if (request.destination === 'document') {
    return 'document';
  }
  
  // Default - Network first with dynamic caching
  return 'dynamic';
};

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin) && !request.url.includes('fonts.googleapis.com') && !request.url.includes('fonts.gstatic.com')) {
    return;
  }

  const strategy = getCacheStrategy(request);
  
  switch (strategy) {
    case 'api':
      // Network first, then cache for API requests
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the successful response
            caches.open(API_CACHE)
              .then((cache) => {
                // Only cache successful responses
                if (response.ok) {
                  // Add expiration header for API cache
                  const headers = new Headers(responseToCache.headers);
                  const expirationDate = new Date();
                  expirationDate.setMinutes(expirationDate.getMinutes() + 5); // 5 minute expiration
                  headers.append('sw-cache-expires', expirationDate.toISOString());
                  
                  const responseWithExpiration = new Response(
                    responseToCache.body,
                    {
                      status: responseToCache.status,
                      statusText: responseToCache.statusText,
                      headers: headers
                    }
                  );
                  
                  cache.put(request, responseWithExpiration);
                }
              });
            
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  // Check if the cached response has expired
                  const expirationHeader = cachedResponse.headers.get('sw-cache-expires');
                  if (expirationHeader) {
                    const expirationDate = new Date(expirationHeader);
                    if (expirationDate < new Date()) {
                      // Cached response has expired
                      return caches.delete(request).then(() => {
                        return Response.error();
                      });
                    }
                  }
                  return cachedResponse;
                }
                
                // If no cache, return error response
                return Response.error();
              });
          })
      );
      break;
      
    case 'image':
      // Cache first, then network for images
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            return fetch(request)
              .then((response) => {
                // Clone the response
                const responseToCache = response.clone();
                
                // Cache the successful response
                caches.open(IMAGE_CACHE)
                  .then((cache) => {
                    if (response.ok) {
                      cache.put(request, responseToCache);
                    }
                  });
                
                return response;
              })
              .catch(() => {
                // If both cache and network fail, return placeholder image
                if (request.destination === 'image') {
                  return caches.match('/icons/placeholder-image.png');
                }
                
                return Response.error();
              });
          })
      );
      break;
      
    case 'static':
      // Cache first, then network for static assets
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            return fetch(request)
              .then((response) => {
                // Clone the response
                const responseToCache = response.clone();
                
                // Cache the successful response
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    if (response.ok) {
                      cache.put(request, responseToCache);
                    }
                  });
                
                return response;
              });
          })
      );
      break;
      
    case 'document':
      // Network first, then cache for HTML documents
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the successful response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                if (response.ok) {
                  cache.put(request, responseToCache);
                }
              });
            
            return response;
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                
                // If no cache for specific page, return cached home page
                return caches.match('/');
              });
          })
      );
      break;
      
    case 'dynamic':
    default:
      // Network first with dynamic caching
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }
            
            // Try to get from cache for other requests
            return caches.match(request);
          })
      );
      break;
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'job-update') {
    event.waitUntil(syncJobUpdates());
  }
  
  if (event.tag === 'passdown-note') {
    event.waitUntil(syncPassdownNotes());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update from JobLine.ai',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('JobLine.ai', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateBackgroundData());
  }
});

// Sync functions
async function syncJobUpdates() {
  try {
    // Get pending job updates from IndexedDB
    const pendingUpdates = await getPendingJobUpdates();
    
    for (const update of pendingUpdates) {
      try {
        await fetch('/api/jobs/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(update)
        });
        
        // Remove from pending updates
        await removePendingJobUpdate(update.id);
      } catch (error) {
        console.error('Failed to sync job update:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncPassdownNotes() {
  try {
    // Get pending passdown notes from IndexedDB
    const pendingNotes = await getPendingPassdownNotes();
    
    for (const note of pendingNotes) {
      try {
        await fetch('/api/passdown/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
        
        // Remove from pending notes
        await removePendingPassdownNote(note.id);
      } catch (error) {
        console.error('Failed to sync passdown note:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function updateBackgroundData() {
  // Fetch updated data in the background
  try {
    // Update job data
    const jobsResponse = await fetch('/api/jobs');
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      
      // Store in cache for offline use
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/jobs', new Response(JSON.stringify(jobsData), {
        headers: {
          'Content-Type': 'application/json',
          'sw-cache-expires': new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        }
      }));
    }
    
    // Update machine data
    const machinesResponse = await fetch('/api/machines');
    if (machinesResponse.ok) {
      const machinesData = await machinesResponse.json();
      
      // Store in cache for offline use
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/machines', new Response(JSON.stringify(machinesData), {
        headers: {
          'Content-Type': 'application/json',
          'sw-cache-expires': new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        }
      }));
    }
    
    console.log('Background data update completed');
  } catch (error) {
    console.error('Background data update failed:', error);
  }
}

// IndexedDB helpers
async function getPendingJobUpdates() {
  return getOfflineData('jobUpdates') || [];
}

async function removePendingJobUpdate(id) {
  const updates = await getPendingJobUpdates();
  const filteredUpdates = updates.filter(update => update.id !== id);
  return storeOfflineData('jobUpdates', filteredUpdates);
}

async function getPendingPassdownNotes() {
  return getOfflineData('passdownNotes') || [];
}

async function removePendingPassdownNote(id) {
  const notes = await getPendingPassdownNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  return storeOfflineData('passdownNotes', filteredNotes);
}

// Generic IndexedDB functions
async function getOfflineData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JobLineOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      
      // Check if the store exists
      if (!db.objectStoreNames.contains(storeName)) {
        resolve(null);
        db.close();
        return;
      }
      
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const getRequest = store.get('data');
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
      
      getRequest.onerror = () => {
        reject(new Error('Failed to get data from IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

async function storeOfflineData(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JobLineOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const putRequest = store.put(data, 'data');
      
      putRequest.onsuccess = () => {
        resolve();
      };
      
      putRequest.onerror = () => {
        reject(new Error('Failed to store data in IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
    
    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}