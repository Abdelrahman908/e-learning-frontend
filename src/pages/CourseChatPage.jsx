import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import MessageList from "../components/messages/MessageList";
import MessageInput from "../components/messages/MessageInput";
import TypingIndicator from "../components/messages/TypingIndicator";
import UnseenBadge from "../components/messages/UnseenBadge";
import { FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import CourseService from "../services/courses";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "";

const CourseChatPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const {
    activeCourse,
    setActiveCourse,
    messages,
    fetchMessages,
    typingUsers,
    markAsSeen,
  } = useChat();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const courseData = await CourseService.getCourseById(courseId);
        setActiveCourse(courseData);
        await fetchMessages();
        markAsSeen();
      } catch (error) {
        console.error("فشل في تحميل بيانات الدورة:", error);
      }
    };

    if (courseId && (!activeCourse || activeCourse.id !== parseInt(courseId))) {
      loadCourseData();
    }
  }, [courseId, activeCourse?.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!activeCourse) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gradient-to-tr from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-4 border-blue-500 border-opacity-60"></div>
        <p className="text-md text-gray-600 font-semibold tracking-wide">
          جاري تحميل بيانات الدورة...
        </p>
      </div>
    );
  }

  // بناء رابط الصورة مع التأكد من وجوده
  const courseImageSrc =
    activeCourse.imageUrl && !activeCourse.imageUrl.startsWith("http")
      ? `${BACKEND_URL}${activeCourse.imageUrl}`
      : activeCourse.imageUrl || "/images/default-course.jpg";

  return (
    <motion.div
      className="flex h-screen bg-gradient-to-b from-indigo-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1 flex flex-col overflow-hidden shadow-lg rounded-tr-3xl rounded-br-3xl bg-white">
        {/* Header */}
        <motion.header
          className="bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center p-5 shadow-lg z-20 rounded-tr-3xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <img
              src={courseImageSrc}
              alt={activeCourse.name}
              className="h-14 w-14 rounded-2xl object-cover border-4 border-white shadow-md"
            />
            <div>
              <h1 className="font-extrabold text-white text-xl tracking-wide drop-shadow-lg">
                {activeCourse.name}
              </h1>
              <p className="text-indigo-200 text-sm mt-1 select-none">
                المحاضر: {activeCourse.instructorName || "غير معروف"}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <UnseenBadge />
            <motion.button
              whileHover={{ scale: 1.15, color: "#8b5cf6" }}
              className="text-indigo-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg p-2"
              aria-label="رسائل"
              title="رسائل"
            >
              <FiMessageSquare size={26} />
            </motion.button>
          </div>
        </motion.header>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-indigo-50 p-6 space-y-5 scroll-smooth"
          onScroll={() => {
            if (chatContainerRef.current?.scrollTop === 0) {
              fetchMessages();
            }
          }}
        >
          <TypingIndicator />
          <MessageList />
        </div>

        {/* Input */}
        <motion.div
          className="bg-white border-t border-indigo-200 p-5 shadow-inner rounded-br-3xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MessageInput />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseChatPage;
