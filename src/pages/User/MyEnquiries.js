import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import enquiryService from '../../services/enquiry/enquiryService';
import Navbar from '../../components/Navbar';
import './UserPages.css';
import { 
  Mail, Search, Eye, XCircle, AlertCircle, Phone,
  DollarSign, CheckCircle, Clock, MapPin
} from 'lucide-react';

const MyEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const response = await enquiryService.getMyEnquiries();
      setEnquiries(response.data?.enquiries || []);
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this enquiry?')) {
      try {
        await enquiryService.cancelEnquiry(id);
        loadEnquiries();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enq.land?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || enq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    completed: enquiries.filter(e => e.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="user-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <Navbar />
      
      <div className="page-container">
        <header className="page-header">
          <div className="header-title">
            <Mail size={32} />
            <div>
              <h1>My Enquiries</h1>
              <p>Track your property enquiries</p>
            </div>
          </div>
        </header>

        <div className="stats-row">
          <div className="stat-card">
            <Mail size={24} />
            <div>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Total Enquiries</p>
            </div>
          </div>
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={64} />
            <h2>No Enquiries Found</h2>
            <p>You haven't made any enquiries yet.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/buy')}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredEnquiries.map(enquiry => (
              <div key={enquiry.id} className="submission-card">
                <div className="card-header">
                  <h3>{enquiry.land?.title || 'Land Property'}</h3>
                  <span className={`status-badge ${enquiry.status}`}>
                    {enquiry.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{enquiry.land?.location || 'Location unavailable'}</span>
                  </div>
                  <div className="info-row">
                    <Mail size={16} />
                    <span className="enquiry-type">{enquiry.enquiry_type?.replace('_', ' ')}</span>
                  </div>
                  {enquiry.budget && (
                    <div className="info-row">
                      <DollarSign size={16} />
                      <span>Budget: ₹{enquiry.budget?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <Phone size={16} />
                    <span>{enquiry.contact_phone}</span>
                  </div>
                  
                  {enquiry.message && (
                    <div className="enquiry-message">
                      <p>{enquiry.message}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button 
                    className="btn-icon btn-view"
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      setShowDetailModal(true);
                    }}
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  {enquiry.status === 'pending' && (
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleCancel(enquiry.id)}
                      title="Cancel enquiry"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              <div className="form-group">
                <label>Property</label>
                <p>{selectedEnquiry.land?.title || 'Land Property'}</p>
              </div>
              <div className="form-group">
                <label>Location</label>
                <p>{selectedEnquiry.land?.location || 'Not available'}</p>
              </div>
              <div className="form-group">
                <label>Enquiry Type</label>
                <p>{selectedEnquiry.enquiry_type?.replace('_', ' ')}</p>
              </div>
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
                <p>{selectedEnquiry.contact_email}</p>
              </div>
              {selectedEnquiry.budget && (
                <div className="form-group">
                  <label>Budget</label>
                  <p>₹{selectedEnquiry.budget?.toLocaleString()}</p>
                </div>
              )}
              {selectedEnquiry.message && (
                <div className="form-group">
                  <label>Message</label>
                  <p>{selectedEnquiry.message}</p>
                </div>
              )}
              {selectedEnquiry.preferred_contact_time && (
                <div className="form-group">
                  <label>Preferred Contact Time</label>
                  <p>{selectedEnquiry.preferred_contact_time}</p>
                </div>
              )}
              <div className="form-group">
                <label>Status</label>
                <span className={`status-badge ${selectedEnquiry.status}`}>
                  {selectedEnquiry.status}
                </span>
              </div>
              {selectedEnquiry.admin_notes && (
                <div className="form-group">
                  <label>Admin Notes</label>
                  <p className="admin-notes">{selectedEnquiry.admin_notes}</p>
                </div>
              )}
              <div className="form-group">
                <label>Enquiry Date</label>
                <p>{new Date(selectedEnquiry.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnquiries;
