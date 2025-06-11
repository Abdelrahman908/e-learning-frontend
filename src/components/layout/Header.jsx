import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { message } from 'antd';
import { AuthContext } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import NotificationService from '../../services/notifications';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const notificationRef = useRef();
  const userMenuRef = useRef();

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    NotificationService.startConnection((notification) => {
      setNotifications(prev => [notification, ...prev]);
      message.info(`${notification.title} - ${notification.message}`, 4);
    });

    return () => NotificationService.stopConnection();
  }, [user]);

  useEffect(() => {
    if (notificationVisible) {
      const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        for (const n of unread) {
          try {
            await NotificationService.updateReadStatus(n.id, true);
            setNotifications(prev =>
              prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
            );
          } catch (err) {
            console.error("❌ فشل في تحديث الإشعار:", err.message);
          }
        }
      };
      markAllAsRead();
    }
  }, [notificationVisible]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationVisible(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setUserMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'admin': return 'bg-gray-200 text-gray-700';
      case 'instructor': return 'bg-blue-200 text-blue-800';
      case 'student': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Variants for framer-motion dropdown menus
  const dropdownVariants = {
    hidden: { opacity: 0, y: -15, scale: 0.95, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <header className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-3xl font-extrabold text-black tracking-wide hover:text-blue-900 hover:underline transition-colors duration-300"
          aria-label="Go to dashboard"
        >
          FRAMY
        </Link>

        <div className="flex items-center gap-6 relative">
          {/* 🔔 إشعارات */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationVisible(prev => !prev)}
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full relative transition-colors duration-300"
              aria-label="Toggle notifications"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5 font-semibold shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationVisible && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="p-4 border-b font-semibold text-gray-700 text-lg">
                    الإشعارات
                  </div>
                  <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <li
                          key={notif.id}
                          className={`px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            !notif.isRead ? "bg-blue-50" : ""
                          }`}
                          title={notif.message}
                        >
                          <p className="font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                        </li>
                      ))
                    ) : (
                      <li className="px-5 py-4 text-center text-gray-500">لا توجد إشعارات جديدة</li>
                    )}
                  </ul>
                  <div className="text-center border-t py-3">
                    <Link
                      to="/notifications"
                      className="text-blue-600 hover:underline font-medium text-sm"
                    >
                      عرض كل الإشعارات
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 المستخدم */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuVisible(prev => !prev)}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full transition-shadow duration-300 shadow-sm hover:shadow-lg bg-white p-1.5"
              aria-label="Toggle user menu"
            >
              <Avatar name={user?.name || user?.fullName || user?.email} className="ring-1 ring-gray-300" />
              <div className="hidden md:flex items-center gap-3">
                <span className="font-semibold text-gray-800 truncate max-w-xs">
                  {user?.name || user?.fullName}
                </span>
                <span
                  className={`text-xs px-3 py-0.5 rounded-full select-none whitespace-nowrap ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {user?.role}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {userMenuVisible && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <User className="h-4 w-4 mr-2" />
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    الإعدادات
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    تسجيل الخروج
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
