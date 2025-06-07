import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Progress } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  MoneyCollectOutlined 
} from '@ant-design/icons';
import dashboardService from '../../services/dashboard';

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getInstructorDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  // بيانات جدول الكورسات
  const coursesData = [
    { id: 1, title: 'البرمجة بلغة Python', students: 45, revenue: 4500, rating: 4.7 },
    { id: 2, title: 'تطوير تطبيقات الجوال', students: 32, revenue: 3200, rating: 4.8 },
    { id: 3, title: 'تعلم الآلة', students: 28, revenue: 4200, rating: 4.9 },
  ];

  const columns = [
    { title: 'اسم الكورس', dataIndex: 'title', key: 'title' },
    { title: 'عدد الطلاب', dataIndex: 'students', key: 'students' },
    { title: 'الإيرادات', dataIndex: 'revenue', key: 'revenue', render: text => `${text} ج.م` },
    { 
      title: 'التقييم', 
      dataIndex: 'rating', 
      key: 'rating',
      render: rating => (
        <Progress percent={rating * 20} status="active" format={() => rating} />
      )
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>لوحة تحكم المدرس</h1>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="عدد الكورسات"
              value={dashboardData.CoursesCount}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card>
            <Statistic
              title="إجمالي الطلاب"
              value={dashboardData.TotalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card>
            <Statistic
              title="إجمالي الأرباح"
              value={dashboardData.TotalEarnings}
              prefix={<MoneyCollectOutlined />}
              suffix="ج.م"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="الكورسات الخاصة بك">
            <Table 
              dataSource={coursesData} 
              columns={columns} 
              pagination={false} 
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="الإيرادات الشهرية">
            <div style={{ height: '300px', textAlign: 'center' }}>
              <p>رسم بياني سيظهر هنا</p>
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="أحدث التعليقات">
            <div style={{ padding: '16px' }}>
              <p>"الكورس رائع، شرح ممتاز!"</p>
              <p>- أحمد محمد</p>
              <div style={{ marginTop: '16px' }}>
                <p>"تمارين عملية مفيدة جداً"</p>
                <p>- سارة عبد الله</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorDashboard;