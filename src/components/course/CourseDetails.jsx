import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CourseService from '../../services/courses';
import {
  Card,
  Button,
  Space,
  Tag,
  Descriptions,
  Spin,
  Alert,
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

  const { isInstructor, user, token, isAdmin } = useAuth();

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
      setEnrollmentStatus(false);
      return;
    }

    const fetchEnrollment = async () => {
      try {
        setCheckingEnrollment(true);
        const isEnrolled = await CourseService.isEnrolled(id);
        setEnrollmentStatus(isEnrolled);
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

  if (loading) return <Spin size="large" className="flex justify-center mt-12" />;
  if (error) return <Alert message={error} type="error" showIcon className="m-4" />;
  if (!course) return <Alert message="الكورس غير موجود" type="error" showIcon className="m-4" />;

  const canEdit = isInstructor() &&
    (user?.sub === course.instructorId || user?.userId === course.instructorId);

  const canChat = enrollmentStatus || canEdit || isAdmin?.();

  const formattedDate = course.createdAt && dayjs(course.createdAt).isValid()
    ? dayjs(course.createdAt).format('YYYY-MM-DD')
    : 'تاريخ غير معروف';

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fullBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const imageSrc = course.imageUrl
    ? (course.imageUrl.startsWith('http')
      ? course.imageUrl
      : `${fullBaseUrl}${course.imageUrl.startsWith('/') ? course.imageUrl.slice(1) : course.imageUrl}`)
    : '/default-course.jpg';

  const handleChatClick = () => {
    navigate(`/courses/${course.id}/chat`);
  };

  return (
    <div className="course-details p-6 max-w-7xl mx-auto">
      <Card
        bordered={false}
        className="rounded-3xl shadow-lg overflow-hidden"
        title={
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {course.name}
          </h1>
        }
        cover={
          <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl shadow-inner">
            <img
              alt={course.name}
              src={imageSrc}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-course.jpg';
                e.target.className = 'w-full h-full object-contain bg-gray-100 p-6';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-8">
              <Tag
                color={course.isActive ? 'green' : 'red'}
                className="text-lg font-semibold"
              >
                {course.isActive ? 'مفعلة' : 'غير مفعلة'}
              </Tag>
            </div>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row gap-10">
          {/* الوصف والتفاصيل */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-inner">
            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{ fontWeight: '600', color: '#374151' }}
              contentStyle={{ color: '#4B5563', fontSize: '1rem' }}
            >
              <Descriptions.Item label="الوصف">
                <p className="whitespace-pre-line">{course.description || 'لا يوجد وصف'}</p>
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

          {/* الجهة اليمنى - السعر، التسجيل، أزرار */}
          <div className="md:w-96 flex flex-col gap-6">
            <div className="bg-blue-50 p-5 rounded-xl shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">السعر</h3>
              <p className="text-4xl font-extrabold text-blue-600">
                {course.price > 0 ? `$${course.price}` : 'مجاني'}
              </p>
            </div>

            <Space direction="vertical" className="w-full">
              {canEdit ? (
                <Link to={`/courses/edit/${course.id}`} className="w-full">
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="rounded-xl font-bold shadow-lg hover:shadow-xl"
                  >
                    تعديل الدورة
                  </Button>
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={checkingEnrollment || !course.isActive}
                  className={`
                    w-full py-4 rounded-xl text-white text-lg font-extrabold transition-all duration-300
                    ${!course.isActive
                      ? 'bg-gray-400 cursor-not-allowed'
                      : checkingEnrollment
                        ? 'bg-blue-400 cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'}
                  `}
                >
                  {checkingEnrollment
                    ? 'جاري التحقق...'
                    : course.isFree
                      ? 'سجل الآن'
                      : 'إدفع وسجل'}
                </button>
              )}

              {canChat && (
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={handleChatClick}
                  className="mt-4 rounded-xl font-semibold border-blue-600 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
                  icon={<span style={{ fontSize: '22px' }}>💬</span>}
                >
                  دردشة الدورة
                </Button>
              )}

              <Link to="/courses" className="w-full">
                <Button
                  block
                  size="large"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold shadow-sm"
                >
                  العودة للقائمة
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
