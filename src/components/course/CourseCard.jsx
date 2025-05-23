import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Rating } from '../ui/Rating';

const CourseCard = ({ course, isInstructor = false }) => {
  const {
    id,
    name,
    price,
    imageUrl,
    description,
    averageRating,
    instructorName
  } = course;

  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  return (
    <div className="card h-100 shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={name}
          style={{ height: '180px', objectFit: 'cover' }}
          loading="lazy"
        />
      )}
      
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{name}</h5>
          {price > 0 && (
            <span className="badge bg-success">${price.toFixed(2)}</span>
          )}
        </div>
        
        {averageRating && <Rating value={averageRating} className="mb-2" />}
        
        <p className="card-text text-muted flex-grow-1">
          {truncatedDescription}
        </p>
        
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to={`/courses/${id}`} 
            className="btn btn-primary btn-sm"
            aria-label={`View details of ${name}`}
          >
            View Details
          </Link>
          
          {isInstructor && (
            <div className="d-flex gap-2">
              <Link
                to={`/instructor/courses/edit/${id}`}
                className="btn btn-outline-secondary btn-sm"
                aria-label={`Edit course ${name}`}
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-footer bg-transparent">
        <small className="text-muted">
          Instructor: {instructorName}
        </small>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    imageUrl: PropTypes.string,
    description: PropTypes.string.isRequired,
    averageRating: PropTypes.number,
    instructorName: PropTypes.string.isRequired
  }).isRequired,
  isInstructor: PropTypes.bool
};

export default CourseCard;