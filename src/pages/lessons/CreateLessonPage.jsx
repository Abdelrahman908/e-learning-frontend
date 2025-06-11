import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LessonsService from '../../services/lessons';
import { AuthContext } from '../../contexts/AuthContext';

const lessonTypeMap = {
  Video: 'Video',
  Pdf: 'Pdf',
  Text: 'Text',
  Quiz: 'Quiz',
  Mixed: 'Mixed',
};

const CreateLessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState(lessonTypeMap.Video);
  const [duration, setDuration] = useState(0);
  const [isFree, setIsFree] = useState(true);
  const [isSequential, setIsSequential] = useState(true);
  const [order, setOrder] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // إذا تغير نوع الدرس، نمسح الملفات غير المتوافقة (تنظيف)
  useEffect(() => {
    if (type !== lessonTypeMap.Video) {
      setVideoFile(null);
    }
    if (type !== lessonTypeMap.Pdf) {
      setPdfFile(null);
    }
    if (type !== lessonTypeMap.Text) {
      setContent('');
    }
  }, [type]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  // التحقق من الحقول الأساسية
  if (!title.trim()) {
    setError('يرجى إدخال عنوان الدرس');
    return;
  }
  if (type === lessonTypeMap.Text && !content.trim()) {
    setError('يرجى إدخال المحتوى النصي للدرس');
    return;
  }
  if (type === lessonTypeMap.Video && !videoFile) {
    setError('يرجى رفع ملف فيديو');
    return;
  }
  if (type === lessonTypeMap.Pdf && !pdfFile) {
    setError('يرجى رفع ملف PDF');
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append('Content', content);
formData.append('type', lessonTypeMap[type]);
    formData.append('Duration', duration);
    formData.append('IsFree', isFree);
    formData.append('IsSequential', isSequential);
    formData.append('Order', order);

    if (videoFile) formData.append('VideoFile', videoFile);
    
    // تحويل ملف PDF إلى base64 إذا كان موجودًا
    if (pdfFile) {
      const pdfBase64 = await convertFileToBase64(pdfFile);
      formData.append('PdfFileBase64', pdfBase64);
    }

    const response = await LessonsService.createLesson(courseId, formData);
    const newLessonId = response.data?.id || response.Data?.Id;
    navigate(`/courses/${courseId}/lessons/${newLessonId}`);
  } catch (err) {
      console.error('Create lesson error:', error);

    console.error(err);
    
    setError(err.response?.data?.message || 'فشل إنشاء الدرس، يرجى المحاولة لاحقًا');
  } finally {
    setLoading(false);
  }
};

// دالة مساعدة لتحويل الملف إلى base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};
  if (!user)
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 bg-red-50 rounded-lg shadow-md text-center text-red-700 font-semibold text-lg">
        🚫 غير مسموح بالدخول
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md ring-1 ring-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-6 border-b-2 border-indigo-600 pb-3">
        ➕ إنشاء درس جديد
      </h2>

      {error && (
        <p
          className="mb-5 bg-red-100 text-red-700 font-semibold px-3 py-2 rounded-md border border-red-300 shadow-sm text-sm"
          role="alert"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="أدخل عنوان الدرس"
            className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
            الوصف
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للدرس"
            rows={3}
            className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
            المحتوى النصي {type === lessonTypeMap.Text && <span className="text-red-500">*</span>}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="المحتوى التفصيلي للدرس"
            rows={5}
            required={type === lessonTypeMap.Text}
            className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none resize-y"
          />
        </div>

        {/* Type & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="type" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
              نوع الدرس <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none"
            >
              <option value={lessonTypeMap.Video}>فيديو</option>
              <option value={lessonTypeMap.Pdf}>PDF</option>
              <option value={lessonTypeMap.Text}>نص</option>
              <option value={lessonTypeMap.Quiz}>اختبار</option>
              <option value={lessonTypeMap.Mixed}>مختلط</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
              مدة الدرس (بالثواني) <span className="text-red-500">*</span>
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={0}
              required
              placeholder="مثال: 300"
              className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <label className="flex items-center space-x-2 text-gray-800 text-base sm:text-lg cursor-pointer">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>درس مجاني</span>
          </label>

          <label className="flex items-center space-x-2 text-gray-800 text-base sm:text-lg cursor-pointer">
            <input
              type="checkbox"
              checked={isSequential}
              onChange={(e) => setIsSequential(e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>درس متسلسل</span>
          </label>
        </div>

        {/* Order */}
        <div>
          <label htmlFor="order" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
            ترتيب الدرس <span className="text-red-500">*</span>
          </label>
          <input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            min={0}
            required
            placeholder="ترتيب ظهور الدرس"
            className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded-md shadow-sm transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 outline-none"
          />
        </div>

        {/* Video File */}
        {type === lessonTypeMap.Video && (
          <div>
            <label htmlFor="videoFile" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
              رفع ملف فيديو <span className="text-red-500">*</span>
            </label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="w-full text-gray-700"
            />
          </div>
        )}

        {/* PDF File */}
        <div>
          <label htmlFor="pdfFile" className="block mb-2 font-semibold text-gray-800 text-base sm:text-lg">
            رفع ملف PDF (اختياري)
          </label>
          <input
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-md transition"
        >
          {loading ? 'جارٍ الإنشاء...' : 'إنشاء الدرس'}
        </button>
      </form>
    </div>
  );
};

export default CreateLessonPage;
