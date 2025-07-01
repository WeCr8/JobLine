// Accessibility utilities

export function focusElement(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

export function setAria(element, attr, value) {
  if (element) {
    element.setAttribute(`aria-${attr}`, value);
  }
}

// Announce a message to screen readers using a live region
let liveRegion;
export function announce(message, politeness = 'polite') {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
    liveRegion.style.whiteSpace = 'nowrap';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
} 