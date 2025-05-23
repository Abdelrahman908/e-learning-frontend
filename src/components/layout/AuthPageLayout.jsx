import React from 'react';

const AuthPageLayout = ({ children, title, subtitle, sideContent }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Hero Section */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            {sideContent}
          </div>

          {/* Right Side - Form Section */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center md:text-left mb-10">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                {subtitle && (
                  <p className="mt-2 text-gray-600">{subtitle}</p>
                )}
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
