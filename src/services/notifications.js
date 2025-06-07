import axiosInstance from '../config/axios';
import * as signalR from '@microsoft/signalr';

let connection = null;

const extractErrorMessage = (error, fallback = 'حدث خطأ في الإشعارات') => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || fallback;
};

const NotificationService = {
  getMyNotifications: async (page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get('/Notification', {
        params: { page, pageSize }
      });

      if (response.data?.Success) {
        return response.data.Data;
      } else {
        throw new Error(response.data?.Message || 'فشل في جلب الإشعارات');
      }
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  updateReadStatus: async (id, isRead) => {
    try {
      const response = await axiosInstance.patch(`/Notification/${id}/read-status`, isRead);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في تحديث حالة الإشعار'));
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await axiosInstance.delete(`/Notification/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في حذف الإشعار'));
    }
  },

  startConnection: async (onReceive) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ لا يوجد توكن لتأسيس الاتصال");
      return;
    }

    if (connection) {
      console.log("🔔 SignalR connection already established.");
      return; // لا داعي لإعادة الاتصال إذا كان هناك اتصال قائم
    }

    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7056/notificationHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('ReceiveNotification', (notification) => {
      onReceive(notification);
    });

    try {
      await connection.start();
      console.log('✅ SignalR connected');
    } catch (error) {
      console.error('❌ SignalR connection error:', error);
    }
  },

  stopConnection: async () => {
    if (connection) {
      await connection.stop();
      connection = null;
      console.log('⛔ SignalR connection stopped');
    } else {
      console.log("❌ No SignalR connection to stop");
    }
  }
};

export default NotificationService;
