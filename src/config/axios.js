// src/config/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7056/api', // تأكد من الـ API Base URL الخاص بك
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة توكن الـ JWT تلقائياً في هيدر الطلبات
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // مفترض تحتفظ بالتوكن هنا
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء تلقائياً (مثال: إعادة توجيه عند 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // توجيه المستخدم لصفحة تسجيل الدخول عند انتهاء صلاحية التوكن
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
