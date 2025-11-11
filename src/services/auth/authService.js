import { apiCall } from '../api';

/**
 * Auth Service - Handles all authentication related API calls
 */
class AuthService {
  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} - Login response with token and user data
   */
  async login(identifierOrUsername, password) {
    try {
      const response = await apiCall('/login/login', {
        method: 'POST',
        // Backend supports both `identifier` and legacy `username`
        body: JSON.stringify({ identifier: identifierOrUsername, password }),
      });

      // Store token and user data in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise} - Registration response
   */
  async signup(userData) {
    try {
      const response = await apiCall('/user/create', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  /**
   * Get current user from localStorage
   * @returns {object|null} - User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  /**
   * Check if user is admin
   * @returns {boolean} - True if user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  /**
   * Get auth token
   * @returns {string|null} - Auth token or null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Change password
   * @param {string} username - Username
   * @param {string} oldPassword - Old password
   * @param {string} newPassword - New password
   * @returns {Promise} - Change password response
   */
  async changePassword(username, oldPassword, newPassword) {
    try {
      const response = await apiCall('/login/change-password', {
        method: 'POST',
        body: JSON.stringify({
          username,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
