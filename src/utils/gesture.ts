import Hammer from 'hammerjs';

/**
 * Gesture utilities for cross-platform touch interactions
 */

declare global {
  type HammerInput = any;
}

// Add swipe gesture to an element
export const addSwipeGesture = (
  element: HTMLElement, 
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void
): (() => void) => {
  const hammer = new Hammer(element);
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  
  const handleSwipe = (event: HammerInput) => {
    switch (event.direction) {
      case Hammer.DIRECTION_LEFT:
        onSwipe('left');
        break;
      case Hammer.DIRECTION_RIGHT:
        onSwipe('right');
        break;
      case Hammer.DIRECTION_UP:
        onSwipe('up');
        break;
      case Hammer.DIRECTION_DOWN:
        onSwipe('down');
        break;
    }
  };
  
  hammer.on('swipe', handleSwipe);
  
  // Return cleanup function
  return () => {
    hammer.off('swipe', handleSwipe);
    hammer.destroy();
  };
};

// Add pinch zoom gesture to an element
export const addPinchGesture = (
  element: HTMLElement,
  onPinch: (scale: number, event: HammerInput) => void
): (() => void) => {
  const hammer = new Hammer(element);
  hammer.get('pinch').set({ enable: true });
  
  const handlePinch = (event: HammerInput) => {
    onPinch(event.scale, event);
  };
  
  hammer.on('pinch', handlePinch);
  
  // Return cleanup function
  return () => {
    hammer.off('pinch', handlePinch);
    hammer.destroy();
  };
};

// Add tap gesture to an element
export const addTapGesture = (
  element: HTMLElement,
  onTap: (event: HammerInput) => void,
  options: { doubleTap?: boolean } = {}
): (() => void) => {
  const hammer = new Hammer(element);
  
  if (options.doubleTap) {
    hammer.get('tap').set({ taps: 2 });
  }
  
  hammer.on('tap', onTap);
  
  // Return cleanup function
  return () => {
    hammer.off('tap', onTap);
    hammer.destroy();
  };
};

// Add pan gesture to an element
export const addPanGesture = (
  element: HTMLElement,
  onPan: (event: HammerInput) => void,
  onPanEnd?: (event: HammerInput) => void
): (() => void) => {
  const hammer = new Hammer(element);
  hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  
  hammer.on('pan', onPan);
  
  if (onPanEnd) {
    hammer.on('panend', onPanEnd);
  }
  
  // Return cleanup function
  return () => {
    hammer.off('pan', onPan);
    if (onPanEnd) {
      hammer.off('panend', onPanEnd);
    }
    hammer.destroy();
  };
};

// Add long press gesture to an element
export const addLongPressGesture = (
  element: HTMLElement,
  onLongPress: (event: HammerInput) => void
): (() => void) => {
  const hammer = new Hammer(element);
  hammer.get('press').set({ time: 500 }); // 500ms for long press
  
  hammer.on('press', onLongPress);
  
  // Return cleanup function
  return () => {
    hammer.off('press', onLongPress);
    hammer.destroy();
  };
};