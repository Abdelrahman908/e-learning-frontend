import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://your-api-url.up.railway.app/api'
    : 'https://localhost:7056/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // احذفها إذا لم تستخدم الكوكيز
});

// ✅ Interceptor لإضافة التوكن من localStorage تلقائيًا
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor لمعالجة 401 وتجديد التوكن
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
        const { Token: token, RefreshToken: newRefreshToken } = response.data.Data;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
