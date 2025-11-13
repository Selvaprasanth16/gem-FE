import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import "../style/landingPageFooter.css";

const LandingPageFooter = ({ instagram }) => {
  const ig = instagram || {
    description:
      "Join our community of land enthusiasts! Get daily inspiration, property showcases, and exclusive deals. Share your land journey with us!",
    handle: "gem_realestate_",
    url: "https://instagram.com/gem_realestate_",
    followers: "10K+",
    posts: "500+",
    properties: "50+",
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo & About */}
          <div className="footer-about">
            <Link to="/" className="footer-logo">
              <img src="/assests/gemlogof.jpg" alt="Gem Real-Estate" className="footer-logo-image" />
              <span className="footer-brand">Gem Real-Estate</span>
            </Link>
            <p className="footer-desc">
              🌿 Connecting you with pristine, untouched landscapes for over a decade. 
              Your dream land awaits discovery.
            </p>
            <div className="footer-socials">
              <a
                href={ig.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn instagram"
              >
                <Instagram className="icon-small" />
              </a>
              <a
                href="https://wa.me/919894351011"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn whatsapp"
              >
                <MessageCircle className="icon-small" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/lands">Browse Lands</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/sell-land">Sell Your Land</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li>🏞️ Premium Land Sales</li>
              <li>🏡 Property Consultation</li>
              <li>💰 Investment Planning</li>
              <li>⚖️ Legal Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Contact</h3>
            <div className="footer-contact">
              <a
                href="https://wa.me/919894351011"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item contact-link"
              >
                <Phone className="icon-small text-green" />
                <span>+91 98943 51011</span>
              </a>
              <a
                href="mailto:Gemrealestate100@gmail.com"
                className="contact-item contact-link"
              >
                <Mail className="icon-small text-green" />
                <span>Gemrealestate100@gmail.com</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=123+Nature+Drive+Green+Valley+CA+94041"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item contact-link"
              >
                <MapPin className="icon-small text-green" />
                <span>
                  123 Nature Drive <br />
                  Green Valley, CA 94041
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Instagram Section */}
        <div className="footer-instagram-section">
          <div className="instagram-header">
            <Instagram className="instagram-icon-footer" />
            <h3>Follow Us on Instagram</h3>
          </div>
          <p className="instagram-description">{ig.description}</p>
          <a
            href={ig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-follow-btn"
          >
            <Instagram size={20} />
            <span>Follow @{ig.handle}</span>
          </a>
          <div className="instagram-stats">
            <div className="stat-item">
              <span className="stat-number">{ig.followers || '10K+'}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{ig.posts || '500+'}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{ig.properties || '50+'}</span>
              <span className="stat-label">Properties</span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="footer-bottom">
          <p>
            © 2024 Gem Realstate. All rights reserved. 🌱 We never share your data.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
