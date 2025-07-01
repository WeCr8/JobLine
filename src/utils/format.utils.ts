/**
 * Format a status string to title case with spaces
 * @param status Status string with hyphens
 */
export const formatStatus = (status: string): string => {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Format a role string to a readable format
 * @param role Role string
 */
export const formatRole = (role: string): string => {
  if (role === 'organization_admin') return 'Org Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format a duration in seconds to a human-readable string (MM:SS)
 * @param seconds Duration in seconds
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a number with commas as thousands separators
 * @param num Number to format
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a percentage value
 * @param value Percentage value (0-100)
 * @param decimals Number of decimal places (default: 0)
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

// Slugify
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// camelCase
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toLowerCase())
}

// kebab-case
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

// Number formatting
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}
export function formatPercent(value: number, locale = 'en-US', digits = 2): string {
  return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value)
}

// Masking utilities
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2')
}
export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!user || !domain) return email
  return user[0] + '***' + user.slice(-1) + '@' + domain
}
export function maskId(id: string, visible = 4): string {
  if (id.length <= visible) return id
  return '*'.repeat(id.length - visible) + id.slice(-visible)
}