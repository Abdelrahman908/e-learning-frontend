import axiosInstance from '../config/axios';

// 🔧 دالة استخراج رسالة الخطأ من الرد
const extractErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || data?.message || fallbackMessage;
};

const PaymentService = {
  // ✅ تنفيذ عملية الدفع
  pay: async ({ courseId, paymentMethod, amount }) => {
    try {
      const response = await axiosInstance.post(`/Payment/pay`, {
        CourseId: courseId,
        PaymentMethod: paymentMethod,
        Amount: amount,
      });

      const data = response.data;
      return {
        success: data?.Success ?? false,
        message: data?.Message || 'فشل في عملية الدفع',
        transactionId: data?.TransactionId || null,
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'حدث خطأ أثناء الدفع'),
      };
    }
  },

  // ✅ جلب سجل مدفوعات مستخدم معين لدورة معينة (admin/student)
  getUserPayments: async (userId, courseId) => {
  try {
    const response = await axiosInstance.get(`/Payment/user/${userId}/course/${courseId}`);
    const data = response.data;
    // تأكد أن data هي مصفوفة فعلًا
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    console.error('❌ فشل في جلب سجل المدفوعات:', error);
    return [];
  }
},


  // ✅ جلب مدفوعات الطالب الحالي (مع pagination)
  getMyPayments: async (page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(`/Payment/my-payments`, {
        params: { page, pageSize },
      });
      return response.data || { data: [], totalCount: 0 };
    } catch (error) {
      console.error('❌ فشل في جلب مدفوعات الطالب:', error);
      return { data: [], totalCount: 0 };
    }
  },

  // ✅ إلغاء الدفع غير المكتمل خلال ساعة
  cancelPayment: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`/Payment/${paymentId}`);
      return {
        success: true,
        message: response.data?.Message || 'تم إلغاء الدفع بنجاح',
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'فشل في إلغاء الدفع'),
      };
    }
  },
};

export default PaymentService;
