import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';
import AdminDashboard from '../pages/admin/AdminDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';

const DashboardRouter = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('DashboardRouter State:', {
    loading,
    isAuthenticated,
    user: user ? { id: user.id, role: user.role } : null
  });

  if (loading) {
    console.log('DashboardRouter: Loading auth data...');
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    console.log('DashboardRouter: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.error('DashboardRouter: User is null after authentication!');
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();
  console.log('DashboardRouter: User role detected:', role);

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      console.warn('DashboardRouter: Unauthorized role:', role);
      return <Navigate to="/not-authorized" replace />;
  }
};

export default DashboardRouter;