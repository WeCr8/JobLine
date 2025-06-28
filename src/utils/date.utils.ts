import { format, formatDistance, formatRelative, subDays } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date string to a readable date and time format
 * @param dateString ISO date string
 * @param formatStr Format string (default: 'MMM dd, yyyy HH:mm:ss')
 */
export const formatDateTime = (dateString: string, formatStr: string = 'MMM dd, yyyy HH:mm:ss'): string => {
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format a Unix timestamp to a readable date format
 * @param timestamp Unix timestamp in seconds
 * @param formatStr Format string (default: 'MMM dd, yyyy')
 */
export const formatUnixTimestamp = (timestamp: number, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    return format(new Date(timestamp * 1000), formatStr);
  } catch (error) {
    console.error('Error formatting Unix timestamp:', error);
    return 'Invalid date';
  }
};

/**
 * Get the start of a date range based on a period
 * @param period Period type ('today', 'yesterday', 'week', 'month', 'year')
 */
export const getDateRangeStart = (period: string): Date => {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'yesterday':
      return subDays(new Date(now.setHours(0, 0, 0, 0)), 1);
    case 'week':
      return subDays(now, 7);
    case 'month':
      return subDays(now, 30);
    case 'year':
      return subDays(now, 365);
    default:
      return new Date(0); // beginning of time
  }
};