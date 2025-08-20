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
   * Get authentication token
   */
  async getAuthToken() {
    try {
      return await storageService.get(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create request headers
   */
  async createHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = await response.text() || errorMessage;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: await this.createHeaders(options.contentType),
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle network errors and retries
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Request failed, retrying (${attempt}/${this.retryAttempts}):`, error.message);
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
   * Download file
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
      return response.status === 'ok';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
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