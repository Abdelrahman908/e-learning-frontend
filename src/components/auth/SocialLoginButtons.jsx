import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaGithub, FaTwitter } from 'react-icons/fa';

const SocialLoginButtons = ({ loading }) => {
  const handleSocialLogin = (provider) => {
    // هنا يمكنك تنفيذ منطق تسجيل الدخول عبر وسائل التواصل الاجتماعي
    console.log(`Logging in with ${provider}`);
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        disabled={loading}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FcGoogle className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin('facebook')}
        disabled={loading}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FaFacebookF className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin('github')}
        disabled={loading}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FaGithub className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => handleSocialLogin('twitter')}
        disabled={loading}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FaTwitter className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SocialLoginButtons;
