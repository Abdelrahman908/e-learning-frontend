import React, { useEffect, useState } from "react";
import CourseService from "../services/courses";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiEye, FiStar, FiUser, FiDollarSign } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload["role"] || payload["roles"] || null;
    } catch {
      return null;
    }
  };

  const role = getUserRole();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await CourseService.getCourses();
        setCourses(data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الكورسات. الرجاء المحاولة لاحقاً");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Skeleton height={180} />
          <div className="p-4">
            <Skeleton count={2} />
            <div className="mt-4">
              <Skeleton width={100} height={30} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الكورسات التعليمية</h1>
            <p className="mt-2 text-gray-600">
              اكتشف مجموعة واسعة من الكورسات المصممة لمساعدتك في رحلتك التعليمية
            </p>
          </div>
          
          {role === "Instructor" && (
            <button
              onClick={() => navigate("/courses/create")}
              className="mt-4 sm:mt-0 flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FiPlus className="ml-2" />
              إضافة كورس جديد
            </button>
          )}
        </div>

        {/* Content Section */}
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : loading ? (
          renderSkeletons()
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد كورسات متاحة</h3>
            <p className="mt-1 text-gray-500">لا يوجد أي كورسات لعرضها حالياً.</p>
            {role === "Instructor" && (
              <div className="mt-6">
                <button
                  onClick={() => navigate("/courses/create")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="-mr-1 ml-2 h-5 w-5" />
                  إنشاء كورس جديد
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-100"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  {course.imageUrl ? (
                    <img
                      src={
                        course.imageUrl.startsWith("http")
                          ? course.imageUrl
                          : `https://localhost:7056${course.imageUrl}`
                      }
                      alt={course.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x225?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">لا توجد صورة</span>
                    </div>
                  )}
                  {course.price > 0 && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      مدفوع
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || "لا يوجد وصف متاح"}
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUser className="ml-1" />
                      <span>{course.instructorName || "غير معروف"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiStar className="ml-1 text-yellow-500" />
                        <span>{course.averageRating ? course.averageRating.toFixed(1) : "جديد"}</span>
                      </div>
                      
                      {course.price > 0 && (
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <FiDollarSign className="mr-1" />
                          <span>{course.price} جنيه</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => 
                      role === "Instructor" || role === "Admin" 
                        ? navigate(`/courses/edit/${course.id}`) 
                        : navigate(`/courses/${course.id}`)
                    }
                    className={`mt-4 w-full py-2 rounded-lg text-white font-medium flex items-center justify-center transition-colors duration-200 ${
                      role === "Instructor" || role === "Admin"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {role === "Instructor" || role === "Admin" ? (
                      <>
                        <FiEdit className="ml-2" />
                        تعديل الكورس
                      </>
                    ) : (
                      <>
                        <FiEye className="ml-2" />
                        عرض التفاصيل
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;