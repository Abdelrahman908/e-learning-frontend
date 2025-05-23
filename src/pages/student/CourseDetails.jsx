import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert, 
  Card, 
  Badge,
  Button,
  Tab,
  Tabs,
  ListGroup,
  ProgressBar
} from 'react-bootstrap';
import { fetchCourseById } from '../../store/slices/courseSlice';
import { Rating } from '../../components/ui/Rating';
import useAuth from '../../hooks/useAuth';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCourse: course, loading, error } = useSelector((state) => state.courses);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <div className="mb-4">
            <h1>{course.name}</h1>
            <div className="d-flex align-items-center mb-3">
              <Rating value={course.averageRating} showLabel />
              <span className="ms-3 text-muted">
                Instructor: {course.instructorName}
              </span>
            </div>
            {course.price > 0 ? (
              <Badge bg="success" className="fs-5 mb-3">
                ${course.price}
              </Badge>
            ) : (
              <Badge bg="info" className="fs-5 mb-3">
                Free
              </Badge>
            )}
          </div>
          
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.name}
              className="img-fluid rounded mb-4"
            />
          )}

          {/* عرض شريط التقدم للطالب */}
          {user?.role === 'Student' && course.progress !== undefined && (
            <div className="mb-4">
              <h5>Your Progress</h5>
              <ProgressBar now={course.progress} label={`${course.progress}%`} />
            </div>
          )}
          
          <Tabs defaultActiveKey="description" className="mb-4">
            <Tab eventKey="description" title="Description">
              <div className="p-3">
                <p>{course.description}</p>
              </div>
            </Tab>
            <Tab eventKey="curriculum" title="Curriculum">
              <ListGroup variant="flush">
                {course.lessons?.map(lesson => (
                  <ListGroup.Item key={lesson.id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{lesson.title}</span>
                      <span className="text-muted">{lesson.duration} min</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
            <Tab eventKey="reviews" title="Reviews">
              <div className="p-3">
                {course.reviews?.length > 0 ? (
                  course.reviews.map(review => (
                    <Card key={review.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <Rating value={review.rating} readOnly />
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <Card.Text className="mt-2">{review.comment}</Card.Text>
                        <Card.Subtitle className="text-muted">
                          - {review.studentName}
                        </Card.Subtitle>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <div className="d-grid gap-2">
                {user ? (
                  user.role === 'Student' ? (
                    <>
                      {course.isEnrolled ? (
                        <Button 
                          variant="success" 
                          size="lg" 
                          as={Link} 
                          to={`/student/courses/${course.id}/lessons`}
                        >
                          Continue Learning
                        </Button>
                      ) : (
                        <Button variant="primary" size="lg">
                          Enroll Now
                        </Button>
                      )}
                      <Button variant="outline-secondary">
                        Add to Wishlist
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* أزرار لدور غير الطالب (مثلاً Instructor) */}
                      <Button variant="primary" size="lg">
                        Enroll Now
                      </Button>
                      <Button variant="outline-secondary">
                        Add to Wishlist
                      </Button>
                    </>
                  )
                ) : (
                  <Button variant="primary" size="lg" as={Link} to="/login">
                    Login to Enroll
                  </Button>
                )}
              </div>
              
              <hr />
              
              <div className="mb-3">
                <h5>Course Details</h5>
                <ul className="list-unstyled">
                  <li>
                    <strong>Category:</strong> {course.categoryName}
                  </li>
                  <li>
                    <strong>Duration:</strong> {course.totalDuration} hours
                  </li>
                  <li>
                    <strong>Lessons:</strong> {course.lessons?.length || 0}
                  </li>
                  <li>
                    <strong>Level:</strong> {course.level}
                  </li>
                </ul>
              </div>
              
              {user?.role === 'Instructor' && (
                <>
                  <hr />
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary"
                      as={Link}
                      to={`/instructor/courses/edit/${course.id}`}
                    >
                      Edit Course
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetailsPage;
