import { publicApiCall, apiCall } from '../api';

class SiteContentService {
  async getPublicLanding() {
    return await publicApiCall('/public/landing', { method: 'GET' });
  }

  async getAdminLanding() {
    return await apiCall('/admin/landing', { method: 'GET' });
  }

  async updateLanding(payload) {
    return await apiCall('/admin/landing', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }
}

export default new SiteContentService();
