import axiosInstance from '../config/axios';

const messagesService = {
  sendMessage: async (courseId, formData) => {
    try {
      const response = await axiosInstance.post(`/messages/send/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('sendMessage error:', error);
      throw error;
    }
  },

  getMessages: async (courseId, params = {}) => {
  const defaultParams = {
    page: 1,
    pageSize: 20,
    search: null,
    fromDate: null,
    toDate: null
  };
  const queryParams = { ...defaultParams, ...params };

  try {
    const response = await axiosInstance.get(`/messages/${courseId}`, { params: queryParams });

    // شكل الداتا الحقيقي من السيرفر
    return {
      messages: response.data.Messages || [],
      totalCount: response.data.TotalCount || 0
    };

  } catch (error) {
    console.error('getMessages error:', error);
    throw error;
  }
},


  getUnseenCount: async (courseId) => {
  try {
    const response = await axiosInstance.get(`/messages/unseen-count/${courseId}`);
    return response.data?.UnseenMessages ?? 0;
  } catch (error) {
    console.error('getUnseenCount error:', error);
    throw error;
  }
},


  markAsSeen: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/messages/mark-seen/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('markAsSeen error:', error);
      throw error;
    }
  },

  sendTyping: async (courseId) => {
    try {
      const response = await axiosInstance.post(`/messages/typing/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('sendTyping error:', error);
      throw error;
    }
  },

  editMessage: async (messageId, newText) => {
    try {
      const response = await axiosInstance.put(`/messages/edit/${messageId}`, { newText });
      return response.data;
    } catch (error) {
      console.error('editMessage error:', error);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(`/messages/delete/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('deleteMessage error:', error);
      throw error;
    }
  },

  reactToMessage: async (messageId, reactionType) => {
    try {
      const response = await axiosInstance.post(`/messages/react/${messageId}`, { reactionType });
      return response.data;
    } catch (error) {
      console.error('reactToMessage error:', error);
      throw error;
    }
  }
};

export default messagesService;
