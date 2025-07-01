import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index';
import App from './App.vue';
import './style.css';
import { isIOS, isAndroid, getPlatformClass } from './utils/platform';
import { addConnectivityListeners } from './utils/offline';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
// Add platform-specific class to body
document.body.classList.add(getPlatformClass());
// Add platform detection to window for debugging
window.isPlatform = {
    ios: isIOS(),
    android: isAndroid()
};
// PWA Installation handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Dispatch custom event that components can listen for
    window.dispatchEvent(new CustomEvent('pwaInstallable'));
});
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
            console.log('SW registered: ', registration);
        })
            .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
// Handle app installation
window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    window.dispatchEvent(new CustomEvent('pwaInstalled'));
});
// Set up online/offline listeners
addConnectivityListeners(() => {
    // Online event
    window.dispatchEvent(new CustomEvent('appOnline'));
    console.log('App is online');
}, () => {
    // Offline event
    window.dispatchEvent(new CustomEvent('appOffline'));
    console.log('App is offline');
});
// Prevent zoom on input focus (iOS Safari)
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
// Prevent pull-to-refresh
let startY = 0;
document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
});
document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    if (y > startY && window.scrollY === 0) {
        e.preventDefault();
    }
}, { passive: false });
// Add safe area support for notched devices
if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    document.body.classList.add('has-safe-areas');
}
// Expose installPWA method for components to use
window.installPWA = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
};
app.mount('#app');
