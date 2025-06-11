import React from "react";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaLaptopCode, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaChalkboardTeacher className="text-blue-600 text-6xl mx-auto mb-6" />,
    title: "Expert Instructors",
    description: "Learn from industry experts who are passionate about teaching.",
  },
  {
    icon: <FaLaptopCode className="text-blue-600 text-6xl mx-auto mb-6" />,
    title: "Hands-On Learning",
    description: "Interactive lessons and real-world projects to boost your skills.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-6xl mx-auto mb-6" />,
    title: "Global Community",
    description: "Join a supportive learning community from all over the world.",
  },
];

// Variants for the cards container (optional if you want stagger effect)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // smooth easeOut cubic bezier
    },
  },
};

const iconVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0], // bounce up and down
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-16 text-gray-900 drop-shadow-md tracking-wide">
          Why Choose Framy?
        </h2>
        <motion.div
          className="grid md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-lg cursor-pointer transform transition-shadow duration-400"
              variants={itemVariants}
              whileHover={{
                scale: 1.07,
                rotate: 1.5,
                boxShadow:
                  "0 20px 40px rgba(59, 130, 246, 0.3), 0 6px 12px rgba(59, 130, 246, 0.2)",
                transition: { duration: 0.4, ease: "easeOut" },
              }}
            >
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                className="mb-6"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold mb-5 text-gray-800 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
