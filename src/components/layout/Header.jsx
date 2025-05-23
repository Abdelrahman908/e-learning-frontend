import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import useAuth from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";

const Header = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden mr-4">
            {/* أيقونة القائمة للجوال */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-gray-800">
            منصتنا
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <Avatar name={user.name} />
              <span className="hidden md:inline-block font-medium">{user.name}</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-2" />
                <span>الملف الشخصي</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>الإعدادات</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;