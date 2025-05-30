import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ roles = [], redirectPath = '/login' }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const hasRequiredRole = roles.length === 0 || roles.some(role => role.toLowerCase() === userRole);

  if (!hasRequiredRole) {
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default React.memo(ProtectedRoute);