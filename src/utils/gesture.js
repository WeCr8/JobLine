import Hammer from 'hammerjs';
/**
 * Gesture utilities for cross-platform touch interactions
 */
// Add swipe gesture to an element
export const addSwipeGesture = (element, onSwipe) => {
    const hammer = new Hammer(element);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    const handleSwipe = (event) => {
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
export const addPinchGesture = (element, onPinch) => {
    const hammer = new Hammer(element);
    hammer.get('pinch').set({ enable: true });
    const handlePinch = (event) => {
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
export const addTapGesture = (element, onTap, options = {}) => {
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
export const addPanGesture = (element, onPan, onPanEnd) => {
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
export const addLongPressGesture = (element, onLongPress) => {
    const hammer = new Hammer(element);
    hammer.get('press').set({ time: 500 }); // 500ms for long press
    hammer.on('press', onLongPress);
    // Return cleanup function
    return () => {
        hammer.off('press', onLongPress);
        hammer.destroy();
    };
};

// Expanded gesture utility for touch and mouse events
// If Hammer.js is available, use it for advanced gestures

let Hammer;
try {
  Hammer = require('hammerjs');
} catch (e) {
  Hammer = null;
}

export function addTapGesture(element, handler, options = {}) {
  if (Hammer) {
    const hammer = new Hammer(element);
    if (options.doubleTap) {
      hammer.get('tap').set({ taps: 2 });
    }
    hammer.on('tap', handler);
    return () => {
      hammer.off('tap', handler);
      hammer.destroy();
    };
  } else {
    element.addEventListener('click', handler);
    element.addEventListener('touchend', handler);
    return () => {
      element.removeEventListener('click', handler);
      element.removeEventListener('touchend', handler);
    };
  }
}

export function addSwipeGesture(element, handler) {
  if (Hammer) {
    const hammer = new Hammer(element);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    const handleSwipe = (event) => {
      switch (event.direction) {
        case Hammer.DIRECTION_LEFT:
          handler('left'); break;
        case Hammer.DIRECTION_RIGHT:
          handler('right'); break;
        case Hammer.DIRECTION_UP:
          handler('up'); break;
        case Hammer.DIRECTION_DOWN:
          handler('down'); break;
      }
    };
    hammer.on('swipe', handleSwipe);
    return () => {
      hammer.off('swipe', handleSwipe);
      hammer.destroy();
    };
  } else {
    let startX = 0, startY = 0, isSwiping = false;
    const onStart = (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    };
    const onMove = (e) => {
      if (!isSwiping) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
          handler(dx > 0 ? 'right' : 'left');
        } else {
          handler(dy > 0 ? 'down' : 'up');
        }
        isSwiping = false;
      }
    };
    const onEnd = () => { isSwiping = false; };
    element.addEventListener('touchstart', onStart);
    element.addEventListener('touchmove', onMove);
    element.addEventListener('touchend', onEnd);
    return () => {
      element.removeEventListener('touchstart', onStart);
      element.removeEventListener('touchmove', onMove);
      element.removeEventListener('touchend', onEnd);
    };
  }
}

export function addPanGesture(element, onPan, onPanEnd) {
  if (Hammer) {
    const hammer = new Hammer(element);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('pan', onPan);
    if (onPanEnd) hammer.on('panend', onPanEnd);
    return () => {
      hammer.off('pan', onPan);
      if (onPanEnd) hammer.off('panend', onPanEnd);
      hammer.destroy();
    };
  }
}

export function addPinchGesture(element, onPinch) {
  if (Hammer) {
    const hammer = new Hammer(element);
    hammer.get('pinch').set({ enable: true });
    hammer.on('pinch', (event) => onPinch(event.scale, event));
    return () => {
      hammer.off('pinch', onPinch);
      hammer.destroy();
    };
  }
}

export function addLongPressGesture(element, onLongPress) {
  if (Hammer) {
    const hammer = new Hammer(element);
    hammer.get('press').set({ time: 500 });
    hammer.on('press', onLongPress);
    return () => {
      hammer.off('press', onLongPress);
      hammer.destroy();
    };
  }
}
