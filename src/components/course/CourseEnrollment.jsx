import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CourseService from '../../services/courses';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CourseEnrollment = ({ course, isEnrolled, isInstructor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${course.id}` } });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (course.price > 0) {
        // Redirect to payment page
        navigate(`/checkout/${course.id}`);
      } else {
        // Free course - enroll directly
        await CourseService.enrollInCourse(course.id);
        setSuccess('تم تسجيلك في الدورة بنجاح!');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في التسجيل في الدورة');
    } finally {
      setLoading(false);
    }
  };

  if (isInstructor) {
    return (
      <div className="enrollment-box instructor-view">
        <h3>إحصائيات الدورة</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{course.enrollmentCount || 0}</span>
            <span className="stat-label">طلاب مسجلين</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{course.lessonCount || 0}</span>
            <span className="stat-label">درس</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{course.averageRating || 0}</span>
            <span className="stat-label">تقييم</span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/instructor/courses/${course.id}/manage`)}
        >
          إدارة الدورة
        </button>
      </div>
    );
  }

  return (
    <div className="enrollment-box">
      {isEnrolled ? (
        <>
          <h3>أنت مسجل في هذه الدورة</h3>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/learning/${course.id}`)}
          >
            متابعة التعلم
          </button>
        </>
      ) : (
        <>
          <h3>اشترك في الدورة</h3>
          <div className="price-display">
            {course.price > 0 ? (
              <>
                <span className="current-price">{course.price} ج.م</span>
                {course.originalPrice > course.price && (
                  <span className="original-price">{course.originalPrice} ج.م</span>
                )}
              </>
            ) : (
              <span className="free-label">مجاني</span>
            )}
          </div>
          
          {error && <div className="message message-error">{error}</div>}
          {success && <div className="message message-success">{success}</div>}
          
          <button 
            className="btn btn-primary"
            onClick={handleEnroll}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <span>{course.price > 0 ? 'اشترك الآن' : 'سجل مجاناً'}</span>
            )}
          </button>
          
          <div className="enrollment-features">
            <h4>تشمل هذه الدورة:</h4>
            <ul>
              <li>وصول كامل مدى الحياة</li>
              <li>شهادة إتمام</li>
              <li>تمارين عملية</li>
              <li>دعم من المدرب</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseEnrollment;