"use strict";
/**
 * Platform detection utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNotch = exports.onOrientationChange = exports.getOrientation = exports.supportsTouch = exports.isStandalone = exports.getPlatformClass = exports.isFirefox = exports.isSafari = exports.isMobile = exports.isAndroid = exports.isIOS = void 0;
// Detect iOS
var isIOS = function () {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};
exports.isIOS = isIOS;
// Detect Android
var isAndroid = function () {
    return /Android/.test(navigator.userAgent);
};
exports.isAndroid = isAndroid;
// Detect mobile device
var isMobile = function () {
    return (0, exports.isIOS)() || (0, exports.isAndroid)() || /Mobi|Android/i.test(navigator.userAgent);
};
exports.isMobile = isMobile;
// Detect Safari browser
var isSafari = function () {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};
exports.isSafari = isSafari;
// Detect Firefox browser
var isFirefox = function () {
    return navigator.userAgent.indexOf('Firefox') !== -1;
};
exports.isFirefox = isFirefox;
// Get platform-specific class
var getPlatformClass = function () {
    if ((0, exports.isIOS)())
        return 'ios-device';
    if ((0, exports.isAndroid)())
        return 'android-device';
    return 'web-device';
};
exports.getPlatformClass = getPlatformClass;
// Check if the app is running in standalone mode (PWA installed)
var isStandalone = function () {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
};
exports.isStandalone = isStandalone;
// Check if the device supports touch
var supportsTouch = function () {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
exports.supportsTouch = supportsTouch;
// Get device orientation
var getOrientation = function () {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};
exports.getOrientation = getOrientation;
// Listen for orientation changes
var onOrientationChange = function (callback) {
    var handler = function () {
        callback((0, exports.getOrientation)());
    };
    window.addEventListener('resize', handler);
    // Return cleanup function
    return function () {
        window.removeEventListener('resize', handler);
    };
};
exports.onOrientationChange = onOrientationChange;
// Check if the device has notch (iOS safe areas)
var hasNotch = function () {
    // iOS devices with notch
    if ((0, exports.isIOS)()) {
        // Check for iPhone X and newer models
        var ratio = window.devicePixelRatio || 1;
        var screen_1 = {
            width: window.screen.width * ratio,
            height: window.screen.height * ratio
        };
        // iPhone X, XS, 11 Pro, 12 mini, 13 mini
        var isIPhoneWithNotch = ((screen_1.width === 1125 && screen_1.height === 2436) || // X, XS
            (screen_1.width === 828 && screen_1.height === 1792) || // XR, 11
            (screen_1.width === 1242 && screen_1.height === 2688) || // XS Max, 11 Pro Max
            (screen_1.width === 1170 && screen_1.height === 2532) || // 12, 12 Pro, 13, 13 Pro
            (screen_1.width === 1284 && screen_1.height === 2778) || // 12 Pro Max, 13 Pro Max
            (screen_1.width === 1080 && screen_1.height === 2340) // 12 mini, 13 mini
        );
        return isIPhoneWithNotch;
    }
    // For Android, we can check for cutout support
    if ((0, exports.isAndroid)()) {
        return 'CSS' in window && 'supports' in CSS && CSS.supports('padding-top: env(safe-area-inset-top)');
    }
    return false;
};
exports.hasNotch = hasNotch;
