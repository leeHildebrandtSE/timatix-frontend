import { apiService } from './api';
import { SERVICE_STATUS } from '../utils/constants';

class ServiceRequestsService {
  /**
   * Get all service requests for current user
   * @returns {Promise<Array>} Array of service requests
   */
  async getUserRequests() {
    try {
      const response = await apiService.get('/service-requests/user');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user service requests:', error);
      throw error;
    }
  }

  /**
   * Get all service requests (admin/mechanic view)
   * @param {object} params - Query parameters
   * @returns {Promise<Array>} Array of service requests
   */
  async getAllRequests(params = {}) {
    try {
      const response = await apiService.get('/service-requests', params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching all service requests:', error);
      throw error;
    }
  }

  /**
   * Get service requests assigned to mechanic
   * @param {string} mechanicId - Mechanic ID
   * @returns {Promise<Array>} Array of assigned service requests
   */
  async getAssignedRequests(mechanicId) {
    try {
      const response = await apiService.get(`/service-requests/mechanic/${mechanicId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching assigned service requests:', error);
      throw error;
    }
  }

  /**
   * Get service request by ID
   * @param {string} requestId - Service request ID
   * @returns {Promise<object>} Service request details
   */
  async getRequestById(requestId) {
    try {
      const response = await apiService.get(`/service-requests/${requestId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching service request:', error);
      throw error;
    }
  }

  /**
   * Create new service request
   * @param {object} requestData - Service request data
   * @returns {Promise<object>} Created service request
   */
  async createRequest(requestData) {
    try {
      const response = await apiService.post('/service-requests', requestData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating service request:', error);
      throw error;
    }
  }

  /**
   * Update service request
   * @param {string} requestId - Service request ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated service request
   */
  async updateRequest(requestId, updateData) {
    try {
      const response = await apiService.put(`/service-requests/${requestId}`, updateData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating service request:', error);
      throw error;
    }
  }

  /**
   * Update service request status
   * @param {string} requestId - Service request ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated service request
   */
  async updateStatus(requestId, status) {
    try {
      const response = await apiService.patch(`/service-requests/${requestId}/status`, { status });
      return response.data || response;
    } catch (error) {
      console.error('Error updating service request status:', error);
      throw error;
    }
  }

  /**
   * Cancel service request
   * @param {string} requestId - Service request ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<object>} Updated service request
   */
  async cancelRequest(requestId, reason) {
    try {
      const response = await apiService.patch(`/service-requests/${requestId}/cancel`, { reason });
      return response.data || response;
    } catch (error) {
      console.error('Error cancelling service request:', error);
      throw error;
    }
  }

  /**
   * Accept quote for service request
   * @param {string} requestId - Service request ID
   * @returns {Promise<object>} Updated service request
   */
  async acceptQuote(requestId) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/accept-quote`);
      return response.data || response;
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw error;
    }
  }

  /**
   * Decline quote for service request
   * @param {string} requestId - Service request ID
   * @param {string} reason - Decline reason
   * @returns {Promise<object>} Updated service request
   */
  async declineQuote(requestId, reason) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/decline-quote`, { reason });
      return response.data || response;
    } catch (error) {
      console.error('Error declining quote:', error);
      throw error;
    }
  }

  /**
   * Assign mechanic to service request
   * @param {string} requestId - Service request ID
   * @param {string} mechanicId - Mechanic ID
   * @returns {Promise<object>} Updated service request
   */
  async assignMechanic(requestId, mechanicId) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/assign`, { mechanicId });
      return response.data || response;
    } catch (error) {
      console.error('Error assigning mechanic:', error);
      throw error;
    }
  }

  /**
   * Start service work
   * @param {string} requestId - Service request ID
   * @returns {Promise<object>} Updated service request
   */
  async startWork(requestId) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/start`);
      return response.data || response;
    } catch (error) {
      console.error('Error starting work:', error);
      throw error;
    }
  }

  /**
   * Complete service work
   * @param {string} requestId - Service request ID
   * @param {object} completionData - Completion details
   * @returns {Promise<object>} Updated service request
   */
  async completeWork(requestId, completionData) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/complete`, completionData);
      return response.data || response;
    } catch (error) {
      console.error('Error completing work:', error);
      throw error;
    }
  }

  /**
   * Add progress update to service request
   * @param {string} requestId - Service request ID
   * @param {object} progressData - Progress update data
   * @returns {Promise<object>} Updated service request
   */
  async addProgressUpdate(requestId, progressData) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/progress`, progressData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding progress update:', error);
      throw error;
    }
  }

  /**
   * Upload photos for service request
   * @param {string} requestId - Service request ID
   * @param {Array} photos - Array of photo files
   * @returns {Promise<object>} Updated service request
   */
  async uploadPhotos(requestId, photos) {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });

      const response = await apiService.post(
        `/service-requests/${requestId}/photos`, 
        formData, 
        { isFormData: true }
      );
      return response.data || response;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    }
  }

  /**
   * Get service request statistics
   * @param {object} filters - Filter options
   * @returns {Promise<object>} Statistics data
   */
  async getStatistics(filters = {}) {
    try {
      const response = await apiService.get('/service-requests/statistics', filters);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Get available service slots
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Available time slots
   */
  async getAvailableSlots(date) {
    try {
      const response = await apiService.get(`/service-requests/available-slots`, { date });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  /**
   * Send reminder for service request
   * @param {string} requestId - Service request ID
   * @returns {Promise<boolean>} Success status
   */
  async sendReminder(requestId) {
    try {
      await apiService.post(`/service-requests/${requestId}/reminder`);
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  /**
   * Rate completed service
   * @param {string} requestId - Service request ID
   * @param {object} ratingData - Rating and review data
   * @returns {Promise<object>} Updated service request
   */
  async rateService(requestId, ratingData) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/rating`, ratingData);
      return response.data || response;
    } catch (error) {
      console.error('Error rating service:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const serviceRequestsService = new ServiceRequestsService();
export default serviceRequestsService;