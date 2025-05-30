import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7056/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // مهم لعمليات المصادقة
});

// Interceptor لإضافة التوكن تلقائياً
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor لمعالجة الأخطاء
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post('/auth/refresh-token', { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;