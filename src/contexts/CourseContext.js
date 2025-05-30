import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import courseService from '../services/courses';
import categoryService from '../services/categories';
import { useAuth } from '../hooks/useAuth';

// Create the context
const CourseContext = createContext();

// Export the hook for consuming the context
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

// Provider component
export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [filters, setFilters] = useState({
    categoryId: null,
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { user } = useAuth();

  // Fetch all courses with optional filters
  const fetchCourses = useCallback(async (filterParams = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses(filterParams);
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
      console.error('Error in fetchCourses:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch course by ID
  const fetchCourseById = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourseById(courseId);
      setCurrentCourse(data);
      return data;
    } catch (err) {
      setError('Failed to fetch course details. Please try again.');
      console.error('Error in fetchCourseById:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch instructor courses
  const fetchInstructorCourses = useCallback(async () => {
    if (!user || user.role !== 'Instructor') {
      return [];
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getInstructorCourses();
      return data;
    } catch (err) {
      setError('Failed to fetch your courses. Please try again.');
      console.error('Error in fetchInstructorCourses:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create new course
  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.createCourse(courseData);
      fetchCourses(); // Refresh courses after creating
      return data;
    } catch (err) {
      setError('Failed to create course. Please try again.');
      console.error('Error in createCourse:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses]);

  // Update course
  const updateCourse = useCallback(async (courseId, courseData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.updateCourse(courseId, courseData);
      fetchCourses(); // Refresh courses after updating
      
      // Update current course if it's the one being updated
      if (currentCourse && currentCourse.id === courseId) {
        setCurrentCourse(prev => ({ ...prev, ...courseData }));
      }
      
      return data;
    } catch (err) {
      setError('Failed to update course. Please try again.');
      console.error('Error in updateCourse:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, currentCourse]);

  // Update course with image
  const updateCourseWithImage = useCallback(async (courseId, courseData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.updateCourseWithImage(courseId, courseData);
      fetchCourses(); // Refresh courses after updating
      
      // Refresh course details if it's the one being viewed
      if (currentCourse && currentCourse.id === courseId) {
        fetchCourseById(courseId);
      }
      
      return data;
    } catch (err) {
      setError('Failed to update course. Please try again.');
      console.error('Error in updateCourseWithImage:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, currentCourse, fetchCourseById]);

  // Delete course
  const deleteCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.deleteCourse(courseId);
      // Remove the course from state
      setCourses(prev => prev.filter(course => course.id !== courseId));
      return true;
    } catch (err) {
      setError('Failed to delete course. Please try again.');
      console.error('Error in deleteCourse:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      return data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Load courses and categories on mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  // Re-fetch courses when filters change
  useEffect(() => {
    fetchCourses(filters);
  }, [filters, fetchCourses]);

  // Context value
  const value = {
    courses,
    categories,
    loading,
    error,
    currentCourse,
    filters,
    fetchCourses,
    fetchCourseById,
    fetchInstructorCourses,
    createCourse,
    updateCourse,
    updateCourseWithImage,
    deleteCourse,
    fetchCategories,
    updateFilters,
    setCurrentCourse,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export default CourseContext;