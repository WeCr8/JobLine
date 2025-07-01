/**
 * Validate an email address
 * @param email Email address to validate
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validate a password (minimum 8 characters, at least one letter and one number)
 * @param password Password to validate
 */
export declare const isValidPassword: (password: string) => boolean;
/**
 * Validate a URL
 * @param url URL to validate
 */
export declare const isValidUrl: (url: string) => boolean;
/**
 * Validate a phone number
 * @param phone Phone number to validate
 */
export declare const isValidPhone: (phone: string) => boolean;
/**
 * Validate a date string (YYYY-MM-DD)
 * @param dateString Date string to validate
 */
export declare const isValidDate: (dateString: string) => boolean;
/**
 * Validate a number is within a range
 * @param value Number to validate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
export declare const isInRange: (value: number, min: number, max: number) => boolean;
/**
 * Validate a string is not empty
 * @param value String to validate
 */
export declare const isNotEmpty: (value: string) => boolean;
/**
 * Validate a string has a minimum length
 * @param value String to validate
 * @param minLength Minimum length
 */
export declare const hasMinLength: (value: string, minLength: number) => boolean;
/**
 * Validate a string has a maximum length
 * @param value String to validate
 * @param maxLength Maximum length
 */
export declare const hasMaxLength: (value: string, maxLength: number) => boolean;
