import { apiCall } from '../api';

class UserService {
  async getProfile() {
    return apiCall('/user/get', { method: 'GET' });
  }

  async updateProfile(update) {
    return apiCall('/user/update', {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async changePassword(usernameOrIdentifier, oldPassword, newPassword) {
    // Backend expects username in change-password currently; pass current username from storage or identifier field
    const userStr = localStorage.getItem('user');
    const current = userStr ? JSON.parse(userStr) : null;
    const username = current?.username || usernameOrIdentifier || '';
    return apiCall('/login/change-password', {
      method: 'POST',
      body: JSON.stringify({ username, old_password: oldPassword, new_password: newPassword }),
    });
  }
}

export default new UserService();
