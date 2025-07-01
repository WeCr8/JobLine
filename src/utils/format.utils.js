/**
 * Format a status string to title case with spaces
 * @param status Status string with hyphens
 */
export const formatStatus = (status) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
/**
 * Format a role string to a readable format
 * @param role Role string
 */
export const formatRole = (role) => {
    if (role === 'organization_admin')
        return 'Org Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
};
/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 */
export const formatFileSize = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};
/**
 * Format a duration in seconds to a human-readable string (MM:SS)
 * @param seconds Duration in seconds
 */
export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
/**
 * Format a number with commas as thousands separators
 * @param num Number to format
 */
export const formatNumber = (num) => {
    return num.toLocaleString();
};
/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default: 0)
 */
export const formatPercentage = (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
};
// Slugify
export function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
// camelCase
export function camelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (m) => m.toLowerCase());
}
// kebab-case
export function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
}
// Number formatting
export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
export function formatPercent(value, locale = 'en-US', digits = 2) {
    return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
export function formatCompactNumber(value, locale = 'en-US') {
    return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
}
// Masking utilities
export function maskPhone(phone) {
    return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
}
export function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!user || !domain)
        return email;
    return user[0] + '***' + user.slice(-1) + '@' + domain;
}
export function maskId(id, visible = 4) {
    if (id.length <= visible)
        return id;
    return '*'.repeat(id.length - visible) + id.slice(-visible);
}
