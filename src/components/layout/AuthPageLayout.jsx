import React from 'react';
import HeroImage from '../../assets/images/Expert Data Entry and Accurate Web Research Solutions.jpeg'; // ✅ عدّل المسار حسب مكان الملف الحالي

const AuthPageLayout = ({ children, title, subtitle, sideContent }) => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image Background with Overlay and Text */}
          <div className="md:w-1/2 relative flex items-center justify-center p-10 overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${HeroImage})`,
              }}
            />
            {/* Dark Overlay with less opacity */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-30" />
            {/* Side Content */}
            <div className="relative z-10 text-white text-center md:text-left">
              {sideContent}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
