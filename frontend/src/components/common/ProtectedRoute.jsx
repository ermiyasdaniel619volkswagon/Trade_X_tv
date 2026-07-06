
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🔒 ProtectedRoute Debug:', {
    loading,
    isAuthenticated,
    userRole: user?.role,
    requiredRoles,
  });

  // ✅ If still loading, show spinner
  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return <LoadingSpinner fullScreen message="Verifying your access..." />;
  }

  // ✅ If not authenticated, redirect to home
  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // ✅ If account is deactivated
  if (user && user.isActive === false) {
    console.log('🔒 Account deactivated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // ✅ Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    console.log(`🔒 Role mismatch: ${user?.role} not in ${requiredRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('🔒 Access granted, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;