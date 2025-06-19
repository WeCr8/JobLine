import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// PWA Installation handling
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
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
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed');
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

app.mount('#app');