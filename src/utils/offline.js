"use strict";
/**
 * Offline support utilities
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBackgroundSync = exports.clearOfflineActions = exports.getOfflineActions = exports.queueOfflineAction = exports.getOfflineData = exports.storeOfflineData = exports.addConnectivityListeners = exports.isOnline = void 0;
// Check if the app is currently online
var isOnline = function () {
    return navigator.onLine;
};
exports.isOnline = isOnline;
// Listen for online/offline events
var addConnectivityListeners = function (onOnline, onOffline) {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    // Return cleanup function
    return function () {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
};
exports.addConnectivityListeners = addConnectivityListeners;
// Store data in IndexedDB for offline use
var storeOfflineData = function (storeName, key, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var request = indexedDB.open('JobLineOfflineDB', 1);
                request.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                };
                request.onsuccess = function (event) {
                    var db = event.target.result;
                    var transaction = db.transaction(storeName, 'readwrite');
                    var store = transaction.objectStore(storeName);
                    var storeRequest = store.put(data, key);
                    storeRequest.onsuccess = function () {
                        resolve();
                    };
                    storeRequest.onerror = function () {
                        reject(new Error('Failed to store offline data'));
                    };
                    transaction.oncomplete = function () {
                        db.close();
                    };
                };
                request.onerror = function () {
                    reject(new Error('Failed to open offline database'));
                };
            })];
    });
}); };
exports.storeOfflineData = storeOfflineData;
// Retrieve data from IndexedDB
var getOfflineData = function (storeName, key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var request = indexedDB.open('JobLineOfflineDB', 1);
                request.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                };
                request.onsuccess = function (event) {
                    var db = event.target.result;
                    var transaction = db.transaction(storeName, 'readonly');
                    var store = transaction.objectStore(storeName);
                    var getRequest = store.get(key);
                    getRequest.onsuccess = function () {
                        resolve(getRequest.result || null);
                    };
                    getRequest.onerror = function () {
                        reject(new Error('Failed to retrieve offline data'));
                    };
                    transaction.oncomplete = function () {
                        db.close();
                    };
                };
                request.onerror = function () {
                    reject(new Error('Failed to open offline database'));
                };
            })];
    });
}); };
exports.getOfflineData = getOfflineData;
// Queue actions for later sync when online
var queueOfflineAction = function (action) { return __awaiter(void 0, void 0, void 0, function () {
    var actions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getOfflineActions)()];
            case 1:
                actions = _a.sent();
                actions.push(action);
                return [2 /*return*/, (0, exports.storeOfflineData)('system', 'offlineActions', actions)];
        }
    });
}); };
exports.queueOfflineAction = queueOfflineAction;
// Get all queued offline actions
var getOfflineActions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var actions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getOfflineData)('system', 'offlineActions')];
            case 1:
                actions = _a.sent();
                return [2 /*return*/, actions || []];
        }
    });
}); };
exports.getOfflineActions = getOfflineActions;
// Clear processed actions
var clearOfflineActions = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.storeOfflineData)('system', 'offlineActions', [])];
    });
}); };
exports.clearOfflineActions = clearOfflineActions;
// Register for background sync (if supported)
var registerBackgroundSync = function (syncTag) { return __awaiter(void 0, void 0, void 0, function () {
    var registration, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!('serviceWorker' in navigator && 'SyncManager' in window)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, navigator.serviceWorker.ready];
            case 2:
                registration = _a.sent();
                return [4 /*yield*/, registration.sync.register(syncTag)];
            case 3:
                _a.sent();
                return [2 /*return*/, true];
            case 4:
                error_1 = _a.sent();
                console.error('Background sync registration failed:', error_1);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/, false];
        }
    });
}); };
exports.registerBackgroundSync = registerBackgroundSync;
