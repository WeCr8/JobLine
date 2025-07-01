// Deep clone (using structuredClone if available, fallback to JSON)
export function deepClone(obj) {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
// Deep merge (simple recursive merge)
export function deepMerge(target, source) {
    const output = { ...target };
    function isPlainObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    }
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) &&
            isPlainObject(source[key]) &&
            isPlainObject(output[key])) {
            output[key] = deepMerge(output[key], source[key]);
        }
        else if (isPlainObject(source[key])) {
            output[key] = deepMerge({}, source[key]);
        }
        else {
            output[key] = source[key];
        }
    }
    return output;
}
// Deep equality
export function deepEqual(a, b) {
    if (a === b)
        return true;
    if (typeof a !== typeof b)
        return false;
    if (typeof a !== 'object' || a === null || b === null)
        return false;
    if (Array.isArray(a) !== Array.isArray(b))
        return false;
    if (Array.isArray(a)) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i]))
                return false;
        }
        return true;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (!deepEqual(a[key], b[key]))
            return false;
    }
    return true;
}
// Array chunk
export function chunk(arr, size) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size));
    }
    return res;
}
// Array shuffle (Fisher-Yates)
export function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
// Unique (by value)
export function unique(arr) {
    return Array.from(new Set(arr));
}
// Intersection
export function intersection(a, b) {
    const setB = new Set(b);
    return a.filter(x => setB.has(x));
}
// Difference
export function difference(a, b) {
    const setB = new Set(b);
    return a.filter(x => !setB.has(x));
}
