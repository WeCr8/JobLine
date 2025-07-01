/**
 * Validate an email address
 * @param email Email address to validate
 */
export const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
/**
 * Validate a password (minimum 8 characters, at least one letter and one number)
 * @param password Password to validate
 */
export const isValidPassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
};
/**
 * Validate a URL
 * @param url URL to validate
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
};
/**
 * Validate a phone number
 * @param phone Phone number to validate
 */
export const isValidPhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
};
/**
 * Validate a date string (YYYY-MM-DD)
 * @param dateString Date string to validate
 */
export const isValidDate = (dateString) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(dateString))
        return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
/**
 * Validate a number is within a range
 * @param value Number to validate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
export const isInRange = (value, min, max) => {
    return value >= min && value <= max;
};
/**
 * Validate a string is not empty
 * @param value String to validate
 */
export const isNotEmpty = (value) => {
    return value.trim().length > 0;
};
/**
 * Validate a string has a minimum length
 * @param value String to validate
 * @param minLength Minimum length
 */
export const hasMinLength = (value, minLength) => {
    return value.length >= minLength;
};
/**
 * Validate a string has a maximum length
 * @param value String to validate
 * @param maxLength Maximum length
 */
export const hasMaxLength = (value, maxLength) => {
    return value.length <= maxLength;
};
