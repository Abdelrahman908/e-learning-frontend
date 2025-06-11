import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-20 px-6 text-center rounded-xl shadow-xl mx-4 md:mx-20 my-12">
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Ready to Start Learning?
      </motion.h2>
      <motion.p
        className="mb-10 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Join thousands of learners and get access to high-quality courses today.
      </motion.p>
      <motion.a
        href="/register"
        className="inline-block bg-white text-blue-600 font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 ease-in-out"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Sign Up Now
      </motion.a>
    </section>
  );
};

export default CallToAction;
