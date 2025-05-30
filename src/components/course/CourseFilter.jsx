import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCategories } from '../../hooks/useCategories';

const CourseFilter = ({ filters, onChange, isInstructorView = false }) => {
  const { categories, loading } = useCategories();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value || null };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { 
      ...localFilters, 
      [name]: value ? parseInt(value) : null 
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: null,
      minPrice: null,
      maxPrice: null,
      search: '',
      sort: 'newest',
      page: 1
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="course-filter">
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="ابحث عن دورات..."
            value={localFilters.search || ''}
            onChange={handleChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <select
            name="category"
            value={localFilters.category || ''}
            onChange={handleChange}
            className="filter-select"
            disabled={loading}
          >
            <option value="">جميع التصنيفات</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-range">
          <input
            type="number"
            name="minPrice"
            placeholder="الحد الأدنى"
            value={localFilters.minPrice || ''}
            onChange={handlePriceChange}
            className="price-input"
            min="0"
          />
          <span>إلى</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="الحد الأقصى"
            value={localFilters.maxPrice || ''}
            onChange={handlePriceChange}
            className="price-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <select
            name="sort"
            value={localFilters.sort}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="newest">الأحدث</option>
            <option value="price">السعر من الأقل للأعلى</option>
            <option value="price_desc">السعر من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً</option>
            {isInstructorView && <option value="popular">الأكثر شعبية</option>}
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            تطبيق الفلتر
          </button>
          <button 
            type="button" 
            onClick={handleReset} 
            className="btn btn-outline"
          >
            إعادة الضبط
          </button>
        </div>
      </form>
    </div>
  );
};

CourseFilter.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
    search: PropTypes.string,
    sort: PropTypes.string,
    page: PropTypes.number
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isInstructorView: PropTypes.bool
};

export default CourseFilter;