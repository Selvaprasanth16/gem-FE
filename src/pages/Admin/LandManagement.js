import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import imageUploadService from '../../services/admin/imageUploadService';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import MessageModal from '../../components/Modal/MessageModal';
import './AdminPages.css';
import { 
  MapPin, Search, Eye, Trash2, DollarSign,
  CheckCircle, XCircle, AlertCircle, Maximize, ArrowLeft, Plus, Upload, X, Image as ImageIcon, Edit
} from 'lucide-react';

const LandManagement = ({ hideBackButton = false }) => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [selectedLand, setSelectedLand] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ type: 'info', title: '', message: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newLand, setNewLand] = useState({
    title: '',
    location: '',
    address: '',
    property_type: 'Coconut Land',
    price: '',
    size: '',
    description: '',
    features: '',
    images_urls: []
  });

  const [editLand, setEditLand] = useState({
    id: '',
    title: '',
    location: '',
    address: '',
    property_type: 'Coconut Land',
    price: '',
    size: '',
    size_unit: 'sqft',
    latitude: '',
    longitude: '',
    description: '',
    features: '',
    status: 'available',
    images_urls: []
  });
  const [editSelectedFiles, setEditSelectedFiles] = useState([]);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/');
      return;
    }
    loadLands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterType, filterLocation, minPrice, maxPrice, minSize, maxSize, debouncedSearch]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const showMessage = (type, title, message) => {
    setMessageModal({ type, title, message });
    setShowMessageModal(true);
  };

  const openEditModal = (land) => {
    setEditLand({
      id: land.id,
      title: land.title || '',
      location: land.location || '',
      address: land.address || '',
      property_type: land.property_type || 'Coconut Land',
      price: land.price ?? '',
      size: land.size ?? '',
      size_unit: land.size_unit || 'sqft',
      latitude: land.latitude ?? '',
      longitude: land.longitude ?? '',
      description: land.description || '',
      features: Array.isArray(land.features) ? (land.features[0] || '') : (land.features || ''),
      status: land.status || 'available',
      images_urls: Array.isArray(land.images_urls) ? land.images_urls : []
    });
    setShowEditModal(true);
  };

  const handleUpdateLand = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Upload new images if selected
      let newUrls = [];
      if (editSelectedFiles.length > 0) {
        const imageResponse = await imageUploadService.uploadLandImages(editSelectedFiles);
        newUrls = imageResponse.image_urls || [];
      }
      const payload = {
        title: editLand.title,
        location: editLand.location,
        address: editLand.address,
        property_type: editLand.property_type,
        price: editLand.price === '' ? undefined : parseInt(editLand.price),
        size: editLand.size === '' ? undefined : parseInt(editLand.size),
        size_unit: editLand.size_unit || undefined,
        latitude: editLand.latitude === '' ? undefined : Number(editLand.latitude),
        longitude: editLand.longitude === '' ? undefined : Number(editLand.longitude),
        description: editLand.description,
        features: editLand.features ? [editLand.features] : undefined,
        status: editLand.status,
        images_urls: [...(editLand.images_urls || []), ...newUrls]
      };
      await adminService.updateLand(editLand.id, payload);
      showMessage('success', 'Updated!', 'Land updated successfully');
      setShowEditModal(false);
      setEditSelectedFiles([]);
      loadLands();
    } catch (error) {
      showMessage('error', 'Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLands = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus && filterStatus !== 'all') params.status = filterStatus;
      if (filterType) params.property_type = filterType;
      if (filterLocation) params.location = filterLocation;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (minSize) params.min_size = minSize;
      if (maxSize) params.max_size = maxSize;
      if (debouncedSearch) params.search = debouncedSearch;
      const response = await adminService.getAllLands(params);
      setLands(response.data?.lands || []);
    } catch (error) {
      console.error('Error loading lands:', error);
      showMessage('error', 'Load Failed', 'Failed to load lands: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = (land) => {
    setConfirmAction({
      title: 'Mark as Sold',
      message: `Mark "${land.title}" as sold?`,
      onConfirm: async () => {
        try {
          await adminService.updateLandStatus(land.id, 'sold');
          showMessage('success', 'Updated!', 'Land marked as sold successfully');
          loadLands();
        } catch (error) {
          showMessage('error', 'Update Failed', error.message);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleMarkAsAvailable = (land) => {
    setConfirmAction({
      title: 'Mark as Available',
      message: `Mark "${land.title}" as available?`,
      onConfirm: async () => {
        try {
          await adminService.updateLandStatus(land.id, 'available');
          showMessage('success', 'Updated!', 'Land marked as available successfully');
          loadLands();
        } catch (error) {
          showMessage('error', 'Update Failed', error.message);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleDelete = (land) => {
    setConfirmAction({
      title: 'Delete Land',
      message: `Are you sure you want to delete "${land.title}"? This action cannot be undone.`,
      confirmButtonClass: 'btn-danger',
      onConfirm: async () => {
        try {
          await adminService.deleteLand(land.id);
          showMessage('success', 'Deleted!', 'Land deleted successfully');
          loadLands();
        } catch (error) {
          showMessage('error', 'Delete Failed', error.message);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const filteredLands = lands.filter(land =>
    land.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: lands.length,
    available: lands.filter(l => l.status === 'available').length,
    sold: lands.filter(l => l.status === 'sold').length
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      showMessage('warning', 'Too Many Files', 'Maximum 10 images allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleRemoveSelectedFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      showMessage('warning', 'Too Many Files', 'Maximum 10 images allowed');
      return;
    }
    setEditSelectedFiles(files);
  };

  const handleRemoveExistingImage = (index) => {
    const updated = (editLand.images_urls || []).filter((_, i) => i !== index);
    setEditLand({ ...editLand, images_urls: updated });
  };

  const handleCreateLand = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      showMessage('warning', 'No Images', 'Please select at least one image');
      return;
    }

    try {
      setLoading(true);
      
      // Step 1: Upload images to Cloudinary
      const imageResponse = await imageUploadService.uploadLandImages(selectedFiles);
      const imageUrls = imageResponse.image_urls;
      
      // Step 2: Create land with uploaded image URLs
      await adminService.createLand({
        title: newLand.title,
        location: newLand.location,
        address: newLand.address,
        property_type: newLand.property_type,
        price: parseInt(newLand.price),
        size: parseInt(newLand.size),
        description: newLand.description,
        features: newLand.features ? [newLand.features] : undefined,
        images_urls: imageUrls
      });
      
      // Reset form
      setShowCreateModal(false);
      setNewLand({
        title: '',
        location: '',
        address: '',
        property_type: 'Coconut Land',
        price: '',
        size: '',
        description: '',
        features: '',
        images_urls: []
      });
      setSelectedFiles([]);
      showMessage('success', 'Success!', 'Land created successfully with images!');
      loadLands();
    } catch (error) {
      showMessage('error', 'Creation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading lands...</p>
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

      {/* Edit Land Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Land</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateLand}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={editLand.title}
                    onChange={(e) => setEditLand({...editLand, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={editLand.location}
                    onChange={(e) => setEditLand({...editLand, location: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={editLand.address}
                    onChange={(e) => setEditLand({...editLand, address: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Property Type *</label>
                  <select
                    value={editLand.property_type}
                    onChange={(e) => setEditLand({...editLand, property_type: e.target.value})}
                    required
                  >
                    <option value="Coconut Land">Coconut Land</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="House">House</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Features</label>
                  <select
                    value={editLand.features}
                    onChange={(e) => setEditLand({...editLand, features: e.target.value})}
                  >
                    <option value="">Select one</option>
                    <option value="residential">residential</option>
                    <option value="commercial">commercial</option>
                    <option value="agricultural">agricultural</option>
                    <option value="Coconut Farm">Coconut Farm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editLand.price}
                    onChange={(e) => setEditLand({...editLand, price: e.target.value})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 140px', gap:'8px'}}>
                    <input
                      type="number"
                      value={editLand.size}
                      onChange={(e) => setEditLand({...editLand, size: e.target.value})}
                      min="1"
                    />
                    <select
                      value={editLand.size_unit}
                      onChange={(e)=>setEditLand({...editLand, size_unit: e.target.value})}
                    >
                      <option value="sqft">sqft</option>
                      <option value="acres">acres</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  <div>
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editLand.latitude}
                      onChange={(e)=>setEditLand({...editLand, latitude: e.target.value})}
                    />
                  </div>
                  <div>
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editLand.longitude}
                      onChange={(e)=>setEditLand({...editLand, longitude: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editLand.description}
                    onChange={(e) => setEditLand({...editLand, description: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editLand.status}
                    onChange={(e) => setEditLand({...editLand, status: e.target.value})}
                  >
                    <option value="available">available</option>
                    <option value="sold">sold</option>
                    <option value="pending">pending</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                {/* Existing Images */}
                {editLand.images_urls && editLand.images_urls.length>0 && (
                  <div className="form-group">
                    <label>Existing Images ({editLand.images_urls.length})</label>
                    <div className="land-images-grid">
                      {editLand.images_urls.map((url, idx)=> (
                        <div key={idx} className="land-image-item" style={{position:'relative'}}>
                          <img src={url} alt={`Image ${idx+1}`} />
                          <button
                            type="button"
                            onClick={()=>handleRemoveExistingImage(idx)}
                            style={{position:'absolute', top:6, right:6, background:'#ef4444', color:'#fff', border:'none', borderRadius:'50%', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div className="form-group">
                  <label>
                    <ImageIcon size={18} style={{display: 'inline', marginRight: '8px'}} />
                    Add More Images (optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleEditFileSelect}
                  />
                  {editSelectedFiles.length>0 && (
                    <div style={{marginTop: '12px'}}>
                      <p style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', color: '#10b981'}}>
                        {editSelectedFiles.length} file(s) selected
                      </p>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px'}}>
                        {Array.from(editSelectedFiles).map((file, index) => (
                          <div key={index} style={{position: 'relative', paddingTop: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb'}}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Selected ${index + 1}`}
                              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (
                      <>
                        <Edit size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
        <div className="header-title">
          <MapPin size={32} />
          <div>
            <h1>Land Management</h1>
            <p>Manage all land listings</p>
          </div>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <MapPin size={24} />
          <div>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">Total Lands</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <p className="stat-value">{stats.available}</p>
            <p className="stat-label">Available</p>
          </div>
        </div>
        <div className="stat-card">
          <XCircle size={24} />
          <div>
            <p className="stat-value">{stats.sold}</p>
            <p className="stat-label">Sold</p>
          </div>
        </div>
        <div className="stat-card create-card" onClick={() => setShowCreateModal(true)} style={{cursor: 'pointer'}}>
          <Plus size={24} />
          <div>
            <p className="stat-label">Create New Land</p>
          </div>
        </div>
      </div>

      <div className="filters-section" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'10px', alignItems:'center'}}>
        <div className="search-box" style={{gridColumn: '1 / -1'}}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search lands..."
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
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select 
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="land">Empty Land</option>
          <option value="farm">Coconut / Farm</option>
          <option value="commercial">Commercial</option>
          <option value="residential">House / Residential</option>
        </select>
        <input className="filter-input" type="text" placeholder="Location" value={filterLocation} onChange={(e)=>setFilterLocation(e.target.value)} />
        <input className="filter-input" type="number" min="0" placeholder="Min Price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
        <input className="filter-input" type="number" min="0" placeholder="Max Price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
          <input className="filter-input" type="number" min="0" placeholder="Min Size" value={minSize} onChange={(e)=>setMinSize(e.target.value)} />
          <input className="filter-input" type="number" min="0" placeholder="Max Size" value={maxSize} onChange={(e)=>setMaxSize(e.target.value)} />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th>Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLands.map(land => (
              <tr key={land.id} onClick={() => { setSelectedLand(land); setShowDetailModal(true); }}>
                <td>
                  <div className="user-cell">
                    <div>
                      <p className="user-name">{land.title}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <MapPin size={14} />
                    {land.location}
                  </div>
                </td>
                <td>{land.property_type}</td>
                <td>
                  <div className="email-cell">
                    <DollarSign size={14} />
                    ₹{land.price?.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <Maximize size={14} />
                    {land.size} sqft
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${land.status}`}>
                    {land.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLand(land);
                        setShowDetailModal(true);
                      }}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      onClick={(e) => { e.stopPropagation(); openEditModal(land); }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    {land.status === 'available' && (
                      <button 
                        className="btn-icon btn-reject"
                        onClick={(e) => { e.stopPropagation(); handleMarkAsSold(land); }}
                        title="Mark as sold"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    {land.status === 'sold' && (
                      <button 
                        className="btn-icon btn-approve"
                        onClick={(e) => { e.stopPropagation(); handleMarkAsAvailable(land); }}
                        title="Mark as available"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      className="btn-icon btn-delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(land); }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLands.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No lands found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="mobile-card-view">
        {filteredLands.map(land => (
          <div key={land.id} className="mobile-card" onClick={() => { setSelectedLand(land); setShowDetailModal(true); }}>
            <div className="mobile-card-header">
              <div>
                <h3 className="mobile-card-title">{land.title}</h3>
                <p className="mobile-card-subtitle">{land.location}</p>
              </div>
              <span className={`status-badge ${land.status}`}>
                {land.status}
              </span>
            </div>
            <div className="mobile-card-body">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Type</span>
                <span className="mobile-card-value">{land.property_type}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Price</span>
                <span className="mobile-card-value">₹{land.price?.toLocaleString()}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Size</span>
                <span className="mobile-card-value">{land.size} sqft</span>
              </div>
            </div>
          </div>
        ))}
        {filteredLands.length === 0 && (
          <div className="no-data">
            <AlertCircle size={48} />
            <p>No lands found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLand && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Land Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{padding: '24px'}}>
              {/* Land Images */}
              {selectedLand.images_urls && selectedLand.images_urls.length > 0 && (
                <div className="form-group">
                  <label>Images ({selectedLand.images_urls.length})</label>
                  <div className="land-images-grid">
                    {selectedLand.images_urls.map((url, index) => (
                      <div key={index} className="land-image-item">
                        <img 
                          src={url} 
                          alt={`${selectedLand.title} - ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Title</label>
                <p>{selectedLand.title}</p>
              </div>
              <div className="form-group">
                <label>Location</label>
                <p>{selectedLand.location}</p>
              </div>
              <div className="form-group">
                <label>Address</label>
                <p>{selectedLand.address || 'Not provided'}</p>
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <p>{selectedLand.property_type}</p>
              </div>
              <div className="form-group">
                <label>Price</label>
                <p>₹{selectedLand.price?.toLocaleString()}</p>
              </div>
              <div className="form-group">
                <label>Size</label>
                <p>{selectedLand.size} sqft</p>
              </div>
              <div className="form-group">
                <label>Description</label>
                <p>{selectedLand.description || 'No description'}</p>
              </div>
              {selectedLand.features && selectedLand.features.length > 0 && (
                <div className="form-group">
                  <label>Features</label>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {selectedLand.features.map((feature, idx) => (
                      <span key={idx} className="status-badge available">{feature}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label>Status</label>
                <span className={`status-badge ${selectedLand.status}`}>
                  {selectedLand.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Land Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Land Listing</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateLand}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={newLand.title}
                    onChange={(e) => setNewLand({...newLand, title: e.target.value})}
                    placeholder="e.g., Beautiful Coconut Land in Erode"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={newLand.location}
                    onChange={(e) => setNewLand({...newLand, location: e.target.value})}
                    placeholder="e.g., Erode, Tamil Nadu"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    value={newLand.address}
                    onChange={(e) => setNewLand({...newLand, address: e.target.value})}
                    placeholder="Enter full address with street, city, state, pincode..."
                    rows="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Property Type *</label>
                  <select
                    value={newLand.property_type}
                    onChange={(e) => setNewLand({...newLand, property_type: e.target.value})}
                    required
                  >
                    <option value="Coconut Land">Coconut Land</option>
                    <option value="Empty Land">Empty Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="House">House</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={newLand.price}
                    onChange={(e) => setNewLand({...newLand, price: e.target.value})}
                    placeholder="e.g., 6000000"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Size (sqft) *</label>
                  <input
                    type="number"
                    value={newLand.size}
                    onChange={(e) => setNewLand({...newLand, size: e.target.value})}
                    placeholder="e.g., 986"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newLand.description}
                    onChange={(e) => setNewLand({...newLand, description: e.target.value})}
                    placeholder="Enter land description..."
                    rows="4"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                  <label>
                    <ImageIcon size={18} style={{display: 'inline', marginRight: '8px'}} />
                    Land Images * (Max 10)
                  </label>
                  <input
                    type="file"
                    id="land-images"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    required
                  />
                  
                  {selectedFiles.length > 0 && (
                    <div style={{marginTop: '12px'}}>
                      <p style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', color: '#10b981'}}>
                        {selectedFiles.length} file(s) selected
                      </p>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px'}}>
                        {Array.from(selectedFiles).map((file, index) => (
                          <div key={index} style={{position: 'relative', paddingTop: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb'}}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Selected ${index + 1}`}
                              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedFile(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '8px', fontStyle: 'italic'}}>
                        Images will be uploaded when you click "Create Land"
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}}></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Create Land
                      </>
                    )}
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
        confirmButtonClass={confirmAction?.confirmButtonClass || ''}
        showIcon={false}
      />

      {/* Message Modal */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </div>
  );
};

export default LandManagement;
