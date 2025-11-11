import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth/authService';
import { Home, User, LogOut, LayoutDashboard } from 'lucide-react';
import '../style/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    // authService.logout() already redirects to landing page
  };

  const getDashboardLink = () => {
    return isAdmin ? '/admin/dashboard' : '/user/dashboard';
  };

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
            <Home size={18} />
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

          {isAuthenticated ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <div className="navbar-user">
                <span className="user-name">
                  <User size={16} />
                  <span className="user-name-text">{currentUser?.full_name || currentUser?.username}</span>
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link login-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
