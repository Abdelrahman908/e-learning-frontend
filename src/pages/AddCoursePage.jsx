// src/pages/AddCoursePage.jsx
import { Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CourseForm from './../components/course/CourseForm';
import CourseService from './../services/courses';
import Header from '../components/layout/Header';

const { Content } = Layout;

const AddCoursePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await CourseService.createCourse(formData);
      message.success("تم إنشاء الكورس بنجاح");
      navigate("/dashboard/my-courses");
    } catch (error) {
      message.error(error?.response?.data?.message || "فشل في إنشاء الكورس");
    }
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Content className="flex justify-center items-start pt-10 px-4">
        <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 إضافة دورة جديدة</h1>
            <p className="text-gray-500">يرجى تعبئة الحقول أدناه لإضافة دورة جديدة إلى النظام.</p>
          </div>
          <CourseForm onSubmit={handleSubmit} />
        </div>
      </Content>
    </Layout>
  );
};

export default AddCoursePage;
