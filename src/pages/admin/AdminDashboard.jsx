import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../config/axios';
import { Card, CardContent, Grid, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard/admin');
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

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        لوحة تحكم المسؤول
      </Typography>

      <Grid container spacing={3}>
        {/* إحصائيات رئيسية */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي المستخدمين</Typography>
              <Typography variant="h5">{dashboardData.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي الطلاب</Typography>
              <Typography variant="h5">{dashboardData.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي المدربين</Typography>
              <Typography variant="h5">{dashboardData.totalInstructors}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">إجمالي الكورسات</Typography>
              <Typography variant="h5">{dashboardData.totalCourses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* مخطط الإيرادات */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>الإيرادات</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.topCoursesByRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#8884d8" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* أفضل الكورسات حسب التقييم */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>أفضل الكورسات حسب التقييم</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>اسم الكورس</TableCell>
                      <TableCell align="right">التقييم</TableCell>
                      <TableCell align="right">عدد المسجلين</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.topCoursesByRating.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell align="right">{course.averageRating.toFixed(1)}</TableCell>
                        <TableCell align="right">{course.enrollments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* أفضل الكورسات حسب الإيرادات */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>أفضل الكورسات حسب الإيرادات</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>اسم الكورس</TableCell>
                      <TableCell align="right">الإيرادات</TableCell>
                      <TableCell align="right">عدد المسجلين</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.topCoursesByRevenue.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell align="right">${course.totalRevenue.toFixed(2)}</TableCell>
                        <TableCell align="right">{course.enrollments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;