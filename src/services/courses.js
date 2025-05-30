import axiosInstance from '../config/axios';

const CourseService = {
  /**
   * Get all courses with optional filtering and pagination
   * @param {Object} filters - Filtering options
   * @param {number} [filters.categoryId] - Filter by category ID
   * @param {number} [filters.minPrice] - Minimum price filter
   * @param {number} [filters.maxPrice] - Maximum price filter
   * @param {string} [filters.search] - Search term
   * @param {string} [filters.sort] - Sorting option (newest, price, rating)
   * @param {number} [filters.page] - Page number
   * @param {number} [filters.limit] - Items per page
   * @returns {Promise} Axios response
   */
  getAllCourses: async (filters = {}) => {
    const params = {
      pageNumber: filters.page || 1,
      pageSize: filters.limit || 10,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      sort: filters.sort || 'newest'
    };

    // Remove undefined/null values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    return await axiosInstance.get('/courses', { params });
  },

  /**
   * Get courses for a specific instructor
   * @param {number} instructorId - Instructor ID
   * @param {Object} filters - Filtering options (same as getAllCourses)
   * @returns {Promise} Axios response
   */
  getInstructorCourses: async (instructorId, filters = {}) => {
    const params = {
      pageNumber: filters.page || 1,
      pageSize: filters.limit || 10,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      sort: filters.sort || 'newest'
    };

    // Remove undefined/null values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    return await axiosInstance.get(`/courses/instructor/${instructorId}`, { params });
  },

  /**
   * Get single course by ID
   * @param {number} id - Course ID
   * @returns {Promise} Axios response
   */
  getCourseById: async (id) => {
    return await axiosInstance.get(`/courses/${id}`);
  },

  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @param {string} courseData.name - Course name
   * @param {string} courseData.description - Course description
   * @param {number} courseData.price - Course price
   * @param {boolean} courseData.isActive - Course status
   * @param {number} courseData.categoryId - Category ID
   * @param {File} [courseData.image] - Course image file
   * @returns {Promise} Axios response
   */
  createCourse: async (courseData) => {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(courseData).forEach(key => {
      if (courseData[key] !== undefined && courseData[key] !== null) {
        formData.append(key, courseData[key]);
      }
    });

    return await axiosInstance.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Update an existing course
   * @param {number} id - Course ID
   * @param {Object} courseData - Updated course data
   * @param {string} [courseData.name] - Course name
   * @param {string} [courseData.description] - Course description
   * @param {number} [courseData.price] - Course price
   * @param {boolean} [courseData.isActive] - Course status
   * @param {number} [courseData.categoryId] - Category ID
   * @param {File} [courseData.image] - New course image
   * @returns {Promise} Axios response
   */
  updateCourse: async (id, courseData) => {
    // If there's an image file, use multipart form
    if (courseData.image) {
      const formData = new FormData();
      
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== undefined && courseData[key] !== null) {
          formData.append(key, courseData[key]);
        }
      });

      return await axiosInstance.put(`/courses/update-with-image/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    // Otherwise use regular JSON
    return await axiosInstance.put(`/courses/${id}`, courseData);
  },

  /**
   * Delete a course
   * @param {number} id - Course ID
   * @returns {Promise} Axios response
   */
  deleteCourse: async (id) => {
    return await axiosInstance.delete(`/courses/${id}`);
  },

  /**
   * Get popular courses (custom endpoint if available)
   * @param {number} limit - Number of courses to return
   * @returns {Promise} Axios response
   */
  getPopularCourses: async (limit = 4) => {
    return await axiosInstance.get('/courses/popular', { params: { limit } });
  },

  /**
   * Get related courses (custom endpoint if available)
   * @param {number} courseId - Current course ID
   * @param {number} limit - Number of related courses to return
   * @returns {Promise} Axios response
   */
  getRelatedCourses: async (courseId, limit = 3) => {
    return await axiosInstance.get(`/courses/${courseId}/related`, { params: { limit } });
  }
};

export default CourseService;