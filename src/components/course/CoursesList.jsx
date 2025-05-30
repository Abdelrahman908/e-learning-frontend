import React from 'react';
import { useCourses } from '../../hooks/useCourses';
import CourseCard from './CourseCard';
import CourseFilter from './CourseFilter';
import LoadingSpinner from '../ui/LoadingSpinner';
import Pagination from '../ui/Pagination';
import EmptyState from '../ui/EmptyState';

const CoursesList = ({ isInstructorView = false }) => {
  const [filters, setFilters] = React.useState({
    category: null,
    minPrice: null,
    maxPrice: null,
    search: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });
  
  const { courses, loading, error, totalPages, totalCount } = useCourses(
    filters, 
    isInstructorView
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="message message-error">{error}</div>;

  return (
    <div className="courses-section">
      <div className="section-header">
        <h2>
          {isInstructorView ? 'دوراتي التعليمية' : 'تصفح جميع الدورات'}
          {totalCount !== undefined && (
            <span className="results-count"> ({totalCount} نتيجة)</span>
          )}
        </h2>
        <CourseFilter 
          filters={filters} 
          onChange={handleFilterChange}
          isInstructorView={isInstructorView}
        />
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="لا توجد دورات متاحة"
          description="حاول تعديل فلتر البحث أو إنشاء دورة جديدة إذا كنت مدرباً"
          actionText={isInstructorView ? "إنشاء دورة جديدة" : "استكشاف جميع الدورات"}
          actionLink={isInstructorView ? "/instructor/courses/new" : "/courses"}
        />
      ) : (
        <>
          <div className="courses-grid">
            {courses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isInstructor={isInstructorView}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination 
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CoursesList;