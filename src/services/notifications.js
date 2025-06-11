import axiosInstance from '../config/axios';
import * as signalR from '@microsoft/signalr';

let connection = null;
let connectionPromise = null; // ✅ قفل المحاولة الحالية

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

    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      console.log("🔔 SignalR connection already established.");
      return;
    }

    if (connectionPromise) {
      console.log("🔁 الاتصال بـ SignalR جارٍ باستخدام promise موجودة...");
      return connectionPromise;
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

    connectionPromise = connection.start()
      .then(() => {
        console.log('✅ SignalR connected');
      })
      .catch(error => {
        console.error('❌ SignalR connection error during start:', error);
        connection = null;
        throw error;
      })
      .finally(() => {
        connectionPromise = null; // ✅ تحرير promise مهما كانت النتيجة
      });

    return connectionPromise;
  },

  stopConnection: async () => {
    if (connection) {
      try {
        await connection.stop();
        console.log('⛔ SignalR connection stopped');
      } catch (error) {
        console.error('❌ Error stopping SignalR connection:', error);
      } finally {
        connection = null;
        connectionPromise = null;
      }
    }
  }
};
  getConnectionState: () => {
    return connection?.state;
  }

export default NotificationService;
