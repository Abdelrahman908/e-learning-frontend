// components/common/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useCourses } from '../../contexts/CourseContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({
  children,
  roles = [],
  redirectPath = '/login',
  requireCourseOwnership = false
}) => {
  const location = useLocation();
  const params = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { currentCourse, loading: courseLoading, fetchCourseById } = useCourses();
  
  const [isChecking, setIsChecking] = useState(true);
  const courseId = params.id || params.courseId || new URLSearchParams(location.search).get('courseId');

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        // 1. إذا كان مطلوب جلب بيانات الدورة
        if (requireCourseOwnership && courseId && !currentCourse) {
          await fetchCourseById(courseId);
        }
      } catch (error) {
        console.error('فشل في التحقق من الوصول:', error);
        toast.error('حدث خطأ أثناء التحقق من الصلاحيات');
      } finally {
        setIsChecking(false);
      }
    };

    verifyAccess();
  }, [requireCourseOwnership, courseId, currentCourse, fetchCourseById]);

  // 1. عرض التحميل أثناء الجلب الأولي للبيانات
  if (authLoading || isChecking) {
    return <LoadingSpinner fullScreen />;
  }

  // 2. التحقق من المصادقة
  if (!isAuthenticated) {
    localStorage.setItem('redirectPath', location.pathname + location.search);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 3. التحقق من الصلاحيات
  const userRole = user?.role?.toLowerCase();
  if (roles.length > 0 && !roles.includes(userRole)) {
    toast.error('ليس لديك صلاحية الوصول إلى هذه الصفحة');
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }

  // 4. التحقق من ملكية الدورة
  if (requireCourseOwnership) {
    if (!courseId) {
      toast.error('لم يتم تحديد دورة');
      return <Navigate to="/courses" replace />;
    }

    if (courseLoading) {
      return <LoadingSpinner fullScreen />;
    }

    if (currentCourse?.instructorId !== user.id) {
      toast.error('ليس لديك صلاحية التعديل على هذه الدورة');
      return <Navigate to="/not-authorized" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default React.memo(ProtectedRoute);