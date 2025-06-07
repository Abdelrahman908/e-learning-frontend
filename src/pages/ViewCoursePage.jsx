import { Layout } from 'antd';
import CourseDetails from '../components/course/CourseDetails';
import Header from '../components/layout/Header';

const { Content } = Layout;

const ViewCoursePage = () => {
  return (
    <Layout className="min-h-screen bg-gray-100">
      {/* رأس الصفحة المخصص */}
      <Header />

      <Content className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* تفاصيل الدورة */}
          <CourseDetails />
        </div>
      </Content>
    </Layout>
  );
};

export default ViewCoursePage;
