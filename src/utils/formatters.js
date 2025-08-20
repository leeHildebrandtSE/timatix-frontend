import { TIME_FORMATS } from './constants';

/**
 * Format currency amount to South African Rand
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: ZAR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'ZAR') => {
  if (amount === null || amount === undefined) {
    return 'R 0.00';
  }

  const numericAmount = parseFloat(amount);
  
  if (isNaN(numericAmount)) {
    return 'R 0.00';
  }

  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type (see TIME_FORMATS)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = TIME_FORMATS.DISPLAY_DATE) => {
  if (!date) return 'Not set';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case TIME_FORMATS.DISPLAY_DATE:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    
    case TIME_FORMATS.DISPLAY_DATETIME:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    
    case TIME_FORMATS.DATE:
      return dateObj.toISOString().split('T')[0];
    
    case TIME_FORMATS.TIME:
      return dateObj.toTimeString().split(' ')[0].slice(0, 5);
    
    case TIME_FORMATS.DATETIME:
      return dateObj.toISOString().slice(0, 16);
    
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Format time to readable string
 * @param {string} time - Time string (HH:mm format)
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  if (!time) return 'Not set';

  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return 'Invalid time';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';

  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

/**
 * Format phone number
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // South African phone number formatting
  if (digits.startsWith('27')) {
    // International format
    const localNumber = digits.slice(2);
    if (localNumber.length === 9) {
      return `+27 ${localNumber.slice(0, 2)} ${localNumber.slice(2, 5)} ${localNumber.slice(5)}`;
    }
  } else if (digits.startsWith('0') && digits.length === 10) {
    // Local format
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phoneNumber; // Return original if no format matches
};

/**
 * Format vehicle identification
 * @param {object} vehicle - Vehicle object
 * @returns {string} Formatted vehicle string
 */
export const formatVehicleName = (vehicle) => {
  if (!vehicle) return 'Unknown Vehicle';

  const parts = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean);
  return parts.join(' ') || 'Unknown Vehicle';
};

/**
 * Format mileage
 * @param {number} mileage - Mileage number
 * @param {string} unit - Unit (km, miles)
 * @returns {string} Formatted mileage string
 */
export const formatMileage = (mileage, unit = 'km') => {
  if (!mileage && mileage !== 0) return 'Not recorded';

  const numericMileage = parseFloat(mileage);
  
  if (isNaN(numericMileage)) {
    return 'Invalid mileage';
  }

  return `${numericMileage.toLocaleString()} ${unit}`;
};

/**
 * Format status for display
 * @param {string} status - Status string
 * @returns {string} Formatted status string
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';

  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) {
    return '0%';
  }

  const numericValue = parseFloat(value);
  
  if (isNaN(numericValue)) {
    return '0%';
  }

  return `${numericValue.toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatRelativeTime,
  formatPhoneNumber,
  formatVehicleName,
  formatMileage,
  formatStatus,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalizeWords,
};