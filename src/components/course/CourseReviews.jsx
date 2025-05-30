import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CourseService from '../../services/courses';
import Rating from '@mui/material/Rating';
import LoadingSpinner from '../ui/LoadingSpinner';

const CourseReviews = ({ courseId, reviews = [], averageRating, reviewCount, isEnrolled }) => {
  const { user } = useAuth();
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState(reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const review = allReviews.find(r => r.userId === user.id);
      if (review) {
        setUserReview(review);
        setRating(review.rating);
        setComment(review.comment);
      }
    }
  }, [user, allReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (userReview) {
        // Update existing review
        response = await CourseService.updateReview(courseId, {
          rating,
          comment
        });
      } else {
        // Create new review
        response = await CourseService.createReview(courseId, {
          rating,
          comment
        });
      }

      setUserReview(response.data);
      if (!userReview) {
        setAllReviews([response.data, ...allReviews]);
      } else {
        setAllReviews(allReviews.map(r => 
          r.id === response.data.id ? response.data : r
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في حفظ التقييم');
    } finally {
      setLoading(false);
    }
  };

  const canReview = isEnrolled && !userReview;

  return (
    <div className="course-reviews">
      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-number">{averageRating?.toFixed(1) || '0.0'}</span>
          <Rating value={averageRating || 0} precision={0.1} readOnly />
          <span className="total-reviews">({reviewCount} تقييم)</span>
        </div>
        
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(star => {
            const count = allReviews.filter(r => Math.floor(r.rating) === star).length;
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            
            return (
              <div key={star} className="rating-bar">
                <span className="stars">{star} نجوم</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {(canReview || userReview) && (
        <div className="add-review">
          <h3>{userReview ? 'تقييمك للدورة' : 'أضف تقييمك'}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={1}
                size="large"
              />
            </div>
            
            <div className="form-group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شاركنا رأيك عن الدورة..."
                rows="4"
                required
              />
            </div>
            
            {error && <div className="message message-error">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{userReview ? 'تحديث التقييم' : 'إضافة التقييم'}</span>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="reviews-list">
        <h3>آراء الطلاب</h3>
        
        {allReviews.length === 0 ? (
          <div className="empty-reviews">لا توجد تقييمات بعد</div>
        ) : (
          <ul>
            {allReviews.map(review => (
              <li key={review.id} className="review-item">
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="user-name">{review.userName}</span>
                  </div>
                  <div className="review-rating">
                    <Rating value={review.rating} precision={0.5} readOnly size="small" />
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;