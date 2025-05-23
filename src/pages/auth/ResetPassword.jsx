import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import AuthPageLayout from "../../components/layout/AuthPageLayout";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no email provided
  useEffect(() => {
    if (!location.state?.email) {
      toast.error('يجب البدء من صفحة نسيان كلمة المرور');
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  // Password validation rules
  const validatePassword = (password) => {
    const requirements = [
      { test: password.length >= 8, message: `8 أحرف على الأقل` },
      { test: /[A-Z]/.test(password), message: 'حرف كبير واحد على الأقل' },
      { test: /[a-z]/.test(password), message: 'حرف صغير واحد على الأقل' },
      { test: /[0-9]/.test(password), message: 'رقم واحد على الأقل' },
      { test: /[^A-Za-z0-9]/.test(password), message: 'رمز خاص واحد على الأقل' }
    ];

    return {
      valid: requirements.every(req => req.test),
      errors: requirements.filter(req => !req.test).map(req => req.message)
    };
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      const { errors } = validatePassword(value);
      setFormErrors(prev => ({
        ...prev,
        newPassword: errors[0] || '',
        confirmPassword: value && formData.confirmPassword && value !== formData.confirmPassword 
          ? 'كلمة المرور غير متطابقة' 
          : ''
      }));
    } else if (name === 'confirmPassword') {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: value && formData.newPassword && value !== formData.newPassword 
          ? 'كلمة المرور غير متطابقة' 
          : ''
      }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const passwordValidation = validatePassword(formData.newPassword);
    const errors = {
      code: !formData.code ? 'كود التحقق مطلوب' : '',
      newPassword: !formData.newPassword ? 'كلمة المرور الجديدة مطلوبة' : 
                 !passwordValidation.valid ? passwordValidation.errors[0] : '',
      confirmPassword: !formData.confirmPassword ? 'تأكيد كلمة المرور مطلوب' : 
                      formData.newPassword !== formData.confirmPassword ? 'كلمة المرور غير متطابقة' : ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await resetPassword(
        formData.email,
        formData.code,
        formData.newPassword
      );

      if (result?.success) {
        setSuccess(true);
        toast.success('تم إعادة تعيين كلمة المرور بنجاح', {
          icon: <CheckCircle className="text-green-500" />
        });
        setTimeout(() => navigate('/login', { state: { email: formData.email } }), 2000);
      }
    } catch (err) {
      handleResetError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset errors
  const handleResetError = (err) => {
    let errorMsg = err.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
    
    if (err.response?.status === 400) {
      errorMsg = err.response.data?.errors 
        ? Object.values(err.response.data.errors).join(', ')
        : 'كود التحقق غير صحيح أو منتهي الصلاحية';
    } else if (err.response?.status === 404) {
      errorMsg = 'البريد الإلكتروني غير مسجل';
      navigate('/forgot-password');
    }

    toast.error(errorMsg, {
      icon: <AlertCircle className="text-red-500" />
    });
  };

  // Password requirement checklist
  const renderPasswordRequirements = () => {
    const requirements = [
      { test: formData.newPassword.length >= 8, text: '8 أحرف على الأقل' },
      { test: /[A-Z]/.test(formData.newPassword), text: 'حرف كبير واحد على الأقل' },
      { test: /[a-z]/.test(formData.newPassword), text: 'حرف صغير واحد على الأقل' },
      { test: /[0-9]/.test(formData.newPassword), text: 'رقم واحد على الأقل' },
      { test: /[^A-Za-z0-9]/.test(formData.newPassword), text: 'رمز خاص واحد على الأقل' }
    ];

    return (
      <div className="mt-2 text-xs text-gray-500">
        <p>متطلبات كلمة المرور:</p>
        <ul className="list-disc list-inside space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className={req.test ? 'text-green-500' : ''}>
              {req.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <AuthPageLayout
      title="إعادة تعيين كلمة المرور"
      subtitle="أدخل كود التحقق وكلمة المرور الجديدة"
      sideContent={
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">تعيين كلمة مرور جديدة</h1>
          <p className="text-blue-100">
            أدخل كود التحقق الذي تلقيته بالبريد الإلكتروني وكلمة المرور الجديدة
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 border border-white/30 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-all"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      }
    >
      {success ? (
        <div className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">تم تغيير كلمة المرور بنجاح</h3>
          <p className="text-gray-600">
            سيتم تحويلك إلى صفحة تسجيل الدخول تلقائياً...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Verification Code Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              كود التحقق
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-3 py-3 border ${formErrors.code ? 'border-red-300' : 'border-gray-300'} rounded-lg`}
              placeholder="أدخل الكود المكون من 6 أرقام"
              disabled={loading}
            />
            {formErrors.code && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AlertCircle className="mr-1 h-4 w-4" />
                {formErrors.code}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 border ${formErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg`}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {formErrors.newPassword ? (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AlertCircle className="mr-1 h-4 w-4" />
                {formErrors.newPassword}
              </p>
            ) : (
              renderPasswordRequirements()
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg`}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AlertCircle className="mr-1 h-4 w-4" />
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                جارٍ المعالجة...
              </span>
            ) : (
              'إعادة تعيين كلمة المرور'
            )}
          </button>
        </form>
      )}
    </AuthPageLayout>
  );
};

export default ResetPassword;