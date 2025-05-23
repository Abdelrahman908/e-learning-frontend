import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../config/axios'; // تأكد من المسار

 import { toast } from 'react-toastify';
import {
  registerUser as apiRegisterUser,
  loginUser as apiLoginUser,
  refreshAuthToken as apiRefreshAuthToken,
  confirmEmail as apiConfirmEmail,
  resendConfirmationCode as apiResendConfirmationCode,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  validateToken as apiValidateToken
} from '../services/auth';

// Constants for token management
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiration
const TOKEN_CHECK_INTERVAL = 60 * 1000; // Check every minute
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

export const AuthContext = createContext();

/**
 * AuthProvider component that manages authentication state and provides auth-related functions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken,
      refreshToken: savedRefreshToken,
      loading: false,
      error: null,
      isTokenValid: false,
      lastActivity: Date.now(),
      rememberedEmail
    };
  });

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Checks if a JWT token is valid
   * @param {string} token - JWT token to validate
   * @returns {boolean} True if token is valid, false otherwise
   */
  const checkTokenValidity = useCallback((token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }, []);

  /**
   * Updates auth state with new values
   * @param {Object} updates - New values to merge into auth state
   */
  const updateAuthState = useCallback((updates) => {
    setAuthState(prev => ({
      ...prev,
      ...updates,
      ...(updates.token ? { isTokenValid: checkTokenValidity(updates.token) } : {})
    }));
  }, [checkTokenValidity]);

  const persistAuthData = useCallback(({ user, token, refreshToken, rememberMe }) => {
  const authUpdates = {};

  if (user) {
    const formattedUser = {
      id: user.Id,         // كان user.id
      email: user.Email,   // كان user.email
      fullName: user.FullName, // كان user.fullName
      role: user.Role      // كان user.role
    };
    
    localStorage.setItem('user', JSON.stringify(formattedUser));
    authUpdates.user = formattedUser;
  }
  
  if (token) {
    localStorage.setItem('token', token);
    authUpdates.token = token;
  }
  
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
    authUpdates.refreshToken = refreshToken;
  }

  if (rememberMe && user?.Email) {  // كان user?.email
    localStorage.setItem('rememberedEmail', user.Email);
    authUpdates.rememberedEmail = user.Email;
  } else if (!rememberMe) {
    localStorage.removeItem('rememberedEmail');
    authUpdates.rememberedEmail = null;
  }

  authUpdates.lastActivity = Date.now();
  updateAuthState(authUpdates);
}, [updateAuthState]);

  /**
   * Handles user login
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} [rememberMe=false] - Remember user session
   * @returns {Promise<Object>} Response object with success status and user data or error
   */
  const login = useCallback(async (credentials, rememberMe = false) => {
    updateAuthState({ loading: true, error: null });
    
    try {
      const response = await apiLoginUser({
        email: credentials.email,
        password: credentials.password,
        rememberMe
      });

      const { user, token, refreshToken, message } = response.data;

      if (!user || !token) {
        throw new Error(message || 'Login failed - no user or token received');
      }

      persistAuthData({ user, token, refreshToken, rememberMe });
      toast.success(message || 'تم تسجيل الدخول بنجاح');
      
      // Redirect to intended page or default
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin);
      return { success: true, user };
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.message;
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        errorMsg = errorMsg || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (err.response?.status === 403) {
        errorMsg = errorMsg || 'الحساب غير مفعل، يرجى تأكيد البريد الإلكتروني';
      } else {
        errorMsg = errorMsg || 'حدث خطأ أثناء تسجيل الدخول';
      }

      updateAuthState({ error: errorMsg });
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      updateAuthState({ loading: false });
    }
  }, [navigate, location, persistAuthData, updateAuthState]);

  /**
   * Handles user registration
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} [userData.role='user'] - User role
   * @returns {Promise<Object>} Response object with success status and email or error
   */
 const register = useCallback(async (userData) => {
  updateAuthState({ loading: true, error: null });

  try {
    const response = await apiRegisterUser({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });

    console.log('Registration Processed:', response.data);

    if (!response.data?.userId) {
      throw new Error(response.data?.message || 'Incomplete registration data');
    }

    toast.success(response.data.message || 'تم التسجيل بنجاح! يرجى تأكيد البريد الإلكتروني');
    
    navigate('/confirm-email', { 
      state: { 
        email: userData.email, // نستخدم الإيميل من البيانات المدخلة
        userId: response.data.userId,
        canResendAt: Date.now() + 30000
      } 
    });
    
    return { success: true, email: userData.email };
  } catch (err) {
    let errorMsg = err.response?.data?.Message || err.message;
    
    if (err.response?.status === 400) {
      errorMsg = 'بيانات التسجيل غير صالحة';
    } else if (err.response?.status === 409) {
      errorMsg = 'البريد الإلكتروني مسجل بالفعل';
    } else {
      errorMsg = errorMsg || 'حدث خطأ أثناء التسجيل';
    }

    updateAuthState({ error: errorMsg });
    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    updateAuthState({ loading: false });
  }
}, [navigate, updateAuthState]);
  /**
   * Confirms user's email with verification code
   * @param {string} email - User email to confirm
   * @param {string} code - Verification code
   * @returns {Promise<Object>} Response object with success status
   */
  const confirmEmail = useCallback(async (email, code) => {
    updateAuthState({ loading: true, error: null });
    
    try {
      const response = await apiConfirmEmail({ email, code });
      const { success, message } = response.data;

      if (!success) {
        throw new Error(message || 'Email confirmation failed');
      }

      toast.success(message || 'تم تأكيد البريد الإلكتروني بنجاح');
      navigate('/login', { state: { email } });
      return { success: true };
    } catch (err) {
      let errorMsg = err.response?.data?.message || err.message;
      
      if (err.response?.status === 400) {
        errorMsg = errorMsg || 'رمز التأكيد غير صحيح أو منتهي الصلاحية';
      } else {
        errorMsg = errorMsg || 'حدث خطأ أثناء تأكيد البريد الإلكتروني';
      }

      updateAuthState({ error: errorMsg });
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      updateAuthState({ loading: false });
    }
  }, [navigate, updateAuthState]);

  /**
   * Resends confirmation code to user's email
   * @param {string} email - User email to resend code to
   * @param {number} [canResendAt] - Timestamp when resend is allowed
   * @returns {Promise<Object>} Response object with success status and next resend time
   */
  const resendConfirmation = useCallback(async (email) => {
  updateAuthState({ loading: true, error: null });
  
  try {
    const response = await axiosInstance.post('/Auth/resend-confirmation-code', {
      Email: email.trim() // التأكد من استخدام الحرف الكبير Email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data?.Success) {
      throw new Error(response.data?.Message || 'فشل في إعادة الإرسال');
    }

    toast.success(response.data.Message || 'تم إعادة إرسال رمز التحقق بنجاح');
    return { 
      success: true,
      canResendAt: Date.now() + 30000 // 30 ثانية قبل إعادة المحاولة
    };
  } catch (err) {
    let errorMsg = err.response?.data?.Message || err.message;
    
    if (err.response?.status === 400) {
      errorMsg = 'بيانات غير صالحة: ' + (err.response.data.Errors?.join(', ') || errorMsg);
    } else if (err.response?.status === 404) {
      errorMsg = 'البريد الإلكتروني غير مسجل';
    }

    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    updateAuthState({ loading: false });
  }
}, [updateAuthState]);
  /**
   * Initiates password reset process
   * @param {string} email - User email to reset password for
   * @returns {Promise<Object>} Response object with success status
   */
  const forgotPassword = useCallback(async (email) => {
  updateAuthState({ loading: true, error: null });
  
  try {
   const response = await axiosInstance.post('/Auth/forgot-password', {
      Email: String(email) // نستخدم الحرف الكبير Email كما في Swagger
    });
    if (!response.data.Success) { // لاحظ الحرف الكبير في Success
      throw new Error(response.data.Message || 'فشل إرسال كود التحقق');
    }

    toast.success(response.data.Message || 'تم إرسال كود التحقق بنجاح');
    return { 
      success: true,
      message: response.data.Message
    };
  } catch (err) {
    let errorMsg = err.response?.data?.Message || err.message;
    
    if (err.response?.status === 400) {
      errorMsg = 'بيانات غير صالحة: ' + errorMsg;
    } else if (err.response?.status === 404) {
      errorMsg = 'البريد الإلكتروني غير مسجل';
    }

    toast.error(errorMsg);
    return { 
      success: false, 
      error: errorMsg 
    };
  } finally {
    updateAuthState({ loading: false });
  }
}, [navigate, updateAuthState]);

  /**
 * Completes password reset process
 * @param {string} email - User email
 * @param {string} code - Password reset code
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response object with success status
 */
const resetPassword = useCallback(async (email, code, newPassword) => {
  updateAuthState({ loading: true, error: null });
  
  try {
    const response = await axiosInstance.post('/Auth/reset-password', {
      email: email,
      code: code,
      newPassword: newPassword

    });

    if (!response.data.Success) {
      throw new Error(response.data.Message || 'فشل إعادة تعيين كلمة المرور');
    }

    toast.success(response.data.Message || 'تم إعادة تعيين كلمة المرور بنجاح');
    navigate('/login', { state: { email } });
    return { success: true };
  } catch (err) {
    let errorMsg = err.response?.data?.Message || err.message;
    
    if (err.response?.data?.errors) {
      errorMsg = Object.values(err.response.data.errors).join(', ');
    } else if (err.response?.status === 400) {
      errorMsg = 'بيانات غير صالحة: ' + errorMsg;
    } else if (err.response?.status === 404) {
      errorMsg = 'البريد الإلكتروني غير مسجل';
    }

    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    updateAuthState({ loading: false });
  }
}, [navigate, updateAuthState]);
  /**
   * Logs out the current user
   * @param {string} [message='تم تسجيل الخروج بنجاح'] - Logout message
   * @param {boolean} [sessionExpired=false] - Whether logout is due to session expiration
   */
  const logout = useCallback((message = 'تم تسجيل الخروج بنجاح', sessionExpired = false) => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    updateAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isTokenValid: false,
      lastActivity: null
    });

    if (sessionExpired) {
      toast.warning('انتهت جلستك بسبب عدم النشاط، يرجى تسجيل الدخول مرة أخرى');
    } else {
      toast.info(message);
    }
    
    navigate('/login', { 
      replace: true,
      state: { 
        email: authState.rememberedEmail || authState.user?.email 
      } 
    });
  }, [navigate, authState.rememberedEmail, authState.user?.email, updateAuthState]);

  /**
   * Refreshes authentication token
   * @returns {Promise<string|null>} New token or null if refresh failed
   */
  const refreshToken = useCallback(async () => {
    if (!authState.refreshToken) {
      logout('انتهت جلستك، يرجى تسجيل الدخول مرة أخرى', true);
      return null;
    }

    try {
      const response = await apiRefreshAuthToken({ refreshToken: authState.refreshToken });
      const { token, refreshToken: newRefreshToken, message } = response.data;

      if (!token) {
        throw new Error(message || 'Failed to refresh token');
      }

      persistAuthData({ token, refreshToken: newRefreshToken });
      return token;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ أثناء تجديد الجلسة';
      logout(errorMsg, true);
      return null;
    }
  }, [authState.refreshToken, logout, persistAuthData]);

  /**
   * Updates last activity timestamp
   */
  const updateLastActivity = useCallback(() => {
    updateAuthState({ lastActivity: Date.now() });
  }, [updateAuthState]);

  // Check token validity periodically
  useEffect(() => {
    if (!authState.token) return;

    const checkToken = async () => {
      const isValid = checkTokenValidity(authState.token);
      updateAuthState({ isTokenValid: isValid });

      if (!isValid) {
        await refreshToken();
      } else {
        const decoded = jwtDecode(authState.token);
        const expiresIn = (decoded.exp * 1000) - Date.now();
        
        if (expiresIn < TOKEN_REFRESH_THRESHOLD) {
          await refreshToken();
        }
      }
    };

    checkToken();
    const interval = setInterval(checkToken, TOKEN_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [authState.token, checkTokenValidity, refreshToken, updateAuthState]);

  // Check for session timeout due to inactivity
  useEffect(() => {
    if (!authState.token || !authState.lastActivity) return;

    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - authState.lastActivity;
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        logout('انتهت جلستك بسبب عدم النشاط', true);
      }
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateLastActivity();

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const inactivityInterval = setInterval(checkInactivity, 10000); // Check every 10 seconds

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityInterval);
    };
  }, [authState.token, authState.lastActivity, logout, updateLastActivity]);

 // Validate token on initial load (local validation only)
useEffect(() => {
  const verifyInitialToken = () => {
    if (authState.token) {
      try {
        const decoded = jwtDecode(authState.token);
        const isTokenValid = decoded.exp > Date.now() / 1000;
        
        updateAuthState({ isTokenValid });
        
        if (!isTokenValid) {
          logout('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى', true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى', true);
      }
    }
  };

  verifyInitialToken();
}, [authState.token, logout, updateAuthState]);

  // Context value
  const contextValue = useMemo(() => ({
    user: authState.user,
    token: authState.token,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: authState.isTokenValid,
    rememberedEmail: authState.rememberedEmail,
    login,
    register,
    confirmEmail,
    resendConfirmationCode: resendConfirmation,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    updateLastActivity
  }), [authState, login, register, confirmEmail, resendConfirmation, forgotPassword, resetPassword, logout, refreshToken, updateLastActivity]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );

};
/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};