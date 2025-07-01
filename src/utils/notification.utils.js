// Notification utilities

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  return Notification.permission;
}

export function showNotification(title, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, options);
  }
}

export function onNotificationClick(callback) {
  self.addEventListener('notificationclick', callback);
} 