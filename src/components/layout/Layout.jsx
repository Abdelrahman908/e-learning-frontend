import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import LoadingSpinner from '../ui/LoadingSpinner';
import useAuth from '../../hooks/useAuth';

/**
 * ✅ تصميم محمي احترافي مع أنيميشن وإظهار حسب صلاحيات المستخدم
 */
const Layout = ({ children }) => {
  const {
    user = { role: 'guest' },
    loading = false,
    isAuthenticated = false,
    logout = () => {}
  } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  const role = user?.role?.toLowerCase() || 'guest';

  const colors = {
    admin: {
      bg: 'bg-gray-50',
      border: 'border-t-gray-400',
      bar: 'bg-gray-400'
    },
    instructor: {
      bg: 'bg-blue-50',
      border: 'border-t-blue-400',
      bar: 'bg-blue-400'
    },
    student: {
      bg: 'bg-green-50',
      border: 'border-t-green-400',
      bar: 'bg-green-400'
    },
    guest: {
      bg: 'bg-white',
      border: 'border-t-gray-300',
      bar: 'bg-gray-300'
    }
  };

  const currentColors = colors[role] || colors.guest;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col min-h-screen ${currentColors.bg}`}
    >
      {/* ✅ شريط علوي ملون حسب الدور */}
      <motion.div
        layout
        className={`${currentColors.bar} h-1 w-full`}
      />

      {/* ✅ رأس الصفحة */}
      <Header user={user} logout={logout} />

      {/* ✅ المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={user?.role || 'guest'}
          user={{
            fullName: user?.fullName,
            avatarUrl: user?.avatarUrl
          }}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <Breadcrumbs />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl shadow-xl p-6 min-h-[calc(100vh-180px)]"
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>

      {/* ✅ التذييل */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white border-t py-4 text-center text-gray-500 text-sm shadow-inner"
      >
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} منصتنا. جميع الحقوق محفوظة.
        </div>
      </motion.footer>
    </motion.div>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
