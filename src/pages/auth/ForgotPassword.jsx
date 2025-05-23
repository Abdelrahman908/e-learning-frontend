import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import axios from '../../config/axios';
import AuthPageLayout from "../../components/layout/AuthPageLayout";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateEmail(email)) {
    setError('صيغة البريد الإلكتروني غير صحيحة');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const result = await forgotPassword(email);
    if (result?.success) {
      setSuccess(true);
      setCanResend(false);
      setTimeout(() => setCanResend(true), 30000);
      
      navigate('/reset-password', { 
        state: { 
          email,
          // يمكنك إضافة بيانات إضافية هنا إذا كانت مطلوبة
        } 
      });
    } else if (result?.error) {
      setError(result.error);
    }
  } catch (err) {
    let errorMsg = err.message || 'حدث خطأ غير متوقع';
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthPageLayout
      title="استعادة كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني لاستلام كود التحقق"
      sideContent={
        <>
          <h1 className="text-4xl font-bold mb-4">نسيت كلمة المرور؟</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            سنرسل لك كود تحقق لإعادة تعيين كلمة المرور الخاصة بك
          </p>
          
          <div className="mt-8 space-y-6">
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-base font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </>
      }
    >
      {success ? (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">تم إرسال كود التحقق</h3>
          <p className="text-sm text-gray-600">
            يرجى التحقق من بريدك الإلكتروني ({email}) وإدخال الكود في الصفحة التالية.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="mr-1 h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !canResend}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
                (loading || !canResend) ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  جاري الإرسال...
                </>
              ) : !canResend ? (
                'تم الإرسال، انتظر 30 ثانية'
              ) : (
                'إرسال كود التحقق'
              )}
            </button>
          </div>
        </form>
      )}
    </AuthPageLayout>
  );
};

export default ForgotPassword;