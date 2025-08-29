import { apiService } from './api';
import { SERVICE_STATUS } from '../utils/constants';

class ServiceRequestsService {
  /**
   * Get all service requests for the current user
   * @param {string|number} [userId] - Optional user ID
   * @returns {Promise<Array>} Array of service requests
   */
  async getUserRequests(userId) {
    try {
      if (userId) {
        // Admin/mechanic can fetch by user ID
        const response = await apiService.get(`/service-requests/${userId}`);
        return response.data || response;
      } else {
        // Client uses their own /my-requests endpoint
        return await this.getMyRequests();
      }
    } catch (error) {
      console.error('Error fetching user service requests:', error);
      throw error;
    }
  }

  /**
   * Get service requests for the authenticated user (CLIENT)
   */
  async getMyRequests() {
    try {
      const response = await apiService.get('/service-requests/my-requests');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching my service requests:', error);
      throw error;
    }
  }

  /**
   * Get all service requests (admin/mechanic view)
   */
  async getAllRequests(params = {}) {
    try {
      const response = await apiService.get('/service-requests', { params });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching all service requests:', error);
      throw error;
    }
  }

  async getAssignedRequests(mechanicId) {
    if (!mechanicId) throw new Error('Mechanic ID is required');
    try {
      const response = await apiService.get(`/service-requests/mechanic/${mechanicId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching assigned service requests:', error);
      throw error;
    }
  }

  async getRequestById(requestId) {
    if (!requestId) throw new Error('Request ID is required');
    try {
      const response = await apiService.get(`/service-requests/${requestId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching service request:', error);
      throw error;
    }
  }

  async createRequest(requestData) {
    try {
      const response = await apiService.post('/service-requests', requestData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating service request:', error);
      throw error;
    }
  }

  async updateRequest(requestId, updateData) {
    if (!requestId) throw new Error('Request ID is required');
    try {
      const response = await apiService.put(`/service-requests/${requestId}`, updateData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating service request:', error);
      throw error;
    }
  }

  async updateStatus(requestId, status) {
    if (!requestId || !status) throw new Error('Request ID and status are required');
    try {
      const response = await apiService.patch(`/service-requests/${requestId}/status`, { status });
      return response.data || response;
    } catch (error) {
      console.error('Error updating service request status:', error);
      throw error;
    }
  }

  async cancelRequest(requestId, reason) {
    if (!requestId || !reason) throw new Error('Request ID and reason are required');
    try {
      const response = await apiService.patch(`/service-requests/${requestId}/cancel`, { reason });
      return response.data || response;
    } catch (error) {
      console.error('Error cancelling service request:', error);
      throw error;
    }
  }

  async acceptQuote(requestId) {
    if (!requestId) throw new Error('Request ID is required');
    try {
      const response = await apiService.post(`/service-requests/${requestId}/accept-quote`);
      return response.data || response;
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw error;
    }
  }

  async declineQuote(requestId, reason) {
    if (!requestId || !reason) throw new Error('Request ID and reason are required');
    try {
      const response = await apiService.post(`/service-requests/${requestId}/decline-quote`, { reason });
      return response.data || response;
    } catch (error) {
      console.error('Error declining quote:', error);
      throw error;
    }
  }

  async assignMechanic(requestId, mechanicId) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/assign`, { mechanicId });
      return response.data || response;
    } catch (error) {
      console.error('Error assigning mechanic:', error);
      throw error;
    }
  }

  async startWork(requestId) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/start`);
      return response.data || response;
    } catch (error) {
      console.error('Error starting work:', error);
      throw error;
    }
  }

  async completeWork(requestId, completionData) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/complete`, completionData);
      return response.data || response;
    } catch (error) {
      console.error('Error completing work:', error);
      throw error;
    }
  }

  async addProgressUpdate(requestId, progressData) {
    try {
      const response = await apiService.post(`/service-requests/${requestId}/progress`, progressData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding progress update:', error);
      throw error;
    }
  }

  async uploadPhotos(requestId, photos) {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });

      const response = await apiService.post(`/service-requests/${requestId}/photos`, formData, { isFormData: true });
      return response.data || response;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    }
  }

  async getStatistics(filters = {}) {
    try {
      const response = await apiService.get('/service-requests/statistics', { params: filters });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  async getAvailableSlots(date) {
    try {
      const response = await apiService.get('/service-requests/available-slots', { params: { date } });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  async sendReminder(requestId) {
    try {
      await apiService.post(`/service-requests/${requestId}/reminder`);
      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

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

export const serviceRequestsService = new ServiceRequestsService();
export default serviceRequestsService;
