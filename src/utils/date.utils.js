import { format, formatDistanceToNow, formatDuration, add, sub, parseISO, differenceInMilliseconds, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, isValid } from 'date-fns';
/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
    try {
        return format(new Date(dateString), formatStr);
    }
    catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};
/**
 * Format a date string to a readable date and time format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy HH:mm:ss')
 */
export const formatDateTime = (dateString, formatStr = 'MMM dd, yyyy HH:mm:ss') => {
    try {
        return format(new Date(dateString), formatStr);
    }
    catch (error) {
        console.error('Error formatting date time:', error);
        return 'Invalid date';
    }
};
/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 */
export const formatRelativeTime = (dateString) => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    }
    catch (error) {
        console.error('Error formatting relative time:', error);
        return 'Invalid date';
    }
};
/**
 * Format a Unix timestamp to a readable date format
 * @param timestamp Unix timestamp in seconds
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export const formatUnixTimestamp = (timestamp, formatStr = 'MMM dd, yyyy') => {
    try {
        return format(new Date(timestamp * 1000), formatStr);
    }
    catch (error) {
        console.error('Error formatting Unix timestamp:', error);
        return 'Invalid date';
    }
};
/**
 * Get the start of a date range based on a period
 * @param period Period type ('today', 'yesterday', 'week', 'month', 'year')
 */
export const getDateRangeStart = (period) => {
    const now = new Date();
    switch (period) {
        case 'today':
            return new Date(now.setHours(0, 0, 0, 0));
        case 'yesterday':
            return sub(new Date(now.setHours(0, 0, 0, 0)), { days: 1 });
        case 'week':
            return sub(now, { weeks: 1 });
        case 'month':
            return sub(now, { months: 1 });
        case 'year':
            return sub(now, { years: 1 });
        default:
            return new Date(0); // beginning of time
    }
};
// Timezone conversion (using Intl API)
export function toTimeZone(date, timeZone) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    // Format to parts in target timezone, then reconstruct Date
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(d);
    const get = (type) => Number(parts.find(p => p.type === type)?.value);
    return new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
}
// Relative time (e.g., '5 minutes ago')
export function relativeTime(date) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
}
// Duration formatting (e.g., '1h 23m')
export function formatDurationMs(ms) {
    const sec = Math.floor(ms / 1000);
    const duration = {
        hours: Math.floor(sec / 3600),
        minutes: Math.floor((sec % 3600) / 60),
        seconds: sec % 60
    };
    return formatDuration(duration, { format: ['hours', 'minutes', 'seconds'] });
}
// Date math (add/subtract)
export function addToDate(date, duration) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return add(d, duration);
}
export function subFromDate(date, duration) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return sub(d, duration);
}
// Difference helpers
export function diffInMilliseconds(a, b) {
    return differenceInMilliseconds(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b);
}
export function diffInSeconds(a, b) {
    return differenceInSeconds(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b);
}
export function diffInMinutes(a, b) {
    return differenceInMinutes(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b);
}
export function diffInHours(a, b) {
    return differenceInHours(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b);
}
export function diffInDays(a, b) {
    return differenceInDays(typeof a === 'string' ? parseISO(a) : a, typeof b === 'string' ? parseISO(b) : b);
}
// Safe date parse
export function safeParseDate(date) {
    if (date instanceof Date && isValid(date))
        return date;
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? d : null;
}
// Format date (wrapper)
export function formatDateWrapper(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
}
