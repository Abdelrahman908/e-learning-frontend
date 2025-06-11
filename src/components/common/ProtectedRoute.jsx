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
  const [errorMessage, setErrorMessage] = useState(null);
  const [redirect, setRedirect] = useState(null);

  const courseId =
    params.id || params.courseId || new URLSearchParams(location.search).get('courseId');

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (requireCourseOwnership && courseId && !currentCourse) {
          await fetchCourseById(courseId);
        }
      } catch (error) {
        console.error('فشل في التحقق من الوصول:', error);
        setErrorMessage('حدث خطأ أثناء التحقق من الصلاحيات');
        setRedirect('/not-authorized');
      } finally {
        setIsChecking(false);
      }
    };

    verifyAccess();
  }, [requireCourseOwnership, courseId, currentCourse, fetchCourseById]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      setErrorMessage(null);
    }
  }, [errorMessage]);

  if (authLoading || isChecking || courseLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (redirect) {
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    localStorage.setItem('redirectPath', location.pathname + location.search);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // ✅ مقارنة مرنة غير حساسة لحالة الأحرف
  const userRole = user?.role?.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (roles.length > 0 && !allowedRoles.includes(userRole)) {
    setErrorMessage('ليس لديك صلاحية الوصول إلى هذه الصفحة');
    setRedirect('/not-authorized');
    return null;
  }

  if (requireCourseOwnership) {
    if (!courseId) {
      setErrorMessage('لم يتم تحديد دورة');
      setRedirect('/courses');
      return null;
    }

    if (String(currentCourse?.instructorId) !== String(user.id)) {
  setErrorMessage('ليس لديك صلاحية التعديل على هذه الدورة');
  setRedirect('/not-authorized');
  return null;
}

  }

  return children;
};

export default React.memo(ProtectedRoute);
