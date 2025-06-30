"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMaxLength = exports.hasMinLength = exports.isNotEmpty = exports.isInRange = exports.isValidDate = exports.isValidPhone = exports.isValidUrl = exports.isValidPassword = exports.isValidEmail = void 0;
/**
 * Validate an email address
 * @param email Email address to validate
 */
var isValidEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.isValidEmail = isValidEmail;
/**
 * Validate a password (minimum 8 characters, at least one letter and one number)
 * @param password Password to validate
 */
var isValidPassword = function (password) {
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
};
exports.isValidPassword = isValidPassword;
/**
 * Validate a URL
 * @param url URL to validate
 */
var isValidUrl = function (url) {
    try {
        new URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
/**
 * Validate a phone number
 * @param phone Phone number to validate
 */
var isValidPhone = function (phone) {
    var re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
};
exports.isValidPhone = isValidPhone;
/**
 * Validate a date string (YYYY-MM-DD)
 * @param dateString Date string to validate
 */
var isValidDate = function (dateString) {
    var re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(dateString))
        return false;
    var date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
/**
 * Validate a number is within a range
 * @param value Number to validate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
var isInRange = function (value, min, max) {
    return value >= min && value <= max;
};
exports.isInRange = isInRange;
/**
 * Validate a string is not empty
 * @param value String to validate
 */
var isNotEmpty = function (value) {
    return value.trim().length > 0;
};
exports.isNotEmpty = isNotEmpty;
/**
 * Validate a string has a minimum length
 * @param value String to validate
 * @param minLength Minimum length
 */
var hasMinLength = function (value, minLength) {
    return value.length >= minLength;
};
exports.hasMinLength = hasMinLength;
/**
 * Validate a string has a maximum length
 * @param value String to validate
 * @param maxLength Maximum length
 */
var hasMaxLength = function (value, maxLength) {
    return value.length <= maxLength;
};
exports.hasMaxLength = hasMaxLength;
