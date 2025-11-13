import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import './AdminPages.css';
import { 
  ArrowLeft, FileText, Search, CheckCircle, XCircle, 
  Eye, TrendingUp, MapPin, DollarSign, AlertCircle, Edit, Image as ImageIcon
} from 'lucide-react';
import imageUploadService from '../../services/admin/imageUploadService';

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
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveForm, setMoveForm] = useState({
    title: '',
    location: '',
    property_type: 'Coconut Land',
    price: '',
    size: '',
    size_unit: 'sqft',
    description: '',
    features: '',
    address: '',
    coordinates: '',
    images_urls: []
  });
  const [moveFiles, setMoveFiles] = useState([]);
  const [moving, setMoving] = useState(false);

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

  const openMoveModal = (submission) => {
    // Prefill from submission
    setMoveForm({
      title: `${submission.owner_name}'s Land`,
      location: submission.location || '',
      property_type: (
        submission.land_type === 'Coconut Land' ? 'Coconut Land' :
        submission.land_type === 'Empty Land' ? 'Empty Land' :
        submission.land_type === 'Commercial Land' ? 'Commercial Land' :
        'House'
      ),
      price: submission.price ?? '',
      size: submission.area ?? '',
      size_unit: 'sqft',
      description: '' ,
      address: submission.location || '',
      coordinates: '',
      images_urls: []
    });
    setMoveFiles([]);
    setSelectedSubmission(submission);
    setShowMoveModal(true);
  };

  const handleMoveFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) return alert('Maximum 10 images allowed');
    setMoveFiles(files);
  };

  const handleCreateLandFromSubmission = async (e) => {
    e.preventDefault();
    try {
      setMoving(true);
      // Upload images if any
      let newUrls = [];
      if (moveFiles.length > 0) {
        const uploadRes = await imageUploadService.uploadLandImages(moveFiles);
        newUrls = uploadRes.image_urls || [];
      }
      const payload = {
        title: moveForm.title,
        location: moveForm.location,
        property_type: moveForm.property_type,
        price: moveForm.price === '' ? undefined : parseInt(moveForm.price),
        size: moveForm.size === '' ? undefined : parseInt(moveForm.size),
        size_unit: moveForm.size_unit,
        description: moveForm.description,
        features: moveForm.features ? [moveForm.features] : undefined,
        address: moveForm.address,
        coordinates: moveForm.coordinates,
        images_urls: [...(moveForm.images_urls||[]), ...newUrls]
      };
      await adminService.createLand(payload);
      // mark submission as moved if backend supports update
      try { await adminService.updateSubmission(selectedSubmission.id, { status: 'moved_to_land' }); } catch {}
      setShowMoveModal(false);
      setMoveFiles([]);
      loadSubmissions();
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to create land'));
    } finally {
      setMoving(false);
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

      {/* Move to Land - Creation Modal */}
      {showMoveModal && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowMoveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Land from Submission</h2>
              <button className="modal-close" onClick={() => setShowMoveModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateLandFromSubmission}>
              <div style={{padding:'24px', display:'grid', gap:'12px'}}>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={moveForm.title} onChange={(e)=>setMoveForm({...moveForm, title:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" value={moveForm.location} onChange={(e)=>setMoveForm({...moveForm, location:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" value={moveForm.address} onChange={(e)=>setMoveForm({...moveForm, address:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Property Type *</label>
                  <select value={moveForm.property_type} onChange={(e)=>setMoveForm({...moveForm, property_type:e.target.value})} required>
                    <option value="Coconut Land">Coconut Land</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="House">House</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" min="0" value={moveForm.price} onChange={(e)=>setMoveForm({...moveForm, price:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 140px', gap:'8px'}}>
                    <input type="number" min="1" value={moveForm.size} onChange={(e)=>setMoveForm({...moveForm, size:e.target.value})} />
                    <select value={moveForm.size_unit} onChange={(e)=>setMoveForm({...moveForm, size_unit:e.target.value})}>
                      <option value="sqft">sqft</option>
                      <option value="acres">acres</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Coordinates (optional: lat,lon or Google Maps URL)</label>
                  <input type="text" value={moveForm.coordinates} onChange={(e)=>setMoveForm({...moveForm, coordinates:e.target.value})} placeholder="11.11, 77.77 or https://maps.google..." />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="3" value={moveForm.description} onChange={(e)=>setMoveForm({...moveForm, description:e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Features</label>
                  <select value={moveForm.features} onChange={(e)=>setMoveForm({...moveForm, features:e.target.value})}>
                    <option value="">Select one</option>
                    <option value="residential">residential</option>
                    <option value="commercial">commercial</option>
                    <option value="agricultural">agricultural</option>
                    <option value="Coconut Farm">Coconut Farm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <ImageIcon size={18} style={{display:'inline', marginRight:8}}/>Upload Images (optional)
                  </label>
                  <input type="file" multiple accept="image/*" onChange={handleMoveFiles} />
                  {moveFiles.length>0 && (
                    <p style={{fontSize:'0.875rem', color:'#10b981', marginTop:6}}>{moveFiles.length} file(s) selected</p>
                  )}
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={()=>setShowMoveModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={moving}>
                    {moving ? 'Creating...' : (<><CheckCircle size={16}/> Create Land</>)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
                        onClick={(e) => { e.stopPropagation(); openMoveModal(submission); }}
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
