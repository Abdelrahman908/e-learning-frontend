import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LessonsService from '../../services/lessons';
import { AuthContext } from '../../contexts/AuthContext';

const EditLessonPage = () => {
  const { courseId, id: lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [isSequential, setIsSequential] = useState(false);
  const [order, setOrder] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const data = await LessonsService.getLesson(courseId, lessonId);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setVideoUrl(data.videoUrl || '');
        setContent(data.content || '');
        setDuration(data.duration || '');
        setIsFree(data.isFree || false);
        setIsSequential(data.isSequential || false);
        setOrder(data.order || '');
      } catch {
        setError('فشل جلب بيانات الدرس');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      videoUrl,
      content,
      duration: duration ? duration.toString() : '',
      isFree: isFree ? 'true' : 'false',
      isSequential: isSequential ? 'true' : 'false',
      order: order ? order.toString() : '',
      pdfFile,
    };

    try {
      setLoading(true);
      await LessonsService.updateLesson(courseId, lessonId, data);
      navigate(`/courses/${courseId}/lessons/${lessonId}`);
    } catch (error) {
      setError('فشل تحديث الدرس');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center text-red-600 mt-10">غير مسموح بالدخول</p>;
  if (loading) return <p className="text-center text-gray-600 mt-10">جاري التحميل...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">تعديل الدرس</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        {/* العنوان */}
        <div>
          <label htmlFor="title" className="block mb-1 font-semibold text-gray-700">
            العنوان *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* الوصف */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-700">
            الوصف
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* رابط الفيديو */}
        <div>
          <label htmlFor="videoUrl" className="block mb-1 font-semibold text-gray-700">
            رابط الفيديو
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* محتوى الدرس */}
        <div>
          <label htmlFor="content" className="block mb-1 font-semibold text-gray-700">
            محتوى الدرس
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* مدة الدرس */}
        <div>
          <label htmlFor="duration" className="block mb-1 font-semibold text-gray-700">
            مدة الدرس (بالدقائق)
          </label>
          <input
            id="duration"
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* ترتيب الدرس */}
        <div>
          <label htmlFor="order" className="block mb-1 font-semibold text-gray-700">
            ترتيب الدرس
          </label>
          <input
            id="order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          />
        </div>

        {/* هل الدرس مجاني */}
        <div className="flex items-center space-x-4">
          <input
            id="isFree"
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="isFree" className="font-semibold text-gray-700 cursor-pointer select-none">
            الدرس مجاني
          </label>
        </div>

        {/* هل الدرس متسلسل */}
        <div className="flex items-center space-x-4">
          <input
            id="isSequential"
            type="checkbox"
            checked={isSequential}
            onChange={(e) => setIsSequential(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="isSequential" className="font-semibold text-gray-700 cursor-pointer select-none">
            تتابعي (يجب إكمال الدرس السابق)
          </label>
        </div>

        {/* رفع ملف PDF */}
        <div>
          <label htmlFor="pdfFile" className="block mb-1 font-semibold text-gray-700">
            ملف PDF (اختياري)
          </label>
          <input
            id="pdfFile"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="text-gray-600"
          />
          {pdfFile && (
            <p className="mt-1 text-indigo-600 font-medium">
              تم اختيار الملف: {pdfFile.name}
            </p>
          )}
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-4 text-white font-semibold rounded-md shadow-md transition
          ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? 'جاري التحديث...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
};

export default EditLessonPage;
