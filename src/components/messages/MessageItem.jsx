import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FaReply, FaTrash, FaEdit, FaSmile } from 'react-icons/fa';

const MessageItem = ({ message }) => {
  const { user } = useAuth();
  const { setReplyingTo, editMessage, deleteMessage, reactToMessage } = useChat();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text || '');
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef(null);

  const isOwnMessage = user?.id === message.senderId;

  const handleEdit = useCallback(async () => {
    if (editedText.trim() && editedText !== message.text) {
      await editMessage(message.id, editedText);
    }
    setIsEditing(false);
  }, [editedText, message.id, message.text, editMessage]);

  const handleDelete = useCallback(() => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      deleteMessage(message.id);
    }
  }, [message.id, deleteMessage]);

  const handleReaction = useCallback(
    (reaction) => {
      reactToMessage(message.id, reaction);
      setShowReactions(false);
    },
    [message.id, reactToMessage]
  );

  // Close reaction menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reactionRef.current && !reactionRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`p-4 rounded-2xl mb-4 relative shadow-sm ${
        isOwnMessage
          ? 'bg-blue-50 border-l-4 border-blue-500 ml-10'
          : 'bg-gray-50 border-l-4 border-gray-300 mr-10'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="font-bold text-gray-800">{message.senderName}</span>
          {isOwnMessage && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">أنت</span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {format(new Date(message.sentAt), 'hh:mm a', { locale: ar })}
        </span>
      </div>

      {/* Reply Preview */}
      {message.replyToMessage && (
        <div className="mb-2 p-2 bg-gray-100 border-r-4 border-gray-300 rounded text-sm text-gray-600">
          <span className="font-medium">{message.replyToMessage.senderName}: </span>
          {message.replyToMessage.text || 'مرفق'}
        </div>
      )}

      {/* Message Body */}
      <div className="mb-2">
        {isEditing ? (
          <div>
            <textarea
              rows={2}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              dir="auto"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded"
              >
                إلغاء
              </button>
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                حفظ
              </button>
            </div>
          </div>
        ) : (
          <>
            {message.text && (
              <p className="text-gray-800 break-words whitespace-pre-wrap" dir="auto">
                {message.text}
              </p>
            )}
            {message.attachmentUrl && (
              <div className="mt-2">
                <a
                  href={message.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  📎 عرض المرفق
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reaction Display */}
      {message.reaction && !isEditing && (
        <div className="mb-2 text-xl">
          <span className="inline-block bg-yellow-100 px-2 py-1 rounded">
            {message.reaction === 'Like' && '👍'}
            {message.reaction === 'Love' && '❤️'}
            {message.reaction === 'Laugh' && '😂'}
          </span>
        </div>
      )}

      {/* Controls */}
      {!isEditing && (
        <div className="flex justify-between items-center text-gray-500">
          {/* Left: Reply + Reactions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setReplyingTo(message)} className="hover:text-blue-600" title="رد">
              <FaReply />
            </button>

            <div className="relative" ref={reactionRef}>
              <button
                onClick={() => setShowReactions((prev) => !prev)}
                className="hover:text-yellow-600"
                title="تفاعل"
              >
                <FaSmile />
              </button>
              {showReactions && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-white border rounded-lg shadow-md p-2 flex gap-2">
                  <button onClick={() => handleReaction('Like')} title="إعجاب" className="text-xl">
                    👍
                  </button>
                  <button onClick={() => handleReaction('Love')} title="حب" className="text-xl">
                    ❤️
                  </button>
                  <button onClick={() => handleReaction('Laugh')} title="ضحك" className="text-xl">
                    😂
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Edit + Delete (own message only) */}
          {isOwnMessage && (
            <div className="flex items-center gap-3">
              <button onClick={() => setIsEditing(true)} className="hover:text-green-600" title="تعديل">
                <FaEdit />
              </button>
              <button onClick={handleDelete} className="hover:text-red-600" title="حذف">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
