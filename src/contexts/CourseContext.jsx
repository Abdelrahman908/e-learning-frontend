// src/contexts/CourseContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CourseService from '../services/courses';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState({
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
    filters: {
      searchTerm: '',
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      page: 1,
      pageSize: 10,
      sortBy: 'newest',
    },
    pagination: {
      totalCount: 0,
      totalPages: 1,
    },
  });

  const setLoading = (loading) => setState(prev => ({ ...prev, loading }));
  const setError = (error) => setState(prev => ({ ...prev, error }));

  const fetchCourses = useCallback(async (filters = state.filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const { courses, totalCount, totalPages } = await CourseService.getAllCourses(filters);
      
      setState(prev => ({
        ...prev,
        courses,
        filters,
        pagination: { totalCount, totalPages },
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [state.filters]);

  const fetchCourseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const course = await CourseService.getCourseById(id);
      setState(prev => ({ ...prev, currentCourse: course }));
      return course;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInstructorCourses = useCallback(async () => {
    if (!user || user.role !== 'Instructor') return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const courses = await CourseService.getInstructorCourses(user.id, state.filters);
      setState(prev => ({ ...prev, courses }));
      return courses;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, state.filters]);

  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCourse = await CourseService.createCourse({
        ...courseData,
        instructorId: user.id,
      });
      
      setState(prev => ({
        ...prev,
        courses: [newCourse, ...prev.courses],
      }));
      
      return newCourse;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateCourse = useCallback(async (id, courseData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCourse = courseData.imageFile 
        ? await CourseService.updateCourseWithImage(id, courseData)
        : await CourseService.updateCourse(id, courseData);
      
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(c => 
          c.id === id ? updatedCourse : c
        ),
        currentCourse: prev.currentCourse?.id === id 
          ? updatedCourse 
          : prev.currentCourse,
      }));
      
      return updatedCourse;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await CourseService.deleteCourse(id);
      
      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(c => c.id !== id),
        currentCourse: prev.currentCourse?.id === id 
          ? null 
          : prev.currentCourse,
      }));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const clearCurrentCourse = useCallback(() => {
    setState(prev => ({ ...prev, currentCourse: null }));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <CourseContext.Provider value={{
      ...state,
      fetchCourses,
      fetchCourseById,
      fetchInstructorCourses,
      createCourse,
      updateCourse,
      deleteCourse,
      updateFilters,
      clearCurrentCourse,
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};