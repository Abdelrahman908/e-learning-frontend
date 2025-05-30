import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseService from '../../services/courses';
import LoadingSpinner from '../ui/LoadingSpinner';
import StudentRow from './StudentRow';

const CourseStudents = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'progress',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getCourseStudents(id);
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="message message-error">{error}</div>;

  return (
    <div className="course-students-container">
      <div className="students-header">
        <h2>Course Students</h2>
        <div className="students-search">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Student {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th>Email</th>
              <th onClick={() => handleSort('enrolledAt')}>
                Enrolled {sortConfig.key === 'enrolledAt' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('progress')}>
                Progress {sortConfig.key === 'progress' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('lastAccessed')}>
                Last Active {sortConfig.key === 'lastAccessed' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <StudentRow key={student.id} student={student} courseId={id} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-table">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="students-summary">
        <div className="summary-card">
          <h3>Total Students</h3>
          <p>{students.length}</p>
        </div>
        <div className="summary-card">
          <h3>Active Students</h3>
          <p>{students.filter(s => s.isActive).length}</p>
        </div>
        <div className="summary-card">
          <h3>Completion Rate</h3>
          <p>
            {students.length > 0
              ? Math.round(
                  (students.filter(s => s.progress === 100).length / students.length) * 100
                ) + '%'
              : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};

const StudentRow = ({ student, courseId }) => {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = () => {
    console.log(`Send message to ${student.email}`);
  };

  const handleRemoveStudent = async () => {
    if (!window.confirm(`Are you sure you want to remove ${student.name} from this course?`)) {
      return;
    }

    try {
      setLoading(true);
      await CourseService.removeStudentFromCourse(courseId, student.id);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td>
        <div className="student-info">
          <div className="student-avatar">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <span>{student.name}</span>
        </div>
      </td>
      <td>{student.email}</td>
      <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
      <td>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${student.progress}%` }}
            ></div>
          </div>
          <span>{student.progress}%</span>
        </div>
      </td>
      <td>
        {student.lastAccessed
          ? new Date(student.lastAccessed).toLocaleDateString()
          : 'Never'}
      </td>
      <td>
        <div className="actions-container">
          <button
            className="actions-toggle"
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>
          {showActions && (
            <div className="actions-dropdown">
              <button onClick={handleSendMessage}>Send Message</button>
              <button onClick={() => window.location = `/users/${student.id}`}>
                View Profile
              </button>
              <button onClick={handleRemoveStudent} disabled={loading}>
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </td>
    </tr>
  );
};

export default CourseStudents;
