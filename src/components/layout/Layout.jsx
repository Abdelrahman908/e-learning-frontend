import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import LoadingSpinner from "../ui/LoadingSpinner";
import useAuth from "../../hooks/useAuth";

/**
 * Layout component that provides the main application structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Optional child components
 * @returns {React.ReactElement} Layout component
 */
const Layout = ({ children }) => {
  const { 
    user = { role: 'guest' }, 
    loading = false, 
    isAuthenticated = false,
    logout = () => {}
  } = useAuth();

  // Show loading spinner while authenticating
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  /**
   * Safely determines the role-based border color class
   * @returns {string} Tailwind CSS class for the role-specific border color
   */
  const getRoleColorClass = () => {
    const role = user?.role?.toLowerCase() || 'guest';
    
    const roleColors = {
      admin: 'border-t-admin bg-admin-50',
      instructor: 'border-t-instructor bg-instructor-50',
      student: 'border-t-student bg-student-50',
      guest: 'border-t-primary bg-gray-50'
    };

    return roleColors[role] || roleColors.guest;
  };

  return (
    <div className={`flex flex-col min-h-screen ${getRoleColorClass()} border-t-4`}>
      <Header user={user} logout={logout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          role={user?.role || 'guest'} 
          user={user}
          className="hidden md:flex"
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Breadcrumbs className="mb-4" />
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-180px)]">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      <footer className="bg-white border-t py-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} منصتنا. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;