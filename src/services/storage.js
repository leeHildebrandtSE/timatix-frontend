import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  /**
   * Store a value
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error storing value for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Retrieve a value
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {Promise<any>} Retrieved value or default
   */
  async get(key, defaultValue = null) {
    try {
      const serializedValue = await AsyncStorage.getItem(key);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(`Error retrieving value for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove a value
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all stored values
   * @returns {Promise<boolean>} Success status
   */
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all keys
   * @returns {Promise<string[]>} Array of all keys
   */
  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Get multiple values
   * @param {string[]} keys - Array of keys
   * @returns {Promise<object>} Object with key-value pairs
   */
  async getMultiple(keys) {
    try {
      const keyValuePairs = await AsyncStorage.multiGet(keys);
      const result = {};
      
      keyValuePairs.forEach(([key, value]) => {
        try {
          result[key] = value ? JSON.parse(value) : null;
        } catch (parseError) {
          console.error(`Error parsing value for key "${key}":`, parseError);
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error getting multiple values:', error);
      return {};
    }
  }

  /**
   * Set multiple values
   * @param {object} keyValuePairs - Object with key-value pairs
   * @returns {Promise<boolean>} Success status
   */
  async setMultiple(keyValuePairs) {
    try {
      const serializedPairs = Object.entries(keyValuePairs).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      
      await AsyncStorage.multiSet(serializedPairs);
      return true;
    } catch (error) {
      console.error('Error setting multiple values:', error);
      return false;
    }
  }

  /**
   * Remove multiple values
   * @param {string[]} keys - Array of keys to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeMultiple(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Error removing multiple values:', error);
      return false;
    }
  }

  /**
   * Check if a key exists
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} True if key exists
   */
  async exists(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking existence of key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get storage size info
   * @returns {Promise<object>} Storage usage information
   */
  async getStorageInfo() {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;
      const keyInfo = [];

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const size = value ? value.length : 0;
        totalSize += size;
        keyInfo.push({ key, size });
      }

      return {
        totalKeys: keys.length,
        totalSize,
        keyInfo: keyInfo.sort((a, b) => b.size - a.size),
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalKeys: 0,
        totalSize: 0,
        keyInfo: [],
      };
    }
  }

  /**
   * Merge value with existing value (for objects)
   * @param {string} key - Storage key
   * @param {object} value - Value to merge
   * @returns {Promise<boolean>} Success status
   */
  async merge(key, value) {
    try {
      const existingValue = await this.get(key, {});
      const mergedValue = { ...existingValue, ...value };
      return await this.set(key, mergedValue);
    } catch (error) {
      console.error(`Error merging value for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Store value with expiration
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @param {number} expirationMs - Expiration time in milliseconds
   * @returns {Promise<boolean>} Success status
   */
  async setWithExpiration(key, value, expirationMs) {
    try {
      const expirationTime = Date.now() + expirationMs;
      const dataWithExpiration = {
        value,
        expiration: expirationTime,
      };
      
      return await this.set(key, dataWithExpiration);
    } catch (error) {
      console.error(`Error storing value with expiration for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get value with expiration check
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist or expired
   * @returns {Promise<any>} Retrieved value or default
   */
  async getWithExpiration(key, defaultValue = null) {
    try {
      const data = await this.get(key);
      
      if (!data || typeof data !== 'object' || !data.expiration) {
        return defaultValue;
      }
      
      if (Date.now() > data.expiration) {
        // Value has expired, remove it
        await this.remove(key);
        return defaultValue;
      }
      
      return data.value;
    } catch (error) {
      console.error(`Error retrieving value with expiration for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Clean up expired values
   * @returns {Promise<number>} Number of expired keys removed
   */
  async cleanupExpired() {
    try {
      const keys = await this.getAllKeys();
      let removedCount = 0;
      
      for (const key of keys) {
        const data = await this.get(key);
        
        if (data && typeof data === 'object' && data.expiration && Date.now() > data.expiration) {
          await this.remove(key);
          removedCount++;
        }
      }
      
      return removedCount;
    } catch (error) {
      console.error('Error cleaning up expired values:', error);
      return 0;
    }
  }

  /**
   * Store value in secure storage (for sensitive data)
   * Note: This is a placeholder. In production, use @react-native-keychain or similar
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise<boolean>} Success status
   */
  async setSecure(key, value) {
    // In production, implement with react-native-keychain or similar
    console.warn('setSecure: Using regular storage. Implement secure storage for production.');
    return await this.set(`secure_${key}`, value);
  }

  /**
   * Get value from secure storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value
   * @returns {Promise<any>} Retrieved value or default
   */
  async getSecure(key, defaultValue = null) {
    // In production, implement with react-native-keychain or similar
    console.warn('getSecure: Using regular storage. Implement secure storage for production.');
    return await this.get(`secure_${key}`, defaultValue);
  }

  /**
   * Remove value from secure storage
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  async removeSecure(key) {
    // In production, implement with react-native-keychain or similar
    console.warn('removeSecure: Using regular storage. Implement secure storage for production.');
    return await this.remove(`secure_${key}`);
  }
}

// Create and export singleton instance
export const storageService = new StorageService();
export default storageService;