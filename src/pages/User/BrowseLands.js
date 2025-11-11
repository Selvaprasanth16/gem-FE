import React, { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import enquiryService from '../../services/enquiry/enquiryService';
import Navbar from '../../components/Navbar';
import './UserPages.css';
import { 
  Search, MapPin, DollarSign, Maximize, Filter,
  AlertCircle, Mail, CheckCircle, X
} from 'lucide-react';

const BrowseLands = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [filters, setFilters] = useState({
    property_type: '',
    min_price: '',
    max_price: '',
    location: ''
  });
  const [enquiryForm, setEnquiryForm] = useState({
    enquiry_type: 'buy_interest',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    message: '',
    budget: '',
    preferred_contact_time: ''
  });

  useEffect(() => {
    loadLands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLands = async () => {
    try {
      setLoading(true);
      // Build filter params, only include non-empty values
      const filterParams = {};
      if (filters.property_type) filterParams.property_type = filters.property_type;
      if (filters.location) filterParams.location = filters.location;
      if (filters.min_price) filterParams.min_price = filters.min_price;
      if (filters.max_price) filterParams.max_price = filters.max_price;
      if (searchTerm) filterParams.search = searchTerm;
      
      console.log('Loading lands with filters:', filterParams);
      const response = await enquiryService.getAvailableLands(filterParams);
      console.log('Received lands:', response.lands?.length, 'properties');
      setLands(response.lands || []);
    } catch (error) {
      console.error('Error loading lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = async (land) => {
    setSelectedLand(land);
    
    if (authService.isAuthenticated()) {
      // Logged in: go to detail page with enquiry modal open
      navigate(`/land/${land.id}?enquire=1`);
    } else {
      // Guest: ask for mobile number to submit guest enquiry
      setShowMobileModal(true);
    }
  };

  const handleSubmitMobileNumber = async (e) => {
    e.preventDefault();
    try {
      // Submit guest enquiry with mobile number
      await enquiryService.createGuestEnquiry({
        land_id: selectedLand.id,
        contact_phone: mobileNumber
      });
      
      setShowMobileModal(false);
      setShowSuccessModal(true);
      setMobileNumber('');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    try {
      await enquiryService.createEnquiry({
        land_id: selectedLand.id,
        ...enquiryForm,
        budget: enquiryForm.budget ? parseInt(enquiryForm.budget) : null
      });
      
      setShowEnquiryModal(false);
      alert('Enquiry submitted successfully! We will contact you soon.');
      setEnquiryForm({
        enquiry_type: 'buy_interest',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        message: '',
        budget: '',
        preferred_contact_time: ''
      });
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleApplyFilters = () => {
    loadLands();
  };

  const handleResetFilters = async () => {
    setFilters({
      property_type: '',
      min_price: '',
      max_price: '',
      location: ''
    });
    setSearchTerm('');
    // Reload all lands after reset
    try {
      setLoading(true);
      const response = await enquiryService.getAvailableLands({});
      setLands(response.lands || []);
    } catch (error) {
      console.error('Error loading lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Use the same loadLands function
    loadLands();
  };

  if (loading) {
    return (
      <div className="user-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading properties...</p>
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
            <MapPin size={32} />
            <div>
              <h1>Browse Properties</h1>
              <p>Find your perfect land</p>
            </div>
          </div>
        </header>

        {/* Filters Launcher */}
        <div className="filters-section" style={{display:'flex', justifyContent:'flex-end'}}>
          <button className="btn-secondary" onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="results-header">
          <p>{lands.length} properties found</p>
        </div>

        {lands.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={64} />
            <h2>No Properties Found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="lands-grid">
            {lands.map(land => (
              <div 
                key={land.id} 
                className="land-card"
                onClick={() => navigate(`/land/${land.id}`)}
                style={{cursor: 'pointer'}}
              >
                {/* Land Image */}
                {land.images_urls && land.images_urls.length > 0 && (
                  <div className="land-card-image">
                    <img 
                      src={land.images_urls[0]} 
                      alt={land.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                      }}
                    />
                    {land.images_urls.length > 1 && (
                      <div className="image-count-badge">
                        +{land.images_urls.length - 1} more
                      </div>
                    )}
                  </div>
                )}
                
                <div className="land-card-header">
                  <h3>{land.title}</h3>
                  <span className="property-type-badge">
                    {land.property_type || 'Land'}
                  </span>
                </div>
                
                <div className="land-card-body">
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{land.location}</span>
                  </div>
                  
                  <div className="info-row">
                    <DollarSign size={16} />
                    <span className="price">₹{land.price?.toLocaleString()}</span>
                  </div>
                  
                  <div className="info-row">
                    <Maximize size={16} />
                    <span>{land.size} sqft</span>
                  </div>
                  
                  {land.description && (
                    <p className="land-description">{land.description}</p>
                  )}
                  
                  {land.features && land.features.length > 0 && (
                    <div className="features-row">
                      {land.features.map((feature, idx) => (
                        <span key={idx} className="feature-badge">{feature}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="land-card-footer">
                  <button 
                    className="btn-primary full-width"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnquiry(land);
                    }}
                  >
                    <Mail size={16} /> I'm Interested
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Popover (MUI) */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2, borderRadius: 2, width: 360 } }}
      >
        <div style={{display:'grid', gap:12}}>
          <div className="search-box" style={{border:'2px solid #e2e8f0'}}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by title, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <input
            type="text"
            className="filter-input"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
          <select
            className="filter-input"
            value={filters.property_type}
            onChange={(e) => setFilters({...filters, property_type: e.target.value})}
            style={{cursor: 'pointer'}}
          >
            <option value="">All Types</option>
            <option value="land">Land</option>
            <option value="farm">Farm</option>
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
          </select>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <input
              type="number"
              className="filter-input"
              placeholder="Min Price"
              value={filters.min_price}
              onChange={(e) => setFilters({...filters, min_price: e.target.value})}
            />
            <input
              type="number"
              className="filter-input"
              placeholder="Max Price"
              value={filters.max_price}
              onChange={(e) => setFilters({...filters, max_price: e.target.value})}
            />
          </div>
          <div className="modal-actions" style={{marginTop:8}}>
            <button className="btn-secondary" onClick={() => { handleResetFilters(); }}>
              Reset
            </button>
            <button className="btn-primary" onClick={() => { handleApplyFilters(); setFilterAnchorEl(null); }}>
              <Filter size={16} /> Apply
            </button>
          </div>
        </div>
      </Popover>

      {/* Mobile Number Modal for Guest Users */}
      {showMobileModal && selectedLand && (
        <div className="modal-overlay" onClick={() => setShowMobileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '400px'}}>
            <div className="modal-header">
              <h2>Enter Your Mobile Number</h2>
              <button className="modal-close" onClick={() => setShowMobileModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitMobileNumber}>
              <div style={{padding: '24px'}}>
                <p style={{marginBottom: '20px', color: '#666'}}>
                  Please provide your mobile number so we can contact you about {selectedLand.title}.
                </p>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowMobileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <CheckCircle size={16} />
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedLand && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <button 
              className="modal-close" 
              onClick={() => setShowSuccessModal(false)}
              style={{position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer'}}
            >
              <X size={24} />
            </button>
            
            <div style={{padding: '40px 24px', textAlign: 'center'}}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle size={36} color="white" />
              </div>
              
              <h2 style={{marginBottom: '16px', color: '#1f2937'}}>Thank You for Your Interest!</h2>
              <p style={{marginBottom: '24px', color: '#6b7280', fontSize: '16px'}}>
                We will contact you soon regarding <strong>{selectedLand.title}</strong>.
              </p>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowSuccessModal(false)}
                  style={{padding: '12px 24px'}}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseLands;
