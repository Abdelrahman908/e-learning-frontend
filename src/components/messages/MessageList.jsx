import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { useChat } from '../../contexts/ChatContext';

const MessageList = () => {
  const { 
    messages, 
    pagination, 
    fetchMessages, 
    activeCourse,
    markAsSeen,
    user // تأكد من أن `user` موجود في useChat أو استورده من AuthContext حسب مشروعك
  } = useChat();

  const messagesEndRef = useRef(null);
  const listRef = useRef(null);

  // تحميل المزيد من الرسائل عند التمرير لأعلى
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;

      const { scrollTop } = listRef.current;
      if (scrollTop === 0 && pagination.hasMore) {
        fetchMessages(pagination.page + 1);
      }
    };

    const list = listRef.current;
    if (list) {
      list.addEventListener('scroll', handleScroll);
      return () => list.removeEventListener('scroll', handleScroll);
    }
  }, [pagination, fetchMessages]);

  // التمرير لأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // تعليم الرسائل كمقروءة إذا كانت موجهة للمستخدم الحالي
  useEffect(() => {
    if (
      activeCourse &&
      user &&
      messages.some(msg => !msg.isSeen && msg.senderId !== user.id)
    ) {
      markAsSeen();
    }
  }, [activeCourse, messages, user, markAsSeen]);

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 bg-gray-50"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      {pagination.hasMore && (
        <div className="text-center py-4 text-gray-500">
          جارٍ تحميل المزيد من الرسائل...
        </div>
      )}

      <div className="flex flex-col">
            {messages
  .filter((msg, index, self) => index === self.findIndex(m => m.id === msg.id))
  .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))  // الترتيب من الأقدم للأحدث
  .map(message => (
    <MessageItem key={`${message.id}-${message.sentAt}`} message={message} />
  ))
}



        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
