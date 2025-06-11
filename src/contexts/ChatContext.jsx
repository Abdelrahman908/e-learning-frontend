import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import messagesService from '../services/messages';
import { useAuth } from './AuthContext';
import * as signalR from '@microsoft/signalr';

const ChatContext = createContext();

const initialState = {
  activeCourse: null,
  messages: [],
  pagination: {
    page: 1,
    pageSize: 20,
    totalCount: 0,
    hasMore: true
  },
  typingUsers: [],
  unseenCount: 0,
  replyingTo: null,
  connection: null
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_COURSE':
      return {
        ...initialState,
        activeCourse: action.payload,
        connection: state.connection
      };
    case 'ADD_MESSAGE':
      if (state.messages.some(msg => msg.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        messages: [action.payload, ...state.messages],
        unseenCount: action.payload.senderId !== action.currentUserId
          ? state.unseenCount + 1
          : state.unseenCount
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: [...action.payload.messages, ...state.messages],
        pagination: {
          ...state.pagination,
          page: action.payload.page,
          totalCount: action.payload.totalCount,
          hasMore: action.payload.totalCount > state.messages.length + action.payload.messages.length
        }
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload } : msg
        )
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(msg => msg.id !== action.payload)
      };
    case 'ADD_TYPING_USER':
      if (state.typingUsers.some(u => u.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        typingUsers: [...state.typingUsers, action.payload]
      };
    case 'REMOVE_TYPING_USER':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(user => user.id !== action.payload)
      };
    case 'SET_UNSEEN_COUNT':
      return { ...state, unseenCount: action.payload };
    case 'MARK_AS_SEEN':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.senderId !== action.currentUserId && !msg.isSeen
            ? { ...msg, isSeen: true }
            : msg
        ),
        unseenCount: 0
      };
    case 'SET_REPLYING':
      return { ...state, replyingTo: action.payload };
    case 'ADD_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, reaction: action.payload.reactionType }
            : msg
        )
      };
    case 'SET_CONNECTION':
      return {
        ...state,
        connection: action.payload
      };
    default:
      return state;
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const typingTimeouts = useRef({});

  const setActiveCourse = (course) => {
    dispatch({ type: 'SET_COURSE', payload: course });
  };

  useEffect(() => {
    if (!state.activeCourse || !user) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/chathub`, {
        accessTokenFactory: () => localStorage.getItem('token'),
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        connection.invoke("JoinGroup", `Course_${state.activeCourse.id}`).catch(console.error);
        dispatch({ type: 'SET_CONNECTION', payload: connection });
      })
      .catch(err => console.error("SignalR connection error:", err));

    connection.on("ReceiveMessage", (message) => {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: message.id,
          senderId: message.senderId,
          text: message.text,
          attachmentUrl: message.attachmentUrl,
          sentAt: new Date(message.sentAt),
          isSeen: message.isSeen,
          replyToMessageId: message.replyToMessageId
        },
        currentUserId: user.id
      });
    });

    connection.on("Typing", (userData) => {
      dispatch({ type: 'ADD_TYPING_USER', payload: userData });

      if (typingTimeouts.current[userData.id]) {
        clearTimeout(typingTimeouts.current[userData.id]);
      }
      typingTimeouts.current[userData.id] = setTimeout(() => {
        dispatch({ type: 'REMOVE_TYPING_USER', payload: userData.id });
        delete typingTimeouts.current[userData.id];
      }, 3000);
    });

    connection.on("MessagesSeen", ({ userId }) => {
      if (userId !== user.id) {
        dispatch({ type: 'MARK_AS_SEEN', currentUserId: user.id });
      }
    });

    connection.on("MessageEdited", ({ messageId, newText }) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: { id: messageId, text: newText } });
    });

    connection.on("MessageDeleted", ({ messageId }) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    });

    connection.on("MessageReacted", ({ messageId, reaction }) => {
      dispatch({ type: 'ADD_REACTION', payload: { messageId, reactionType: reaction } });
    });

    return () => {
      Object.values(typingTimeouts.current).forEach(clearTimeout);
      typingTimeouts.current = {};
      if (connection) {
        connection.stop().catch(err => console.error("SignalR disconnect error:", err));
      }
      dispatch({ type: 'SET_CONNECTION', payload: null });
    };
  }, [state.activeCourse, user]);

  useEffect(() => {
    if (state.activeCourse) {
      messagesService.getUnseenCount(state.activeCourse.id)
        .then(({ data }) => {
          if (data?.unseenMessages !== undefined) {
          dispatch({ type: 'SET_UNSEEN_COUNT', payload: data.UnseenMessages });
          } else {
            console.warn('unseenMessages not found in response:', data);
          }
        })
        .catch(console.error);
    }
  }, [state.activeCourse]);

  const fetchMessages = async (page = 1) => {
  if (!state.activeCourse) return;

  try {
    const data = await messagesService.getMessages(state.activeCourse.id, {
      page,
      pageSize: state.pagination.pageSize
    });

    if (!data || !data.messages) {
      console.warn("No messages found in response:", data);
      return;
    }

    dispatch({
      type: 'SET_MESSAGES',
      payload: {
        messages: data.messages.map(msg => ({
          ...msg,
          sentAt: new Date(msg.SentAt), // كمان غير هنا
          isSeen: msg.IsSeen,           // لو بتستخدم isSeen، لازم تغير الحروف كمان
          id: msg.Id,
          text: msg.Text,
          senderName: msg.SenderName,
        })),
        page,
        totalCount: data.totalCount
      }
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

  useEffect(() => {
    if (state.activeCourse) {
      fetchMessages(1);
    }
  }, [state.activeCourse]);

  const sendMessage = async (text, file) => {
    if (!text && !file) return;

    const formData = new FormData();
    formData.append('Text', text || '');
    if (file) formData.append('File', file);
    if (state.replyingTo) {
      formData.append('ReplyToMessageId', state.replyingTo.id);
    }

    try {
      await messagesService.sendMessage(state.activeCourse.id, formData);
      dispatch({ type: 'SET_REPLYING', payload: null });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const sendTyping = () => {
    if (state.activeCourse) {
      messagesService.sendTyping(state.activeCourse.id);
    }
  };

  const markAsSeen = async () => {
    if (!user || !state.activeCourse) return;

    try {
      await messagesService.markAsSeen(state.activeCourse.id);
      dispatch({ type: 'MARK_AS_SEEN', currentUserId: user.id });
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
    }
  };

  const setReplyingTo = (message) => {
    dispatch({ type: 'SET_REPLYING', payload: message });
  };

  const editMessage = async (messageId, newText) => {
    try {
      await messagesService.editMessage(messageId, { newText });
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await messagesService.deleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const reactToMessage = async (messageId, reactionType) => {
    try {
      await messagesService.reactToMessage(messageId, reactionType);
    } catch (error) {
      console.error("Failed to react to message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        setActiveCourse,
        fetchMessages,
        sendMessage,
        sendTyping,
        markAsSeen,
        setReplyingTo,
        editMessage,
        deleteMessage,
        reactToMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
