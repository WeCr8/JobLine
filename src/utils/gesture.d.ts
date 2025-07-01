/**
 * Gesture utilities for cross-platform touch interactions
 */
export declare const addSwipeGesture: (element: HTMLElement, onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void) => (() => void);
export declare const addPinchGesture: (element: HTMLElement, onPinch: (scale: number, event: HammerInput) => void) => (() => void);
export declare const addTapGesture: (element: HTMLElement, onTap: (event: HammerInput) => void, options?: {
    doubleTap?: boolean;
}) => (() => void);
export declare const addPanGesture: (element: HTMLElement, onPan: (event: HammerInput) => void, onPanEnd?: (event: HammerInput) => void) => (() => void);
export declare const addLongPressGesture: (element: HTMLElement, onLongPress: (event: HammerInput) => void) => (() => void);
