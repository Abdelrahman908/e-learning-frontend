import React from "react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-20 px-6 text-center rounded-lg shadow-lg mx-4 md:mx-20 my-12">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">
       ? Ready to Start Learning
      </h2>
      <p className="mb-8 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
        Join thousands of learners and get access to high-quality courses today.
      </p>
      <a
        href="/register"
        className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 ease-in-out"
      >
        Sign Up Now
      </a>
    </section>
  );
};

export default CallToAction;
