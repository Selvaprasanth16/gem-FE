import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/assests/gemlogof.jpg" alt="Gem Real-Estate" className="logo-image" />
          <span className="logo-text">Gem Real-Estate</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/sell" 
            className={`nav-link ${location.pathname === '/sell' ? 'active' : ''}`}
          >
            Sell Land
          </Link>
          <Link 
            to="/buy" 
            className={`nav-link ${location.pathname === '/buy' ? 'active' : ''}`}
          >
            Buy Land
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
