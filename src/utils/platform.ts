/**
 * Platform detection utilities
 */

// Detect iOS
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Detect Android
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// Detect mobile device
export const isMobile = (): boolean => {
  return isIOS() || isAndroid() || /Mobi|Android/i.test(navigator.userAgent);
};

// Detect Safari browser
export const isSafari = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Detect Firefox browser
export const isFirefox = (): boolean => {
  return navigator.userAgent.indexOf('Firefox') !== -1;
};

// Get platform-specific class
export const getPlatformClass = (): string => {
  if (isIOS()) return 'ios-device';
  if (isAndroid()) return 'android-device';
  return 'web-device';
};

// Check if the app is running in standalone mode (PWA installed)
export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true;
};

// Check if the device supports touch
export const supportsTouch = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get device orientation
export const getOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// Listen for orientation changes
export const onOrientationChange = (callback: (orientation: 'portrait' | 'landscape') => void): (() => void) => {
  const handler = () => {
    callback(getOrientation());
  };
  
  window.addEventListener('resize', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handler);
  };
};

// Check if the device has notch (iOS safe areas)
export const hasNotch = (): boolean => {
  // iOS devices with notch
  if (isIOS()) {
    // Check for iPhone X and newer models
    const ratio = window.devicePixelRatio || 1;
    const screen = {
      width: window.screen.width * ratio,
      height: window.screen.height * ratio
    };
    
    // iPhone X, XS, 11 Pro, 12 mini, 13 mini
    const isIPhoneWithNotch = (
      (screen.width === 1125 && screen.height === 2436) || // X, XS
      (screen.width === 828 && screen.height === 1792) ||  // XR, 11
      (screen.width === 1242 && screen.height === 2688) || // XS Max, 11 Pro Max
      (screen.width === 1170 && screen.height === 2532) || // 12, 12 Pro, 13, 13 Pro
      (screen.width === 1284 && screen.height === 2778) || // 12 Pro Max, 13 Pro Max
      (screen.width === 1080 && screen.height === 2340)    // 12 mini, 13 mini
    );
    
    return isIPhoneWithNotch;
  }
  
  // For Android, we can check for cutout support
  if (isAndroid()) {
    return 'CSS' in window && 'supports' in CSS && CSS.supports('padding-top: env(safe-area-inset-top)');
  }
  
  return false;
};