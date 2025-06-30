"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRangeStart = exports.formatUnixTimestamp = exports.formatRelativeTime = exports.formatDateTime = exports.formatDate = void 0;
var date_fns_1 = require("date-fns");
/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
var formatDate = function (dateString, formatStr) {
    if (formatStr === void 0) { formatStr = 'MMM dd, yyyy'; }
    try {
        return (0, date_fns_1.format)(new Date(dateString), formatStr);
    }
    catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};
exports.formatDate = formatDate;
/**
 * Format a date string to a readable date and time format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy HH:mm:ss')
 */
var formatDateTime = function (dateString, formatStr) {
    if (formatStr === void 0) { formatStr = 'MMM dd, yyyy HH:mm:ss'; }
    try {
        return (0, date_fns_1.format)(new Date(dateString), formatStr);
    }
    catch (error) {
        console.error('Error formatting date time:', error);
        return 'Invalid date';
    }
};
exports.formatDateTime = formatDateTime;
/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 */
var formatRelativeTime = function (dateString) {
    try {
        return (0, date_fns_1.formatDistance)(new Date(dateString), new Date(), { addSuffix: true });
    }
    catch (error) {
        console.error('Error formatting relative time:', error);
        return 'Invalid date';
    }
};
exports.formatRelativeTime = formatRelativeTime;
/**
 * Format a Unix timestamp to a readable date format
 * @param timestamp Unix timestamp in seconds
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
var formatUnixTimestamp = function (timestamp, formatStr) {
    if (formatStr === void 0) { formatStr = 'MMM dd, yyyy'; }
    try {
        return (0, date_fns_1.format)(new Date(timestamp * 1000), formatStr);
    }
    catch (error) {
        console.error('Error formatting Unix timestamp:', error);
        return 'Invalid date';
    }
};
exports.formatUnixTimestamp = formatUnixTimestamp;
/**
 * Get the start of a date range based on a period
 * @param period Period type ('today', 'yesterday', 'week', 'month', 'year')
 */
var getDateRangeStart = function (period) {
    var now = new Date();
    switch (period) {
        case 'today':
            return new Date(now.setHours(0, 0, 0, 0));
        case 'yesterday':
            return (0, date_fns_1.subDays)(new Date(now.setHours(0, 0, 0, 0)), 1);
        case 'week':
            return (0, date_fns_1.subDays)(now, 7);
        case 'month':
            return (0, date_fns_1.subDays)(now, 30);
        case 'year':
            return (0, date_fns_1.subDays)(now, 365);
        default:
            return new Date(0); // beginning of time
    }
};
exports.getDateRangeStart = getDateRangeStart;
