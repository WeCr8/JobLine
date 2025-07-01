/**
 * Offline support utilities
 */
// Check if the app is currently online
export const isOnline = () => {
    return navigator.onLine;
};
// Listen for online/offline events
export const addConnectivityListeners = (onOnline, onOffline) => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    // Return cleanup function
    return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
};
// Store data in IndexedDB for offline use
export const storeOfflineData = async (storeName, key, data) => {
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
            const storeRequest = store.put(data, key);
            storeRequest.onsuccess = () => {
                resolve();
            };
            storeRequest.onerror = () => {
                reject(new Error('Failed to store offline data'));
            };
            transaction.oncomplete = () => {
                db.close();
            };
        };
        request.onerror = () => {
            reject(new Error('Failed to open offline database'));
        };
    });
};
// Retrieve data from IndexedDB
export const getOfflineData = async (storeName, key) => {
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
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(key);
            getRequest.onsuccess = () => {
                resolve(getRequest.result || null);
            };
            getRequest.onerror = () => {
                reject(new Error('Failed to retrieve offline data'));
            };
            transaction.oncomplete = () => {
                db.close();
            };
        };
        request.onerror = () => {
            reject(new Error('Failed to open offline database'));
        };
    });
};
// Queue actions for later sync when online
export const queueOfflineAction = async (action) => {
    const actions = await getOfflineActions();
    actions.push(action);
    return storeOfflineData('system', 'offlineActions', actions);
};
// Get all queued offline actions
export const getOfflineActions = async () => {
    const actions = await getOfflineData('system', 'offlineActions');
    return actions || [];
};
// Clear processed actions
export const clearOfflineActions = async () => {
    return storeOfflineData('system', 'offlineActions', []);
};
// Register for background sync (if supported)
export const registerBackgroundSync = async () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            // const registration = await navigator.serviceWorker.ready;
            return true;
        }
        catch (error) {
            console.error('Background sync registration failed:', error);
            return false;
        }
    }
    return false;
};
