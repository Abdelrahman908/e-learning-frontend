import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, deleteCourse } from '../../services/courses';
import { setCourses } from '../../store/slices/courseSlice';
import CoursesList from '../../components/course/CoursesList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading } = useSelector((state) => state.course);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const response = await fetchAllCourses();
      dispatch(setCourses(response.data));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      loadCourses(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/admin/courses/edit/${courseId}`);
  };

  if (loading) return <LoadingSpinner fullscreen />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>إدارة الكورسات</h2>
        <Button onClick={() => navigate('/admin/courses/new')}>
          إضافة كورس جديد
        </Button>
      </div>

      <CoursesList
        courses={courses}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminCourses;