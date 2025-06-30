"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefersHighContrast = exports.prefersReducedMotion = exports.addKeyboardNavigation = exports.announceToScreenReader = exports.clearBodyScrollLocks = exports.lockBodyScroll = exports.createAccessibleFocusTrap = void 0;
var body_scroll_lock_1 = require("body-scroll-lock");
var focus_trap_1 = require("focus-trap");
/**
 * Accessibility utilities for cross-platform compatibility
 */
// Create a focus trap for modals and dialogs
var createAccessibleFocusTrap = function (element) {
    var trap = (0, focus_trap_1.createFocusTrap)(element, {
        allowOutsideClick: true,
        escapeDeactivates: true,
        fallbackFocus: element
    });
    return {
        activate: function () { return trap.activate(); },
        deactivate: function () { return trap.deactivate(); }
    };
};
exports.createAccessibleFocusTrap = createAccessibleFocusTrap;
// Lock body scroll for modals
var lockBodyScroll = function (element) {
    (0, body_scroll_lock_1.disableBodyScroll)(element, {
        reserveScrollBarGap: true
    });
    return function () {
        (0, body_scroll_lock_1.enableBodyScroll)(element);
    };
};
exports.lockBodyScroll = lockBodyScroll;
// Clear all body scroll locks (useful in cleanup)
var clearBodyScrollLocks = function () {
    (0, body_scroll_lock_1.clearAllBodyScrollLocks)();
};
exports.clearBodyScrollLocks = clearBodyScrollLocks;
// Announce message to screen readers
var announceToScreenReader = function (message) {
    var announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    // Set the message after a small delay to ensure it's announced
    setTimeout(function () {
        announcer.textContent = message;
        // Clean up after announcement
        setTimeout(function () {
            document.body.removeChild(announcer);
        }, 1000);
    }, 100);
};
exports.announceToScreenReader = announceToScreenReader;
// Add keyboard navigation to a list of items
var addKeyboardNavigation = function (containerElement, itemSelector, onSelect) {
    var handleKeyDown = function (event) {
        var _a, _b;
        var items = Array.from(containerElement.querySelectorAll(itemSelector));
        var currentIndex = items.findIndex(function (item) { return item === document.activeElement; });
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
                (_a = items[0]) === null || _a === void 0 ? void 0 : _a.focus();
                break;
            case 'End':
                event.preventDefault();
                (_b = items[items.length - 1]) === null || _b === void 0 ? void 0 : _b.focus();
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
    return function () {
        containerElement.removeEventListener('keydown', handleKeyDown);
    };
};
exports.addKeyboardNavigation = addKeyboardNavigation;
// Check if reduced motion is preferred
var prefersReducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
exports.prefersReducedMotion = prefersReducedMotion;
// Check if high contrast mode is active
var prefersHighContrast = function () {
    return window.matchMedia('(prefers-contrast: more)').matches;
};
exports.prefersHighContrast = prefersHighContrast;
