"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPercentage = exports.formatCurrency = exports.formatNumber = exports.formatDuration = exports.formatFileSize = exports.formatRole = exports.formatStatus = void 0;
/**
 * Format a status string to title case with spaces
 * @param status Status string with hyphens
 */
var formatStatus = function (status) {
    return status.split('-').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};
exports.formatStatus = formatStatus;
/**
 * Format a role string to a readable format
 * @param role Role string
 */
var formatRole = function (role) {
    if (role === 'organization_admin')
        return 'Org Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
};
exports.formatRole = formatRole;
/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 */
var formatFileSize = function (bytes) {
    var sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 B';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};
exports.formatFileSize = formatFileSize;
/**
 * Format a duration in seconds to a human-readable string (MM:SS)
 * @param seconds Duration in seconds
 */
var formatDuration = function (seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return "".concat(mins, ":").concat(secs.toString().padStart(2, '0'));
};
exports.formatDuration = formatDuration;
/**
 * Format a number with commas as thousands separators
 * @param num Number to format
 */
var formatNumber = function (num) {
    return num.toLocaleString();
};
exports.formatNumber = formatNumber;
/**
 * Format a currency value
 * @param amount Amount in cents
 * @param currency Currency code (default: 'USD')
 */
var formatCurrency = function (amount, currency) {
    if (currency === void 0) { currency = 'USD'; }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount / 100);
};
exports.formatCurrency = formatCurrency;
/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default: 0)
 */
var formatPercentage = function (value, decimals) {
    if (decimals === void 0) { decimals = 0; }
    return "".concat(value.toFixed(decimals), "%");
};
exports.formatPercentage = formatPercentage;
