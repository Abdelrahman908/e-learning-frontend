import React from 'react';
import { Bell } from 'lucide-react';

import { NavLink } from 'react-router-dom';
import {
  Home, BookOpen, Users, Settings,
  FileText, Video, BarChart2, HelpCircle
} from 'lucide-react';

const Sidebar = ({ role }) => {
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
    Admin: [
      { to: '/admin/users', icon: <Users className="h-5 w-5" />, text: 'المستخدمين' },
      { to: '/admin/reports', icon: <BarChart2 className="h-5 w-5" />, text: 'التقارير' }
    ],
    Instructor: [
      { to: '/instructor/courses', icon: <BookOpen className="h-5 w-5" />, text: 'دوراتي' },
      { to: '/instructor/upload', icon: <Video className="h-5 w-5" />, text: 'رفع دورة جديدة' }
    ],
    Student: [
      { to: '/student/my-courses', icon: <BookOpen className="h-5 w-5" />, text: 'دوراتي' },
      { to: '/student/progress', icon: <FileText className="h-5 w-5" />, text: 'تقدمي' }
    ]
  };

  const navLinks = [...commonLinks, ...(roleBasedLinks[role] || [])];

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">
          {role === 'Admin' && 'لوحة التحكم'}
          {role === 'Instructor' && 'لوحة المدرس'}
          {role === 'Student' && 'لوحة الطالب'}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <NavLink
          to="/help"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          <span>المساعدة</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

