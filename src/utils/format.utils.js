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
 * Format a currency value
 * @param amount Amount in cents
 * @param currency Currency code (default: 'USD')
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    }).format(amount / 100);
};
/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default: 0)
 */
export const formatPercentage = (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
};
