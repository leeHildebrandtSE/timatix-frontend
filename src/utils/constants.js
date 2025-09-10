// src/utils/constants.js - CORRECTED for your backend
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Based on your backend server logs:
// ✅ Spring Boot server: http://0.0.0.0:8083
// ✅ Mobile access: http://192.168.18.7:8083  
// ✅ Health endpoint: http://localhost:8083/api/health
// This means your backend uses /api as context path

const getBaseURL = () => {
  if (__DEV__) {
    console.log('🔍 Device Detection:', {
      platform: Platform.OS,
      isDevice: Constants.isDevice,
      deviceName: Constants.deviceName || 'Unknown',
    });

    const isAndroidEmulator = Platform.OS === 'android' && !Constants.isDevice;
    const isIOSSimulator = Platform.OS === 'ios' && !Constants.isDevice;
    const isPhysicalDevice = Constants.isDevice;

    console.log('📱 Device Type:', { isAndroidEmulator, isIOSSimulator, isPhysicalDevice });

    // IMPORTANT: Include /api here since your backend uses it as context path
    if (isAndroidEmulator) {
      console.log('🤖 Using Android Emulator URL');
      return 'http://10.0.2.2:8083/api'; // ✅ Includes /api
    } else if (isIOSSimulator) {
      console.log('🍎 Using iOS Simulator URL');
      return 'http://localhost:8083/api'; // ✅ Includes /api
    } else if (typeof window !== 'undefined') {
      console.log('🌐 Using Web URL');
      return 'http://localhost:8083/api'; // ✅ Includes /api
    } else {
      console.log('📱 Using Physical Device URL');
      return 'http://192.168.18.7:8083/api'; // ✅ Includes /api - MATCHES YOUR SERVER
    }
  } else {
    return 'https://your-production-api.com/api';
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
};

// Verify configuration matches your backend
console.log('🔗 API Configuration (Updated for your backend):');
console.log('   BASE_URL:', API_CONFIG.BASE_URL);
console.log('   Expected endpoints:');
console.log('   - Health:', `${API_CONFIG.BASE_URL.replace('/api', '')}/api/health`);
console.log('   - Login:', `${API_CONFIG.BASE_URL}/users/login`);
console.log('   - Vehicles:', `${API_CONFIG.BASE_URL}/vehicles`);

// Test these URLs manually in your browser:
console.log('🧪 Manual Test URLs:');
console.log('   Health Check:', 'http://192.168.18.7:8083/api/health');
console.log('   Backend Root:', 'http://192.168.18.7:8083');

// User Roles
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  MECHANIC: 'MECHANIC',
  ADMIN: 'ADMIN',
};

// Service Status
export const SERVICE_STATUS = {
  PENDING_QUOTE: 'PENDING_QUOTE',
  QUOTE_SENT: 'QUOTE_SENT',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
};

// Demo Credentials - VERIFIED from your backend logs
export const DEMO_CREDENTIALS = {
  CLIENT: {
    email: 'john.doe@email.com',
    password: 'password', // Your backend uses 'password'
  },
  MECHANIC: {
    email: 'mike@timatix.com',
    password: 'password', // Your backend uses 'password'
  },
  ADMIN: {
    email: 'admin@timatix.com', 
    password: 'password', // Your backend uses 'password'
  },
};

// Additional test accounts from your backend
export const TEST_ACCOUNTS = {
  ADMINS: ['admin@timatix.com', 'manager@timatix.com'],
  MECHANICS: ['mike@timatix.com', 'sarah@timatix.com', 'david.mechanic@timatix.com'],
  CLIENTS: ['john.doe@email.com', 'emma.brown@email.com', 'alex.taylor@email.com'],
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  VIN_LENGTH: 17,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Check your connection and ensure backend is running.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  FIELD_REQUIRED: 'This field is required.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
};

export default {
  API_CONFIG,
  USER_ROLES, 
  SERVICE_STATUS,
  STORAGE_KEYS,
  DEMO_CREDENTIALS,
  TEST_ACCOUNTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
};