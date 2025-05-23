import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert, 
  Button,
  Card,
  Badge
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../../store/slices/courseSlice';
import { useAuth } from '../../hooks/useAuth';

const InstructorCoursesPage = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCourses({ instructorId: user.id }));
    }
  }, [dispatch, user]);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Courses</h1>
        <Button as={Link} to="/instructor/courses/create" variant="primary">
          Create New Course
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {courses.map(course => (
            <Col key={course.id}>
              <Card className="h-100 shadow-sm">
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    className="card-img-top"
                    alt={course.name}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{course.name}</h5>
                    <Badge bg={course.isActive ? 'success' : 'warning'}>
                      {course.isActive ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="card-text text-muted flex-grow-1">
                    {course.description.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </Link>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/instructor/courses/edit/${course.id}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <small className="text-muted">
                    {course.studentsCount || 0} students enrolled
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {!loading && courses.length === 0 && (
        <Card className="text-center py-5">
          <Card.Body>
            <h5 className="text-muted">You haven't created any courses yet</h5>
            <Button 
              as={Link} 
              to="/instructor/courses/create" 
              variant="primary" 
              className="mt-3"
            >
              Create Your First Course
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default InstructorCoursesPage;