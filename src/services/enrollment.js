import axiosInstance from '../config/axios';

const extractErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || data?.message || fallbackMessage;
};

const EnrollmentService = {
  enroll: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/Enrollment/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في التسجيل في الدورة'));
    }
  },

  isEnrolled: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/Enrollment/is-enrolled/${courseId}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في التحقق من حالة التسجيل'));
    }
  }
};

export default EnrollmentService;
