import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import './AdminPages.css';
import { 
  ArrowLeft, Users, Search, Edit, Trash2, Shield, User,
  Mail, Calendar, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

const UserManagement = ({ hideBackButton = false }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      // Response format: {success: true, data: {users: [...]}}
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await adminService.deleteUser(userId);
        loadUsers();
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser({
        user_id: editingUser.id,
        username: editingUser.username,
        email: editingUser.email,
        phone: editingUser.phone,
        full_name: editingUser.full_name,
        role: editingUser.role
      });
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="page-header">
        {!hideBackButton && (
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        )}
        <div className="header-title">
          <Users size={32} />
          <div>
            <h1>User Management</h1>
            <p>Manage all registered users</p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={24} />
          <div>
            <p className="stat-value">{stats.admins}</p>
            <p className="stat-label">Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <User size={24} />
          <div>
            <p className="stat-value">{stats.users}</p>
            <p className="stat-label">Regular Users</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* Users Table - Desktop */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} onClick={() => handleEdit(user)}>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.full_name?.charAt(0) || user.username?.charAt(0)}
                    </div>
                    <div>
                      <p className="user-name">{user.full_name || user.username}</p>
                      <p className="user-username">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <Mail size={14} />
                    {user.email}
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit"
                      onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                      title="Edit user"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(user.id, user.username); }}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="mobile-card-view">
        {filteredUsers.map(user => (
          <div key={user.id} className="mobile-card" onClick={() => handleEdit(user)}>
            <div className="mobile-card-header">
              <div>
                <h3 className="mobile-card-title">{user.full_name || user.username}</h3>
                <p className="mobile-card-subtitle">@{user.username}</p>
              </div>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                {user.role}
              </span>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Email</span>
                <span className="mobile-card-value">{user.email}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Created</span>
                <span className="mobile-card-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editingUser.username || ''}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  placeholder="10-digit mobile"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
