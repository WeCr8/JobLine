/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export declare const formatDate: (dateString: string, formatStr?: string) => string;
/**
 * Format a date string to a readable date and time format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy HH:mm:ss')
 */
export declare const formatDateTime: (dateString: string, formatStr?: string) => string;
/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 */
export declare const formatRelativeTime: (dateString: string) => string;
/**
 * Format a Unix timestamp to a readable date format
 * @param timestamp Unix timestamp in seconds
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export declare const formatUnixTimestamp: (timestamp: number, formatStr?: string) => string;
/**
 * Get the start of a date range based on a period
 * @param period Period type ('today', 'yesterday', 'week', 'month', 'year')
 */
export declare const getDateRangeStart: (period: string) => Date;
