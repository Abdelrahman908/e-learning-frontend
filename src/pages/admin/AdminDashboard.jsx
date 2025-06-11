import React, { useState, useEffect } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Progress,
  Avatar,
  Tag,
  Spin
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import dashboardService from '../../services/dashboard';

const cardStyle = {
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6
    }
  })
};

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

  if (loading || !dashboardData) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" tip="جاري تحميل البيانات..." />
      </div>
    );
  }

  const monthlyRevenueData = [
    { month: 'يناير', revenue: 1200 },
    { month: 'فبراير', revenue: 1500 },
    { month: 'مارس', revenue: 1800 },
    { month: 'أبريل', revenue: 2000 },
    { month: 'مايو', revenue: 2500 },
    { month: 'يونيو', revenue: dashboardData.TotalRevenue || 4500 }
  ];

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

  const courseColumns = [
    { title: 'اسم الكورس', dataIndex: 'title', key: 'title' },
    { title: 'الإيرادات', dataIndex: 'revenue', key: 'revenue', render: text => `${text} ج.م` },
    { title: 'عدد الطلاب', dataIndex: 'students', key: 'students' },
    {
      title: 'التقييم',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => (
        <Progress percent={rating * 20} status="active" format={() => rating.toFixed(1)} />
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
    <div style={{ padding: '24px' }}>
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{ marginBottom: '32px', textAlign: 'center', fontSize: '26px', fontWeight: 'bold' }}
      >
        لوحة تحكم المشرف
      </motion.h1>

      <Row gutter={[16, 16]}>
        {[
          {
            title: 'إجمالي المستخدمين',
            value: dashboardData.TotalUsers,
            icon: <UserOutlined />,
            color: '#3f8600'
          },
          {
            title: 'عدد الطلاب',
            value: dashboardData.TotalStudents,
            icon: <TeamOutlined />,
            color: '#1890ff'
          },
          {
            title: 'عدد المدرسين',
            value: dashboardData.TotalInstructors,
            icon: <UserOutlined />,
            color: '#722ed1'
          },
          {
            title: 'عدد الكورسات',
            value: dashboardData.TotalCourses,
            icon: <BookOutlined />,
            color: '#faad14'
          },
          {
            title: 'الكورسات النشطة',
            value: dashboardData.ActiveCourses,
            icon: <RiseOutlined />,
            color: '#13c2c2'
          },
          {
            title: 'إجمالي الإيرادات',
            value: dashboardData.TotalRevenue,
            icon: <DollarOutlined />,
            color: '#f5222d',
            suffix: 'ج.م'
          }
        ].map((item, index) => (
          <Col xs={12} sm={8} md={4} key={index}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <Card bordered style={cardStyle}>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={item.icon}
                  suffix={item.suffix}
                  valueStyle={{ color: item.color }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '32px' }}>
        <Col xs={24} md={12}>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
            <Card title="أفضل الكورسات حسب الإيرادات" bordered style={cardStyle}>
              <Table
                dataSource={topCoursesData}
                columns={courseColumns}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} md={12}>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
            <Card title="أحدث المستخدمين" bordered style={cardStyle}>
              <Table
                dataSource={recentUsersData}
                columns={userColumns}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '32px' }}>
        <Col xs={24} md={12}>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
            <Card title="الإيرادات الشهرية" bordered style={cardStyle}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} ج.م`} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#52c41a"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} md={12}>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
            <Card title="ملخص النظام" bordered style={cardStyle}>
              <div style={{ padding: '16px' }}>
                <p><Tag color="green">الحالة</Tag> النظام يعمل بشكل طبيعي</p>
                <p><Tag color="blue">النسخة</Tag> 1.2.0</p>
                <p><Tag color="purple">آخر تحديث</Tag> 2025-6-09</p>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
