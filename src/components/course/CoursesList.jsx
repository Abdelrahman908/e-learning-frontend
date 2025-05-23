import React, { useEffect, useState } from 'react';
import CourseCard from '../../components/CourseCard';
import CourseFilter from '../../components/CourseFilter';
import courseService from '../../services/courseService';
import { Spinner } from 'react-bootstrap';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoursesAndCategories();
  }, []);

  const fetchCoursesAndCategories = async () => {
    setLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getAllCategories()
      ]);
      setCourses(coursesRes);
      setFilteredCourses(coursesRes);
      setCategories(categoriesRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    const { searchTerm, categoryId } = filters;
    const filtered = courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryId || course.categoryId?.toString() === categoryId;
      return matchesSearch && matchesCategory;
    });
    setFilteredCourses(filtered);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Browse Courses</h2>
      <CourseFilter 
        categories={categories} 
        onFilter={handleFilter}
        isLoading={loading}
      />

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-muted text-center">No courses found.</p>
      ) : (
        <div className="row g-4">
          {filteredCourses.map(course => (
            <div key={course.id} className="col-md-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
