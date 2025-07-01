/**
 * Platform detection utilities
 */
export declare const isIOS: () => boolean;
export declare const isAndroid: () => boolean;
export declare const isMobile: () => boolean;
export declare const isSafari: () => boolean;
export declare const isFirefox: () => boolean;
export declare const getPlatformClass: () => string;
export declare const isStandalone: () => boolean;
export declare const supportsTouch: () => boolean;
export declare const getOrientation: () => 'portrait' | 'landscape';
export declare const onOrientationChange: (callback: (orientation: 'portrait' | 'landscape') => void) => (() => void);
export declare const hasNotch: () => boolean;
