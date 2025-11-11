import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import './UserDashboard.css';
import { Home, LogOut, User, FileText, ShoppingCart, Mail } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user
    const currentUser = authService.getCurrentUser();
    
    // Check if user is actually a user (not admin)
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Home size={24} />
          <span>GEM</span>
        </div>
        <div className="nav-user">
          <User size={20} />
          <span>{user.full_name}</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user.full_name}!</h1>
          <p>Manage your land listings and explore new opportunities</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate('/sell')}>
            <div className="card-icon">
              <Home size={32} />
            </div>
            <h3>Sell Your Land</h3>
            <p>Submit your property for sale</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/buy')}>
            <div className="card-icon">
              <ShoppingCart size={32} />
            </div>
            <h3>Browse Properties</h3>
            <p>Find your perfect land</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/user/my-submissions')}>
            <div className="card-icon">
              <FileText size={32} />
            </div>
            <h3>My Submissions</h3>
            <p>View your sell land submissions</p>
          </div>

          <div className="dashboard-card" onClick={() => navigate('/user/my-enquiries')}>
            <div className="card-icon">
              <Mail size={32} />
            </div>
            <h3>My Enquiries</h3>
            <p>Track your property enquiries</p>
          </div>
        </div>

        <div className="user-info-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              <p>{user.username}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p className="role-badge">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
