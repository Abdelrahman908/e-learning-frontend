import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CourseService from '../../services/courses';
import {
  Card,
  Button,
  Space,
  Tag,
  Divider,
  Spin,
  Alert,
  Descriptions,
  Modal
} from 'antd';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  const { isInstructor, user, token } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await CourseService.getCourseById(id);
        setCourse(courseData);
      } catch (err) {
        setError(err.message || 'فشل في تحميل بيانات الدورة');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (!token) {
      setCheckingEnrollment(false);
      return;
    }

    const fetchEnrollment = async () => {
      try {
        setCheckingEnrollment(true);
        const enrollmentData = await CourseService.isEnrolled(id);
        setEnrollmentStatus(enrollmentData.isEnrolled);
      } catch (err) {
        console.warn('فشل التحقق من التسجيل:', err);
        setEnrollmentStatus(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    fetchEnrollment();
  }, [token, id]);

  const handleEnroll = async () => {
    try {
      if (course.isFree) {
        await CourseService.enroll(course.id);
        setEnrollmentStatus(true);
        Modal.success({
          title: 'تم التسجيل بنجاح',
          content: 'يمكنك الآن البدء في دراسة الدورة',
          okText: 'الذهاب للدورة',
          onOk: () => navigate(`/learn/${course.id}`)
        });
      } else {
        navigate(`/courses/${course.id}/payment`);
      }
    } catch (err) {
      Modal.error({
        title: 'خطأ في التسجيل',
        content: err.message || 'حدث خطأ أثناء محاولة التسجيل',
      });
    }
  };

  if (loading) return <Spin size="large" className="flex justify-center mt-8" />;
  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;
  if (!course) return <Alert message="الكورس غير موجود" type="error" showIcon className="m-4" />;

  const canEdit = isInstructor() &&
    (user?.sub === course.instructorId || user?.userId === course.instructorId);

  const formattedDate = course.createdAt && dayjs(course.createdAt).isValid()
    ? dayjs(course.createdAt).format('YYYY-MM-DD')
    : 'تاريخ غير معروف';

  // ✅ تأكد أن VITE_API_BASE_URL تنتهي بـ /
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fullBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const imageSrc = course.imageUrl
    ? (course.imageUrl.startsWith('http')
      ? course.imageUrl
      : `${fullBaseUrl}${course.imageUrl.startsWith('/') ? course.imageUrl.slice(1) : course.imageUrl}`)
    : '/default-course.jpg';

  return (
    <div className="course-details p-4 max-w-6xl mx-auto">
      <Card
        title={<h1 className="text-2xl font-bold">{course.name}</h1>}
        cover={
          <img
            alt={course.name}
            src={imageSrc}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-course.jpg';
              e.target.className = 'w-full h-64 object-contain bg-gray-100 p-4';
            }}
          />
        }
        className="shadow-md"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="الوصف">
                {course.description || 'لا يوجد وصف'}
              </Descriptions.Item>
              <Descriptions.Item label="التصنيف">
                {course.categoryName || 'غير محدد'}
              </Descriptions.Item>
              <Descriptions.Item label="المدرس">
                {course.instructorName || 'غير محدد'}
              </Descriptions.Item>
              <Descriptions.Item label="تاريخ الإنشاء">
                {formattedDate}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div className="md:w-80 flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">حالة الدورة</h3>
              <Tag color={course.isActive ? 'green' : 'red'} className="text-lg">
                {course.isActive ? 'مفعلة' : 'غير مفعلة'}
              </Tag>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">السعر</h3>
              <p className="text-2xl font-bold text-blue-600">
                {course.price > 0 ? `$${course.price}` : 'مجاني'}
              </p>
            </div>

            <div className="mt-auto">
              <Space direction="vertical" className="w-full">
                {canEdit ? (
                  <Link to={`/courses/edit/${course.id}`} className="w-full">
                    <Button type="primary" block size="large">
                      تعديل الدورة
                    </Button>
                  </Link>
                ) : enrollmentStatus ? (
                  <Link to={`/learn/${course.id}`} className="w-full">
                    <Button type="primary" block size="large">
                      استمر في التعلم
                    </Button>
                  </Link>
                ) : (
                 <button
  onClick={handleEnroll}
  disabled={checkingEnrollment || !course.isActive}
  className={`
    w-full py-3 rounded-xl text-white text-lg font-semibold transition
    ${!course.isActive
      ? 'bg-gray-400 cursor-not-allowed'
      : checkingEnrollment
      ? 'bg-blue-400 cursor-wait'
      : 'bg-blue-600 hover:bg-blue-700'}
  `}
>
  {checkingEnrollment
    ? 'جاري التحقق...'
    : course.isFree
    ? 'سجل الآن'
    : 'إدفع وسجل'}
</button>

                )}

                <Link to="/courses" className="w-full">
                  <Button
                    block
                    size="large"
                    className="bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    العودة للقائمة
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
