import React, { useState } from "react";
import coursesData from "../data/coursesData";
import Features from "../components/layout/Features";
import CallToAction from "../components/layout/CallToAction";
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* === Popular Courses Section === */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular <span className="text-blue-600">Courses</span>
          </h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View all courses <FaArrowRight className="ml-2" />
          </button>
        </div>

        {/* === Courses Grid === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {course.category}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-4">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center mb-4">
                  <FaUserTie className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{course.instructor}</span>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-blue-600">${course.price}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Enroll Now
                  </button>
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
            className={`flex items-center px-4 py-2 rounded-l-lg border border-gray-300 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 border-t border-b border-gray-300 ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-r-lg border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* === Features Section === */}
      <section className="mb-20">
        <Features />
      </section>

      {/* === Call to Action Section === */}
      <section>
        <CallToAction />
      </section>
    </main>
  );
};

export default Home;
