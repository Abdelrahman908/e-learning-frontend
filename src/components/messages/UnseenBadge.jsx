import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

const UnseenBadge = () => {
  const { unseenCount } = useChat();

  return (
    <AnimatePresence>
      {unseenCount > 0 && (
        <motion.span
          className="ml-2 bg-red-500 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {unseenCount > 99 ? '99+' : unseenCount}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default UnseenBadge;
