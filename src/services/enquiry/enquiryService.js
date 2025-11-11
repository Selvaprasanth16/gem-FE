import { apiCall, publicApiCall } from '../api';

/**
 * Enquiry Service - Handles all enquiry related API calls
 */
class EnquiryService {
  /**
   * Create a new enquiry for a land listing
   * @param {object} enquiryData - Enquiry data
   * @returns {Promise} - Enquiry response
   */
  async createEnquiry(enquiryData) {
    try {
      const response = await apiCall('/user/enquiries/create', {
        method: 'POST',
        body: JSON.stringify(enquiryData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a guest enquiry (no authentication required)
   * @param {object} guestData - Guest enquiry data (land_id, contact_phone)
   * @returns {Promise} - Enquiry response
   */
  async createGuestEnquiry(guestData) {
    try {
      const response = await publicApiCall('/user/enquiries/guest-enquiry', {
        method: 'POST',
        body: JSON.stringify(guestData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all user's enquiries
   * @returns {Promise} - User's enquiries
   */
  async getMyEnquiries() {
    try {
      const response = await apiCall('/user/enquiries/my-enquiries', {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get enquiry by ID
   * @param {string} id - Enquiry ID
   * @returns {Promise} - Enquiry details
   */
  async getEnquiryById(id) {
    try {
      const response = await apiCall(`/user/enquiries/enquiry?id=${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update enquiry
   * @param {string} id - Enquiry ID
   * @param {object} updateData - Updated enquiry data
   * @returns {Promise} - Update response
   */
  async updateEnquiry(id, updateData) {
    try {
      const response = await apiCall(`/user/enquiries/update?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel enquiry
   * @param {string} id - Enquiry ID
   * @returns {Promise} - Cancel response
   */
  async cancelEnquiry(id) {
    try {
      const response = await apiCall(`/user/enquiries/cancel?id=${id}`, {
        method: 'PUT',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available lands for browsing (public endpoint - no authentication required)
   * @param {object} filters - Filter parameters
   * @returns {Promise} - Available lands
   */
  async getAvailableLands(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `/user/enquiries/available-lands?${queryParams}`
        : '/user/enquiries/available-lands';

      const response = await publicApiCall(endpoint, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get land details by ID (public endpoint - no authentication required)
   * @param {string} id - Land ID
   * @returns {Promise} - Land details
   */
  async getLandById(id) {
    try {
      const response = await publicApiCall(`/user/enquiries/land?id=${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new EnquiryService();
