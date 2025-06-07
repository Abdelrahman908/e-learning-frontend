import axiosInstance from '../config/axios';

const extractErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || data?.message || fallbackMessage;
};

const PaymentService = {
  pay: async ({ courseId, paymentMethod, amount }) => {
    try {
      const response = await axiosInstance.post(`/Payment/pay`, {
        CourseId: courseId,
        PaymentMethod: paymentMethod,
        Amount: amount
      });

      if (response.data && response.data.Success) {
        return {
          success: true,
          message: response.data.Message,
          transactionId: response.data.TransactionId
        };
      } else {
        return {
          success: false,
          message: response.data?.Message || 'فشل في عملية الدفع'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'فشل في الدفع')
      };
    }
  },

  getUserPayments: async (userId, courseId) => {
    try {
      const response = await axiosInstance.get(`/Payment/user/${userId}/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('❌ فشل في جلب سجل المدفوعات:', error);
      return [];
    }
  }
};

export default PaymentService;
