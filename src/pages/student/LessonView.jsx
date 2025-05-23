// src/pages/student/LessonView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Alert, 
  Button, 
  Spinner, 
  Card, 
  ListGroup,
  Badge,
  Row,
  Col
} from "react-bootstrap";
import { toast } from "react-toastify";
import lessonService from "../../services/lessons";
import useProgressTracking from "../../hooks/useProgressTracking"; // Custom hook for progress tracking
import { formatDuration } from "../../utils/helpers"; // Utility for time formatting
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheckCircle, 
  faFileAlt, 
  faDownload,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

const LessonView = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const { updateCourseProgress } = useProgressTracking();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const lessonData = await lessonService.getLessonById(lessonId);
        setLesson(lessonData);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل الدرس");
        toast.error("حدث خطأ أثناء تحميل الدرس");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleCompleteLesson = async () => {
    try {
      setIsCompleting(true);
      await lessonService.markLessonComplete(lessonId);
      await updateCourseProgress(courseId); // Update overall course progress
      
      toast.success("تم إكمال الدرس بنجاح ✅", {
        autoClose: 3000,
        position: "top-center"
      });
      
      // Optional: navigate to next lesson or back to course
      // navigate(`/courses/${courseId}/lessons/${nextLessonId}`);
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء تحديث حالة الدرس");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <div className="text-center mt-3">
          <Button variant="secondary" onClick={handleBackToCourse}>
            العودة إلى الدورة التدريبية
          </Button>
        </div>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          لا يوجد درس متاح
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 lesson-container">
      <Button 
        variant="outline-secondary" 
        onClick={handleBackToCourse}
        className="mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        العودة إلى الدورة
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title as="h2" className="mb-0">
              {lesson.title}
            </Card.Title>
            {lesson.isCompleted && (
              <Badge bg="success" className="fs-6">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                مكتمل
              </Badge>
            )}
          </div>

          {lesson.duration && (
            <div className="text-muted mb-3">
              المدة: {formatDuration(lesson.duration)}
            </div>
          )}

          <Card.Text className="lesson-content fs-5">
            {lesson.content}
          </Card.Text>

          {lesson.videoUrl && (
            <div className="my-4">
              <h5>فيديو الدرس:</h5>
              <div className="ratio ratio-16x9">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {lesson.files?.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-3">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                ملفات الدرس:
              </h5>
              <ListGroup>
                {lesson.files.map((file, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <span>{file.name}</span>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      href={file.url} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      تحميل
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {!lesson.isCompleted && (
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                onClick={handleCompleteLesson}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    تم الانتهاء من الدرس
                  </>
                )}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="mt-4">
        <Col className="text-end">
          {lesson.previousLesson && (
            <Button 
              variant="outline-secondary"
              onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.previousLesson.id}`)}
            >
              الدرس السابق
            </Button>
          )}
        </Col>
        <Col className="text-start">
          {lesson.nextLesson && (
            <Button 
              variant="outline-primary"
              onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.nextLesson.id}`)}
            >
              الدرس التالي
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LessonView;