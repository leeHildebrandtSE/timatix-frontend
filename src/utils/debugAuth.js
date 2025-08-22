// Add this debug code to your login success handler or create a new file
// src/utils/debugAuth.js

import apiService from '../services/api';
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from './constants';

export const debugAuthFlow = async () => {
  console.log('🔍 === AUTHENTICATION DEBUG ===');
  
  try {
    // 1. Check storage service
    console.log('1️⃣ Testing storage service...');
    await storageService.set('test_key', 'test_value');
    const testValue = await storageService.get('test_key');
    console.log('Storage test:', testValue === 'test_value' ? '✅ Working' : '❌ Failed');
    
    // 2. Check stored authentication data
    console.log('2️⃣ Checking stored auth data...');
    const storedToken = await storageService.get(STORAGE_KEYS.USER_TOKEN);
    const storedUserData = await storageService.get(STORAGE_KEYS.USER_DATA);
    
    console.log('Stored auth data:', {
      hasToken: !!storedToken,
      tokenLength: storedToken ? storedToken.length : 0,
      tokenPreview: storedToken ? `${storedToken.substring(0, 30)}...` : 'No token',
      hasUserData: !!storedUserData
    });
    
    // 3. Test API service token retrieval
    console.log('3️⃣ Testing API service token retrieval...');
    await apiService.debugTokenStorage();
    
    // 4. Test authenticated request
    if (storedToken) {
      console.log('4️⃣ Testing authenticated request to vehicles...');
      try {
        const vehicles = await apiService.get('/vehicles');
        console.log('✅ Vehicles request successful:', vehicles);
      } catch (error) {
        console.error('❌ Vehicles request failed:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
      }
    } else {
      console.log('4️⃣ ⚠️ No token found, skipping authenticated request test');
    }
    
    // 5. Test health check
    console.log('5️⃣ Testing health check...');
    try {
      const health = await apiService.get('/health');
      console.log('✅ Health check successful:', health);
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Debug flow error:', error);
  }
  
  console.log('🔍 === DEBUG COMPLETE ===');
};

// Alternative: Manual token check
export const checkTokenManually = async () => {
  try {
    // Direct AsyncStorage check (alternative to storageService)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const directToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    console.log('🔍 Direct AsyncStorage check:', {
      hasToken: !!directToken,
      tokenLength: directToken ? directToken.length : 0,
      tokenPreview: directToken ? `${directToken.substring(0, 30)}...` : 'No token'
    });
    
    return directToken;
  } catch (error) {
    console.error('❌ Direct token check failed:', error);
    return null;
  }
};

// Test authentication after login
export const testAuthAfterLogin = async (loginResponse) => {
  console.log('🔍 Testing auth after login...');
  console.log('Login response:', loginResponse);
  
  // Wait a moment for storage to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Run debug flow
  await debugAuthFlow();
};