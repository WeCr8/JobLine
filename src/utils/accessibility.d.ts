/**
 * Accessibility utilities for cross-platform compatibility
 */
export declare const createAccessibleFocusTrap: (element: HTMLElement) => {
    activate: () => any;
    deactivate: () => any;
};
export declare const lockBodyScroll: (element: HTMLElement) => () => void;
export declare const clearBodyScrollLocks: () => void;
export declare const announceToScreenReader: (message: string) => void;
export declare const addKeyboardNavigation: (containerElement: HTMLElement, itemSelector: string, onSelect: (element: HTMLElement) => void) => () => void;
export declare const prefersReducedMotion: () => boolean;
export declare const prefersHighContrast: () => boolean;
