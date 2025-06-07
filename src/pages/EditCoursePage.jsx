import { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/course/CourseForm';
import CourseService from '../services/courses'; // ✅ التعديل هنا
import Header from '../components/layout/Header';
import ProtectedRoute from '../components/common/ProtectedRoute';

const { Content } = Layout;

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await CourseService.getCourseById(id); // ✅
        setInitialValues(course);
      } catch (error) {
        message.error('فشل في تحميل بيانات الدورة');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      if (values.Image) {
        await CourseService.updateCourseWithImage(id, values); // ✅
      } else {
        await CourseService.updateCourse(id, values); // ✅
      }
      message.success('تم تحديث الدورة بنجاح!');
      navigate(`/courses/${id}`);
    } catch (error) {
      message.error(error.message || 'فشل في تحديث الدورة');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute roles={['Instructor']}>
      <Layout>
        <Header />
        <Content className="p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">تعديل الدورة</h1>
            <CourseForm 
              initialValues={initialValues} 
              onSubmit={handleSubmit} 
              isEdit 
            />
          </div>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditCoursePage;
