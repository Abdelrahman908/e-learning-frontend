import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { FaPaperclip, FaSmile, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = () => {
  const { sendMessage, sendTyping, replyingTo, setReplyingTo } = useChat();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    await sendMessage(text, file);
    setText('');
    setFile(null);
    setShowEmojiPicker(false);
    setIsTyping(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      sendTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = textareaRef.current.selectionStart;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setText(newText);

    // إعادة ضبط المؤشر بعد إدخال الإيموجي
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPos + emoji.length;
    }, 0);
  };

  return (
    <motion.div
      className="border-t p-4 bg-white relative"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* الرسالة اللي بيرد عليها */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            className="mb-2 p-3 bg-blue-50 border-r-4 border-blue-500 flex justify-between items-center rounded shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="text-sm text-gray-700 truncate">
              <span className="font-semibold">الرد على {replyingTo.senderName}: </span>
              <span className="ml-1">{replyingTo.text || 'مرفق'}</span>
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* المرفق */}
      <AnimatePresence>
        {file && (
          <motion.div
            className="mb-2 flex items-center justify-between p-2 bg-gray-100 rounded shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="text-sm truncate max-w-xs">{file.name}</span>
            <button 
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* فورم الإدخال */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
        {/* الأزرار الجانبية */}
        <div className="flex gap-2">
          {/* زر المرفق */}
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-2 text-gray-500 hover:text-blue-600 transition"
            title="إرفاق ملف"
          >
            <FaPaperclip />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>

          {/* زر الإيموجي */}
          <div className="relative">
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-yellow-500 transition"
              title="إيموشن"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <FaSmile />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={350}
                  width={300}
                  theme="light"
                />
              </div>
            )}
          </div>
        </div>

        {/* حقل الإدخال */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="اكتب رسالتك..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition"
            rows={1}
            onFocus={sendTyping}
          />
        </div>

        {/* زر الإرسال */}
        <motion.button
          type="submit"
          disabled={!text.trim() && !file}
          className={`p-3 rounded-full shadow transition ${
            text.trim() || file
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          whileTap={{ scale: 0.95 }}
          title="إرسال"
        >
          <FaPaperPlane />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
