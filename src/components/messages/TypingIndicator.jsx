import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { FaPenNib } from 'react-icons/fa';

const TypingIndicator = () => {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm mb-3 max-w-fit direction-rtl" dir="rtl">
      <div className="flex items-center space-x-1">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
      </div>
      <div className="flex flex-col text-sm text-gray-700">
        <span className="flex items-center gap-1 font-medium">
          <FaPenNib className="text-blue-500" />
          {typingUsers.map((user) => user.name).join(', ')}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">يكتب...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
