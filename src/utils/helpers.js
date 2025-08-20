/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after ms
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry async function with exponential backoff
 * @param {function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Safe JSON parse
 * @param {string} str - JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} Parsed object or fallback
 */
export const safeJsonParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return fallback;
  }
};

/**
 * Safe JSON stringify
 * @param {any} obj - Object to stringify
 * @param {string} fallback - Fallback string if stringify fails
 * @returns {string} JSON string or fallback
 */
export const safeJsonStringify = (obj, fallback = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return fallback;
  }
};

/**
 * Get nested object property safely
 * @param {object} obj - Object to traverse
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if path doesn't exist
 * @returns {any} Value at path or default value
 */
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object' || !path) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }

  return current;
};

/**
 * Set nested object property safely
 * @param {object} obj - Object to modify
 * @param {string} path - Dot notation path
 * @param {any} value - Value to set
 * @returns {object} Modified object
 */
export const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
};

/**
 * Remove duplicates from array
 * @param {array} arr - Array to deduplicate
 * @param {string|function} key - Key to compare by or comparison function
 * @returns {array} Array without duplicates
 */
export const removeDuplicates = (arr, key) => {
  if (!Array.isArray(arr)) return [];

  if (!key) {
    return [...new Set(arr)];
  }

  if (typeof key === 'string') {
    const seen = new Set();
    return arr.filter(item => {
      const value = getNestedProperty(item, key);
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  if (typeof key === 'function') {
    const seen = new Set();
    return arr.filter(item => {
      const value = key(item);
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  return arr;
};

/**
 * Group array by key
 * @param {array} arr - Array to group
 * @param {string|function} key - Key to group by or grouping function
 * @returns {object} Grouped object
 */
export const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {};

  return arr.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : getNestedProperty(item, key);
    const group = groups[groupKey] || [];
    group.push(item);
    groups[groupKey] = group;
    return groups;
  }, {});
};

/**
 * Sort array by multiple criteria
 * @param {array} arr - Array to sort
 * @param {array} sortBy - Array of sort criteria
 * @returns {array} Sorted array
 */
export const multiSort = (arr, sortBy) => {
  if (!Array.isArray(arr) || !Array.isArray(sortBy)) return arr;

  return [...arr].sort((a, b) => {
    for (const { key, direction = 'asc' } of sortBy) {
      const aVal = getNestedProperty(a, key);
      const bVal = getNestedProperty(b, key);

      if (aVal < bVal) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });
};

/**
 * Check if value is valid email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if value is valid phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @param {string} chars - Characters to use
 * @returns {string} Random string
 */
export const randomString = (length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Calculate age from date of birth
 * @param {string|Date} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Convert bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Human readable size
 */
export const humanFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get contrast color (black or white) for a given color
 * @param {string} hexColor - Hex color string
 * @returns {string} 'black' or 'white'
 */
export const getContrastColor = (hexColor) => {
  const color = hexColor.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
};

/**
 * Merge objects deeply
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} Merged object
 */
export const mergeDeep = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

export default {
  generateId,
  deepClone,
  debounce,
  throttle,
  isEmpty,
  sleep,
  retryWithBackoff,
  safeJsonParse,
  safeJsonStringify,
  getNestedProperty,
  setNestedProperty,
  removeDuplicates,
  groupBy,
  multiSort,
  isValidEmail,
  isValidPhone,
  randomString,
  calculateAge,
  humanFileSize,
  getContrastColor,
  mergeDeep,
};