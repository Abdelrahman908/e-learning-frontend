import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from 'react-query';
import axios from '../../config/axios';
import { Grid, Typography } from '@mui/material';
import { Book, School, Payment } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import DashboardError from '../../components/dashboard/DashboardError';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import Layout from '../../components/layout/Layout';

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery('studentDashboard', async () => {
    const response = await axios.get('/api/dashboard/student');
    return response.data;
  }, {
    staleTime: 5 * 60 * 1000, // 5 دقائق cache
    retry: 2,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError refetch={refetch} />;

  // بيانات التقدم الدراسي
  const progressData = [
    { name: 'الأسبوع 1', progress: 20 },
    { name: 'الأسبوع 2', progress: 45 },
    { name: 'الأسبوع 3', progress: 60 },
    { name: 'الأسبوع 4', progress: 75 },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        لوحة تحكم الطالب
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DashboardCard 
            title="الكورسات المسجلة" 
            value={data.enrolledCourses} 
            icon={<Book />}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard 
            title="إجمالي المدفوعات" 
            value={`$${data.totalPaid.toFixed(2)}`}
            icon={<Payment />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard 
            title="معدل الإكمال" 
            value={`${data.completionRate || 0}%`} 
            icon={<School />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <DashboardCard title="تقدمك الدراسي">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard title="ملخص الكورسات">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DashboardCard 
                  title="الكورسات النشطة" 
                  value={`${data.activeCourses || 0}`} 
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <DashboardCard 
                  title="الكورسات المكتملة" 
                  value={`${data.completedCourses || 0}`} 
                  variant="outlined"
                  size="small"
                  color="success"
                />
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default React.memo(StudentDashboard);