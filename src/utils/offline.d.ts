/**
 * Offline support utilities
 */
export declare const isOnline: () => boolean;
export declare const addConnectivityListeners: (onOnline: () => void, onOffline: () => void) => (() => void);
export declare const storeOfflineData: <T>(storeName: string, key: string, data: T) => Promise<void>;
export declare const getOfflineData: <T>(storeName: string, key: string) => Promise<T | null>;
export declare const queueOfflineAction: (action: {
    type: string;
    payload: any;
    timestamp: number;
}) => Promise<void>;
export declare const getOfflineActions: () => Promise<Array<{
    type: string;
    payload: any;
    timestamp: number;
}>>;
export declare const clearOfflineActions: () => Promise<void>;
export declare const registerBackgroundSync: () => Promise<boolean>;
