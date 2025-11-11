import { apiCall } from '../api';

/**
 * Admin Service - Handles all admin-related API calls
 */
class AdminService {
  // ==================== User Management ====================
  
  /**
   * Get all users
   * @returns {Promise} - All users
   */
  async getAllUsers() {
    try {
      const response = await apiCall('/admin/users', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {object} userData - User data to update
   * @returns {Promise} - Update response
   */
  async updateUser(userData) {
    try {
      const response = await apiCall('/admin/update-user', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID to delete
   * @returns {Promise} - Delete response
   */
  async deleteUser(userId) {
    try {
      const response = await apiCall('/admin/delete-user', {
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Dashboard & Analytics ====================
  
  /**
   * Get admin dashboard statistics
   * @returns {Promise} - Dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await apiCall('/admin/dashboard', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get sell land dashboard statistics
   * @returns {Promise} - Sell land stats
   */
  async getSellLandStats() {
    try {
      const response = await apiCall('/admin/sell-land/dashboard-stats', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get enquiry dashboard statistics
   * @returns {Promise} - Enquiry stats
   */
  async getEnquiryStats() {
    try {
      const response = await apiCall('/admin/enquiries/dashboard-stats', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Sell Land Submissions ====================
  
  /**
   * Get all sell land submissions
   * @param {object} filters - Filter parameters
   * @returns {Promise} - All submissions
   */
  async getAllSubmissions(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `/admin/sell-land/all?${queryParams}`
        : '/admin/sell-land/all';

      const response = await apiCall(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pending submissions
   * @returns {Promise} - Pending submissions
   */
  async getPendingSubmissions() {
    try {
      const response = await apiCall('/admin/sell-land/pending', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve submission
   * @param {string} submissionId - Submission ID
   * @returns {Promise} - Approve response
   */
  async approveSubmission(submissionId) {
    try {
      const response = await apiCall('/admin/sell-land/approve', {
        method: 'POST',
        body: JSON.stringify({ submission_id: submissionId }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reject submission
   * @param {string} submissionId - Submission ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} - Reject response
   */
  async rejectSubmission(submissionId, reason) {
    try {
      const response = await apiCall('/admin/sell-land/reject', {
        method: 'POST',
        body: JSON.stringify({ 
          submission_id: submissionId,
          rejection_reason: reason 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Move submission to Land model
   * @param {string} submissionId - Submission ID
   * @returns {Promise} - Move response
   */
  async moveToLand(submissionId) {
    try {
      const response = await apiCall('/admin/sell-land/move-to-land', {
        method: 'POST',
        body: JSON.stringify({ submission_id: submissionId }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update submission
   * @param {string} submissionId - Submission ID
   * @param {object} updateData - Update data
   * @returns {Promise} - Update response
   */
  async updateSubmission(submissionId, updateData) {
    try {
      const response = await apiCall(`/admin/sell-land/update?id=${submissionId}`, {
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
   * @param {string} submissionId - Submission ID
   * @returns {Promise} - Delete response
   */
  async deleteSubmission(submissionId) {
    try {
      const response = await apiCall(`/admin/sell-land/delete?id=${submissionId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk approve submissions
   * @param {Array} submissionIds - Array of submission IDs
   * @returns {Promise} - Bulk approve response
   */
  async bulkApprove(submissionIds) {
    try {
      const response = await apiCall('/admin/sell-land/bulk-approve', {
        method: 'POST',
        body: JSON.stringify({ submission_ids: submissionIds }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk delete submissions
   * @param {Array} submissionIds - Array of submission IDs
   * @returns {Promise} - Bulk delete response
   */
  async bulkDelete(submissionIds) {
    try {
      const response = await apiCall('/admin/sell-land/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ submission_ids: submissionIds }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Enquiry Management ====================
  
  /**
   * Get all enquiries
   * @param {object} filters - Filter parameters
   * @returns {Promise} - All enquiries
   */
  async getAllEnquiries(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `/admin/enquiries/all?${queryParams}`
        : '/admin/enquiries/all';

      const response = await apiCall(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get pending enquiries
   * @returns {Promise} - Pending enquiries
   */
  async getPendingEnquiries() {
    try {
      const response = await apiCall('/admin/enquiries/pending', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update enquiry status
   * @param {string} enquiryId - Enquiry ID
   * @param {string} status - New status
   * @returns {Promise} - Update response
   */
  async updateEnquiryStatus(enquiryId, status) {
    try {
      const response = await apiCall('/admin/enquiries/update-status', {
        method: 'PUT',
        body: JSON.stringify({ 
          enquiry_id: enquiryId,
          status: status 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add admin notes to enquiry
   * @param {string} enquiryId - Enquiry ID
   * @param {string} notes - Admin notes
   * @returns {Promise} - Update response
   */
  async addEnquiryNotes(enquiryId, notes) {
    try {
      const response = await apiCall('/admin/enquiries/add-notes', {
        method: 'PUT',
        body: JSON.stringify({ 
          enquiry_id: enquiryId,
          admin_notes: notes 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark enquiry as followed up
   * @param {string} enquiryId - Enquiry ID
   * @param {string} followUpDate - Follow-up date
   * @returns {Promise} - Update response
   */
  async markFollowedUp(enquiryId, followUpDate = null) {
    try {
      const response = await apiCall('/admin/enquiries/mark-followed-up', {
        method: 'PUT',
        body: JSON.stringify({ 
          enquiry_id: enquiryId,
          follow_up_date: followUpDate 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete enquiry
   * @param {string} enquiryId - Enquiry ID
   * @returns {Promise} - Delete response
   */
  async deleteEnquiry(enquiryId) {
    try {
      const response = await apiCall(`/admin/enquiries/delete?id=${enquiryId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk update enquiry status
   * @param {Array} enquiryIds - Array of enquiry IDs
   * @param {string} status - New status
   * @returns {Promise} - Bulk update response
   */
  async bulkUpdateEnquiryStatus(enquiryIds, status) {
    try {
      const response = await apiCall('/admin/enquiries/bulk-update-status', {
        method: 'POST',
        body: JSON.stringify({ 
          enquiry_ids: enquiryIds,
          status: status 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Land Management ====================
  
  /**
   * Create a new land listing
   * @param {object} landData - Land data
   * @returns {Promise} - Create response
   */
  async createLand(landData) {
    try {
      const response = await apiCall('/admin/lands/create', {
        method: 'POST',
        body: JSON.stringify(landData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all lands
   * @param {object} filters - Filter parameters
   * @returns {Promise} - All lands
   */
  async getAllLands(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams 
        ? `/admin/lands/all?${queryParams}`
        : '/admin/lands/all';

      const response = await apiCall(endpoint, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update land status
   * @param {string} landId - Land ID
   * @param {string} status - New status
   * @returns {Promise} - Update response
   */
  async updateLandStatus(landId, status) {
    try {
      const response = await apiCall('/admin/lands/update-status', {
        method: 'PUT',
        body: JSON.stringify({ 
          land_id: landId,
          status: status 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update land details
   * @param {string} landId - Land ID
   * @param {object} updateData - Update data
   * @returns {Promise} - Update response
   */
  async updateLand(landId, updateData) {
    try {
      const response = await apiCall('/admin/lands/update', {
        method: 'PUT',
        body: JSON.stringify({ 
          land_id: landId,
          ...updateData 
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete land
   * @param {string} landId - Land ID
   * @returns {Promise} - Delete response
   */
  async deleteLand(landId) {
    try {
      const response = await apiCall(`/admin/lands/delete?id=${landId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get land dashboard statistics
   * @returns {Promise} - Land stats
   */
  async getLandStats() {
    try {
      const response = await apiCall('/admin/lands/dashboard-stats', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AdminService();
