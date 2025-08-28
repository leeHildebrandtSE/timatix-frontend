// src/services/api.js - UPDATED VERSION with corrected endpoints
import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { storageService } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  /**
   * Get authentication token with proper error handling
   */
  async getAuthToken() {
    try {
      const token = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      console.log('Token retrieval result:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenType: token ? (token.startsWith('demo_') ? 'demo' : 'real') : 'none'
      });
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create request headers with proper authorization
   */
  async createHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header to request');
    } else {
      console.warn('No authentication token available');
    }

    return headers;
  }

  /**
   * Enhanced response handler with better error parsing
   */
  async handleResponse(response) {
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url.replace(this.baseURL, '[API]')
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      
      try {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          
          // Handle different error response formats
          errorMessage = errorData.message || 
                       errorData.error || 
                       errorData.detail || 
                       errorData.errorMessage ||
                       'Server error occurred';
        } else {
          const textError = await response.text();
          console.error('Error response text:', textError);
          errorMessage = textError || 'Server error occurred';
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        
        // Fallback error messages based on status code
        switch (response.status) {
          case 401:
            errorMessage = 'Invalid credentials';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = `Server error (${response.status}). Please try again.`;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      
      // Log specific authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication/Authorization Error:', {
          status: response.status,
          message: errorMessage,
          hasToken: !!(await this.getAuthToken())
        });
      }
      
      throw error;
    }

    // Parse successful response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Success response received:', {
        hasData: !!data,
        dataType: typeof data,
        keys: typeof data === 'object' && data !== null ? Object.keys(data) : 'Not an object'
      });
      return data;
    }

    return await response.text();
  }

  /**
   * Enhanced request method with better debugging
   */
  async makeRequest(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    console.log(`API Request (attempt ${attempt}):`, {
      method: options.method || 'GET',
      url: url.replace(this.baseURL, '[API]'),
      hasBody: !!options.body,
      timeout: this.timeout
    });

    try {
      const headers = await this.createHeaders(options.contentType);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      console.error(`Request failed (attempt ${attempt}):`, {
        url: url.replace(this.baseURL, '[API]'),
        error: error.message,
        name: error.name,
        status: error.status
      });

      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }

      // Don't retry authentication errors
      if (error.status === 401 || error.status === 403) {
        throw error;
      }

      // Retry logic for network errors and server errors
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Retrying request (${attempt}/${this.retryAttempts})`);
        await this.delay(1000 * attempt);
        return this.makeRequest(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error) {
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Retry on network errors, timeout, or 5xx server errors
    return (
      error.name === 'TypeError' || // Network error
      error.name === 'AbortError' || // Timeout
      (error.status >= 500 && error.status < 600) // Server error
    );
  }

  /**
   * Delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.makeRequest(url.toString(), {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body,
      contentType,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      body,
      contentType,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      body,
      contentType,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
    });
  }

  /**
   * Check API health - UPDATED to use correct endpoint
   */
  async healthCheck() {
    try {
      // Try multiple health endpoints to match your backend configuration
      let response;
      
      try {
        response = await this.get('/health');
        console.log('Health check result (via /health):', response);
      } catch (error) {
        console.log('Primary health endpoint failed, trying /actuator/health');
        response = await this.get('/actuator/health');
        console.log('Health check result (via /actuator/health):', response);
      }
      
      return response.status === 'UP' || response.status === 'ok' || response === 'UP';
    } catch (error) {
      console.error('Health check failed:', error.message);
      return false;
    }
  }

  /**
   * Authentication methods - UPDATED to use correct endpoints
   */
  async login(email, password) {
    try {
      console.log('Attempting login for:', email);
      
      const response = await this.post('/users/login', {
        email,
        password
      });

      console.log('Login response received:', {
        hasToken: !!response.token,
        hasUser: !!response.user,
        userRole: response.user?.role
      });

      return response;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log('Attempting registration for:', userData.email);
      
      const response = await this.post('/users/register', userData);

      console.log('Registration response received:', {
        hasToken: !!response.token,
        hasUser: !!response.user,
        userRole: response.user?.role
      });

      return response;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  }

  /**
   * Service-related methods
   */
  async getServices() {
    return this.get('/services');
  }

  async getServiceById(id) {
    return this.get(`/services/${id}`);
  }

  /**
   * Vehicle-related methods
   */
  async getVehicles() {
    return this.get('/vehicles');
  }

  async addVehicle(vehicleData) {
    return this.post('/vehicles', vehicleData);
  }

  async updateVehicle(id, vehicleData) {
    return this.put(`/vehicles/${id}`, vehicleData);
  }

  async deleteVehicle(id) {
    return this.delete(`/vehicles/${id}`);
  }

  /**
   * Booking-related methods
   */
  async getAvailableSlots(date) {
    return this.get('/booking-slots/available', { date });
  }

  async createServiceRequest(requestData) {
    return this.post('/service-requests', requestData);
  }

  async getServiceRequests() {
    return this.get('/service-requests');
  }

  async getServiceRequestById(id) {
    return this.get(`/service-requests/${id}`);
  }

  /**
   * Debug authentication state
   */
  async debugAuth() {
    console.log('=== AUTHENTICATION DEBUG ===');
    
    try {
      // Check stored token
      const token = await this.getAuthToken();
      const userData = await storageService.get(STORAGE_KEYS.USER_DATA);
      
      console.log('Auth State:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenType: token ? (token.startsWith('demo_') ? 'demo' : 'real') : 'none',
        hasUserData: !!userData,
        userRole: userData ? userData.role : 'unknown'
      });

      // Test health endpoint (should work without auth)
      try {
        console.log('Testing health endpoint...');
        const health = await this.healthCheck();
        console.log('Health check result:', health);
      } catch (healthError) {
        console.error('Health check failed:', healthError.message);
      }

      // Test authenticated endpoint if we have a token
      if (token) {
        try {
          console.log('Testing authenticated endpoint...');
          const vehicles = await this.get('/vehicles');
          console.log('Vehicles request successful:', {
            isArray: Array.isArray(vehicles),
            count: Array.isArray(vehicles) ? vehicles.length : 'not array'
          });
        } catch (authError) {
          console.error('Authenticated request failed:', {
            message: authError.message,
            status: authError.status
          });
        }
      } else {
        console.log('No token found, skipping authenticated endpoint test');
      }

    } catch (error) {
      console.error('Auth debug failed:', error);
    }
    
    console.log('=== DEBUG COMPLETE ===');
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;