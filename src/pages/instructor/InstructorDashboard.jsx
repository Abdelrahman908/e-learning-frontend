import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Progress, Typography, Divider, Space } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import dashboardService from '../../services/dashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

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

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</div>;

  const coursesData = [
    { id: 1, title: 'البرمجة بلغة Python', students: 45, revenue: 4500, rating: 4.7 },
    { id: 2, title: 'تطوير تطبيقات الجوال', students: 32, revenue: 3200, rating: 4.8 },
    { id: 3, title: 'تعلم الآلة', students: 28, revenue: 4200, rating: 4.9 },
  ];

  const columns = [
    { title: 'اسم الكورس', dataIndex: 'title', key: 'title' },
    { title: 'عدد الطلاب', dataIndex: 'students', key: 'students' },
    {
      title: 'الإيرادات',
      dataIndex: 'revenue',
      key: 'revenue',
      render: text => <Text strong>{text} ج.م</Text>
    },
    {
      title: 'التقييم',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => (
        <Progress
          percent={rating * 20}
          status="active"
          strokeColor={{ from: '#108ee9', to: '#87d068' }}
          format={() => rating}
        />
      )
    },
  ];

  const earningsData = [
    { month: 'يناير', value: dashboardData.TotalEarnings * 0.7 },
    { month: 'فبراير', value: dashboardData.TotalEarnings * 0.8 },
    { month: 'مارس', value: dashboardData.TotalEarnings * 0.9 },
    { month: 'أبريل', value: dashboardData.TotalEarnings },
    { month: 'مايو', value: dashboardData.TotalEarnings * 1.1 },
    { month: 'يونيو', value: dashboardData.TotalEarnings * 1.2 },
  ];

  return (
    <div style={{ padding: '32px', background: '#f0f2f5', minHeight: '100vh', fontFamily: 'Cairo, sans-serif' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: '#333' }}>
        لوحة تحكم المدرّس
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card bordered={false} hoverable style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="عدد الكورسات"
              value={dashboardData.CoursesCount}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} hoverable style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="إجمالي الطلاب"
              value={dashboardData.TotalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} hoverable style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Statistic
              title="إجمالي الأرباح"
              value={dashboardData.TotalEarnings}
              prefix={<MoneyCollectOutlined />}
              suffix="ج.م"
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider style={{ marginTop: 40 }} />

      <Card
        title="الكورسات الخاصة بك"
        bordered={false}
        style={{ borderRadius: 16, marginTop: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <Table
          dataSource={coursesData}
          columns={columns}
          pagination={false}
          rowKey="id"
        />
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card
            title="الإيرادات الشهرية"
            bordered={false}
            style={{ borderRadius: 16, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#722ed1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="أحدث التعليقات"
            bordered={false}
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Space direction="vertical" size="large" style={{ padding: 8 }}>
              <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
                <Text>"الكورس رائع، شرح ممتاز!"</Text>
                <br />
                <Text type="secondary">- أحمد محمد</Text>
              </div>
              <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
                <Text>"تمارين عملية مفيدة جداً"</Text>
                <br />
                <Text type="secondary">- سارة عبد الله</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorDashboard;
