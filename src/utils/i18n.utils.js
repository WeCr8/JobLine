// Locale-aware sorting
export function localeSort(arr, key, locale = navigator.language) {
    if (key) {
        return arr.slice().sort((a, b) => String(a[key]).localeCompare(String(b[key]), locale));
    }
    return arr.slice().sort((a, b) => String(a).localeCompare(String(b), locale));
}
// Pluralization
export function pluralize(count, singular, plural) {
    if (count === 1)
        return singular;
    return plural || singular + 's';
}
// Date localization
export function localizeDate(date, locale = navigator.language, options) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, options);
}
// Number localization
export function localizeNumber(num, locale = navigator.language, options) {
    return num.toLocaleString(locale, options);
}
