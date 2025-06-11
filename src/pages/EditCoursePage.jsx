import { useState, useEffect } from 'react';
import { Layout, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/course/CourseForm';
import CourseService from '../services/courses';
import Header from '../components/layout/Header';

const { Content } = Layout;

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await CourseService.getCourseById(id);
        setInitialValues({
          ...course,
          categoryId: course.categoryId ?? undefined, // حل التحذير
        });
      } catch (error) {
        message.error('فشل في تحميل بيانات الدورة');
        navigate('/dashboard/my-courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await CourseService.updateCourseWithImage(id, formData);
      message.success('تم تحديث الدورة بنجاح!');
      navigate(`/dashboard/my-courses`);
    } catch (error) {
      message.error(error.response?.data?.message || 'فشل في تحديث الدورة');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="جارٍ التحميل..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f7ff' }}>
      <Header />
      <Content className="p-8 max-w-5xl mx-auto">
        <div
          className="bg-white p-8 rounded-2xl shadow-lg"
          style={{ boxShadow: '0 15px 40px rgba(92, 106, 196, 0.15)' }}
        >
          <h1
            className="text-3xl font-extrabold mb-8 text-indigo-700"
            style={{ letterSpacing: '0.05em' }}
          >
            تعديل الدورة
          </h1>

          <CourseForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEdit
            courseId={id}
            buttonStyle={{
              borderRadius: '10px',
              fontWeight: '700',
              padding: '12px 32px',
              backgroundColor: '#5c6ac4',
              borderColor: '#5c6ac4',
              boxShadow: '0 8px 20px rgba(92, 106, 196, 0.3)',
              transition: 'all 0.3s ease',
              color: 'white',
              cursor: 'pointer',
            }}
            buttonHoverStyle={{
              backgroundColor: '#4855a9',
              borderColor: '#4855a9',
              boxShadow: '0 10px 30px rgba(72, 85, 169, 0.6)',
            }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default EditCoursePage;
