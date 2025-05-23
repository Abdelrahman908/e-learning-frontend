import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // أثناء تحميل بيانات المستخدم
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجّل دخول
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // التحقق من الصلاحية بناءً على الدور
  const userRole = user.role?.toLowerCase();
  const isAllowed = allowedRoles.length === 0 || allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!isAllowed) {
    return <Navigate to="/404" replace />;
  }

  // السماح بالوصول
  return <Outlet />;
};

export default ProtectedRoute;
