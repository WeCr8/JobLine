// Device/browser feature detection utilities

export function hasCamera() {
  return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
    ? navigator.mediaDevices.enumerateDevices().then(devices => devices.some(d => d.kind === 'videoinput'))
    : Promise.resolve(false);
}

export function hasMicrophone() {
  return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
    ? navigator.mediaDevices.enumerateDevices().then(devices => devices.some(d => d.kind === 'audioinput'))
    : Promise.resolve(false);
}

export function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export async function getBatteryStatus() {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    return {
      charging: battery.charging,
      level: battery.level
    };
  }
  return null;
} 