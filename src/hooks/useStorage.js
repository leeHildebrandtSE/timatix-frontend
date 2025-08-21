import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storage';

/**
 * Custom hook for managing local storage with React state synchronization
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @param {object} options - Configuration options
 * @returns {object} Storage state and methods
 */
export const useStorage = (key, defaultValue = null, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = null,
    syncOnMount = true,
  } = options;

  const [storedValue, setStoredValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load value from storage on mount
  useEffect(() => {
    if (syncOnMount) {
      loadValue();
    } else {
      setLoading(false);
    }
  }, [key, syncOnMount]);

  const loadValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const value = await storageService.get(key, defaultValue);
      setStoredValue(value);
    } catch (err) {
      console.error(`Error loading value for key "${key}":`, err);
      setError(err);
      setStoredValue(defaultValue);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, onError]);

  // Save value to storage and update state
  const setValue = useCallback(async (value) => {
    try {
      setError(null);
      
      // Allow function updates like useState
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      
      const success = await storageService.set(key, valueToStore);
      
      if (success) {
        setStoredValue(valueToStore);
      } else {
        throw new Error('Failed to save value to storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error saving value for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, storedValue, onError]);

  // Remove value from storage and reset state
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      
      const success = await storageService.remove(key);
      
      if (success) {
        setStoredValue(defaultValue);
      } else {
        throw new Error('Failed to remove value from storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error removing value for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, defaultValue, onError]);

  // Check if key exists in storage
  const exists = useCallback(async () => {
    try {
      return await storageService.exists(key);
    } catch (err) {
      console.error(`Error checking existence for key "${key}":`, err);
      return false;
    }
  }, [key]);

  // Reload value from storage
  const reload = useCallback(() => {
    return loadValue();
  }, [loadValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    exists,
    reload,
    loading,
    error,
    hasError: !!error,
  };
};

/**
 * Hook for managing multiple storage keys
 * @param {object} keys - Object with key-defaultValue pairs
 * @param {object} options - Configuration options
 * @returns {object} Storage state and methods for all keys
 */
export const useMultipleStorage = (keys, options = {}) => {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const { onError = null } = options;

  useEffect(() => {
    loadAllValues();
  }, []);

  const loadAllValues = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});

      const keysList = Object.keys(keys);
      const loadedValues = await storageService.getMultiple(keysList);
      
      // Apply default values for missing keys
      const processedValues = {};
      keysList.forEach(key => {
        processedValues[key] = loadedValues[key] !== null ? loadedValues[key] : keys[key];
      });
      
      setValues(processedValues);
    } catch (err) {
      console.error('Error loading multiple values:', err);
      setErrors({ global: err });
      
      // Set default values on error
      setValues(keys);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [keys, onError]);

  const setValue = useCallback(async (key, value) => {
    try {
      setErrors(prev => ({ ...prev, [key]: null }));
      
      const valueToStore = typeof value === 'function' ? value(values[key]) : value;
      
      const success = await storageService.set(key, valueToStore);
      
      if (success) {
        setValues(prev => ({ ...prev, [key]: valueToStore }));
      } else {
        throw new Error('Failed to save value to storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error saving value for key "${key}":`, err);
      setErrors(prev => ({ ...prev, [key]: err }));
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [values, onError]);

  const setMultipleValues = useCallback(async (newValues) => {
    try {
      setErrors({});
      
      const success = await storageService.setMultiple(newValues);
      
      if (success) {
        setValues(prev => ({ ...prev, ...newValues }));
      } else {
        throw new Error('Failed to save multiple values to storage');
      }
      
      return success;
    } catch (err) {
      console.error('Error saving multiple values:', err);
      setErrors({ global: err });
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [onError]);

  const removeValue = useCallback(async (key) => {
    try {
      setErrors(prev => ({ ...prev, [key]: null }));
      
      const success = await storageService.remove(key);
      
      if (success) {
        setValues(prev => ({ ...prev, [key]: keys[key] })); // Reset to default
      } else {
        throw new Error('Failed to remove value from storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error removing value for key "${key}":`, err);
      setErrors(prev => ({ ...prev, [key]: err }));
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [keys, onError]);

  return {
    values,
    setValue,
    setMultipleValues,
    removeValue,
    reload: loadAllValues,
    loading,
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

/**
 * Hook for managing storage with expiration
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value
 * @param {number} expirationMs - Expiration time in milliseconds
 * @param {object} options - Configuration options
 * @returns {object} Storage state and methods
 */
export const useStorageWithExpiration = (key, defaultValue = null, expirationMs = 24 * 60 * 60 * 1000, options = {}) => {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  const { onError = null, onExpiration = null } = options;

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsExpired(false);
      
      const value = await storageService.getWithExpiration(key, defaultValue);
      
      if (value === defaultValue) {
        // Value was expired or didn't exist
        setIsExpired(true);
        if (onExpiration) {
          onExpiration();
        }
      }
      
      setStoredValue(value);
    } catch (err) {
      console.error(`Error loading value with expiration for key "${key}":`, err);
      setError(err);
      setStoredValue(defaultValue);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, onError, onExpiration]);

  const setValue = useCallback(async (value) => {
    try {
      setError(null);
      setIsExpired(false);
      
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      
      const success = await storageService.setWithExpiration(key, valueToStore, expirationMs);
      
      if (success) {
        setStoredValue(valueToStore);
      } else {
        throw new Error('Failed to save value with expiration to storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error saving value with expiration for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, storedValue, expirationMs, onError]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setIsExpired(false);
      
      const success = await storageService.remove(key);
      
      if (success) {
        setStoredValue(defaultValue);
      } else {
        throw new Error('Failed to remove value from storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error removing value for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, defaultValue, onError]);

  const refresh = useCallback(() => {
    return loadValue();
  }, [loadValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    refresh,
    loading,
    error,
    isExpired,
    hasError: !!error,
  };
};

/**
 * Hook for secure storage operations
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value
 * @param {object} options - Configuration options
 * @returns {object} Secure storage state and methods
 */
export const useSecureStorage = (key, defaultValue = null, options = {}) => {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { onError = null } = options;

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const value = await storageService.getSecure(key, defaultValue);
      setStoredValue(value);
    } catch (err) {
      console.error(`Error loading secure value for key "${key}":`, err);
      setError(err);
      setStoredValue(defaultValue);
      
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, onError]);

  const setValue = useCallback(async (value) => {
    try {
      setError(null);
      
      const valueToStore = typeof value === 'function' ? value(storedValue) : value;
      
      const success = await storageService.setSecure(key, valueToStore);
      
      if (success) {
        setStoredValue(valueToStore);
      } else {
        throw new Error('Failed to save value to secure storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error saving secure value for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, storedValue, onError]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      
      const success = await storageService.removeSecure(key);
      
      if (success) {
        setStoredValue(defaultValue);
      } else {
        throw new Error('Failed to remove value from secure storage');
      }
      
      return success;
    } catch (err) {
      console.error(`Error removing secure value for key "${key}":`, err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    }
  }, [key, defaultValue, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    reload: loadValue,
    loading,
    error,
    hasError: !!error,
  };
};

/**
 * Hook for managing storage cleanup operations
 * @param {object} options - Configuration options
 * @returns {object} Cleanup methods and status
 */
export const useStorageCleanup = (options = {}) => {
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupError, setCleanupError] = useState(null);
  const [lastCleanup, setLastCleanup] = useState(null);

  const { onError = null, onSuccess = null } = options;

  const cleanupExpired = useCallback(async () => {
    try {
      setCleanupLoading(true);
      setCleanupError(null);
      
      const removedCount = await storageService.cleanupExpired();
      setLastCleanup(new Date());
      
      if (onSuccess) {
        onSuccess(removedCount);
      }
      
      return removedCount;
    } catch (err) {
      console.error('Error during storage cleanup:', err);
      setCleanupError(err);
      
      if (onError) {
        onError(err);
      }
      
      return 0;
    } finally {
      setCleanupLoading(false);
    }
  }, [onError, onSuccess]);

  const clearAllStorage = useCallback(async () => {
    try {
      setCleanupLoading(true);
      setCleanupError(null);
      
      const success = await storageService.clear();
      setLastCleanup(new Date());
      
      if (onSuccess) {
        onSuccess(success);
      }
      
      return success;
    } catch (err) {
      console.error('Error clearing all storage:', err);
      setCleanupError(err);
      
      if (onError) {
        onError(err);
      }
      
      return false;
    } finally {
      setCleanupLoading(false);
    }
  }, [onError, onSuccess]);

  const getStorageInfo = useCallback(async () => {
    try {
      return await storageService.getStorageInfo();
    } catch (err) {
      console.error('Error getting storage info:', err);
      return {
        totalKeys: 0,
        totalSize: 0,
        keyInfo: [],
      };
    }
  }, []);

  return {
    cleanupExpired,
    clearAllStorage,
    getStorageInfo,
    cleanupLoading,
    cleanupError,
    lastCleanup,
    hasCleanupError: !!cleanupError,
  };
};

export default {
  useStorage,
  useMultipleStorage,
  useStorageWithExpiration,
  useSecureStorage,
  useStorageCleanup,
};