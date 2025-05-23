import axios from '../config/axios';

import * as jwtDecode from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'https://localhost:7056/api/Auth';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar'
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: true // For cross-site cookies if needed
});

// Add CSRF token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const csrfToken = localStorage.getItem('csrfToken');
  
  if (token) {
    // Check if token is about to expire
    try {
      const decoded = jwtDecode(token);
      const expiresIn = (decoded.exp * 1000) - Date.now();
      
      if (expiresIn < 300000) { // 5 minutes
        config.headers['X-Token-Refresh-Needed'] = 'true';
      }
    } catch {
      // Invalid token - will be handled by response interceptor
    }
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Standardize success response format
    if (response.data && typeof response.data.success === 'undefined') {
      response.data.success = true;
    }
    
    // Store CSRF token if received
    if (response.headers['x-csrf-token']) {
      localStorage.setItem('csrfToken', response.headers['x-csrf-token']);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = error.response;
    
    // Standardize error response
    if (!errorResponse) {
      error.message = 'لا يوجد اتصال بالخادم';
      return Promise.reject(error);
    }

    // Handle token refresh
    if (errorResponse.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const refreshResponse = await api.post('/refresh-token', { refreshToken });
        const { token, refreshToken: newRefreshToken } = refreshResponse.data;
        
        if (token && newRefreshToken) {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('csrfToken');
        window.location.href = '/login?sessionExpired=true';
        return Promise.reject(refreshError);
      }
    }

    // Standard error handling
    const errorData = errorResponse.data || {};
    const errorMessages = [];
    
    // Handle validation errors
    if (errorResponse.status === 400 && errorData.errors) {
      for (const [field, messages] of Object.entries(errorData.errors)) {
        errorMessages.push(...messages);
      }
    }
    
    // Use server message or default
    error.message = errorMessages.length 
      ? errorMessages.join(', ')
      : errorData.message || getDefaultErrorMessage(errorResponse.status);
    
    return Promise.reject(error);
  }
);

/**
 * Gets default error message for HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} Default error message
 */
function getDefaultErrorMessage(status) {
  const messages = {
    400: 'طلب غير صالح',
    401: 'غير مصرح بالدخول',
    403: 'ممنوع الوصول',
    404: 'المورد غير موجود',
    409: 'تعارض في البيانات',
    422: 'بيانات غير صالحة',
    429: 'عدد محاولات كثيرة',
    500: 'خطأ في الخادم الداخلي',
    503: 'الخدمة غير متاحة'
  };
  
  return messages[status] || 'حدث خطأ غير متوقع';
}

// Auth services

/**
 * Validates authentication token
 * @param {string} token - JWT token to validate
 * @returns {Promise<Object>} Validation response
 */
export const validateToken = (token) => api.post('/validate-token', { token });

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', {
      FullName: userData.fullName,
      Email: userData.email,
      Password: userData.password,
      Role: userData.role || 'User'
    });

    console.log('Registration Response:', response.data);

    if (!response.data.Success) {
      throw new Error(response.data.Message || 'Registration failed');
    }

    return {
      data: {
        userId: response.data.Data.UserId, // نأخذ فقط UserId من الخادم
        message: response.data.Message
      }
    };
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logs in a user
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} Login response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', {
      Email: credentials.email,
      Password: credentials.password,
      RememberMe: credentials.rememberMe
    });

    if (!response.data.Success) {
      throw new Error(response.data.Message || 'Login failed');
    }

    // التأكد من هيكل الاستجابة المتوافق مع الباك إند
    if (!response.data.Data || !response.data.Data.Token) {
      throw new Error('Invalid server response structure');
    }

    return {
      Success: response.data.Success,
      Message: response.data.Message,
      Data: {
        Token: response.data.Data.Token,
        RefreshToken: response.data.Data.RefreshToken,
        ExpiresIn: response.data.Data.ExpiresIn,
        User: response.data.Data.User
      }
    };
  } catch (error) {
    console.error('Login Error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    throw new Error(error.response?.data?.Message || error.message);
  }
};
/**
 * Refreshes authentication token
 * @param {Object} data - Refresh token data
 * @returns {Promise<Object>} Token refresh response
 */
export const refreshAuthToken = (data) => api.post('/refresh-token', {
  refreshToken: data.refreshToken
});

/**
 * Confirms user's email with verification code
 * @param {Object} data - Email confirmation data
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmEmail = async (data) => {
  try {
    const response = await api.post('/confirm-email', {
      Email: data.email,  // لاحظ الحرف الكبير في Email
      Code: data.code     // لاحظ الحرف الكبير في Code
    });

    if (!response.data.Success) {
      throw new Error(response.data.Message || 'Email confirmation failed');
    }

    return {
      success: true,
      message: response.data.Message
    };
  } catch (error) {
    console.error('Confirm Email Error:', error.response?.data || error);
    throw error;
  }
};
/**
 * إعادة إرسال رمز التأكيد - الإصدار المتكامل
 * @param {string} email - البريد الإلكتروني
 * @returns {Promise<{success: boolean, message?: string, canResendAt?: number}>}
 */
export const resendConfirmationCode = async (email) => {
  try {
    // التحقق من صحة البريد الإلكتروني
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('صيغة البريد الإلكتروني غير صالحة');
    }

    const response = await api.post('/resend-confirmation-code', {
      Email: email.trim() // التأكد من إزالة الفراغات
    });

    if (!response.data?.Success) {
      throw new Error(response.data?.Message || 'فشل في إعادة الإرسال');
    }

    return {
      success: true,
      message: response.data.Message || 'تم إعادة الإرسال بنجاح',
      canResendAt: Date.now() + 30000 // 30 ثانية تأخير
    };
  } catch (error) {
    console.error('تفاصيل الخطأ:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    const errorMessage = error.response?.data?.Message || 
                       error.response?.data?.error || 
                       error.message || 
                       'حدث خطأ غير متوقع';
    
    throw new Error(errorMessage);
  }
};
/**
 * Initiates password reset process
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset initiation response
 */
export const forgotPassword = (email) => api.post('/forgot-password', { Email: String(email) });

/**
 * Completes password reset process
 * @param {Object} data - Password reset data
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/Auth/reset-password', {
      email: formData.email,
  code: formData.code,
  newPassword: formData.newPassword// التأكد من أنها سلسلة نصية
    });

    if (!response.data.Success) {
      throw new Error(response.data.Message || 'فشل إعادة تعيين كلمة المرور');
    }

    return {
      success: true,
      message: response.data.Message
    };
  } catch (error) {
    console.error('Reset Password Error:', error);
    throw error;
  }
};

// Password validation utilities

/**
 * Gets password requirements specification
 * @returns {Object} Password requirements
 */
export const getPasswordRequirements = () => ({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
});

/**
 * Validates password against requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with validity and errors
 */
export const validatePassword = (password) => {
  const requirements = getPasswordRequirements();
  const errors = [];
  
  if (password.length < requirements.minLength) {
    errors.push(`يجب أن تحتوي كلمة المرور على الأقل ${requirements.minLength} أحرف`);
  }
  
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل');
  }
  
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل');
  }
  
  if (requirements.requireNumber && !/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي كلمة المرور على رقم واحد على الأقل');
  }
  
  if (requirements.requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default api;