import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rating from '@mui/material/Rating';

const CourseCard = ({ course, isInstructor = false }) => {
  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={course.imageUrl || '/images/courses/default.jpg'}
          alt={course.name}
          className="course-image"
          onError={(e) => e.target.src = '/images/courses/default.jpg'}
        />
        {course.isActive || <div className="course-inactive-badge">غير نشط</div>}
      </div>
      
      <div className="course-content">
        <div className="course-meta">
          <span className="course-category">{course.categoryName}</span>
          <div className="course-rating">
            <Rating 
              value={course.averageRating || 0} 
              precision={0.5} 
              readOnly 
              size="small"
            />
            <span>({course.reviewCount || 0})</span>
          </div>
        </div>
        
        <h3 className="course-title">{course.name}</h3>
        
        <p className="course-description">
          {course.description?.substring(0, 100)}{course.description?.length > 100 && '...'}
        </p>
        
        <div className="course-footer">
          <div className="course-price">
            {course.price > 0 ? (
              <>
                <span className="price-amount">{course.price} ج.م</span>
                {course.originalPrice > course.price && (
                  <span className="original-price">{course.originalPrice} ج.م</span>
                )}
              </>
            ) : (
              <span className="price-free">مجاني</span>
            )}
          </div>
          
          {isInstructor ? (
            <Link 
              to={`/instructor/courses/${course.id}`} 
              className="btn btn-outline"
            >
              إدارة الدورة
            </Link>
          ) : (
            <Link to={`/courses/${course.id}`} className="btn btn-primary">
              عرض التفاصيل
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    imageUrl: PropTypes.string,
    isActive: PropTypes.bool,
    categoryName: PropTypes.string,
    averageRating: PropTypes.number,
    reviewCount: PropTypes.number
  }).isRequired,
  isInstructor: PropTypes.bool
};

export default CourseCard;