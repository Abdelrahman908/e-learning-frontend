import { useState, useEffect, useCallback } from 'react';
import CourseService from '../../services/courses';
import CourseCard from './CourseCard';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const ratings = [4, 4.5, 5, 4.2, 4.8]; // قيم ريتينج ثابتة حسب طلبك

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryId: null,
  });

  const { isInstructor } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await CourseService.getAllCourses({
        search: filters.searchTerm,
        categoryId: filters.categoryId,
      });

      setCourses(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'فشل في تحميل الكورسات.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, 700),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleCourseDeleted = () => {
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16 animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-xl mx-auto text-center font-semibold"
        role="alert"
      >
        خطأ: {error}
      </div>
    );

  return (
    <div className="course-list max-w-7xl mx-auto px-4 py-8">
      {/* حاوية البحث مع الزر */}
      <div className="filters mb-10 flex flex-col sm:flex-row sm:items-center justify-center gap-6">
        <input
          type="text"
          placeholder="ابحث عن كورسات..."
          value={searchValue}
          onChange={handleSearch}
          className="border border-gray-300 rounded-xl px-6 py-3 w-full sm:w-96 text-lg placeholder-gray-400
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent
            shadow-md hover:shadow-lg transition-shadow duration-300"
          aria-label="بحث عن كورسات"
        />

        {isInstructor() && (
          <button
            onClick={() => navigate('/courses/new')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold
              hover:from-indigo-700 hover:to-blue-600 transition-shadow shadow-lg whitespace-nowrap"
            aria-label="إضافة كورس جديد"
          >
            إضافة كورس جديد
          </button>
        )}
      </div>

      {/* لا توجد كورسات */}
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 mt-24 text-xl font-light select-none">
          لم يتم العثور على كورسات.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {courses.map((course, idx) =>
            (course?.id || course?.Id) ? (
              <CourseCard
                key={course.id || course.Id}
                course={{
                  ...course,
                  averageRating: ratings[idx % ratings.length], // ريتينج ثابت مع اسم مناسب
                }}
                onDelete={handleCourseDeleted}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
