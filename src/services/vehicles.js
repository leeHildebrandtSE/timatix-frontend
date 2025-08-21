import { apiService } from './api';

class VehiclesService {
  /**
   * Get all vehicles for current user
   * @returns {Promise<Array>} Array of user vehicles
   */
  async getUserVehicles() {
    try {
      const response = await apiService.get('/vehicles/user');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      throw error;
    }
  }

  /**
   * Get all vehicles (admin view)
   * @param {object} params - Query parameters
   * @returns {Promise<Array>} Array of all vehicles
   */
  async getAllVehicles(params = {}) {
    try {
      const response = await apiService.get('/vehicles', params);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      throw error;
    }
  }

  /**
   * Get vehicle by ID
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<object>} Vehicle details
   */
  async getVehicleById(vehicleId) {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  /**
   * Create new vehicle
   * @param {object} vehicleData - Vehicle data
   * @returns {Promise<object>} Created vehicle
   */
  async createVehicle(vehicleData) {
    try {
      const response = await apiService.post('/vehicles', vehicleData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  /**
   * Update vehicle
   * @param {string} vehicleId - Vehicle ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated vehicle
   */
  async updateVehicle(vehicleId, updateData) {
    try {
      const response = await apiService.put(`/vehicles/${vehicleId}`, updateData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  /**
   * Delete vehicle
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteVehicle(vehicleId) {
    try {
      await apiService.delete(`/vehicles/${vehicleId}`);
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }

  /**
   * Get vehicle service history
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<Array>} Service history records
   */
  async getServiceHistory(vehicleId) {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}/service-history`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching service history:', error);
      throw error;
    }
  }

  /**
   * Update vehicle mileage
   * @param {string} vehicleId - Vehicle ID
   * @param {number} mileage - New mileage
   * @returns {Promise<object>} Updated vehicle
   */
  async updateMileage(vehicleId, mileage) {
    try {
      const response = await apiService.patch(`/vehicles/${vehicleId}/mileage`, { mileage });
      return response.data || response;
    } catch (error) {
      console.error('Error updating mileage:', error);
      throw error;
    }
  }

  /**
   * Add maintenance record
   * @param {string} vehicleId - Vehicle ID
   * @param {object} maintenanceData - Maintenance record data
   * @returns {Promise<object>} Created maintenance record
   */
  async addMaintenanceRecord(vehicleId, maintenanceData) {
    try {
      const response = await apiService.post(`/vehicles/${vehicleId}/maintenance`, maintenanceData);
      return response.data || response;
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  }

  /**
   * Get vehicle maintenance reminders
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<Array>} Maintenance reminders
   */
  async getMaintenanceReminders(vehicleId) {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}/reminders`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching maintenance reminders:', error);
      throw error;
    }
  }

  /**
   * Set maintenance reminder
   * @param {string} vehicleId - Vehicle ID
   * @param {object} reminderData - Reminder data
   * @returns {Promise<object>} Created reminder
   */
  async setMaintenanceReminder(vehicleId, reminderData) {
    try {
      const response = await apiService.post(`/vehicles/${vehicleId}/reminders`, reminderData);
      return response.data || response;
    } catch (error) {
      console.error('Error setting maintenance reminder:', error);
      throw error;
    }
  }

  /**
   * Upload vehicle documents
   * @param {string} vehicleId - Vehicle ID
   * @param {Array} documents - Array of document files
   * @returns {Promise<Array>} Uploaded documents
   */
  async uploadDocuments(vehicleId, documents) {
    try {
      const formData = new FormData();
      documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });

      const response = await apiService.post(
        `/vehicles/${vehicleId}/documents`, 
        formData, 
        { isFormData: true }
      );
      return response.data || response;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  }

  /**
   * Get vehicle documents
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<Array>} Vehicle documents
   */
  async getDocuments(vehicleId) {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}/documents`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  /**
   * Delete vehicle document
   * @param {string} vehicleId - Vehicle ID
   * @param {string} documentId - Document ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteDocument(vehicleId, documentId) {
    try {
      await apiService.delete(`/vehicles/${vehicleId}/documents/${documentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Validate VIN number
   * @param {string} vin - VIN to validate
   * @returns {Promise<object>} VIN validation result
   */
  async validateVIN(vin) {
    try {
      const response = await apiService.post('/vehicles/validate-vin', { vin });
      return response.data || response;
    } catch (error) {
      console.error('Error validating VIN:', error);
      throw error;
    }
  }

  /**
   * Get vehicle makes
   * @returns {Promise<Array>} Array of vehicle makes
   */
  async getVehicleMakes() {
    try {
      const response = await apiService.get('/vehicles/makes');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching vehicle makes:', error);
      throw error;
    }
  }

  /**
   * Get vehicle models by make
   * @param {string} make - Vehicle make
   * @returns {Promise<Array>} Array of vehicle models
   */
  async getVehicleModels(make) {
    try {
      const response = await apiService.get(`/vehicles/models`, { make });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      throw error;
    }
  }

  /**
   * Get vehicle specifications
   * @param {string} make - Vehicle make
   * @param {string} model - Vehicle model
   * @param {number} year - Vehicle year
   * @returns {Promise<object>} Vehicle specifications
   */
  async getVehicleSpecs(make, model, year) {
    try {
      const response = await apiService.get('/vehicles/specs', { make, model, year });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching vehicle specs:', error);
      throw error;
    }
  }

  /**
   * Get vehicle statistics for user
   * @returns {Promise<object>} Vehicle statistics
   */
  async getUserVehicleStats() {
    try {
      const response = await apiService.get('/vehicles/user/statistics');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching vehicle statistics:', error);
      throw error;
    }
  }

  /**
   * Export vehicle data
   * @param {string} vehicleId - Vehicle ID
   * @param {string} format - Export format (pdf, csv, excel)
   * @returns {Promise<Blob>} Exported data
   */
  async exportVehicleData(vehicleId, format = 'pdf') {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}/export`, { format });
      return response;
    } catch (error) {
      console.error('Error exporting vehicle data:', error);
      throw error;
    }
  }

  /**
   * Share vehicle information
   * @param {string} vehicleId - Vehicle ID
   * @param {object} shareData - Share configuration
   * @returns {Promise<object>} Share link or result
   */
  async shareVehicle(vehicleId, shareData) {
    try {
      const response = await apiService.post(`/vehicles/${vehicleId}/share`, shareData);
      return response.data || response;
    } catch (error) {
      console.error('Error sharing vehicle:', error);
      throw error;
    }
  }

  /**
   * Check for vehicle recalls
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise<Array>} Recall information
   */
  async checkRecalls(vehicleId) {
    try {
      const response = await apiService.get(`/vehicles/${vehicleId}/recalls`);
      return response.data || response;
    } catch (error) {
      console.error('Error checking recalls:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const vehiclesService = new VehiclesService();
export default vehiclesService;