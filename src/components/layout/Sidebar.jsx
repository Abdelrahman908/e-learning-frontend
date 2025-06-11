import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, BookOpen, Users, Settings,
  FileText, Video, BarChart2, HelpCircle, Bell, User
} from 'lucide-react';

const Sidebar = ({ role, user }) => {
  const normalizedRole = role?.toLowerCase();

  const commonLinks = [
    {
      to: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      text: 'الرئيسية'
    },
    {
      to: '/profile',
      icon: <Settings className="h-5 w-5" />,
      text: 'الملف الشخصي'
    },
    {
      to: '/notifications',
      icon: <Bell className="h-5 w-5" />,
      text: 'الإشعارات'
    }
  ];

  const roleBasedLinks = {
    admin: [
      { to: '/admin/users', icon: <Users className="h-5 w-5" />, text: 'إدارة المستخدمين' },
      { to: '/admin/categories', icon: <BookOpen className="h-5 w-5" />, text: 'التصنيفات' },
      { to: '/admin/categories/create', icon: <Video className="h-5 w-5" />, text: 'إضافة تصنيف' },
    ],
    instructor: [
      { to: '/dashboard/my-courses', icon: <BookOpen className="h-5 w-5" />, text: 'دوراتي' },
      { to: '/courses/new', icon: <Video className="h-5 w-5" />, text: 'إضافة دورة' }
    ],
    // student: [
    //   { to: '/dashboard/my-courses', icon: <BookOpen className="h-5 w-5" />, text: 'دوراتي' },
    // ]
  };

  const navLinks = [...commonLinks, ...(roleBasedLinks[normalizedRole] || [])];

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col shadow-md relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shadow-sm">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-gray-400" size={24} />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-gray-800 truncate">
            {user?.fullName || 'مستخدم'}
          </span>
          <span className="text-xs text-gray-500 capitalize">{role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 custom-scroll">
        <ul className="space-y-1">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium shadow-sm ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                <span className="truncate">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Help Link */}
      <div className="p-4 border-t bg-gray-50">
        <NavLink
          to="/help"
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          <span>المساعدة</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
