// src/utils/constants.js - FIXED for Physical Device Testing
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the correct base URL based on platform and environment
const getBaseURL = () => {
  if (__DEV__) {
    // Development environment
    console.log('🔍 Device Info:', {
      platform: Platform.OS,
      isDevice: Constants.isDevice,
      deviceName: Constants.deviceName
    });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      console.log('🤖 Using Android Emulator URL');
      return 'http://10.0.2.2:8081/api';
    } else if (Platform.OS === 'ios' && !Constants.isDevice) {
      // iOS simulator can use localhost directly
      console.log('🍎 Using iOS Simulator URL');
      return 'http://localhost:8081/api';
    } else if (typeof window !== 'undefined' && window.location) {
      // Web platform
      console.log('🌐 Using Web URL');
      return 'http://localhost:8081/api';
    } else {
      // Physical device - use computer's network IP
      console.log('📱 Using Physical Device URL');
      return 'http://192.168.18.7:8081/api';
    }
  } else {
    // Production environment - replace with your actual production API URL
    return 'https://your-production-api.com/api';
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 15000, // Increased for development
  RETRY_ATTEMPTS: 3,
};

// Log the configuration for debugging
console.log('🔗 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  PLATFORM: Platform.OS,
  IS_DEVICE: Constants.isDevice,
  EXPO_DEV: __DEV__
});

// Test URLs for manual verification
console.log('🧪 Test these URLs in your browser:');
console.log('💻 Local:', 'http://localhost:8081/api/actuator/health');
console.log('📱 Mobile:', 'http://192.168.18.7:8081/api/actuator/health');

// User Roles
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  MECHANIC: 'MECHANIC',
  ADMIN: 'ADMIN',
};

// Service Request Status
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

// Service Progress Phases
export const SERVICE_PHASES = {
  RECEIVED: 'RECEIVED',
  DIAGNOSIS: 'DIAGNOSIS',
  REPAIR_IN_PROGRESS: 'REPAIR_IN_PROGRESS',
  TESTING: 'TESTING',
  CLEANING: 'CLEANING',
  READY_FOR_COLLECTION: 'READY_FOR_COLLECTION',
};

// Service Types
export const SERVICE_TYPES = {
  OIL_CHANGE: 'Oil Change',
  BRAKE_SERVICE: 'Brake Service',
  TIRE_SERVICE: 'Tire Service',
  ENGINE_DIAGNOSTIC: 'Engine Diagnostic',
  TRANSMISSION_SERVICE: 'Transmission Service',
  AIR_CONDITIONING: 'Air Conditioning',
  ELECTRICAL: 'Electrical',
  GENERAL_MAINTENANCE: 'General Maintenance',
  BODYWORK: 'Bodywork',
  OTHER: 'Other',
};

// Vehicle Makes (common ones)
export const VEHICLE_MAKES = [
  'Toyota',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Ford',
  'Nissan',
  'Honda',
  'Hyundai',
  'Kia',
  'Chevrolet',
  'Mazda',
  'Subaru',
  'Volvo',
  'Peugeot',
  'Renault',
  'Isuzu',
  'Mitsubishi',
  'Suzuki',
  'Other',
];

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
};

// Navigation Routes
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Client
  CLIENT_DASHBOARD: 'ClientDashboard',
  VEHICLES: 'Vehicles',
  SERVICE_REQUESTS: 'ServiceRequests',
  CLIENT_PROFILE: 'ClientProfile',
  
  // Mechanic
  MECHANIC_DASHBOARD: 'MechanicDashboard',
  JOB_LIST: 'JobList',
  QUOTE_MANAGEMENT: 'QuoteManagement',
  
  // Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  USER_MANAGEMENT: 'UserManagement',
  SYSTEM_OVERVIEW: 'SystemOverview',
  
  // Common
  PROFILE: 'Profile',
};

// Demo Credentials - Updated with real test accounts
export const DEMO_CREDENTIALS = {
  CLIENT: {
    email: 'john.doe@email.com',
    password: 'client123',
  },
  MECHANIC: {
    email: 'mike@timatix.com',
    password: 'mechanic123',
  },
  ADMIN: {
    email: 'admin@timatix.com',
    password: 'admin123',
  },
};

// Additional test accounts from your backend
export const TEST_ACCOUNTS = {
  ADMINS: [
    'admin@timatix.com',
    'manager@timatix.com'
  ],
  MECHANICS: [
    'mike@timatix.com',
    'sarah@timatix.com',
    'david.mechanic@timatix.com',
    'lisa@timatix.com'
  ],
  CLIENTS: [
    'john.doe@email.com',
    'emma.brown@email.com',
    'alex.taylor@email.com',
    'michael.smith@email.com',
    'jessica.wilson@email.com',
    'robert.davis@email.com'
  ]
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  VIN_LENGTH: 17,
};

// Time formats
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  FIELD_REQUIRED: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters.`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  VEHICLE_ADDED: 'Vehicle added successfully!',
  VEHICLE_UPDATED: 'Vehicle updated successfully!',
  VEHICLE_DELETED: 'Vehicle deleted successfully!',
  SERVICE_REQUEST_CREATED: 'Service request created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

export default {
  API_CONFIG,
  USER_ROLES,
  SERVICE_STATUS,
  SERVICE_PHASES,
  SERVICE_TYPES,
  VEHICLE_MAKES,
  STORAGE_KEYS,
  ROUTES,
  DEMO_CREDENTIALS,
  TEST_ACCOUNTS,
  VALIDATION_RULES,
  TIME_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};