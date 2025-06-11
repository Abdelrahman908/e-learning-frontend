import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsService from '../../services/lessons';
import ProgressService from '../../services/progress';
import { AuthContext } from '../../contexts/AuthContext';

const LessonDetailsPage = () => {
  const { courseId, id } = useParams();
  const lessonId = id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // دالة لبناء رابط معاينة الفيديو من معرف الملف
  const getDrivePreviewUrl = (fileId) => {
    if (!fileId) return "";
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      try {
        const isEnrolled = await LessonsService.checkEnrollment(courseId);
        if (!isEnrolled) {
          setError('🚫 يجب أن تكون مشتركًا في هذه الدورة لمشاهدة الدرس.');
          return;
        }

        const resLesson = await LessonsService.getLesson(courseId, lessonId);
        if (resLesson?.Success) {
          setLesson(resLesson.Data);

          if (user?.id) {
            const resProgress = await ProgressService.getLessonProgress(user.id, lessonId);
            if (resProgress?.Success) {
              const currentProgress = resProgress.Data?.percentage || 0;
              setProgress(currentProgress);
              setLessonCompleted(currentProgress >= 100);
            }
          }
        } else {
          setError(resLesson?.Message || '⚠️ تعذر تحميل بيانات الدرس.');
        }
      } catch (err) {
        console.error(err);
        setError('❌ حدث خطأ غير متوقع أثناء تحميل بيانات الدرس.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndProgress();
  }, [courseId, lessonId, user]);

  const handleCompleteLesson = useCallback(async () => {
    if (!lesson || !user?.id) return;

    const now = new Date();
    const progressData = {
      lessonId: lesson.Id,
      lessonTitle: lesson.Title || 'بدون عنوان',
      isCompleted: true,
      progressPercentage: 100,
      startedAt: now.toISOString(),
      completedAt: now.toISOString(),
      timeSpent: "00:15:00",
    };

    try {
      await ProgressService.updateProgress(user.id, lesson.Id, progressData);
      setProgress(100);
      setLessonCompleted(true);
    } catch (err) {
      console.error(err);
    }
  }, [lesson, user]);

  // واجهات الحالة
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-indigo-600 text-xl font-medium animate-pulse">⏳ جاري تحميل الدرس...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg font-semibold px-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center mt-20 text-gray-700">
        <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ لا يمكن عرض هذا الدرس</h2>
        <p className="text-lg">
          يبدو أن هذا الدرس غير موجود أو لم تتم إضافته بعد.
          <br />
          يرجى التحقق من الرابط أو العودة لاحقًا.
        </p>
      </div>
    );
  }

  // بناء رابط معاينة الفيديو
  const previewUrl = lesson.DriveFileId ? getDrivePreviewUrl(lesson.DriveFileId) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-500 pb-3">
        📖 {lesson.Title}
      </h2>

      <div className="text-gray-800 space-y-4 leading-relaxed text-lg">
        <p><span className="font-bold text-indigo-700">📝 الملخص:</span> {lesson.Description || 'لا يوجد ملخص متاح.'}</p>
        <p><span className="font-bold text-indigo-700">📚 المحتوى:</span> {lesson.Content || 'لا يوجد محتوى متاح.'}</p>
      </div>

      {previewUrl ? (
        <div className="mt-8 rounded-lg overflow-hidden shadow-lg border border-gray-300">
          <iframe
            src={previewUrl}
            title="Lesson Video"
            width="100%"
            height="480"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[480px] rounded-md"
          ></iframe>
        </div>
      ) : lesson.VideoUrl ? (
        // رابط الفيديو القديم (قبل التحديثات)
        <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
          <p>⚠️ رابط الفيديو قديم، يرجى تحديث الدرس لاستخدام النظام الجديد</p>
          <a 
            href={lesson.VideoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 block"
          >
            مشاهدة الفيديو في نافذة جديدة
          </a>
        </div>
      ) : (
        <div className="mt-8 bg-gray-100 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
          <p className="text-gray-500">لا يتوفر فيديو لهذا الدرس</p>
        </div>
      )}

      {/* تقدم الدرس */}
      <div className="mt-10">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">
          🔄 تقدمك في هذا الدرس
        </label>
        <div
          className="w-full h-6 bg-gray-300 rounded-full overflow-hidden shadow-inner"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-6 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-right text-sm text-gray-600">{Math.round(progress)}%</p>
      </div>

      {/* زر إكمال الدرس */}
      {!lessonCompleted && (
        <button
          onClick={handleCompleteLesson}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          ✅ إكمال الدرس يدويًا
        </button>
      )}

      {lessonCompleted && (
        <p className="mt-6 text-green-700 font-semibold text-xl flex items-center gap-2">
          🎉 تم إكمال هذا الدرس بنجاح!
        </p>
      )}

      {/* الملفات القابلة للتحميل */}
      {lesson.Materials?.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            📎 ملفات قابلة للتحميل:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-indigo-700 text-lg">
            {lesson.Materials.map((file, index) => (
              <li key={index}>
                <a
                  href={file.FileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-indigo-900 transition"
                >
                  {file.FileName || `ملف ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LessonDetailsPage;