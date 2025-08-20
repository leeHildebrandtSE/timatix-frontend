import { apiService } from './api';
import { ERROR_MESSAGES, DEMO_CREDENTIALS } from '../utils/constants';

class AuthService {
  /**
   * Login user
   * @param {object} credentials - Login credentials
   * @returns {Promise<object>} User data and token
   */
  async login(credentials) {
    try {
      // Check if using demo credentials
      if (this.isDemoCredentials(credentials)) {
        return this.handleDemoLogin(credentials);
      }

      const response = await apiService.post('/auth/login', credentials);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.status === 401) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      
      if (error.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
      
      throw new Error(error.message || ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} User data and token
   */
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.status === 409) {
        throw new Error('Email already exists');
      }
      
      if (error.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
      
      throw new Error(error.message || ERROR_MESSAGES.UNEXPECTED_ERROR);
    }
  }

  /**
   * Logout user
   * @param {string} token - Auth token
   * @returns {Promise<boolean>} Success status
   */
  async logout(token) {
    try {
      await apiService.post('/auth/logout', { token });
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout - always allow local logout
      return false;
    }
  }

  /**
   * Validate token
   * @param {string} token - Auth token to validate
   * @returns {Promise<boolean>} Validation result
   */
  async validateToken(token) {
    try {
      if (!token) return false;

      // For demo tokens, always return true
      if (this.isDemoToken(token)) {
        return true;
      }

      const response = await apiService.get('/auth/validate');
      return response.valid === true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Refresh auth token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      const response = await apiService.post('/auth/refresh', {
        refreshToken,
      });
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<boolean>} Success status
   */
  async requestPasswordReset(email) {
    try {
      await apiService.post('/auth/password-reset-request', { email });
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error(error.message || 'Failed to request password reset');
    }
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    try {
      await apiService.post('/auth/password-reset', {
        token,
        newPassword,
      });
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(currentPassword, newPassword) {
    try {
      await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.status === 401) {
        throw new Error('Current password is incorrect');
      }
      
      throw new Error(error.message || 'Failed to change password');
    }
  }

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await apiService.put('/auth/profile', userData);
      return response.user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Get user profile
   * @returns {Promise<object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile');
      return response.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.message || 'Failed to get profile');
    }
  }

  /**
   * Check if credentials are demo credentials
   * @private
   */
  isDemoCredentials(credentials) {
    const demoEmails = Object.values(DEMO_CREDENTIALS).map(cred => cred.email);
    return demoEmails.includes(credentials.email);
  }

  /**
   * Check if token is a demo token
   * @private
   */
  isDemoToken(token) {
    return token && token.startsWith('demo_');
  }

  /**
   * Handle demo login
   * @private
   */
  async handleDemoLogin(credentials) {
    // Find matching demo credentials
    const demoRole = Object.keys(DEMO_CREDENTIALS).find(role => 
      DEMO_CREDENTIALS[role].email === credentials.email &&
      DEMO_CREDENTIALS[role].password === credentials.password
    );

    if (!demoRole) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock user data
    const mockUser = {
      id: `demo_${demoRole.toLowerCase()}`,
      email: credentials.email,
      firstName: this.getDemoFirstName(demoRole),
      lastName: this.getDemoLastName(demoRole),
      role: demoRole,
      phoneNumber: this.getDemoPhone(demoRole),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: `demo_${demoRole.toLowerCase()}_${Date.now()}`,
      refreshToken: `refresh_demo_${demoRole.toLowerCase()}_${Date.now()}`,
    };
  }

  /**
   * Get demo first name by role
   * @private
   */
  getDemoFirstName(role) {
    const names = {
      CLIENT: 'John',
      MECHANIC: 'Mike',
      ADMIN: 'Admin',
    };
    return names[role] || 'Demo';
  }

  /**
   * Get demo last name by role
   * @private
   */
  getDemoLastName(role) {
    const names = {
      CLIENT: 'Doe',
      MECHANIC: 'Smith',
      ADMIN: 'User',
    };
    return names[role] || 'User';
  }

  /**
   * Get demo phone by role
   * @private
   */
  getDemoPhone(role) {
    const phones = {
      CLIENT: '+27 11 123 4567',
      MECHANIC: '+27 11 234 5678',
      ADMIN: '+27 11 345 6789',
    };
    return phones[role] || '+27 11 000 0000';
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;