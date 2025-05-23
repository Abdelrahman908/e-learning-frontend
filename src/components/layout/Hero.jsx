import React from "react";
import HeroImage from "../../assets/images/Hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
        {/* نص الهرواي */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-snug mb-6">
            Learn Anytime, Anywhere with{" "}
            <span className="text-blue-600">Framy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-lg leading-relaxed">
            Explore high-quality courses, improve your skills, and join a global community of learners today.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* صورة الهرواي */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={HeroImage}
            alt="E-Learning"
            className="w-full max-w-md rounded-3xl shadow-2xl object-cover max-h-[450px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;  