import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth/authService';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Optionally checks for admin role
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (!requireAdmin && isAdmin) {
    // If admin tries to access user routes, redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
