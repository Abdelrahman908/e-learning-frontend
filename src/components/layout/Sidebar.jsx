import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Users, Settings, 
  FileText, Video, BarChart2, HelpCircle 
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const location = useLocation();

  // عناصر القائمة المشتركة بين جميع الأدوار
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
    }
  ];

  // عناصر القائمة حسب الدور
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

  // دمج القوائم
  const navLinks = [...commonLinks, ...(roleBasedLinks[role] || [])];

  return (
    <div className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-8 p-2">
          <h2 className="text-xl font-bold text-gray-800">
            {role === 'Admin' && 'لوحة التحكم'}
            {role === 'Instructor' && 'لوحة المدرس'}
            {role === 'Student' && 'لوحة الطالب'}
          </h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
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

        <div className="mt-auto p-3">
          <NavLink
            to="/help"
            className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            <span>المساعدة</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;