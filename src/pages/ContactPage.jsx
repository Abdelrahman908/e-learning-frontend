import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUser, FaPaperPlane, FaComment, FaTag, FaTools, FaShoppingCart, FaUserCircle, FaCheckCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة لإرسال البيانات
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardHover = {
    hover: { 
      y: -10,
      boxShadow: "0 15px 40px rgba(37, 99, 235, 0.15)",
      borderColor: "#c7d2fe"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e4edf5] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 relative"
        >
          <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] bg-gradient-to-br from-[rgba(79,70,229,0.1)] to-transparent rounded-full z-0"></div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 mb-4 relative z-10"
          >
            تواصل مع فريق الدعم
          </motion.h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto rounded-full mb-6"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl"
          >
            فريق الدعم لدينا جاهز للإجابة على استفساراتك وتقديم المساعدة الفنية. لا تتردد في التواصل معنا عبر أي من الطرق المتاحة أدناه.
          </motion.p>
        </motion.div>

        {/* Contact Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8 mb-16"
        >
          {/* Contact Info */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-2/5"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200"
              >
                معلومات التواصل
              </motion.h2>
              
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-start bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-600 text-lg">contactframyy@gmail.com
</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-start bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full mr-4">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">رقم الهاتف</h3>
                    <p className="text-gray-600 text-lg">+201145064366</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-start bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">العنوان</h3>
                    <p className="text-gray-600 text-lg">القاهرة، مصر</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
              >
                <div className="flex items-center mb-3">
                  <FaClock className="text-blue-600 text-xl mr-2" />
                  <h3 className="text-xl font-bold text-blue-800">أوقات العمل</h3>
                </div>
                <p className="text-gray-700">
                  الأحد - الخميس: 8 صباحاً - 5 مساءً<br />
                  الجمعة - السبت: مغلق
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-3/5"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-purple-700"></div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200"
              >
                أرسل رسالتك
              </motion.h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-shadow duration-300"
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-shadow duration-300"
                        placeholder="example@domain.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">
                    موضوع الرسالة
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-shadow duration-300"
                      placeholder="موضوع الرسالة"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                    نص الرسالة
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 right-3">
                      <FaComment className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-shadow duration-300 resize-none h-40"
                      placeholder="اكتب رسالتك هنا..."
                      required
                    ></textarea>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 font-bold text-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </motion.button>
                
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg flex items-center"
                  >
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FaCheckCircle className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">تم إرسال رسالتك بنجاح!</p>
                      <p className="text-sm mt-1">سنتواصل معك في أقرب وقت ممكن</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Support Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div 
            variants={itemVariants}
            whileHover="hover"
            variantsس={cardHover}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <FaTools className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">الدعم الفني</h3>
            <p className="text-gray-600">
              فريق الدعم الفني جاهز لمساعدتك في حل المشكلات الفنية واستكشاف الأخطاء وإصلاحها. نحن هنا لضمان تجربة سلسة وخالية من المتاعب.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover="hover"
            variantsس={cardHover}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-violet-600"></div>
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <FaShoppingCart className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">دعم الكورسات</h3>
            <p className="text-gray-600">
              هل لديك أسئلة حول منتجاتنا أو خدماتنا؟ فريق المبيعات لدينا على استعداد للإجابة على استفساراتك ومساعدتك في العثور على الحل الأمثل.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover="hover"
            variantsس={cardHover}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-pink-500 to-rose-600"></div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <FaUserCircle className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">دعم الحساب</h3>
            <p className="text-gray-600">
              فريق دعم الحسابات متاح لمساعدتك في إدارة حسابك، وتحديث معلوماتك، وحل أي مشكلات تتعلق بالحساب قد تواجهك.
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-[10%] left-[5%] w-[150px] h-[150px] bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-transparent rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[15%] right-[8%] w-[100px] h-[100px] bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-transparent transform rotate-45 z-0 pointer-events-none"></div>
    </div>
  );
};

export default ContactPage;