"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var pinia_1 = require("pinia");
var router_1 = require("./router");
var App_vue_1 = require("./App.vue");
require("./style.css");
var platform_1 = require("./utils/platform");
var offline_1 = require("./utils/offline");
var app = (0, vue_1.createApp)(App_vue_1.default);
var pinia = (0, pinia_1.createPinia)();
app.use(pinia);
app.use(router_1.default);
// Add platform-specific class to body
document.body.classList.add((0, platform_1.getPlatformClass)());
// Add platform detection to window for debugging
window.isPlatform = {
    ios: (0, platform_1.isIOS)(),
    android: (0, platform_1.isAndroid)()
};
// PWA Installation handling
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    // Dispatch custom event that components can listen for
    window.dispatchEvent(new CustomEvent('pwaInstallable'));
});
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
            console.log('SW registered: ', registration);
        })
            .catch(function (registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
// Handle app installation
window.addEventListener('appinstalled', function (evt) {
    console.log('App was installed');
    window.dispatchEvent(new CustomEvent('pwaInstalled'));
});
// Set up online/offline listeners
(0, offline_1.addConnectivityListeners)(function () {
    // Online event
    window.dispatchEvent(new CustomEvent('appOnline'));
    console.log('App is online');
}, function () {
    // Offline event
    window.dispatchEvent(new CustomEvent('appOffline'));
    console.log('App is offline');
});
// Prevent zoom on input focus (iOS Safari)
document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});
var lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
// Prevent pull-to-refresh
var startY = 0;
document.addEventListener('touchstart', function (e) {
    startY = e.touches[0].pageY;
});
document.addEventListener('touchmove', function (e) {
    var y = e.touches[0].pageY;
    if (y > startY && window.scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false });
// Add safe area support for notched devices
if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    document.body.classList.add('has-safe-areas');
}
// Expose installPWA method for components to use
window.installPWA = function () {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
};
app.mount('#app');
