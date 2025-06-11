import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import CourseService from '../../services/courses';

const CourseCard = ({ course, onDelete }) => {
  const { user } = useContext(AuthContext);

  if (!course?.id && !course?.Id) return null;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7056';

  const courseData = {
    id: course.id || course.Id,
    name: course.name || course.Name,
    title: course.title || course.Title,
    description: course.description || course.Description,
    price: course.price || course.Price,
    isFree: course.isFree ?? course.IsFree ?? false,
    isActive: course.isActive ?? course.IsActive ?? true,
    instructorId: course.instructorId || course.InstructorId,
    instructorName: course.instructorName || course.InstructorName,
    imageUrl: course.imageUrl || course.ImageUrl,
    createdAt: course.createdAt || course.CreatedAt,
    averageRating: course.averageRating || course.AverageRating || 0,
  };

  const formattedDate = courseData.createdAt
    ? dayjs(courseData.createdAt).format('MMM D, YYYY')
    : 'Unknown date';

  const isInstructor =
    user?.role === 'Instructor' &&
    (user?.sub === courseData.instructorId || user?.userId === courseData.instructorId);

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الكورس؟')) return;
    try {
      await CourseService.deleteCourse(courseData.id);
      alert('تم حذف الكورس بنجاح');
      onDelete?.();
    } catch (error) {
      alert(error.message || 'فشل في حذف الكورس');
    }
  };

  // دالة ترجع نجوم نصفية وممتلئة حسب التقييم العشري (مثلاً 4.5)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // نجمة ممتلئة
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
          </svg>
        );
      } else if (rating >= i - 0.5) {
        // نجمة نصف ممتلئة
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`halfGrad${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#halfGrad${i})`}
              d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z"
            />
          </svg>
        );
      } else {
        // نجمة فارغة
        stars.push(
          <svg
            key={i}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden transform hover:-translate-y-1">
      {/* صورة الكورس مع تأثير التدرج اللوني */}
      {courseData.imageUrl ? (
        <div className="relative h-52 w-full overflow-hidden rounded-t-3xl">
          <img
            src={`${baseUrl}${courseData.imageUrl}`}
            alt={courseData.name}
            className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
            onError={(e) => (e.target.src = '/default-course.jpg')}
          />
          {/* تراكب تدرج لإبراز النص */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-semibold rounded-t-3xl">
          لا توجد صورة
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <h2
          className="text-2xl font-bold text-gray-900 mb-1 truncate"
          title={courseData.name}
        >
          {courseData.name}
        </h2>
        {courseData.title && (
          <p
            className="text-sm text-indigo-600 italic mb-3 truncate"
            title={courseData.title}
          >
            {courseData.title}
          </p>
        )}

        <p className="text-gray-700 text-sm flex-grow leading-relaxed mb-5">
          {(courseData.description?.length > 130
            ? courseData.description.substring(0, 130) + '...'
            : courseData.description) || 'لا يوجد وصف'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {courseData.isFree ? (
              <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full select-none whitespace-nowrap">
                مجاني
              </span>
            ) : (
              <span className="text-lg font-extrabold text-green-700 select-none whitespace-nowrap">
                ${courseData.price}
              </span>
            )}

            <div
              className="flex items-center gap-1 select-none"
              title={`تقييم ${courseData.averageRating.toFixed(1)}`}
            >
              {renderStars(courseData.averageRating)}
              <span className="text-gray-800 font-semibold text-sm ml-1 whitespace-nowrap">
                {courseData.averageRating.toFixed(1)}/5
              </span>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full select-none whitespace-nowrap ${
              courseData.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {courseData.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4 text-gray-600 text-sm space-y-1">
          <div>
            المدرس:{' '}
            <span className="font-medium">
              {courseData.instructorName || 'غير معروف'}
            </span>
          </div>
          <div>
            تاريخ الإنشاء:{' '}
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Link to={`/courses/${courseData.id}`}>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
              التفاصيل
            </button>
          </Link>

          {isInstructor && (
            <div className="flex gap-3">
              <Link to={`/courses/edit/${courseData.id}`}>
                <button className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-400 transition shadow-sm">
                  تعديل
                </button>
              </Link>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
              >
                حذف
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
