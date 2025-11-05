import React, { useState } from "react";
import "../style/SellLandForm.css";
import {
  ArrowLeft,
  Check,
  X,
  MessageCircle
} from "lucide-react";
import Navbar from "./Navbar";

const landTypes = [
  { key: "Coconut Land", label: "Coconut Land", desc: "Agricultural coconut plantation", icon: "🥥" },
  { key: "Empty Land", label: "Empty Land", desc: "Vacant land ready for development", icon: "🌍" },
  { key: "Commercial Land", label: "Commercial Land", desc: "Business and commercial use", icon: "🏢" },
  { key: "House", label: "House", desc: "Residential property with structure", icon: "🏠" },
];

const SellLandForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLandType, setSelectedLandType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    price: "",
    area: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLandTypeSelect = (type) => {
    setSelectedLandType(type);
    setCurrentStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setSelectedLandType("");
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
                </div>

                <button type="submit" className="submit-button">
                  Submit Listing
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
