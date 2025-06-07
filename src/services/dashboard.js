import axiosInstance from '../../src/config/axios';

const dashboardService = {
  // لوحة تحكم الطالب
  getStudentDashboard: async () => {
    try {
      const response = await axiosInstance.get('/Dashboard/student');
      return response.data;
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      throw error;
    }
  },

  // لوحة تحكم المدرس
  getInstructorDashboard: async () => {
    try {
      const response = await axiosInstance.get('/Dashboard/instructor');
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor dashboard:', error);
      throw error;
    }
  },

  // لوحة تحكم الإداري
  getAdminDashboard: async () => {
    try {
      const response = await axiosInstance.get('/Dashboard/admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      throw error;
    }
  }
};

export default dashboardService;