import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import AuthPageLayout from "../../components/layout/AuthPageLayout";
import axios from '../../config/axios';
import { loginUser } from '../../services/auth';
const Login = () => {
  const { login, loading, error, rememberedEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setFormErrors(prev => ({
        ...prev,
        email: value && !validateEmail(value) ? 'البريد الإلكتروني غير صحيح' : ''
      }));
    } else if (name === 'password') {
      setFormErrors(prev => ({
        ...prev,
        password: value && !validatePassword(value) ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: !formData.email ? 'البريد الإلكتروني مطلوب' : 
             !validateEmail(formData.email) ? 'البريد الإلكتروني غير صحيح' : '',
      password: !formData.password ? 'كلمة المرور مطلوبة' : 
                !validatePassword(formData.password) ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsSubmitting(true);
  
  try {
    const response = await loginUser({
      email: formData.email,
      password: formData.password,
      rememberMe: rememberMe
    });

    console.log('Login Response:', response);

    if (response?.Success) {
      // تم نقل حفظ التوكن إلى AuthContext لضمان التزامن
      // التوجيه إلى الصفحة المطلوبة
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
      
      toast.success(response.Message || 'تم تسجيل الدخول بنجاح');
    } else {
      throw new Error(response.Message || 'Login failed');
    }
  } catch (error) {
    console.error("Login Error:", error);
    
    let errorMessage = error.message;
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (error.response.status === 403) {
        errorMessage = 'الحساب غير مفعل، يرجى تأكيد البريد الإلكتروني';
      } else if (error.response.status === 400) {
        errorMessage = 'بيانات الدخول غير صالحة';
      }
    } else if (error.message.includes('network')) {
      errorMessage = 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت';
    }

    toast.error(errorMessage, {
      icon: <AlertCircle className="text-red-500" />
    });
  } finally {
    setIsSubmitting(false);
  }
};

useEffect(() => {
  if (rememberedEmail) {
    setFormData(prev => ({ ...prev, email: rememberedEmail }));
    setRememberMe(true);
  }
}, [rememberedEmail]);

  return (
    <AuthPageLayout 
      title="تسجيل الدخول إلى حسابك"
      subtitle="أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك"
      sideContent={
        <>
          <h1 className="text-4xl font-bold mb-4">مرحبًا بعودتك!</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            استمر في رحلتك التعليمية مع الوصول إلى آلاف الدورات التي يدرسها خبراء الصناعة.
          </p>
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-shrink-0 bg-blue-500 p-3 rounded-lg">
                <ChevronRight className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">جديد في منصتنا؟</h3>
                <p className="text-sm text-blue-100 mt-1">أنشئ حسابًا للبدء</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/register')}
              className="w-full flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-base font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              إنشاء حساب جديد
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="you@example.com"
              autoComplete="username"
              disabled={loading}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.email}
            </p>
          )}
        </div>
        
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-3 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.password}
            </p>
          )}
        </div>
        
        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              تذكر بياناتي
            </label>
          </div>
          <div className="text-sm">
            <button 
              type="button"
              onClick={() => navigate('/forgot-password', { state: { email: formData.email } })}
              className="font-medium text-blue-600 hover:text-blue-500"
              disabled={loading}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
              (loading || isSubmitting) ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {(loading || isSubmitting) ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                جاري تسجيل الدخول...
              </>
            ) : 'تسجيل الدخول'}
          </button>
        </div>
      </form>
      
      {/* Social Login */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              أو سجل الدخول باستخدام
            </span>
          </div>
        </div>
        <SocialLoginButtons />
      </div>

      {/* Additional Help */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          لديك مشكلة في تسجيل الدخول؟{' '}
          <button 
            type="button"
            onClick={() => navigate('/contact-support')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            تواصل مع الدعم الفني
          </button>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Login;