import { Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CourseForm from './../components/course/CourseForm';
import { createCourse } from './../services/courses';
import Header from '../components/layout/Header';
import ProtectedRoute from '../components/common/ProtectedRoute';

const { Content } = Layout;

const AddCoursePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await createCourse(values);
      message.success('Course created successfully!');
      navigate('/courses');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <ProtectedRoute roles={['Instructor']}>
      <Layout>
        <AppHeader />
        <Content className="p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
            <CourseForm onSubmit={handleSubmit} />
          </div>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
};

export default AddCoursePage;