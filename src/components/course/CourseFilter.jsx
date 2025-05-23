import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button } from 'react-bootstrap';

const CourseFilter = ({ categories, onFilter, isLoading = false }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      categoryId: ''
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded" role="search">
      <Row className="g-3 align-items-end">
        <Col md={6}>
          <Form.Group controlId="searchTerm">
            <Form.Label>Search Courses</Form.Label>
            <Form.Control
              type="search"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Search by course name or description..."
              aria-label="Search courses"
            />
          </Form.Group>
        </Col>
        
        <Col md={4}>
          <Form.Group controlId="categoryId">
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleChange}
              aria-label="Select category to filter"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={2}>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Applying Filters...' : 'Apply Filters'}
            </Button>
            
            <Button
              variant="outline-secondary"
              onClick={handleReset}
              disabled={isLoading}
              type="button"
            >
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

CourseFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onFilter: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default CourseFilter;