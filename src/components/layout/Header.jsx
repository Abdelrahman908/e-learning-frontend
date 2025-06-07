import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { message } from 'antd';
import { AuthContext } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import NotificationService from '../../services/notifications';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getMyNotifications(1, 5);
      setNotifications(data.Notifications || []);
    } catch (error) {
      console.error("❌ فشل في جلب الإشعارات:", error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
  if (!user) return;  // تأكد من وجود المستخدم

  // التحقق من وجود التوكن قبل محاولة بدء الاتصال
  const token = localStorage.getItem("token");
  console.log("🪪 Access Token:", token); // تحقق من التوكن في الـ localStorage

  if (!token) {
    console.error("❌ Token is missing, cannot start SignalR connection");
    return; // إذا التوكن غير موجود، توقف عن الاتصال
  }

  // بدء اتصال SignalR
  NotificationService.startConnection((notification) => {
    setNotifications(prev => [notification, ...prev]);

    message.open({
      type: 'info',
      content: `${notification.title} - ${notification.message}`,
      duration: 4,
    });
  });

  // إيقاف الاتصال عند تغيير المستخدم أو مغادرته
  return () => {
    NotificationService.stopConnection();
  };

}, [user]);  // يتم استدعاء هذا الـ useEffect عند تغير قيمة user
  
  useEffect(() => {
    if (dropdownVisible) {
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
  }, [dropdownVisible]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-gray-800">منصتنا</Link>
        </div>

        <div className="flex items-center space-x-4 relative">
          {user && (
            <div className="relative">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 relative"
                onClick={() => setDropdownVisible(prev => !prev)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-xs bg-red-600 text-white rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                  <div className="p-3 border-b text-sm font-semibold text-gray-700">الإشعارات</div>
                  <ul className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <li key={notif.id} className="px-4 py-2 hover:bg-gray-100 text-sm border-b">
                          <p className="font-medium">{notif.title}</p>
                          <p className="text-xs text-gray-500">{notif.message}</p>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-500 text-center">لا توجد إشعارات جديدة</li>
                    )}
                  </ul>
                  <div className="text-center border-t py-2">
                    <Link to="/notifications" className="text-blue-500 hover:underline text-sm">
                      عرض كل الإشعارات
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {user && (
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <Avatar name={user?.name || user?.FullName || user?.Email || "مستخدم"} />
                <span className="hidden md:inline-block font-medium">{user?.name || user?.FullName}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-2" /><span>الملف الشخصي</span>
                </Link>
                <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-2" /><span>الإعدادات</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-4 w-4 mr-2" /><span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
