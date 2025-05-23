import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuth from "../../hooks/useAuth";
import AuthPageLayout from "../../components/layout/AuthPageLayout";
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import axios from '../../config/axios';


const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    return {
      valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      errors: [
        password.length < minLength && `يجب أن تحتوي على الأقل ${minLength} أحرف`,
        !hasUpperCase && 'يجب أن تحتوي على حرف كبير واحد على الأقل',
        !hasLowerCase && 'يجب أن تحتوي على حرف صغير واحد على الأقل',
        !hasNumber && 'يجب أن تحتوي على رقم واحد على الأقل',
        !hasSpecialChar && 'يجب أن تحتوي على رمز خاص واحد على الأقل'
      ].filter(Boolean)
    };
  };

  // التحقق من صحة الاسم
  const validateFullName = (name) => {
    return name.trim().length >= 3;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // التحقق من الصحة أثناء الكتابة
    if (name === 'email') {
      setFormErrors(prev => ({
        ...prev,
        email: value && !validateEmail(value) ? 'البريد الإلكتروني غير صحيح' : ''
      }));
    } else if (name === 'password') {
      const { errors } = validatePassword(value);
      setFormErrors(prev => ({
        ...prev,
        password: errors.length ? errors[0] : ''
      }));
    } else if (name === 'fullName') {
      setFormErrors(prev => ({
        ...prev,
        fullName: value && !validateFullName(value) ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : ''
      }));
    }
  };

  const validateForm = () => {
    const passwordValidation = validatePassword(formData.password);
    const errors = {
      fullName: !formData.fullName ? 'الاسم الكامل مطلوب' : 
               !validateFullName(formData.fullName) ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : '',
      email: !formData.email ? 'البريد الإلكتروني مطلوب' : 
             !validateEmail(formData.email) ? 'البريد الإلكتروني غير صحيح' : '',
      password: !formData.password ? 'كلمة المرور مطلوبة' : 
                !passwordValidation.valid ? passwordValidation.errors[0] : ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await register(formData);
      if (result?.success) {
        toast.success('تم التسجيل بنجاح! يرجى تأكيد البريد الإلكتروني');
        navigate('/confirm-email', { 
          state: { 
            email: formData.email,
            canResendAt: Date.now() + 30000 // يمكن إعادة الإرسال بعد 30 ثانية
          } 
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      // يتم التعامل مع الخطأ من خلال useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  // عرض رسائل الخطأ من السيرفر
  useEffect(() => {
    if (error) {
      let errorMessage = error;
      
      // تحسين رسائل الخطأ لتكون أكثر وضوحًا للمستخدم
      if (error.includes('400') && error.includes('Email')) {
        errorMessage = 'البريد الإلكتروني مسجل بالفعل';
      } else if (error.includes('network')) {
        errorMessage = 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت';
      }

      toast.error(errorMessage, {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  }, [error]);

  return (
    <AuthPageLayout 
      title="إنشاء حساب جديد"
      subtitle="املأ النموذج أدناه لإنشاء حسابك"
      sideContent={
        <>
          <h1 className="text-4xl font-bold mb-4">انضم إلينا اليوم!</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            احصل على وصول إلى آلاف الدورات وانضم إلى مجتمع من المتعلمين والمعلمين المتحمسين.
          </p>
          
          <div className="mt-8 space-y-6">
            <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex-shrink-0 bg-blue-500 p-3 rounded-lg">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium">لديك حساب بالفعل؟</h3>
                <p className="text-sm text-blue-100 mt-1">سجل الدخول للوصول إلى حسابك</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/login', { state: location.state })}
              className="w-full flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-base font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              تسجيل الدخول
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* الاسم الكامل */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="أحمد محمد"
              autoComplete="name"
              disabled={loading}
            />
          </div>
          {formErrors.fullName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.fullName}
            </p>
          )}
        </div>
        
        {/* البريد الإلكتروني */}
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
              placeholder="example@email.com"
              autoComplete="email"
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
        
        {/* كلمة المرور */}
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
              autoComplete="new-password"
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
          {formErrors.password ? (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.password}
            </p>
          ) : (
            <div className="mt-2 text-xs text-gray-500">
              <p>يجب أن تحتوي كلمة المرور على:</p>
              <ul className="list-disc list-inside">
                <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>8 أحرف على الأقل</li>
                <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>حرف كبير واحد على الأقل</li>
                <li className={/[a-z]/.test(formData.password) ? 'text-green-500' : ''}>حرف صغير واحد على الأقل</li>
                <li className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>رقم واحد على الأقل</li>
                <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}>رمز خاص واحد على الأقل</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* نوع الحساب */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع الحساب
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
              formData.role === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700">طالب</span>
            </label>
            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
              formData.role === 'instructor' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={formData.role === 'instructor'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700">مدرس</span>
            </label>
          </div>
        </div>
        
        {/* زر التسجيل */}
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
                جاري إنشاء الحساب...
              </>
            ) : 'إنشاء حساب'}
          </button>
        </div>
        
        {/* الشروط والأحكام */}
        <p className="text-xs text-gray-500 text-center">
          بمجرد إنشاء الحساب، فإنك توافق على{' '}
          <button 
            type="button"
            onClick={() => navigate('/terms')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            شروط الخدمة
          </button>{' '}
          و{' '}
          <button 
            type="button"
            onClick={() => navigate('/privacy')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            سياسة الخصوصية
          </button>{' '}
          الخاصة بنا.
        </p>
      </form>
      
      {/* تسجيل الدخول عبر وسائل التواصل الاجتماعي */}
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
        
      </div>
    </AuthPageLayout>
  );
};

export default Register;