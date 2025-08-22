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
   * Get authentication token with debugging
   */
  async getAuthToken() {
    try {
      const token = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      console.log('🔑 Token retrieval:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
      });
      return token;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create request headers with debugging
   */
  async createHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added to request');
    } else {
      console.warn('⚠️ No token available - request will be unauthorized');
    }

    console.log('📋 Request headers:', {
      ...headers,
      Authorization: headers.Authorization ? 'Bearer [REDACTED]' : 'Not set'
    });

    return headers;
  }

  /**
   * Handle API response with better error logging
   */
  async handleResponse(response) {
    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      
      // Handle specific status codes
      if (response.status === 401) {
        console.error('🔒 401 Unauthorized - Token may be invalid or expired');
        errorMessage = 'Authentication required. Please log in again.';
      } else if (response.status === 403) {
        console.error('🚫 403 Forbidden - Access denied');
        errorMessage = 'Access forbidden. You do not have permission.';
      } else if (response.status === 404) {
        console.error('🔍 404 Not Found - Endpoint does not exist');
        errorMessage = 'Resource not found.';
      }
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('📄 Error response body:', errorData);
        } else {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
          console.error('📄 Error response text:', textError);
        }
      } catch (parseError) {
        console.error('❌ Error parsing error response:', parseError);
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ JSON response received:', {
        hasData: !!data,
        keys: typeof data === 'object' ? Object.keys(data) : 'Not an object'
      });
      return data;
    }

    return await response.text();
  }

  /**
   * Make HTTP request with enhanced debugging
   */
  async makeRequest(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    console.log(`📤 Making request (attempt ${attempt}):`, {
      url,
      method: options.method || 'GET',
      hasBody: !!options.body
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

      console.error(`❌ Request failed (attempt ${attempt}):`, {
        url,
        error: error.message,
        name: error.name,
        status: error.status
      });

      // Handle network errors and retries
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`🔄 Retrying request (${attempt}/${this.retryAttempts}):`, error.message);
        await this.delay(1000 * attempt); // Exponential backoff
        return this.makeRequest(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Check if request should be retried
   */
  shouldRetry(error) {
    // Don't retry authentication errors
    if (error.status === 401 || error.status === 403) {
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
   * GET request with debugging
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log('🔍 GET request:', { endpoint, params, finalUrl: url.toString() });

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

    console.log('📝 POST request:', { 
      endpoint, 
      hasData: !!data, 
      isFormData: options.isFormData 
    });

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
   * Upload file
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.post(endpoint, formData, { isFormData: true });
  }

  /**
   * Download file (Note: This won't work in React Native)
   */
  async downloadFile(endpoint, filename) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: await this.createHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Note: This download method only works in web browsers, not React Native
      if (typeof window !== 'undefined' && window.document) {
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return response.status === 'ok' || response.status === 'UP';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Debug method to check token storage
   */
  async debugTokenStorage() {
    try {
      const token = await storageService.get(STORAGE_KEYS.USER_TOKEN);
      const userData = await storageService.get(STORAGE_KEYS.USER_DATA);
      
      console.log('🔍 Storage Debug:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        hasUserData: !!userData,
        userDataKeys: userData ? Object.keys(JSON.parse(userData)) : 'No user data'
      });
      
      return { token, userData };
    } catch (error) {
      console.error('❌ Storage debug error:', error);
      return { token: null, userData: null };
    }
  }

  /**
   * Set base URL
   */
  setBaseURL(url) {
    this.baseURL = url;
  }

  /**
   * Set timeout
   */
  setTimeout(timeout) {
    this.timeout = timeout;
  }

  /**
   * Set retry attempts
   */
  setRetryAttempts(attempts) {
    this.retryAttempts = attempts;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;