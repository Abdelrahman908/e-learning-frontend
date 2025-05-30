import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import { Card, CardContent, Grid, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard/instructor');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const courseData = [
    { name: 'عدد الكورسات', value: dashboardData.coursesCount },
    { name: 'إجمالي الطلاب', value: dashboardData.totalStudents },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        لوحة تحكم المدرب
      </Typography>

      <Grid container spacing={3}>
        {/* إحصائيات رئيسية */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">عدد الكورسات</Typography>
              <Typography variant="h4">{dashboardData.coursesCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي الطلاب</Typography>
              <Typography variant="h4">{dashboardData.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي الأرباح</Typography>
              <Typography variant="h4">${dashboardData.totalEarnings.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* مخطط دائري */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>نظرة عامة</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* كورساتي */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>آخر الإحصائيات</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="متوسط تقييم الكورسات" secondary="4.5/5" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="أعلى كورس من حيث الإيرادات" secondary="كورس React المتقدم" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="أعلى كورس من حيث التقييم" secondary="كورس Node.js" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default InstructorDashboard;