import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, List } from 'antd';
import { UserOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import dashboardService from '../../services/dashboard';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getStudentDashboard();
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

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>لوحة تحكم الطالب</h1>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="الكورسات المسجلة"
              value={dashboardData.EnrolledCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card>
            <Statistic
              title="إجمالي المدفوعات"
              value={dashboardData.TotalPaid}
              prefix={<DollarOutlined />}
              suffix="ج.م"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card>
            <Statistic
              title="الكورسات المكتملة"
              value={dashboardData.CompletedCourses || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="تقدم الكورسات">
            <Progress
              percent={dashboardData.AverageQuizScore || 0}
              status="active"
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p>متوسط درجات الاختبارات: {dashboardData.AverageQuizScore || 0}%</p>
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="آخر الكورسات">
            <List
              dataSource={dashboardData.Courses || []}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`تاريخ التسجيل: ${item.enrollmentDate}`}
                  />
                  <div>{item.progress}%</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;