import React from "react";
import CourseList from "../components/course/CourseList";
import Header from "../components/layout/Header";

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <Header />

      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight select-none">
            جميع الكورسات
          </h1>

          <div className="border-t border-gray-200 pt-6">
            <CourseList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
