// src/services/api.js - CORRECTED to avoid double /api
import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { storageService } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

class ApiService {
  constructor() {
    // ✅ Use BASE_URL directly (already includes /api from constants.js)
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    
    console.log('🔧 ApiService initialized:', {
      baseURL: this.baseURL,
      timeout: this.timeout
    });
  }

  async getAuthToken() {
    try {
      const token = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      console.log('🔑 Token retrieval:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenType: token ? (token.startsWith('demo_') ? 'demo' : 'jwt') : 'none'
      });
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  }

  async createHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Added Authorization header');
    }

    return headers;
  }

  async handleResponse(response) {
    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      
      try {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || 
                       errorData.error || 
                       errorData.detail ||
                       'Server error occurred';
        } else {
          const textError = await response.text();
          errorMessage = textError || 'Server error occurred';
        }
      } catch (parseError) {
        console.error('❌ Error parsing error response:', parseError);
        
        // Status-based fallback messages
        switch (response.status) {
          case 401:
            errorMessage = 'Invalid credentials or session expired';
            break;
          case 403:
            errorMessage = 'Access denied';
            break;
          case 404:
            errorMessage = 'Resource not found - check if backend is running';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          default:
            errorMessage = `Server error (${response.status})`;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    // Parse successful response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Response data received:', {
        hasData: !!data,
        dataType: typeof data
      });
      return data;
    }

    return await response.text();
  }

  async makeRequest(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // ✅ Create full URL - baseURL already includes /api
    const fullUrl = `${this.baseURL}${url}`;
    
    console.log(`📞 API Request (attempt ${attempt}):`, {
      method: options.method || 'GET',
      url: fullUrl,
      hasBody: !!options.body
    });

    try {
      const headers = await this.createHeaders(options.contentType);
      
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      console.error(`❌ Request failed (attempt ${attempt}):`, {
        url: fullUrl,
        error: error.message,
        name: error.name
      });

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }

      // Don't retry auth errors
      if (error.status === 401 || error.status === 403) {
        throw error;
      }

      // Retry network errors and 5xx errors
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`🔄 Retrying request (${attempt}/${this.retryAttempts})`);
        await this.delay(1000 * attempt);
        return this.makeRequest(url, options, attempt + 1);
      }

      throw error;
    }
  }

  shouldRetry(error) {
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    
    return (
      error.name === 'TypeError' || // Network error
      error.name === 'AbortError' || // Timeout
      (error.status >= 500 && error.status < 600) // Server error
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    let url = endpoint;
    
    if (Object.keys(params).length > 0) {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          urlParams.append(key, params[key]);
        }
      });
      url = `${endpoint}?${urlParams.toString()}`;
    }

    return this.makeRequest(url, { method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(endpoint, {
      method: 'POST',
      body,
      contentType,
    });
  }

  async put(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(endpoint, {
      method: 'PUT',
      body,
      contentType,
    });
  }

  async patch(endpoint, data = {}, options = {}) {
    const body = options.isFormData ? data : JSON.stringify(data);
    const contentType = options.isFormData ? undefined : 'application/json';

    return this.makeRequest(endpoint, {
      method: 'PATCH',
      body,
      contentType,
    });
  }

  async delete(endpoint) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }

  // Health check - matches your backend endpoint
  // Fix the health check method for backend using /api:
  async healthCheck() {
    try {
      console.log('🏥 Performing health check...');
      
      // Since BASE_URL already includes /api, just use /health
      const response = await this.get('/health');
      console.log('✅ Health check successful:', response);
      
      return response.status === 'UP' || response === 'UP' || response.status === 'ok';
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  // Authentication endpoints - match your backend structure
  async login(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await this.post('/users/login', {
        email,
        password
      });

      console.log('✅ Login response received:', {
        hasToken: !!response.token,
        hasUser: !!response.user
      });

      return response;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  }

  async register(userData) {
    try {
      console.log('📝 Attempting registration for:', userData.email);
      
      const response = await this.post('/users/register', userData);
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  }

  // Vehicle endpoints
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

  // Service request endpoints
  async getServiceRequests() {
    return this.get('/service-requests');
  }

  async createServiceRequest(requestData) {
    return this.post('/service-requests', requestData);
  }

  // Debug method to test connection
  async testConnection() {
    console.log('🧪 Testing API connection...');
    console.log('   Base URL:', this.baseURL);
    
    try {
      // Test health endpoint
      const health = await this.healthCheck();
      console.log('   Health Check:', health ? '✅ PASS' : '❌ FAIL');
      
      // Test a simple authenticated endpoint (will fail without auth, but tests connectivity)
      try {
        await this.get('/vehicles');
        console.log('   Vehicles endpoint: ✅ REACHABLE');
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          console.log('   Vehicles endpoint: ✅ REACHABLE (auth required)');
        } else {
          console.log('   Vehicles endpoint: ❌ UNREACHABLE -', error.message);
        }
      }
      
      return health;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;