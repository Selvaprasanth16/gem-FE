import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Maximize, Calendar, CheckCircle, 
  ChevronLeft, ChevronRight, Mail, Phone, XCircle
} from 'lucide-react';
import enquiryService from '../../services/enquiry/enquiryService';
import authService from '../../services/auth/authService';
import Navbar from '../../components/Navbar';
import './LandDetail.css';

const LandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    message: ''
  });
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    loadLandDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-open enquiry flow when coming from browse with ?enquire=1
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    if (sp.get('enquire') === '1') {
      if (authService.isAuthenticated()) {
        try {
          const user = authService.getCurrentUser();
          setEnquiryForm({
            contact_name: user?.full_name || '',
            contact_phone: user?.phone || '',
            contact_email: user?.email || '',
            message: ''
          });
        } catch {}
        setShowEnquiryModal(true);
      } else {
        setShowMobileModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadLandDetails = async () => {
    try {
      setLoading(true);
      // You'll need to create this API endpoint
      const response = await enquiryService.getLandById(id);
      setLand(response.land);
    } catch (error) {
      console.error('Error loading land details:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitGuestMobile = async (e) => {
    e.preventDefault();
    try {
      const resp = await enquiryService.createGuestEnquiry({
        land_id: id,
        contact_phone: mobileNumber,
      });
      setShowMobileModal(false);
      setMobileNumber('');
      if (resp && resp.duplicate) {
        setShowDuplicateModal(true);
      } else {
        alert('Thank you! We will contact you soon.');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit.');
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? land.images_urls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === land.images_urls.length - 1 ? 0 : prev + 1
    );
  };

  const handleEnquiry = () => {
    // If not logged in, capture mobile as guest enquiry
    if (!authService.isAuthenticated()) {
      setShowMobileModal(true);
      return;
    }
    try {
      const user = authService.getCurrentUser();
      setEnquiryForm({
        contact_name: user?.full_name || '',
        contact_phone: user?.phone || '',
        contact_email: user?.email || '',
        message: ''
      });
    } catch {}
    setShowEnquiryModal(true);
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    try {
      const resp = await enquiryService.createEnquiry({
        land_id: id,
        enquiry_type: 'buy_interest',
        contact_name: enquiryForm.contact_name,
        contact_phone: enquiryForm.contact_phone,
        contact_email: enquiryForm.contact_email,
        message: enquiryForm.message || undefined
      });
      setShowEnquiryModal(false);
      if (resp && resp.duplicate) {
        setShowDuplicateModal(true);
      } else {
        alert('Enquiry submitted successfully');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry');
    }
  };

  const formatINR = (value) => {
    if (value == null) return '';
    try {
      return `₹${Number(value).toLocaleString('en-IN')}`;
    } catch {
      return `₹${value}`;
    }
  };

  const sizeLabel = () => {
    if (!land?.size) return '';
    // Prefer acres if backend provides unit; fallback heuristics
    const unit = land.size_unit || (land.property_type === 'farm' ? 'acres' : 'sqft');
    return `${land.size} ${unit}`;
  };

  if (loading) {
    return (
      <div className="land-detail-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="land-detail-page">
        <Navbar />
        <div className="error-container">
          <h2>Property not found</h2>
          <button onClick={() => navigate('/buy')} className="btn-primary">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="land-detail-page">
      <Navbar />
      
      <div className="land-detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/buy')}>
          <ArrowLeft size={20} />
          <span>Back to Properties</span>
        </button>

        <div className="land-detail-content">
          {/* Image Gallery Section */}
          <div className="land-gallery-section">
            <div className="main-image-container">
              {land.images_urls && land.images_urls.length > 0 ? (
                <>
                  <img 
                    src={land.images_urls[currentImageIndex]} 
                    alt={land.title}
                    className="main-image"
                  />
                  {land.status === 'available' && (
                    <div className="new-badge">New</div>
                  )}

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="modal-overlay" onClick={() => setShowDuplicateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '420px'}}>
            <div className="modal-header">
              <h2>Already Submitted</h2>
              <button className="modal-close" onClick={() => setShowDuplicateModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{padding: '24px'}}>
              <p style={{marginBottom: 16, color:'#374151'}}>
                You have already submitted your interest. We will contact you soon.
              </p>
              <a
                className="btn-primary"
                href={`https://wa.me/919894351011?text=${encodeURIComponent("I’m interested in this property — please provide a quicker response.")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{display:'inline-flex', alignItems:'center', gap:8}}
              >
                <Phone size={16}/> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
                  {land.images_urls.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={handlePrevImage}>
                        <ChevronLeft size={24} />
                      </button>
                      <button className="nav-button next" onClick={handleNextImage}>
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image">No images available</div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {land.images_urls && land.images_urls.length > 1 && (
              <div className="thumbnail-gallery">
                {land.images_urls.map((url, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={url} alt={`${land.title} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="land-details-section">
            {land.title && <h1 className="land-title">{land.title}</h1>}

            <div className="land-meta">
              {land.location && (
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{land.location}</span>
                </div>
              )}

              {(land.latitude != null && land.longitude != null) && (
                <a
                  className="directions-button"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${land.latitude},${land.longitude}`}
                  target="_blank" rel="noreferrer"
                >
                  <MapPin size={16} />
                  Directions
                </a>
              )}

              {land.size && (
                <div className="meta-item">
                  <Maximize size={18} />
                  <span>{sizeLabel()}</span>
                </div>
              )}

              {land.created_at && (
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{new Date(land.created_at).toLocaleDateString('en-IN', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
              )}
            </div>

            {land.price != null && (
              <div className="land-price">{formatINR(land.price)}</div>
            )}

            {land.description && (
              <div className="land-section">
                <h2>Description</h2>
                <p className="land-description">{land.description}</p>
              </div>
            )}

            {land.features && land.features.length > 0 && (
              <div className="land-section">
                <h2>Features</h2>
                <div className="features-list">
                  {land.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckCircle size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="btn-primary btn-large" onClick={handleEnquiry}>
                <Mail size={20} />
                I'm Interested
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="modal-overlay" onClick={() => setShowEnquiryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '520px'}}>
            <div className="modal-header">
              <h2>I'm Interested</h2>
              <button className="modal-close" onClick={() => setShowEnquiryModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={submitEnquiry}>
              <div style={{padding: '24px'}}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={enquiryForm.contact_name}
                    onChange={(e)=>setEnquiryForm({...enquiryForm, contact_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    value={enquiryForm.contact_phone}
                    onChange={(e)=>setEnquiryForm({...enquiryForm, contact_phone: e.target.value})}
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={enquiryForm.contact_email}
                    onChange={(e)=>setEnquiryForm({...enquiryForm, contact_email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message (optional)</label>
                  <textarea
                    rows="3"
                    value={enquiryForm.message}
                    onChange={(e)=>setEnquiryForm({...enquiryForm, message: e.target.value})}
                    placeholder={`Hi, I'm interested in ${land?.title}`}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEnquiryModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    <Mail size={16} /> Submit Enquiry
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Mobile Modal */}
      {showMobileModal && (
        <div className="modal-overlay" onClick={() => setShowMobileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '420px'}}>
            <div className="modal-header">
              <h2>Enter Your Mobile</h2>
              <button className="modal-close" onClick={() => setShowMobileModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={submitGuestMobile}>
              <div style={{padding: '24px'}}>
                <p style={{marginBottom: 12, color:'#64748b'}}>We'll contact you shortly about this property.</p>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e)=>setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowMobileModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    Submit
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

export default LandDetail;
