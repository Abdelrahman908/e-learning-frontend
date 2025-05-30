import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseService from '../../services/courses';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CourseStats = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getCourseStats(id, timeRange);
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id, timeRange]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="message message-error">{error}</div>;
  if (!stats) return <div className="message">No statistics available</div>;

  const enrollmentData = [
    { name: 'Current', value: stats.currentPeriodEnrollments },
    { name: 'Previous', value: stats.previousPeriodEnrollments },
    { name: 'Before', value: stats.beforePreviousPeriodEnrollments }
  ];

  return (
    <div className="course-stats-container">
      <div className="stats-header">
        <h2>Course Statistics</h2>
        <div className="time-range-selector">
          <button
            className={timeRange === 'weekly' ? 'active' : ''}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button
            className={timeRange === 'monthly' ? 'active' : ''}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
          <button
            className={timeRange === 'yearly' ? 'active' : ''}
            onClick={() => setTimeRange('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.totalEnrollments}</div>
          <div className="stat-label">Total Enrollments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageRating?.toFixed(1) || '0.0'}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalRevenue || 0} EGP</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-container">
          <h3>Enrollments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-details">
        <h3>Detailed Metrics</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Active Students</td>
              <td>{stats.activeStudents}</td>
              <td className={stats.activeStudentsChange >= 0 ? 'positive' : 'negative'}>
                {stats.activeStudentsChange >= 0 ? '+' : ''}{stats.activeStudentsChange}%
              </td>
            </tr>
            <tr>
              <td>Completion Rate</td>
              <td>{stats.completionRate}%</td>
              <td className={stats.completionRateChange >= 0 ? 'positive' : 'negative'}>
                {stats.completionRateChange >= 0 ? '+' : ''}{stats.completionRateChange}%
              </td>
            </tr>
            <tr>
              <td>Average Rating</td>
              <td>{stats.averageRating?.toFixed(1) || '0.0'}</td>
              <td className={stats.ratingChange >= 0 ? 'positive' : 'negative'}>
                {stats.ratingChange >= 0 ? '+' : ''}{stats.ratingChange}
              </td>
            </tr>
            <tr>
              <td>Revenue</td>
              <td>{stats.currentPeriodRevenue || 0} EGP</td>
              <td className={stats.revenueChange >= 0 ? 'positive' : 'negative'}>
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseStats;