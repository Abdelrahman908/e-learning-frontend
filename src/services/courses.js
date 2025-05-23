// src/services/courses.js
import axiosInstance from "../config/axios";
import { handleApiError } from "../utils/errorHandler";

// Use environment variable with fallback to local development URL
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7056'}/api/Course`;

/**
 * Professional Course Service with complete API integration
 */
const CourseService = {
  /**
   * Fetches all courses with advanced filtering and pagination
   * @param {Object} [filters={}] - Filter criteria { searchTerm, categoryId, isActive }
   * @param {Object} [pagination={}] - Pagination { page, pageSize }
   * @param {string} [sortField] - Field to sort by
   * @param {string} [sortOrder] - Sort order (asc/desc)
   * @returns {Promise<{data: Array, pagination: Object}>} - Courses and pagination info
   */
  async getAllCourses(filters = {}, pagination = {}, sortField, sortOrder) {
    try {
      const params = {
        ...filters,
        ...pagination,
        ...(sortField && { sortBy: `${sortField} ${sortOrder}` })
      };

      const response = await axiosInstance.get(API_BASE_URL, { 
        params,
        paramsSerializer: {
          indexes: null // Properly serialize array params
        }
      });

      return {
        data: response.data,
        pagination: {
          totalItems: parseInt(response.headers['x-total-count']) || 0,
          totalPages: Math.ceil(parseInt(response.headers['x-total-count']) / pagination.pageSize),
          currentPage: pagination.page || 1,
          pageSize: pagination.pageSize || 10
        }
      };
    } catch (error) {
      throw handleApiError(error, "Failed to fetch courses");
    }
  },

  /**
   * Gets detailed course information by ID
   * @param {number|string} id - Course ID
   * @param {boolean} [includeReviews=false] - Include course reviews
   * @param {boolean} [includeLessons=false] - Include course lessons
   * @returns {Promise<CourseDetailsDto>} - Complete course details
   */
  async getCourseById(id, includeReviews = false, includeLessons = false) {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${id}`, {
        params: {
          includeReviews,
          includeLessons
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch course details");
    }
  },

  /**
   * Creates a new course with image upload support
   * @param {CourseCreateDto} courseData - Course creation data
   * @param {File} [imageFile] - Optional course image
   * @returns {Promise<CourseResponseDto>} - Created course data
   */
  async createCourse(courseData, imageFile = null) {
    try {
      const formData = this._prepareFormData(courseData, imageFile);
      const response = await axiosInstance.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create course");
    }
  },

  /**
   * Updates course information (without image changes)
   * @param {number|string} id - Course ID
   * @param {CourseUpdateDto} courseData - Update data
   * @returns {Promise<CourseResponseDto>} - Updated course data
   */
  async updateCourse(id, courseData) {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update course");
    }
  },

  /**
   * Updates course including image changes
   * @param {number|string} id - Course ID
   * @param {CourseUpdateDto} courseData - Update data
   * @param {File} [imageFile] - New course image (null keeps existing)
   * @returns {Promise<CourseResponseDto>} - Updated course data
   */
  async updateCourseWithImage(id, courseData, imageFile = null) {
    try {
      const formData = this._prepareFormData(courseData, imageFile);
      const response = await axiosInstance.put(
        `${API_BASE_URL}/update-with-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to update course with image");
    }
  },

  /**
   * Deletes a course
   * @param {number|string} id - Course ID to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  async deleteCourse(id) {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      throw handleApiError(error, "Failed to delete course");
    }
  },

  /**
   * Private method to prepare FormData for multipart requests
   * @private
   */
  _prepareFormData(data, file) {
    const formData = new FormData();
    
    // Append all data fields (handles nested objects)
    const flattenObject = (obj, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const fullKey = prefix ? `${prefix}[${key}]` : key;
          
          if (typeof value === 'object' && !(value instanceof File)) {
            flattenObject(value, fullKey);
          } else {
            formData.append(fullKey, value);
          }
        }
      });
    };
    
    flattenObject(data);
    
    // Append file if provided
    if (file) {
      formData.append("imageFile", file);
    }
    
    return formData;
  }
};

export default CourseService;