import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, List, Typography, Space } from 'antd';
import { UserOutlined, BookOutlined, DollarOutlined } from '@ant-design/icons';
import dashboardService from '../../services/dashboard';

const { Title, Text } = Typography;

const fixedCourses = [
  { title: 'English', enrollmentDate: '2025-01-15', progress: 75 },
  { title: 'ASP.NET Core تعلم', enrollmentDate: '2025-02-20', progress: 50 },
  { title: 'python تعلم', enrollmentDate: '2025-03-10', progress: 85 },
];

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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: 1100, margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: '#1890ff' }}>
        لوحة تحكم الطالب
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable bordered={false} style={{ borderRadius: 12, boxShadow: '0 6px 12px rgb(0 0 0 / 0.1)' }}>
            <Statistic
              title="الكورسات المسجلة"
              value={dashboardData.EnrolledCourses}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold', fontSize: 30 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card hoverable bordered={false} style={{ borderRadius: 12, boxShadow: '0 6px 12px rgb(0 0 0 / 0.1)' }}>
            <Statistic
              title="إجمالي المدفوعات"
              value={dashboardData.TotalPaid}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              suffix="ج.م"
              valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: 30 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card hoverable bordered={false} style={{ borderRadius: 12, boxShadow: '0 6px 12px rgb(0 0 0 / 0.1)' }}>
            <Statistic
              title="الكورسات المكتملة"
              value={2}  // ثابت كما طلبت
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold', fontSize: 30 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
        <Col xs={24} md={12}>
          <Card
            title={<Text strong style={{ fontSize: 18, color: '#1890ff' }}>تقدم الكورسات</Text>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 6px 12px rgb(0 0 0 / 0.1)' }}
          >
            <Progress
              percent={60}  // 60% ثابت كما طلبت
              status="active"
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              strokeWidth={16}
              showInfo={false}
              style={{ borderRadius: 10 }}
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text strong style={{ fontSize: 16 }}>متوسط درجات الاختبارات:</Text>{' '}
              <Text style={{ fontSize: 16, color: '#3f8600' }}>60%</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card
            title={<Text strong style={{ fontSize: 18, color: '#1890ff' }}>آخر الكورسات</Text>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 6px 12px rgb(0 0 0 / 0.1)' }}
          >
            <List
              dataSource={fixedCourses}
              locale={{ emptyText: 'لا توجد كورسات مسجلة بعد' }}
              renderItem={item => (
                <List.Item
                  style={{
                    borderRadius: 8,
                    marginBottom: 12,
                    backgroundColor: '#f0f5ff',
                    padding: '12px 16px',
                    boxShadow: '0 2px 6px rgb(0 0 0 / 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'default'
                  }}
                >
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      تاريخ التسجيل: {item.enrollmentDate}
                    </Text>
                  </Space>
                  <Progress
                    type="circle"
                    percent={item.progress}
                    width={50}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
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
