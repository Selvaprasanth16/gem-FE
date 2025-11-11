import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import './AdminPages.css';
import { 
  ArrowLeft, FileText, Search, CheckCircle, XCircle, 
  Eye, TrendingUp, MapPin, DollarSign, AlertCircle, Edit
} from 'lucide-react';

const SubmissionManagement = ({ hideBackButton = false }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editingSubmission, setEditingSubmission] = useState(null);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllSubmissions({ status: filterStatus });
      setSubmissions(response.data?.submissions || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this submission?')) {
      try {
        await adminService.approveSubmission(id);
        loadSubmissions();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleReject = async () => {
    try {
      await adminService.rejectSubmission(selectedSubmission.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      loadSubmissions();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleMoveToLand = async (id) => {
    if (window.confirm('Move this submission to Land model?')) {
      try {
        await adminService.moveToLand(id);
        loadSubmissions();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleEdit = (submission) => {
    setEditingSubmission({...submission});
    setShowEditModal(true);
  };

  const handleUpdateSubmission = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateSubmission(editingSubmission.id, {
        owner_name: editingSubmission.owner_name,
        owner_phone: editingSubmission.owner_phone,
        location: editingSubmission.location,
        price: parseInt(editingSubmission.price),
        area: parseInt(editingSubmission.area),
        land_type: editingSubmission.land_type
      });
      setShowEditModal(false);
      loadSubmissions();
      alert('Submission updated successfully');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.land_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
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
          <FileText size={32} />
          <div>
            <h1>Submission Management</h1>
            <p>Review and approve land submissions</p>
          </div>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <AlertCircle size={24} />
          <div>
            <p className="stat-value">{stats.pending}</p>
            <p className="stat-label">Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <p className="stat-value">{stats.approved}</p>
            <p className="stat-label">Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <XCircle size={24} />
          <div>
            <p className="stat-value">{stats.rejected}</p>
            <p className="stat-label">Rejected</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Submissions</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="moved_to_land">Moved to Land</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Location</th>
              <th>Land Type</th>
              <th>Price</th>
              <th>Area</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(submission => (
              <tr key={submission.id} onClick={() => { setSelectedSubmission(submission); setShowDetailModal(true); }}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {submission.owner_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="user-name">{submission.owner_name}</p>
                      <p className="user-username">{submission.owner_phone}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <MapPin size={14} />
                    {submission.location}
                  </div>
                </td>
                <td>{submission.land_type}</td>
                <td>
                  <div className="email-cell">
                    <DollarSign size={14} />
                    ₹{submission.price?.toLocaleString()}
                  </div>
                </td>
                <td>{submission.area} sqft</td>
                <td>
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubmission(submission);
                        setShowDetailModal(true);
                      }}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-edit"
                      onClick={(e) => { e.stopPropagation(); handleEdit(submission); }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    {submission.status === 'pending' && (
                      <>
                        <button 
                          className="btn-icon btn-approve"
                          onClick={(e) => { e.stopPropagation(); handleApprove(submission.id); }}
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(submission);
                            setShowRejectModal(true);
                          }}
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    {submission.status === 'approved' && (
                      <button 
                        className="btn-icon btn-approve"
                        onClick={(e) => { e.stopPropagation(); handleMoveToLand(submission.id); }}
                        title="Move to Land"
                      >
                        <TrendingUp size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No submissions found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="mobile-card-view">
        {filteredSubmissions.map(submission => (
          <div key={submission.id} className="mobile-card" onClick={() => { setSelectedSubmission(submission); setShowDetailModal(true); }}>
            <div className="mobile-card-header">
              <div>
                <h3 className="mobile-card-title">{submission.owner_name}</h3>
                <p className="mobile-card-subtitle">{submission.owner_phone}</p>
              </div>
              <span className={`status-badge ${submission.status}`}>
                {submission.status}
              </span>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Location</span>
                <span className="mobile-card-value">{submission.location}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Land Type</span>
                <span className="mobile-card-value">{submission.land_type}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Price</span>
                <span className="mobile-card-value">₹{submission.price?.toLocaleString()}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Area</span>
                <span className="mobile-card-value">{submission.area} sqft</span>
              </div>
            </div>
          </div>
        ))}
        {filteredSubmissions.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No submissions found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{padding: '24px'}}>
              <div className="form-group">
                <label>Owner Name</label>
                <p>{selectedSubmission.owner_name}</p>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <p>{selectedSubmission.owner_phone}</p>
              </div>
              <div className="form-group">
                <label>Location</label>
                <p>{selectedSubmission.location}</p>
              </div>
              <div className="form-group">
                <label>Land Type</label>
                <p>{selectedSubmission.land_type}</p>
              </div>
              <div className="form-group">
                <label>Price</label>
                <p>₹{selectedSubmission.price?.toLocaleString()}</p>
              </div>
              <div className="form-group">
                <label>Area</label>
                <p>{selectedSubmission.area} sqft</p>
              </div>
              <div className="form-group">
                <label>Status</label>
                <span className={`status-badge ${selectedSubmission.status}`}>
                  {selectedSubmission.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSubmission && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Submission</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmission}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    value={editingSubmission.owner_name || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, owner_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editingSubmission.owner_phone || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, owner_phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editingSubmission.location || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, location: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Land Type</label>
                  <select
                    value={editingSubmission.land_type || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, land_type: e.target.value})}
                    required
                  >
                    <option value="Coconut Land">Coconut Land</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="House">House</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editingSubmission.price || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, price: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    value={editingSubmission.area || ''}
                    onChange={(e) => setEditingSubmission({...editingSubmission, area: e.target.value})}
                    required
                    min="1"
                  />
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Submission</h2>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleReject(); }}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Rejection Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowRejectModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <XCircle size={16} />
                    Reject Submission
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionManagement;
