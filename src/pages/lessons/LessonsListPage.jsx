import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsService from '../../services/lessons';
import { AuthContext } from '../../contexts/AuthContext';
import { FiPlus, FiEdit, FiTrash2, FiBookOpen } from 'react-icons/fi';

const LessonsListPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const data = await LessonsService.getLessons(courseId);
        if (data?.Success && Array.isArray(data?.Data)) {
          setLessons(data.Data);
          setError(null);
        } else {
          setLessons([]);
          setError('لا توجد دروس متاحة حتى الآن.');
        }
      } catch (err) {
        setError('حدث خطأ أثناء جلب الدروس.');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleAddLesson = () => {
    navigate(`/courses/${courseId}/lessons/new`);
  };

  const handleViewDetails = (lessonId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الدرس؟")) return;
    try {
      await LessonsService.deleteLesson(courseId, lessonId);
      setLessons(prev => prev.filter(l => l.Id !== lessonId));
    } catch {
      alert("حدث خطأ أثناء حذف الدرس.");
    }
  };

  const canEdit = () => {
    return user?.role === 'admin' || user?.role === 'instructor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 select-none">
            <FiBookOpen className="text-blue-600 text-4xl" />
            قائمة الدروس
          </h2>
          {canEdit() && (
            <button
              onClick={handleAddLesson}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl
                font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-600 transition"
              aria-label="إضافة درس جديد"
            >
              <FiPlus size={20} />
              إضافة درس جديد
            </button>
          )}
        </header>

        {loading && (
          <p className="text-center text-gray-500 text-lg">جاري تحميل الدروس...</p>
        )}

        {!loading && error && lessons.length === 0 && (
          <div className="text-center text-gray-600 bg-blue-100 border border-blue-300 p-8 rounded-2xl shadow-inner select-none">
            <p className="text-2xl font-semibold mb-2">📭 لا توجد دروس بعد</p>
            <p className="text-base max-w-md mx-auto">يبدو أنه لم تتم إضافة أي دروس إلى هذا الكورس حتى الآن.</p>
          </div>
        )}

        <ul className="space-y-6">
          {lessons.map((lesson) => (
            <li
              key={lesson.Id}
              className="p-6 bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => handleViewDetails(lesson.Id)}
              aria-label={`عرض تفاصيل الدرس ${lesson.Title}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="text-xl font-bold text-blue-700 mb-1"
                  >
                    #{lesson.Order} - {lesson.Title}
                  </h3>
                  <p className="text-gray-700 mb-1">الوصف: {lesson.Description || '—'}</p>
                  <p className="text-gray-700 font-medium">
                    مجاناً:{" "}
                    <span className={lesson.IsFree ? "text-green-600" : "text-red-500"}>
                      {lesson.IsFree ? 'نعم' : 'لا'}
                    </span>
                  </p>
                </div>

                {canEdit() && (
                  <div
                    className="flex flex-col gap-3 ml-6 text-sm"
                    onClick={(e) => e.stopPropagation()} // لمنع التنقل عند الضغط على الأزرار
                  >
                    <button
                      onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.Id}/edit`)}
                      className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition"
                      aria-label={`تعديل الدرس ${lesson.Title}`}
                    >
                      <FiEdit size={18} />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.Id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                      aria-label={`حذف الدرس ${lesson.Title}`}
                    >
                      <FiTrash2 size={18} />
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LessonsListPage;
