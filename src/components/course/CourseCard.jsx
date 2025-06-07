// src/components/course/CourseCard.jsx

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
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await CourseService.deleteCourse(courseData.id);
      alert('Course deleted successfully');
      onDelete?.();
    } catch (error) {
      alert(error.message || 'Failed to delete course');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all">
      {courseData.imageUrl ? (
        <img
          src={`${baseUrl}${courseData.imageUrl}`}
          alt={courseData.name}
          className="h-48 w-full object-cover"
          onError={(e) => (e.target.src = '/default-course.jpg')}
        />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{courseData.name}</h2>
        {courseData.title && (
          <p className="text-sm text-gray-500 italic">{courseData.title}</p>
        )}
        <p className="text-gray-700 text-sm">
          {courseData.description?.substring(0, 100) || 'No description'}...
        </p>

        <div className="flex justify-between items-center mt-2">
          {courseData.isFree ? (
            <span className="text-blue-600 font-semibold">Free</span>
          ) : (
            <span className="text-lg font-bold text-green-600">${courseData.price}</span>
          )}
          <span className="text-yellow-500 text-sm">
            {'★'.repeat(Math.round(courseData.averageRating)) || '☆☆☆☆☆'}
          </span>
        </div>

        <div className="text-sm text-gray-500 mt-1">
          <div>Instructor: {courseData.instructorName || 'Unknown'}</div>
          <div>Created: {formattedDate}</div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              courseData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {courseData.isActive ? 'Active' : 'Inactive'}
          </span>

          <div className="flex gap-2">
            <Link to={`/courses/${courseData.id}`}>
              <button className="text-white bg-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-700">
                Details
              </button>
            </Link>

            {isInstructor && (
              <>
                <Link to={`/courses/edit/${courseData.id}`}>
                  <button className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300">
                    Edit
                  </button>
                </Link>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
