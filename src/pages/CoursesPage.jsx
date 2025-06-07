import React from "react";
import CourseList from "../components/course/CourseList";
import Header from "../components/layout/Header"; // أو AppHeader إذا غيّرت الاسم

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            جميع الكورسات
          </h1>

          <CourseList />
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
