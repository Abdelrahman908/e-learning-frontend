import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import AuthPageLayout from "../../components/layout/AuthPageLayout";
import axios from '../../config/axios';

import { resendConfirmationCode } from '../../services/auth'; // تأكد من أن هذا المسار صحيح

const ConfirmEmailPage = () => {
  const { resendConfirmationCode } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    code: ''
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    code: ''
  });

  const [canResendAt, setCanResendAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [apiError, setApiError] = useState('');

  // استقبال بيانات البريد الإلكتروني ووقت إعادة الإرسال من الصفحة السابقة
  useEffect(() => {
    if (location.state) {
      if (location.state.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
      if (location.state.canResendAt) {
        setCanResendAt(location.state.canResendAt);
      }
    }
  }, [location.state]);

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // التحقق من صحة رمز التأكيد (6 أرقام بالضبط)
  const validateCode = (code) => {
    return /^\d{6}$/.test(code);
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
    } else if (name === 'code') {
      setFormErrors(prev => ({
        ...prev,
        code: value && !validateCode(value) ? 'يجب أن يتكون الرمز من 6 أرقام' : ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: !formData.email ? 'البريد الإلكتروني مطلوب' : 
             !validateEmail(formData.email) ? 'البريد الإلكتروني غير صحيح' : '',
      code: !formData.code ? 'رمز التأكيد مطلوب' : 
            !validateCode(formData.code) ? 'يجب أن يتكون الرمز من 6 أرقام' : ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!navigator.onLine) {
      toast.error('لا يوجد اتصال بالإنترنت', {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post('/Auth/confirm-email', {
        Email: formData.email,  // لاحظ الحرف الكبير في Email لتطابق مع الخادم
        Code: formData.code     // لاحظ الحرف الكبير في Code
      });

      console.log('API Response:', response.data);

      if (response.data.Success) {
        toast.success(response.data.Message || 'تم تأكيد البريد الإلكتروني بنجاح', {
          icon: <CheckCircle className="text-green-500" />
        });
        
        setTimeout(() => navigate('/login', { 
          state: { email: formData.email } 
        }), 1500);
      } else {
        throw new Error(response.data.Message || 'فشل في تأكيد البريد الإلكتروني');
      }
    } catch (error) {
      console.error('Confirmation Error:', error.response?.data || error);
      
      let errorMsg = 'حدث خطأ أثناء تأكيد البريد الإلكتروني';
      const serverError = error.response?.data;

      if (serverError) {
        errorMsg = serverError.Message || 
                  (serverError.errors && serverError.errors.join(', ')) || 
                  errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }

      setApiError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="text-red-500" />
      });
    } finally {
      setLoading(false);
    }
  };

const handleResendCode = async () => {
  if (!formData.email?.trim()) {
    toast.error('يرجى إدخال البريد الإلكتروني', {
      icon: <AlertCircle className="text-red-500" />
    });
    return;
  }

  if (canResendAt && Date.now() < canResendAt) {
    const secondsLeft = Math.ceil((canResendAt - Date.now()) / 1000);
    toast.error(`يمكنك إعادة الإرسال بعد ${secondsLeft} ثانية`, {
      icon: <AlertCircle className="text-red-500" />
    });
    return;
  }

  setResending(true);

  try {
    // التعديل هنا: استدعاء الدالة مع البريد الإلكتروني مباشرة
    const result = await resendConfirmationCode(formData.email.trim());
    
    if (result?.success) {
      toast.success(result.message || 'تم إرسال رمز التأكيد بنجاح', {
        icon: <CheckCircle className="text-green-500" />
      });
      setCanResendAt(result.canResendAt);
    }
  } catch (error) {
    console.error('تفاصيل الخطأ:', error);
    
    let errorMsg = error.message;
    if (error.response?.data?.Message) {
      errorMsg = error.response.data.Message;
    } else if (error.response?.data?.Errors) {
      errorMsg = error.response.data.Errors.join(', ');
    }

    toast.error(errorMsg || 'حدث خطأ أثناء إعادة الإرسال', {
      icon: <AlertCircle className="text-red-500" />
    });
  } finally {
    setResending(false);
  }
};
  return (
    <AuthPageLayout 
      title="تأكيد البريد الإلكتروني"
      subtitle="أدخل رمز التأكيد الذي استلمته على بريدك الإلكتروني"
      sideContent={
        <>
          <h1 className="text-4xl font-bold mb-4">مرحبًا بك في منصتنا!</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            خطوة واحدة تفصلك عن الوصول إلى حسابك والبدء في رحلتك التعليمية.
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
              onClick={() => navigate('/login', { state: { email: formData.email } })}
              className="w-full flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-base font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              تسجيل الدخول
            </button>
          </div>
        </>
      }
    >
      <form onSubmit={handleConfirm} className="space-y-6">
        {apiError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="mr-2 text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* حقل البريد الإلكتروني */}
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
              disabled={loading || resending}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.email}
            </p>
          )}
        </div>

        {/* حقل رمز التأكيد */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            رمز التأكيد (6 أرقام)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${formErrors.code ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="123456"
              maxLength="6"
              inputMode="numeric"
              pattern="\d*"
              disabled={loading || resending}
            />
          </div>
          {formErrors.code && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {formErrors.code}
            </p>
          )}
        </div>

        {/* زر التأكيد */}
        <div>
          <button
            type="submit"
            disabled={loading || resending}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
              (loading || resending) ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                جاري التأكيد...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                تأكيد الحساب
              </>
            )}
          </button>
        </div>

        {/* إعادة إرسال الرمز */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resending || (canResendAt && Date.now() < canResendAt)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <Loader2 className="inline mr-1 h-4 w-4 animate-spin" />
                جاري إعادة الإرسال...
              </>
            ) : canResendAt && Date.now() < canResendAt ? (
              `يمكنك إعادة الإرسال بعد ${Math.ceil((canResendAt - Date.now()) / 1000)} ثانية`
            ) : (
              'لم تستلم الرمز؟ إعادة إرسال'
            )}
          </button>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default ConfirmEmailPage;