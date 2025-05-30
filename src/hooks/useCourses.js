import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import api from '../services/courses';

export const useCourses = (filters, isInstructorView = false) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let response;
        
        if (isInstructorView) {
          response = await api.getInstructorCourses(user.id, filters);
        } else {
          response = await api.getAllCourses(filters);
        }
        
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, user, isInstructorView]);

  return { courses, loading, error, totalPages };
};