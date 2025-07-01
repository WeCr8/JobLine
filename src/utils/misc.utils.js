// UUID v4 (RFC4122 compliant)
export function uuidv4() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// Idle detection (returns a stop function)
export function onIdle(timeout, callback) {
    let timer;
    const reset = () => {
        if (timer)
            clearTimeout(timer);
        timer = window.setTimeout(callback, timeout);
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    for (const evt of events) {
        window.addEventListener(evt, reset);
    }
    reset();
    return () => {
        if (timer)
            clearTimeout(timer);
        for (const evt of events) {
            window.removeEventListener(evt, reset);
        }
    };
}
// Visibility detection
export function onVisibilityChange(callback) {
    const handler = () => callback(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
}
// Performance measurement
export function measurePerformance(fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    return { result, duration };
}
