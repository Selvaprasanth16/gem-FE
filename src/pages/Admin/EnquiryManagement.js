import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import LandMap from '../../components/LandMap';
import './AdminPages.css';
import { 
  ArrowLeft, Mail, Search, Eye, Phone, MapPin, 
  Clock, CheckCircle, XCircle, Edit, AlertCircle, FileText
} from 'lucide-react';

const EnquiryManagement = ({ hideBackButton = false }) => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllEnquiries({ status: filterStatus });
      setEnquiries(response.data?.enquiries || []);
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id, status) => {
    setConfirmAction({
      title: 'Update Status',
      message: `Update status to "${status}"?`,
      onConfirm: async () => {
        try {
          await adminService.updateEnquiryStatus(id, status);
          loadEnquiries();
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      await adminService.addEnquiryNotes(selectedEnquiry.id, adminNotes);
      setShowNotesModal(false);
      setAdminNotes('');
      loadEnquiries();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleMarkFollowedUp = async (id) => {
    try {
      await adminService.markFollowedUp(id);
      loadEnquiries();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredEnquiries = enquiries.filter(enq =>
    enq.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: enquiries.filter(e => e.status === 'pending').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    in_progress: enquiries.filter(e => e.status === 'in_progress').length,
    completed: enquiries.filter(e => e.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        {!hideBackButton && (
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        )}
        <div className="header-title">
          <Mail size={32} />
          <div>
            <h1>Enquiry Management</h1>
            <p>Manage customer enquiries and follow-ups</p>
          </div>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <Clock size={24} />
          <div>
            <p className="stat-value">{stats.pending}</p>
            <p className="stat-label">Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <Phone size={24} />
          <div>
            <p className="stat-value">{stats.contacted}</p>
            <p className="stat-label">Contacted</p>
          </div>
        </div>
        <div className="stat-card">
          <Edit size={24} />
          <div>
            <p className="stat-value">{stats.in_progress}</p>
            <p className="stat-label">In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <p className="stat-value">{stats.completed}</p>
            <p className="stat-label">Completed</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Enquiries</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Phone</th>
              <th>Enquiry Type</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map(enquiry => (
              <tr key={enquiry.id} onClick={() => { setSelectedEnquiry(enquiry); setShowDetailModal(true); }}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {enquiry.contact_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="user-name">
                        {enquiry.contact_name}
                        {enquiry.is_guest && (
                          <span className="role-badge" style={{marginLeft: '8px', fontSize: '11px', background: '#f59e0b'}}>
                            GUEST
                          </span>
                        )}
                      </p>
                      <p className="user-username">{enquiry.contact_email || 'No email'}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <Phone size={14} />
                    {enquiry.contact_phone}
                  </div>
                </td>
                <td>
                  <span className="role-badge user">
                    {enquiry.enquiry_type?.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {enquiry.budget ? `₹${enquiry.budget.toLocaleString()}` : 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${enquiry.status}`}>
                    {enquiry.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  {enquiry.is_followed_up ? (
                    <span className="status-badge completed">
                      <CheckCircle size={12} />
                      Followed
                    </span>
                  ) : (
                    <button 
                      className="status-badge pending"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkFollowedUp(enquiry.id);
                      }}
                      style={{cursor: 'pointer', border: 'none', background: 'transparent'}}
                      title="Click to mark as followed up"
                    >
                      <Clock size={12} />
                      Pending
                    </button>
                  )}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enquiry);
                        setShowDetailModal(true);
                      }}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enquiry);
                        setShowStatusModal(true);
                      }}
                      title="Update status"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-approve"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enquiry);
                        setShowNotesModal(true);
                      }}
                      title="Add notes"
                    >
                      <FileText size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnquiries.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No enquiries found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="mobile-card-view">
        {filteredEnquiries.map(enquiry => (
          <div key={enquiry.id} className="mobile-card" onClick={() => { setSelectedEnquiry(enquiry); setShowDetailModal(true); }}>
            <div className="mobile-card-header">
              <div>
                <h3 className="mobile-card-title">
                  {enquiry.contact_name}
                  {enquiry.is_guest && (
                    <span className="role-badge" style={{marginLeft: '8px', fontSize: '10px', background: '#f59e0b'}}>
                      GUEST
                    </span>
                  )}
                </h3>
                <p className="mobile-card-subtitle">{enquiry.contact_phone}</p>
              </div>
              <span className={`status-badge ${enquiry.status}`}>
                {enquiry.status}
              </span>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Email</span>
                <span className="mobile-card-value">{enquiry.contact_email}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Type</span>
                <span className="mobile-card-value">{enquiry.enquiry_type?.replace('_', ' ')}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Budget</span>
                <span className="mobile-card-value">
                  {enquiry.budget ? `₹${enquiry.budget.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Follow-up</span>
                <span className="mobile-card-value">
                  {enquiry.is_followed_up ? (
                    <span className="status-badge completed" style={{fontSize: '12px'}}>
                      <CheckCircle size={12} />
                      Followed
                    </span>
                  ) : (
                    <button 
                      className="status-badge pending"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkFollowedUp(enquiry.id);
                      }}
                      style={{cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '12px'}}
                      title="Click to mark as followed up"
                    >
                      <Clock size={12} />
                      Pending
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredEnquiries.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No enquiries found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enquiry Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{padding: '24px'}}>
              {selectedEnquiry.is_guest && (
                <div className="form-group" style={{background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '16px'}}>
                  <label style={{color: '#92400e', fontWeight: 'bold'}}>Guest Enquiry</label>
                  <p style={{color: '#92400e', margin: '4px 0 0 0'}}>This enquiry was submitted by a guest user (not logged in)</p>
                </div>
              )}
              <div className="form-group">
                <label>Contact Name</label>
                <p>{selectedEnquiry.contact_name}</p>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <p>{selectedEnquiry.contact_phone}</p>
              </div>
              <div className="form-group">
                <label>Email</label>
                <p>{selectedEnquiry.contact_email || 'Not provided'}</p>
              </div>
              {selectedEnquiry.land && (
                <>
                  <div className="form-group">
                    <label>Property</label>
                    <p style={{marginBottom: '8px'}}>{selectedEnquiry.land.title} - {selectedEnquiry.land.location}</p>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        const landUrl = `${window.location.origin}/land/${selectedEnquiry.land.id}`;
                        const message = `Hi, regarding enquiry for ${selectedEnquiry.land.title} - ${landUrl}`;
                        const whatsappUrl = `https://wa.me/${selectedEnquiry.contact_phone}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      style={{display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white'}}
                    >
                      <Phone size={16} />
                      Contact on WhatsApp
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Property Location</label>
                    <LandMap 
                      latitude={selectedEnquiry.land.latitude}
                      longitude={selectedEnquiry.land.longitude}
                      title={selectedEnquiry.land.title}
                      address={selectedEnquiry.land.address || selectedEnquiry.land.location}
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Enquiry Type</label>
                <p>{selectedEnquiry.enquiry_type?.replace('_', ' ')}</p>
              </div>
              <div className="form-group">
                <label>Budget</label>
                <p>{selectedEnquiry.budget ? `₹${selectedEnquiry.budget.toLocaleString()}` : 'Not specified'}</p>
              </div>
              <div className="form-group">
                <label>Message</label>
                <p>{selectedEnquiry.message || 'No message'}</p>
              </div>
              <div className="form-group">
                <label>Preferred Contact Time</label>
                <p>{selectedEnquiry.preferred_contact_time || 'Anytime'}</p>
              </div>
              <div className="form-group">
                <label>Admin Notes</label>
                <p>{selectedEnquiry.admin_notes || 'No notes yet'}</p>
              </div>
              <div className="form-group">
                <label>Follow-up Status</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px'}}>
                  {selectedEnquiry.is_followed_up ? (
                    <span className="status-badge completed">
                      <CheckCircle size={14} />
                      Followed Up
                    </span>
                  ) : (
                    <>
                      <span className="status-badge pending">
                        <Clock size={14} />
                        Pending Follow-up
                      </span>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          handleMarkFollowedUp(selectedEnquiry.id);
                          setShowDetailModal(false);
                        }}
                        style={{padding: '8px 16px', fontSize: '14px'}}
                      >
                        <CheckCircle size={14} />
                        Mark as Followed Up
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleStatusUpdate(selectedEnquiry.id, 'contacted')}
                    style={{flex: 1}}
                  >
                    Contacted
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleStatusUpdate(selectedEnquiry.id, 'in_progress')}
                    style={{flex: 1}}
                  >
                    In Progress
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleStatusUpdate(selectedEnquiry.id, 'completed')}
                    style={{flex: 1}}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Enquiry Status</h2>
              <button className="modal-close" onClick={() => setShowStatusModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{padding: '24px'}}>
              <div className="form-group">
                <label>Current Status: <strong>{selectedEnquiry.status}</strong></label>
              </div>
              <div className="form-group">
                <label>Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="filter-select"
                  style={{width: '100%'}}
                >
                  <option value="">Choose status...</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    if (newStatus) {
                      handleStatusUpdate(selectedEnquiry.id, newStatus);
                      setShowStatusModal(false);
                      setNewStatus('');
                    } else {
                      alert('Please select a status');
                    }
                  }}
                >
                  <CheckCircle size={16} />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Admin Notes</h2>
              <button className="modal-close" onClick={() => setShowNotesModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNotes(); }}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this enquiry..."
                    rows={6}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowNotesModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <CheckCircle size={16} />
                    Save Notes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction?.onConfirm}
        title={confirmAction?.title}
        message={confirmAction?.message}
        type="confirm"
        showIcon={false}
      />
    </div>
  );
};

export default EnquiryManagement;
