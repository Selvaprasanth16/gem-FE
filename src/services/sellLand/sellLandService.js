import { apiCall } from '../api';

/**
 * Sell Land Service - Handles all sell land form submission API calls
 */
class SellLandService {
  /**
   * Create a new land submission
   * @param {object} formData - Form data { name, phone, location, price, area, landType, description }
   * @returns {Promise} - Submission response
   */
  async createSubmission(formData) {
    try {
      const response = await apiCall('/user/sell-land/create', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all user's submissions
   * @returns {Promise} - User's submissions
   */
  async getMySubmissions() {
    try {
      const response = await apiCall('/user/sell-land/my-submissions', {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get submission by ID
   * @param {string} id - Submission ID
   * @returns {Promise} - Submission details
   */
  async getSubmissionById(id) {
    try {
      const response = await apiCall(`/user/sell-land/submission?id=${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update submission
   * @param {string} id - Submission ID
   * @param {object} updateData - Updated form data
   * @returns {Promise} - Update response
   */
  async updateSubmission(id, updateData) {
    try {
      const response = await apiCall(`/user/sell-land/update?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete submission
   * @param {string} id - Submission ID
   * @returns {Promise} - Delete response
   */
  async deleteSubmission(id) {
    try {
      const response = await apiCall(`/user/sell-land/delete?id=${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new SellLandService();
