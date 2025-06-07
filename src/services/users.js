import axiosInstance from '../config/axios';

const extractErrorMessage = (error, fallback = 'حدث خطأ في المستخدمين') => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || fallback;
};

const UserService = {
  getAll: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/User', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب المستخدمين'));
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/User/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب المستخدم'));
    }
  },

  create: async (user) => {
    try {
      const response = await axiosInstance.post('/User', user);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في إنشاء المستخدم'));
    }
  },

  update: async (id, updates) => {
    try {
      const response = await axiosInstance.put(`/User/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في تحديث المستخدم'));
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/User/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في حذف المستخدم'));
    }
  }
};

export default UserService;