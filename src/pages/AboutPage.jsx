import React from "react";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaLightbulb,
  FaGraduationCap,
  FaHandshake,
  FaMedal,
  FaRocket,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.25, when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-20 px-6 font-sans text-gray-900 overflow-hidden">
      {/* الخلفية الديكورية */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-60 h-60 bg-indigo-300 opacity-20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-purple-300 opacity-25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300 opacity-20 rounded-full blur-2xl animate-pulse" />
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            initial={{ letterSpacing: "0.25em", opacity: 0 }}
            animate={{ letterSpacing: "0.05em", opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Framy — من نحن
          </motion.h1>
          <motion.div
            className="mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
          />
          <motion.p
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            في Framy نؤمن بأن التعليم هو مفتاح النجاح في المستقبل، ونحرص على تقديم
            أفضل التجارب التعليمية المتطورة والمبتكرة التي تناسب كل متعلم.
          </motion.p>
        </motion.div>

        {/* البطاقات */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              icon: <FaUsers className="text-indigo-500 text-6xl" />,
              title: "رسالتنا",
              desc: "منصة تعليمية مبتكرة تهدف لتوفير محتوى تعليمي عالي الجودة ومتنوع يناسب جميع المتعلمين.",
            },
            {
              icon: <FaChalkboardTeacher className="text-purple-500 text-6xl" />,
              title: "فريقنا",
              desc: "يضم فريق من المحترفين والخبراء ملتزمين بتقديم أفضل المحتويات وتجربة تعليمية فريدة.",
            },
            {
              icon: <FaLightbulb className="text-pink-500 text-6xl" />,
              title: "رؤيتنا",
              desc: "تطوير التعليم باستمرار عبر تبني أحدث التقنيات وتقديم حلول تعليمية مبتكرة وفعالة.",
            },
            {
              icon: (
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  className="text-yellow-500 text-6xl mx-auto"
                >
                  <FaRocket />
                </motion.div>
              ),
              title: "طموحنا",
              desc: "توسيع حدود التعليم الإلكتروني ليشمل الجميع في كل مكان وزمان.",
            },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white rounded-2xl p-8 shadow-lg cursor-pointer border border-gray-200 hover:border-indigo-500"
            >
              <div className="flex justify-center mb-6">{icon}</div>
              <h3 className="text-2xl font-semibold text-center mb-3">{title}</h3>
              <p className="text-center text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* قيمنا الأساسية */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-28 p-12 bg-indigo-50 rounded-3xl shadow-lg"
        >
          <h2 className="text-4xl font-extrabold text-center mb-12 tracking-wide text-indigo-700">
            قيمنا الأساسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <FaGraduationCap className="text-indigo-600 text-7xl mb-4 mx-auto" />,
                title: "الجودة التعليمية",
                desc: "نلتزم بتقديم محتوى تعليمي بمستوى عالمي يضمن تحقيق أفضل النتائج للمتعلمين.",
              },
              {
                icon: <FaHandshake className="text-purple-600 text-7xl mb-4 mx-auto" />,
                title: "التواصل المستمر",
                desc: "نهتم بسماع ملاحظاتكم وتطوير خدماتنا باستمرار لضمان رضا المتعلمين.",
              },
              {
                icon: <FaMedal className="text-pink-600 text-7xl mb-4 mx-auto" />,
                title: "التميز والإبداع",
                desc: "نشجع الابتكار والتميز في كل ما نقدمه لتعزيز تجربة تعليمية ملهمة.",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-200"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 35px rgba(99, 102, 241, 0.3)",
                  transition: { duration: 0.3 },
                }}
              >
                {icon}
                <h3 className="text-2xl font-bold mb-3 text-indigo-700">{title}</h3>
                <p className="text-gray-700">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* زر الاتصال */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <button
            onClick={() => navigate("/contact")}
            className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-semibold text-white rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-500 to-yellow-400 opacity-30 blur-lg transition-transform duration-500 ease-out group-hover:scale-110"></span>
            <span className="relative z-10 text-lg tracking-wider">تواصل معنا</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
