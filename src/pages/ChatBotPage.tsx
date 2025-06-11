import { useState, useEffect, useRef } from "react";
import axiosInstance from "../config/axios";
import { PaperPlaneIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

const ChatBotPage = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }

    setMessages([
      {
        sender: "bot",
        text: "👋  مرحبًا بك!  Framy Bot. كيف يمكنني مساعدتك اليوم ؟ أنا ",       },
    ]);
  }, []);

  const detectLanguage = (text: string): "en" | "egyptian" | "fusha" => {
    const hasEnglish = /[a-zA-Z]/.test(text);
    const isEgyptian = /(ايه|اخويا|عامل|ايوا|ماشي|كده|ليه|فين|ازاي)/i.test(text);
    if (hasEnglish) return "en";
    if (isEgyptian) return "egyptian";
    return "fusha";
  };

  const getBestVoice = (lang: "en" | "egyptian" | "fusha") => {
    const preferredVoices: Record<string, string[]> = {
      en: ["Google US English", "Samantha"],
      egyptian: ["Maged", "Tarik", "Google Tarik"],
      fusha: ["Google Arabic", "Maged"]
    };
    const fallbackLang = lang === "en" ? "en" : "ar";
    const voicesForLang = availableVoices.filter((v) => v.lang.startsWith(fallbackLang));
    const preferredNames = preferredVoices[lang] || [];
    for (const name of preferredNames) {
      const voice = voicesForLang.find((v) => v.name.includes(name));
      if (voice) return voice;
    }
    return voicesForLang[0];
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const langType = detectLanguage(text);
    const langCode = langType === "en" ? "en-US" : langType === "egyptian" ? "ar-EG" : "ar-SA";
    const voice = getBestVoice(langType);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axiosInstance.post("/chat", { message: input });
      const botReply = res.data?.Reply ?? "❓ لم يتم العثور على رد.";
      const replyText = typeof botReply === "string" ? botReply : JSON.stringify(botReply);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ حدث خطأ أثناء الاتصال بالخادم." }]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              background: darkMode 
                ? `rgba(99, 102, 241, ${Math.random() * 0.1})` 
                : `rgba(165, 180, 252, ${Math.random() * 0.2})`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`relative ${darkMode ? "bg-indigo-900" : "bg-indigo-100"} rounded-full p-2`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-xl">🤖</div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Framy Bot</h1>
              <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-green-500" 
                  animate={{ opacity: [0.3, 1, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }} 
                />
                نشط الآن
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg" 
                  : "bg-white text-indigo-600 hover:bg-indigo-50 shadow-md"
              }`}
              aria-label="تبديل الوضع الليلي"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="relative z-10 flex-1 container mx-auto px-4 py-4 flex flex-col">
        <div className={`flex-1 rounded-3xl overflow-hidden shadow-2xl ${
          darkMode 
            ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700" 
            : "bg-white/80 backdrop-blur-sm border border-indigo-100"
        }`}>
          {/* Chat Messages */}
          <div className="h-[60vh] p-4 space-y-4 overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className={`relative max-w-[85%] px-5 py-3 rounded-3xl text-base leading-relaxed tracking-wide ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
                        : `${darkMode ? "bg-gray-700" : "bg-indigo-50"} text-gray-800 dark:text-gray-100 rounded-bl-none`
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {msg.text}
                    
                    {/* Speech button for bot messages */}
                    {msg.sender === "bot" && (
                      <button
                        onClick={() => speak(msg.text)}
                        className={`absolute -bottom-6 left-3 text-xs flex items-center gap-1 ${
                          darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                        } transition`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        استمع للرد
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={`px-5 py-3 rounded-3xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"} text-gray-800 dark:text-gray-100 rounded-bl-none`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Framy Bot يكتب...</span>
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-indigo-100"}`}>
            <div className="flex items-center rounded-full overflow-hidden shadow-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 px-5 py-4 focus:outline-none text-base ${
                  darkMode 
                    ? "bg-gray-900 text-white placeholder-gray-400" 
                    : "bg-white text-gray-800 placeholder-indigo-300"
                }`}
                placeholder="💬 اكتب سؤالك هنا..."
              />
              <motion.button
                onClick={sendMessage}
                disabled={isTyping || !input.trim()}
                className={`p-4 transition-all duration-300 flex items-center gap-2 ${
                  darkMode 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                } ${isTyping || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                whileHover={{ scale: !isTyping && input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: !isTyping && input.trim() ? 0.95 : 1 }}
              >
                <PaperPlaneIcon className="h-5 w-5" />
                <span className="hidden sm:inline">إرسال</span>
              </motion.button>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {["الطقس", "أخبار", "رياضة", "تكنولوجيا"].map((topic, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-xs px-3 py-1.5 rounded-full transition ${
                      darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                    onClick={() => setInput(topic)}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`text-center mt-6 text-sm ${darkMode ? "text-gray-500" : "text-indigo-500"}`}>
          <p>Framy Bot • الإصدار 2.0 • يستخدم الذكاء الاصطناعي المتقدم</p>
          <p className="mt-1">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;