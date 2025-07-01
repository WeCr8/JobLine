// requestAnimationFrame throttling
export function rafThrottle(fn) {
    let ticking = false;
    let lastArgs;
    // @ts-ignore
    return function (...args) {
        lastArgs = args;
        if (!ticking) {
            requestAnimationFrame(() => {
                fn(...lastArgs);
                ticking = false;
            });
            ticking = true;
        }
    };
}
// Smooth scroll to element or position
export function smoothScrollTo(target, options) {
    if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth', ...options });
    }
    else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
// CSS class toggling with animation support
export function toggleClass(el, className, force) {
    if (typeof force === 'boolean') {
        el.classList.toggle(className, force);
    }
    else {
        el.classList.toggle(className);
    }
}
// Animate class (add, then remove after animation ends)
export function animateClass(el, className) {
    el.classList.add(className);
    function remove() {
        el.classList.remove(className);
        el.removeEventListener('animationend', remove);
        el.removeEventListener('transitionend', remove);
    }
    el.addEventListener('animationend', remove);
    el.addEventListener('transitionend', remove);
}
