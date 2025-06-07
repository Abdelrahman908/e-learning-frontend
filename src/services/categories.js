import axiosInstance from '../config/axios';

const extractErrorMessage = (error, fallback = 'فشل في جلب التصنيفات') => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || fallback;
};

const CategoryService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/Category');
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/Category/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب التصنيف'));
    }
  },

  getWithCourses: async () => {
    try {
      const response = await axiosInstance.get('/Category/with-courses');
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب التصنيفات مع الدورات'));
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post('/Category', data);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في إضافة تصنيف'));
    }
  },
};

export default CategoryService;
