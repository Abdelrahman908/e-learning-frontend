import axiosInstance from '../config/axios';

const normalizeCourseData = (course) => ({
  id: course.Id || course.id,
  name: course.Name || course.name,
  title: course.Title || course.title,
  description: course.Description || course.description,
  price: course.Price || course.price,
  isFree: course.IsFree || course.isFree,
  isActive: course.IsActive || course.isActive,
  categoryId: course.CategoryId || course.categoryId,
  instructorId: course.InstructorId || course.instructorId,
  createdAt: course.CreatedAt || course.createdAt,
  imageUrl: course.ImageUrl || course.imageUrl,
  instructorName: course.InstructorName || course.instructorName,
  categoryName: course.CategoryName || course.categoryName,
  averageRating: course.AverageRating || course.averageRating,
});

const extractErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || data?.message || fallbackMessage;
};

const CourseService = {
  getAllCourses: async (filters = {}) => {
    const params = {
      pageNumber: filters.page || 1,
      pageSize: filters.limit || 10,
      searchTerm: filters.search,
      categoryId: filters.categoryId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      isActive: filters.isActive,
      sortBy: filters.sortBy || 'newest',
    };

    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    try {
      const response = await axiosInstance.get('/Course', { params });
      return response.data.map(normalizeCourseData);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب الدورات'));
    }
  },

  getCourseById: async (id) => {
    try {
      const response = await axiosInstance.get(`/Course/${id}`);
      return normalizeCourseData(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب تفاصيل الدورة'));
    }
  },

  getInstructorCourses: async (instructorId, filters = {}) => {
    try {
      const response = await axiosInstance.get(`/Course/instructor/${instructorId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب دورات المدرّس'));
    }
  },

  createCourse: async (courseData) => {
    const formData = new FormData();
    Object.keys(courseData).forEach(key => {
      if (courseData[key] !== undefined && courseData[key] !== null) {
        formData.append(key, courseData[key]);
      }
    });

    try {
      const response = await axiosInstance.post('/Course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في إنشاء الدورة'));
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const response = await axiosInstance.put(`/Course/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في تحديث الدورة'));
    }
  },

  updateCourseWithImage: async (id, courseData) => {
    const formData = new FormData();
    Object.keys(courseData).forEach(key => {
      if (courseData[key] !== undefined && courseData[key] !== null) {
        formData.append(key, courseData[key]);
      }
    });

    try {
      const response = await axiosInstance.put(`/Course/update-with-image/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في تحديث الدورة مع الصورة'));
    }
  },

  deleteCourse: async (id) => {
    try {
      await axiosInstance.delete(`/Course/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في حذف الدورة'));
    }
  },
};

export default CourseService;
