import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import createFocusTrap from 'focus-trap';
/**
 * Accessibility utilities for cross-platform compatibility
 */
// Create a focus trap for modals and dialogs
export const createAccessibleFocusTrap = (element) => {
    const trap = createFocusTrap(element, {
        allowOutsideClick: true,
        escapeDeactivates: true,
        fallbackFocus: element
    });
    return {
        activate: () => trap.activate(),
        deactivate: () => trap.deactivate()
    };
};
// Lock body scroll for modals
export const lockBodyScroll = (element) => {
    disableBodyScroll(element);
    return () => {
        enableBodyScroll(element);
    };
};
// Clear all body scroll locks (useful in cleanup)
export const clearBodyScrollLocks = () => {
    clearAllBodyScrollLocks();
};
// Announce message to screen readers
export const announceToScreenReader = (message) => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    // Set the message after a small delay to ensure it's announced
    setTimeout(() => {
        announcer.textContent = message;
        // Clean up after announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }, 100);
};
// Add keyboard navigation to a list of items
export const addKeyboardNavigation = (containerElement, itemSelector, onSelect) => {
    const handleKeyDown = (event) => {
        const items = Array.from(containerElement.querySelectorAll(itemSelector));
        const currentIndex = items.findIndex(item => item === document.activeElement);
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex - 1].focus();
                }
                break;
            case 'Home':
                event.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (currentIndex !== -1) {
                    onSelect(items[currentIndex]);
                }
                break;
        }
    };
    containerElement.addEventListener('keydown', handleKeyDown);
    // Return cleanup function
    return () => {
        containerElement.removeEventListener('keydown', handleKeyDown);
    };
};
// Check if reduced motion is preferred
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
// Check if high contrast mode is active
export const prefersHighContrast = () => {
    return window.matchMedia('(prefers-contrast: more)').matches;
};
