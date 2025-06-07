// src/components/course/CourseList.jsx

import { useState, useEffect, useCallback } from 'react';
import CourseService from '../../services/courses';
import CourseCard from './CourseCard';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

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
      setError(err.message || 'Failed to load courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, 800),
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
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );

  return (
    <div className="course-list">
      <div className="filters mb-4 flex gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchValue}
          onChange={handleSearch}
          className="border border-gray-300 rounded px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isInstructor() && (
          <button
            onClick={() => navigate('/courses/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) =>
            course?.id || course?.Id ? (
              <CourseCard
                key={course.id || course.Id}
                course={course}
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
