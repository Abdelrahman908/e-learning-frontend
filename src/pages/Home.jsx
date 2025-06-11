import React, { useState } from "react";
import coursesData from "../data/coursesData";
import Features from "../components/layout/Features";
import CallToAction from "../components/layout/CallToAction";
import ThemeToggle from "../components/ThemeToggle";
import {
  FaStar,
  FaUserTie,
  FaRegClock,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(coursesData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedCourses = coursesData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
      <ThemeToggle />

      {/* === Header === */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white animate-fade-in-down">
            Explore Our <span className="text-blue-600 dark:text-blue-400">Courses</span>
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
            Exciting new content is <span className="font-medium text-blue-600 dark:text-blue-400">coming soon</span>!
          </p>
        </div>

        {/* === Courses Grid === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {paginatedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col hover:scale-[1.02] group relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {course.category}
                </div>
                <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md animate-bounce">
                  Coming Soon
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <FaUserTie className="mr-2" />
                  <span>{course.instructor}</span>
                </div>

                <div className="flex justify-start items-center mt-auto">
                  <span className="text-lg font-bold text-blue-500 dark:text-blue-400">
                    ${course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Pagination === */}
        <div className="flex justify-center items-center mt-12 space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-l-xl border text-sm transition-all ${
              currentPage === 1
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            }`}
          >
            <FaArrowLeft className="mr-2" /> Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 text-sm border transition-all ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white border-blue-600 rounded-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-r-xl border text-sm transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            }`}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* === Features Section === */}
      <section className="mb-20 animate-fade-in-up delay-100">
        <Features />
      </section>

      {/* === Call to Action Section === */}
      <section className="animate-fade-in-up delay-200">
        <CallToAction />
      </section>
    </main>
  );
};

export default Home;
