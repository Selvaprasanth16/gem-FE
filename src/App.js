import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from './components/landing';
import SellLandForm from './components/SellLandForm';
import BuyLand from './components/BuyLand';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import SubmissionManagement from './pages/Admin/SubmissionManagement';
import EnquiryManagement from './pages/Admin/EnquiryManagement';
import LandManagement from './pages/Admin/LandManagement';
import LandingContent from './pages/Admin/LandingContent';
import MySubmissions from './pages/User/MySubmissions';
import MyEnquiries from './pages/User/MyEnquiries';
import BrowseLands from './pages/User/BrowseLands';
import LandDetail from './pages/User/LandDetail';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/User/UserProfile';
import AdminProfile from './pages/Admin/AdminProfile';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Public Browse Routes - No login required to view */}
        <Route path="/sell" element={<SellLandForm />} />
        <Route path="/buy" element={<BrowseLands />} />
        <Route path="/land/:id" element={<LandDetail />} />
        
        {/* User Protected Routes */}
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/my-submissions" 
          element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/my-enquiries" 
          element={
            <ProtectedRoute>
              <MyEnquiries />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/profile" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/submissions" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <SubmissionManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/enquiries" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <EnquiryManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/lands" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <LandManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/landing" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <LandingContent />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
