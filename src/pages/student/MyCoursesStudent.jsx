// src/pages/student/MyCourses.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert, 
  Tab, 
  Tabs,
  Badge,
  Button,
  Stack
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBookOpen, 
  faGraduationCap, 
  faSearch,
  faFilter,
  faSyncAlt,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import CourseCard from "../../components/course/CourseCard";
import courseService from "../../services/courses";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import FilterDropdown from "../../components/ui/FilterDropdown";
import ProgressBar from "../../components/ui/ProgressBar";
import { formatDate } from "../../utils/helpers";
import "./MyCourses.scss";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getMyCourses();
      setCourses(response);
      setFilteredCourses(response);
    } catch (error) {
      setError(error.message || "Failed to fetch your courses");
      console.error("Failed to fetch my courses", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    const filterCourses = () => {
      let result = [...courses];
      
      // Apply tab filter
      if (activeTab === "in-progress") {
        result = result.filter(course => course.progress > 0 && course.progress < 100);
      } else if (activeTab === "completed") {
        result = result.filter(course => course.progress === 100);
      } else if (activeTab === "not-started") {
        result = result.filter(course => course.progress === 0);
      }
        
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(course => 
          course.title.toLowerCase().includes(term) || 
          course.instructor.toLowerCase().includes(term) ||
          course.category?.toLowerCase().includes(term)
        );
      }
      
      // Apply additional filters
      if (filter === "recent") {
        result.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
      } else if (filter === "highest-rated") {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filter === "most-progress") {
        result.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      }
      
      setFilteredCourses(result);
    };

    filterCourses();
  }, [courses, activeTab, searchTerm, filter]);

  const handleRefresh = () => {
    fetchMyCourses();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handleBrowseCourses = () => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Stack direction="horizontal" gap={3} className="align-items-center">
            <div className="me-auto">{error}</div>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={fetchMyCourses}
              className="d-flex align-items-center gap-2"
            >
              <FontAwesomeIcon icon={faSyncAlt} />
              <span>Retry</span>
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-courses-page py-4">
      <div className="page-header mb-4">
        <Stack direction="horizontal" gap={3} className="mb-3 flex-wrap">
          <h2 className="page-title mb-0">
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            My Learning
          </h2>
          <div className="ms-auto d-flex gap-3">
            <Button 
              variant="outline-primary" 
              onClick={handleBrowseCourses}
              className="d-flex align-items-center gap-2"
            >
              <span>Browse Courses</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </Stack>
        
        <Stack direction="horizontal" gap={3} className="flex-wrap align-items-center mb-3">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="courses-tabs flex-grow-1 flex-md-grow-0"
          >
            <Tab eventKey="all" title="All" />
            <Tab eventKey="in-progress" title="In Progress" />
            <Tab eventKey="completed" title="Completed" />
            <Tab eventKey="not-started" title="Not Started" />
          </Tabs>
          
          <Stack direction="horizontal" gap={2} className="ms-md-auto">
            <SearchInput 
              placeholder="Search my courses..." 
              onSearch={handleSearch}
              icon={faSearch}
              className="flex-grow-1"
            />
            <FilterDropdown
              options={[
                { value: "all", label: "All" },
                { value: "recent", label: "Recent" },
                { value: "highest-rated", label: "Top Rated" },
                { value: "most-progress", label: "Most Progress" }
              ]}
              selectedValue={filter}
              onChange={handleFilterChange}
              icon={faFilter}
            />
            <Button 
              variant="outline-secondary" 
              onClick={handleRefresh}
              aria-label="Refresh courses"
            >
              <FontAwesomeIcon icon={faSyncAlt} />
            </Button>
          </Stack>
        </Stack>

        {activeTab !== "all" && (
          <div className="mt-2">
            <ProgressBar 
              now={filteredCourses.length} 
              max={courses.length}
              label={`${filteredCourses.length} of ${courses.length} courses`}
              variant="info"
              className="mb-2"
            />
          </div>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={faGraduationCap}
          title={activeTab !== "all" ? 
            `No ${activeTab.replace("-", " ")} courses` : 
            "No enrolled courses"}
          description={activeTab !== "all" ? 
            `You don't have any ${activeTab.replace("-", " ")} courses yet` : 
            "You haven't enrolled in any courses yet"}
          actionText="Browse Available Courses"
          onAction={handleBrowseCourses}
        />
      ) : (
        <Row className="g-4">
          {filteredCourses.map((course) => (
            <Col key={course.id} xs={12} sm={6} lg={4} xl={3}>
              <CourseCard 
                course={course} 
                onClick={() => navigate(`/courses/${course.id}`)}
                showProgress
                progressValue={course.progress}
                progressVariant={
                  course.progress === 100 ? "success" : 
                  course.progress > 0 ? "primary" : "secondary"
                }
                additionalContent={
                  <Stack direction="horizontal" gap={2} className="mt-2 justify-content-between">
                    <Badge bg="light" text="dark" className="text-truncate">
                      {course.lessonCount} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
                    </Badge>
                    <Badge bg={course.isNew ? "info" : "light"} text={course.isNew ? "white" : "dark"}>
                      {course.isNew ? 'New' : `Enrolled ${formatDate(course.enrolledAt)}`}
                    </Badge>
                  </Stack>
                }
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCourses;