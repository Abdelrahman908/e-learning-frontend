import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import CourseDetails from '../components/course/CourseDetails';
import Header from '../components/layout/Header';
import { Layout } from 'antd';

const { Content } = Layout;

const ViewCoursePage = () => {
  const { id } = useParams(); // assuming route is /courses/:id
  const navigate = useNavigate();

  const handleViewLessons = () => {
    navigate(`/courses/${id}/lessons`);
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header />

      <Content className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {/* تفاصيل الدورة */}
          <CourseDetails />

          {/* زر عرض الدروس */}
  <div className="flex justify-center my-6">
  <Button
    size="large"
    type="primary"
    onClick={handleViewLessons}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
  >
    عرض الدروس
  </Button>
</div>


        </div>
      </Content>
    </Layout>
  );
};

export default ViewCoursePage;
