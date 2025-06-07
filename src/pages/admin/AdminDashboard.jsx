import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Table, 
  Progress,
  Avatar,
  Tag 
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined
} from '@ant-design/icons';
import dashboardService from '../../services/dashboard';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getAdminDashboard();
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

  // بيانات الجداول
  const topCoursesData = [
    { id: 1, title: 'الذكاء الاصطناعي', revenue: 12000, students: 120, rating: 4.9 },
    { id: 2, title: 'تطوير الويب', revenue: 9800, students: 98, rating: 4.8 },
    { id: 3, title: 'علم البيانات', revenue: 8500, students: 85, rating: 4.7 },
  ];

  const recentUsersData = [
    { id: 1, name: 'محمد أحمد', role: 'طالب', date: '2023-10-01' },
    { id: 2, name: 'سارة خالد', role: 'مدرس', date: '2023-10-02' },
    { id: 3, name: 'علي محمود', role: 'طالب', date: '2023-10-03' },
  ];

  const columns = [
    { title: 'اسم الكورس', dataIndex: 'title', key: 'title' },
    { title: 'الإيرادات', dataIndex: 'revenue', key: 'revenue', render: text => `${text} ج.م` },
    { title: 'عدد الطلاب', dataIndex: 'students', key: 'students' },
    { 
      title: 'التقييم', 
      dataIndex: 'rating', 
      key: 'rating',
      render: rating => (
        <Progress percent={rating * 20} status="active" format={() => rating} />
      )
    },
  ];

  const userColumns = [
    {
      title: 'المستخدم',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {text}
        </div>
      )
    },
    { title: 'الدور', dataIndex: 'role', key: 'role' },
    { title: 'تاريخ التسجيل', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>لوحة تحكم المشرف</h1>
      
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              title="إجمالي المستخدمين"
              value={dashboardData.TotalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col span={4}>
          <Card>
            <Statistic
              title="عدد الطلاب"
              value={dashboardData.TotalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col span={4}>
          <Card>
            <Statistic
              title="عدد المدرسين"
              value={dashboardData.TotalInstructors}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col span={4}>
          <Card>
            <Statistic
              title="عدد الكورسات"
              value={dashboardData.TotalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col span={4}>
          <Card>
            <Statistic
              title="الكورسات النشطة"
              value={dashboardData.ActiveCourses}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        
        <Col span={4}>
          <Card>
            <Statistic
              title="إجمالي الإيرادات"
              value={dashboardData.TotalRevenue}
              prefix={<DollarOutlined />}
              suffix="ج.م"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="أفضل الكورسات حسب الإيرادات">
            <Table 
              dataSource={topCoursesData} 
              columns={columns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="أحدث المستخدمين">
            <Table 
              dataSource={recentUsersData} 
              columns={userColumns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="الإحصائيات الشهرية">
            <div style={{ height: '300px', textAlign: 'center' }}>
              <p>رسم بياني سيظهر هنا</p>
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="ملخص النظام">
            <div style={{ padding: '16px' }}>
              <p>
                <Tag color="green">الحالة</Tag> النظام يعمل بشكل طبيعي
              </p>
              <p style={{ marginTop: '12px' }}>
                <Tag color="blue">النسخة</Tag> 1.2.0
              </p>
              <p style={{ marginTop: '12px' }}>
                <Tag color="purple">آخر تحديث</Tag> 2023-10-05
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;