/**
 * Format a status string to title case with spaces
 * @param status Status string with hyphens
 */
export declare const formatStatus: (status: string) => string;
/**
 * Format a role string to a readable format
 * @param role Role string
 */
export declare const formatRole: (role: string) => string;
/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 */
export declare const formatFileSize: (bytes: number) => string;
/**
 * Format a duration in seconds to a human-readable string (MM:SS)
 * @param seconds Duration in seconds
 */
export declare const formatDuration: (seconds: number) => string;
/**
 * Format a number with commas as thousands separators
 * @param num Number to format
 */
export declare const formatNumber: (num: number) => string;
/**
 * Format a currency value
 * @param amount Amount in cents
 * @param currency Currency code (default: 'USD')
 */
export declare const formatCurrency: (amount: number, currency?: string) => string;
/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default: 0)
 */
export declare const formatPercentage: (value: number, decimals?: number) => string;
