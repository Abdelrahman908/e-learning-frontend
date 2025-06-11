import axiosInstance from '../config/axios';

const extractErrorMessage = (error, fallback = 'حدث خطأ في المستخدمين') => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || fallback;
};

const formatUser = (u) => ({
  id: u.id ?? u.Id,
  fullName: u.fullName ?? u.FullName ?? '',
  email: u.email ?? u.Email ?? '',
  role: u.role ?? u.Role ?? '',
  createdAt: u.createdAt ?? u.CreatedAt ?? null,
  isActive: u.isActive ?? u.IsActive ?? true,
  isEmailConfirmed: u.isEmailConfirmed ?? u.IsEmailConfirmed ?? false,
});

const UserService = {
  getAll: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/User', { params: filters });
      const users = Array.isArray(response.data) ? response.data : [];
      return users.map(formatUser);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب المستخدمين'));
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/User/${id}`);
      return formatUser(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب المستخدم'));
    }
  },

 create: async (user) => {
  try {
    const res = await axiosInstance.post('/User', user);
    return res.data;
  } catch (error) {
    console.error('API Error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'فشل في إنشاء المستخدم');
  }
}
,

  update: async (id, updates) => {
    try {
      const response = await axiosInstance.put(`/User/${id}`, updates);
      return response.data; // عملية التحديث لا تُرجع كائن المستخدم غالبًا
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
