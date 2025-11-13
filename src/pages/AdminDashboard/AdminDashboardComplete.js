import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth/authService';
import adminService from '../../services/admin/adminService';
import UserManagement from '../Admin/UserManagement';
import SubmissionManagement from '../Admin/SubmissionManagement';
import EnquiryManagement from '../Admin/EnquiryManagement';
import LandManagement from '../Admin/LandManagement';
import AdminProfile from '../Admin/AdminProfile';
import LandingContent from '../Admin/LandingContent';
import './AdminDashboardComplete.css';
import { 
  Shield, LogOut, User, Users, FileText, CheckCircle, 
  XCircle, Clock, TrendingUp, AlertCircle, Mail, Phone,
  MapPin, DollarSign, BarChart3, PieChart, Activity
} from 'lucide-react';

const AdminDashboardComplete = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [sellLandStats, setSellLandStats] = useState(null);
  const [enquiryStats, setEnquiryStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check authentication and admin role
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }

    setUser(currentUser);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all dashboard statistics
      const [dashStats, sellStats, enqStats] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSellLandStats(),
        adminService.getEnquiryStats()
      ]);

      setStats(dashStats);
      setSellLandStats(sellStats);
      setEnquiryStats(enqStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <Shield size={32} className="header-icon" />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.full_name}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="admin-badge">
            <User size={16} />
            {user?.username}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          <FileText size={18} />
          Submissions
        </button>
        <button 
          className={`tab ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          <Mail size={18} />
          Enquiries
        </button>
        <button 
          className={`tab ${activeTab === 'lands' ? 'active' : ''}`}
          onClick={() => setActiveTab('lands')}
        >
          <MapPin size={18} />
          Lands
        </button>
        <button 
          className={`tab ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          <PieChart size={18} />
          Landing
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <section className="metrics-grid">
              <div className="metric-card users">
                <div className="metric-icon">
                  <Users size={32} />
                </div>
                <div className="metric-info">
                  <h3>Total Users</h3>
                  <p className="metric-value">{stats?.total_users || 0}</p>
                  <span className="metric-label">Registered users</span>
                </div>
              </div>

              <div className="metric-card lands">
                <div className="metric-icon">
                  <MapPin size={32} />
                </div>
                <div className="metric-info">
                  <h3>Total Lands</h3>
                  <p className="metric-value">{stats?.total_lands || 0}</p>
                  <span className="metric-label">Listed properties</span>
                </div>
              </div>

              <div className="metric-card pending">
                <div className="metric-icon">
                  <Clock size={32} />
                </div>
                <div className="metric-info">
                  <h3>Pending Submissions</h3>
                  <p className="metric-value">{sellLandStats?.overview?.pending_submissions || 0}</p>
                  <span className="metric-label">Awaiting approval</span>
                </div>
              </div>

              <div className="metric-card enquiries">
                <div className="metric-icon">
                  <Mail size={32} />
                </div>
                <div className="metric-info">
                  <h3>Total Enquiries</h3>
                  <p className="metric-value">{enquiryStats?.overview?.total_enquiries || 0}</p>
                  <span className="metric-label">Customer enquiries</span>
                </div>
              </div>
            </section>

            {/* Submission Status Overview */}
            <section className="status-section">
              <h2>Submission Status Overview</h2>
              <div className="status-grid">
                <div className="status-card pending-card">
                  <Clock size={24} />
                  <div>
                    <h4>Pending</h4>
                    <p>{sellLandStats?.overview?.pending_submissions || 0}</p>
                  </div>
                </div>
                <div className="status-card approved-card">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Approved</h4>
                    <p>{sellLandStats?.overview?.approved_submissions || 0}</p>
                  </div>
                </div>
                <div className="status-card rejected-card">
                  <XCircle size={24} />
                  <div>
                    <h4>Rejected</h4>
                    <p>{sellLandStats?.overview?.rejected_submissions || 0}</p>
                  </div>
                </div>
                <div className="status-card moved-card">
                  <TrendingUp size={24} />
                  <div>
                    <h4>Moved to Land</h4>
                    <p>{sellLandStats?.overview?.moved_to_land || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Enquiry Status Overview */}
            <section className="status-section">
              <h2>Enquiry Status Overview</h2>
              <div className="status-grid">
                <div className="status-card pending-card">
                  <Clock size={24} />
                  <div>
                    <h4>Pending</h4>
                    <p>{enquiryStats?.overview?.pending_enquiries || 0}</p>
                  </div>
                </div>
                <div className="status-card contacted-card">
                  <Phone size={24} />
                  <div>
                    <h4>Contacted</h4>
                    <p>{enquiryStats?.overview?.contacted_enquiries || 0}</p>
                  </div>
                </div>
                <div className="status-card progress-card">
                  <Activity size={24} />
                  <div>
                    <h4>In Progress</h4>
                    <p>{enquiryStats?.overview?.in_progress_enquiries || 0}</p>
                  </div>
                </div>
                <div className="status-card completed-card">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Completed</h4>
                    <p>{enquiryStats?.overview?.completed_enquiries || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <div className="recent-activity-grid">
              {/* Recent Submissions */}
              <section className="activity-section">
                <h2>Recent Submissions</h2>
                <div className="activity-list">
                  {sellLandStats?.recent_submissions?.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="activity-item">
                      <div className="activity-icon">
                        <FileText size={20} />
                      </div>
                      <div className="activity-details">
                        <h4>{submission.owner_name}</h4>
                        <p>{submission.location} - {submission.land_type}</p>
                        <span className={`status-badge ${submission.status}`}>
                          {submission.status}
                        </span>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-price">
                          ₹{submission.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )) || <p className="no-data">No recent submissions</p>}
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/admin/submissions')}
                >
                  View All Submissions
                </button>
              </section>

              {/* Recent Enquiries */}
              <section className="activity-section">
                <h2>Recent Enquiries</h2>
                <div className="activity-list">
                  {enquiryStats?.recent_enquiries?.slice(0, 5).map((enquiry) => (
                    <div key={enquiry.id} className="activity-item">
                      <div className="activity-icon">
                        <Mail size={20} />
                      </div>
                      <div className="activity-details">
                        <h4>{enquiry.contact_name}</h4>
                        <p>{enquiry.enquiry_type.replace('_', ' ')}</p>
                        <span className={`status-badge ${enquiry.status}`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-phone">
                          <Phone size={14} />
                          {enquiry.contact_phone}
                        </span>
                      </div>
                    </div>
                  )) || <p className="no-data">No recent enquiries</p>}
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/admin/enquiries')}
                >
                  View All Enquiries
                </button>
              </section>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="tab-content">
            <AdminProfile />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <UserManagement hideBackButton={true} />
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="tab-content">
            <SubmissionManagement hideBackButton={true} />
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div className="tab-content">
            <EnquiryManagement hideBackButton={true} />
          </div>
        )}

        {/* Lands Tab */}
        {activeTab === 'lands' && (
          <div className="tab-content">
            <LandManagement hideBackButton={true} />
          </div>
        )}

        {/* Landing Content Tab */}
        {activeTab === 'landing' && (
          <div className="tab-content">
            <LandingContent />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardComplete;
