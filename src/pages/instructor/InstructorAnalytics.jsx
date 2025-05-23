import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InstructorAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/instructor/analytics"); // عدل حسب API الخاص بك
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "خطأ في تحميل الإحصائيات");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-4">جاري التحميل...</p>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 underline text-blue-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">تحليلات المدرس</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">عدد الكورسات</h3>
          <p className="text-3xl">{stats.totalCourses}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">عدد الطلاب المسجلين</h3>
          <p className="text-3xl">{stats.totalStudents}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">إجمالي الإيرادات</h3>
          <p className="text-3xl">{stats.totalRevenue} $</p>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">توزيع الطلاب حسب الكورسات</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.studentsPerCourse}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="studentCount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
