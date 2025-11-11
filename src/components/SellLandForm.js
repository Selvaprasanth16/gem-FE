import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/SellLandForm.css";
import {
  ArrowLeft,
  Check,
  X,
  MessageCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Navbar from "./Navbar";
import sellLandService from "../services/sellLand/sellLandService";
import imageUploadService from "../services/admin/imageUploadService";
import authService from "../services/auth/authService";

const landTypes = [
  { key: "Coconut Land", label: "Coconut Land", desc: "Agricultural coconut plantation", icon: "🥥" },
  { key: "Empty Land", label: "Empty Land", desc: "Vacant land ready for development", icon: "🌍" },
  { key: "Commercial Land", label: "Commercial Land", desc: "Business and commercial use", icon: "🏢" },
  { key: "House", label: "House", desc: "Residential property with structure", icon: "🏠" },
];

const SellLandForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLandType, setSelectedLandType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    price: "",
    area: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore form data after login
  useEffect(() => {
    const pendingForm = sessionStorage.getItem('pendingSellForm');
    if (pendingForm && authService.isAuthenticated()) {
      try {
        const savedData = JSON.parse(pendingForm);
        setFormData(savedData.formData);
        setSelectedLandType(savedData.selectedLandType);
        setCurrentStep(savedData.currentStep);
        
        // Check if we should auto-submit
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'submit') {
          // Trigger submit after a short delay to ensure state is set
          setTimeout(() => {
            document.querySelector('.submit-button')?.click();
          }, 500);
        }
      } catch (err) {
        console.error('Error restoring form data:', err);
      }
    }
  }, [location]);

  const handleLandTypeSelect = (type) => {
    setSelectedLandType(type);
    setCurrentStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleRemoveSelectedFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Save form data to sessionStorage to continue after login
      sessionStorage.setItem('pendingSellForm', JSON.stringify({
        formData,
        selectedLandType,
        currentStep
      }));
      
      // Redirect to login with return URL
      navigate('/login?redirect=/sell&action=submit');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload images to Cloudinary
      const imageResponse = await imageUploadService.uploadLandImages(selectedFiles);
      const imageUrls = imageResponse.image_urls;
      
      // Step 2: Prepare data for API
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        price: parseInt(formData.price),
        area: parseInt(formData.area),
        landType: selectedLandType,
        images_urls: imageUrls,
      };

      // Call API
      await sellLandService.createSubmission(submissionData);
      
      // Clear saved form data
      sessionStorage.removeItem('pendingSellForm');
      
      // Show success
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setSelectedLandType("");
    setError("");
    setSelectedFiles([]);
    setFormData({
      name: "",
      phone: "",
      location: "",
      price: "",
      area: "",
    });
  };

  return (
    <>
      <Navbar />
      <div className="sell-form-container">
        <div className="sell-form-card">
          <h2 className="sell-form-title">Sell Your Land</h2>

          {/* Step Indicators */}
          <div className="step-indicators">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className="step-line"></div>
            <div className="step-indicator">3</div>
          </div>

          {/* Step 1 - Land Type Selection */}
          {currentStep === 1 && (
            <div className="step step-1">
              <h3>Select Your Land Type</h3>
              <div className="land-type-options">
                {landTypes.map(({ key, label, desc, icon }) => (
                  <button
                    key={key}
                    className={`land-type-btn ${selectedLandType === key ? "selected" : ""}`}
                    onClick={() => handleLandTypeSelect(key)}
                  >
                    <div className="land-type-icon">{icon}</div>
                    <div className="land-type-text">
                      <strong>{label}</strong>
                      <small>{desc}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 - Property Details */}
          {currentStep === 2 && (
            <div className="form-container">
              <button 
                className="back-button"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedLandType("");
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="form-header">
                <h3>Property Details</h3>
                <span className="land-type-badge">{selectedLandType}</span>
              </div>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-instruction">
                    <label>Owner Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter owner's full name"
                      required
                    />
                  </div>

                  <div className="form-instruction">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State or full address"
                      required
                    />
                  </div>

                  <div className="form-instruction">
                    <label>Land Size (sqft) *</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Enter size in square feet"
                      required
                    />
                  </div>

                  <div className="form-instruction">
                    <label>Expected Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter expected price"
                      required
                    />
                  </div>

                  <div className="form-instruction form-grid-full">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="form-instruction form-grid-full">
                    <label>
                      <ImageIcon size={18} style={{display: 'inline', marginRight: '8px', verticalAlign: 'middle'}} />
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
                          Images will be uploaded when you click "Submit Listing"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Listing"}
                </button>
              </form>
            </div>
          )}

          {/* Success Modal */}
          {showSuccess && (
            <div className="success-modal">
              <div className="success-box">
                <button className="close-modal" onClick={resetForm}>
                  <X size={20} />
                </button>

                <div className="success-icon">
                  <Check size={36} strokeWidth={3} />
                </div>

                <h3>Listing Submitted Successfully!</h3>
                <p>
                  Your land listing has been submitted and will be reviewed shortly.
                </p>

                <div className="success-details">
                  <div className="detail-row">
                    <span className="detail-label">Land Type:</span>
                    <span className="detail-value">{selectedLandType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{formData.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Size:</span>
                    <span className="detail-value">{formData.area} sqft</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">₹{formData.price}</span>
                  </div>
                </div>

                <div className="success-actions">
                  <button className="whatsapp-button">
                    <MessageCircle size={18} />
                    <span>Contact via WhatsApp</span>
                  </button>
                  <button className="new-listing-button" onClick={resetForm}>
                    Create New Listing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellLandForm;
