import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../../services/courses';
import { setCourses } from '../../store/slices/courseSlice';
import CoursesList from '../../components/course/CoursesList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const StudentCourses = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.course);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'student') {
      loadEnrolledCourses();
    }
  }, [user]);

  const loadEnrolledCourses = async () => {
    try {
      const response = await fetchEnrolledCourses(user.id);
      dispatch(setCourses(response.data));
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    }
  };

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="container py-4">
      <h2 className="mb-4">الكورسات المسجلة</h2>
      
      {courses.length === 0 ? (
        <EmptyState
          title="لا يوجد كورسات مسجلة"
          description="يمكنك تصفح الكورسات المتاحة وتسجيل في كورسات جديدة"
          actionText="تصفح الكورسات"
          onAction={() => window.location.href = '/courses'}
        />
      ) : (
        <CoursesList 
          courses={courses} 
          showProgress={true}
          isStudent={true}
        />
      )}
    </div>
  );
};

export default StudentCourses;