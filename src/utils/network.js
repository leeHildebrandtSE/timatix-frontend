// src/utils/network.js
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

class NetworkService {
  constructor() {
    this.isConnected = true;
    this.connectionType = 'unknown';
    this.listeners = new Set();
    this.init();
  }

  init() {
    // Subscribe to network state changes
    NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected;
      this.connectionType = state.type;
      
      console.log('📶 Network state changed:', {
        isConnected: this.isConnected,
        type: this.connectionType,
        wasConnected
      });

      // Notify listeners of network changes
      this.listeners.forEach(listener => {
        try {
          listener(state);
        } catch (error) {
          console.error('Error in network listener:', error);
        }
      });

      // Show connection status changes
      if (wasConnected !== this.isConnected) {
        if (this.isConnected) {
          this.showConnectionRestored();
        } else {
          this.showConnectionLost();
        }
      }
    });

    // Get initial network state
    NetInfo.fetch().then(state => {
      this.isConnected = state.isConnected;
      this.connectionType = state.type;
      console.log('📶 Initial network state:', state);
    });
  }

  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async checkConnection() {
    try {
      const state = await NetInfo.fetch();
      this.isConnected = state.isConnected;
      this.connectionType = state.type;
      return state;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return { isConnected: false, type: 'unknown' };
    }
  }

  showConnectionLost() {
    Alert.alert(
      'Connection Lost',
      'You appear to be offline. Some features may not work properly.',
      [{ text: 'OK' }]
    );
  }

  showConnectionRestored() {
    // Don't show alert for connection restored to avoid spam
    console.log('✅ Connection restored');
  }

  async waitForConnection(timeout = 30000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, timeout);

      const checkConnection = async () => {
        const state = await this.checkConnection();
        if (state.isConnected) {
          clearTimeout(timeoutId);
          resolve(state);
        } else {
          setTimeout(checkConnection, 1000);
        }
      };

      checkConnection();
    });
  }

  isOnline() {
    return this.isConnected;
  }

  getConnectionType() {
    return this.connectionType;
  }

  isWifi() {
    return this.connectionType === 'wifi';
  }

  isCellular() {
    return this.connectionType === 'cellular';
  }
}

// Create singleton instance
export const networkService = new NetworkService();

// React hook for network status
export const useNetwork = () => {
  const [networkState, setNetworkState] = React.useState({
    isConnected: networkService.isOnline(),
    type: networkService.getConnectionType(),
  });

  React.useEffect(() => {
    const unsubscribe = networkService.addListener((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        type: state.type,
      });
    });

    return unsubscribe;
  }, []);

  return networkState;
};

// Network-aware fetch wrapper
export const networkAwareFetch = async (url, options = {}) => {
  // Check connection before making request
  if (!networkService.isOnline()) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // Check if error is network-related
    if (error.message === 'Network request failed' || 
        error.name === 'TypeError' || 
        error.code === 'NETWORK_ERROR') {
      
      // Double-check connection status
      await networkService.checkConnection();
      
      if (!networkService.isOnline()) {
        throw new Error('Network connection lost during request. Please check your internet connection.');
      } else {
        throw new Error('Network error occurred. Please try again.');
      }
    }
    
    throw error;
  }
};

export default networkService;