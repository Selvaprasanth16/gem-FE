import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import sellLandService from '../../services/sellLand/sellLandService';
import Navbar from '../../components/Navbar';
import './UserPages.css';
import { 
  FileText, Search, Edit, Trash2, Eye, AlertCircle,
  MapPin, DollarSign, CheckCircle, XCircle, Clock
} from 'lucide-react';

const MySubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await sellLandService.getMySubmissions();
      setSubmissions(response.data?.submissions || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, location) => {
    if (window.confirm(`Delete submission for ${location}?`)) {
      try {
        await sellLandService.deleteSubmission(id);
        loadSubmissions();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.land_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="user-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your submissions...</p>
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
            <FileText size={32} />
            <div>
              <h1>My Submissions</h1>
              <p>View and manage your land submissions</p>
            </div>
          </div>
        </header>

        <div className="stats-row">
          <div className="stat-card">
            <FileText size={24} />
            <div>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Total Submissions</p>
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="moved_to_land">Moved to Land</option>
          </select>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={64} />
            <h2>No Submissions Found</h2>
            <p>You haven't submitted any land listings yet.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/sell')}
            >
              Submit Your Land
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredSubmissions.map(submission => (
              <div key={submission.id} className="submission-card">
                <div className="card-header">
                  <h3>{submission.land_type}</h3>
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{submission.location}</span>
                  </div>
                  <div className="info-row">
                    <DollarSign size={16} />
                    <span>₹{submission.price?.toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <FileText size={16} />
                    <span>{submission.area} sqft</span>
                  </div>
                  
                  {submission.rejection_reason && (
                    <div className="rejection-reason">
                      <XCircle size={16} />
                      <p>{submission.rejection_reason}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button 
                    className="btn-icon btn-view"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowDetailModal(true);
                    }}
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  {submission.status === 'pending' && (
                    <button 
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(submission.id, submission.location)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              {selectedSubmission.rejection_reason && (
                <div className="form-group">
                  <label>Rejection Reason</label>
                  <p className="rejection-text">{selectedSubmission.rejection_reason}</p>
                </div>
              )}
              <div className="form-group">
                <label>Submitted On</label>
                <p>{new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
