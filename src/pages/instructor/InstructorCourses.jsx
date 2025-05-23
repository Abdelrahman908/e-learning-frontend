import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const navigate = useNavigate();

  // جلب الكورسات من API
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/instructor/courses"); // عدل الرابط حسب API الخاص بك
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل الكورسات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // حذف كورس
  const handleDelete = async (courseId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكورس؟")) return;
    try {
      await axios.delete(`/api/courses/${courseId}`); // عدل الرابط حسب API الخاص بك
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || "فشل الحذف");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">كورسات المدرس</h2>

      <button
        onClick={() => navigate("/instructor/create-course")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        إنشاء كورس جديد
      </button>

      {loading && <p>جاري التحميل...</p>}

      {error && (
        <div className="text-red-600 mb-4">
          {error}
          <button
            onClick={fetchCourses}
            className="ml-4 underline text-blue-600"
          >
            حاول مرة أخرى
          </button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <p>لا يوجد كورسات حالياً.</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">العنوان</th>
              <th className="border border-gray-300 p-2">الوصف</th>
              <th className="border border-gray-300 p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(({ id, title, description }) => (
              <tr key={id}>
                <td className="border border-gray-300 p-2">{title}</td>
                <td className="border border-gray-300 p-2">{description}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/instructor/update-course/${id}`)}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InstructorCourses;
