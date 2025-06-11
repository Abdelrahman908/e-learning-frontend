import axiosInstance from '../config/axios';

// تنسيق بيانات الدورة لتوحيد الحقول
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

// استخلاص رسالة الخطأ من الاستجابة
const extractErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;
  return data?.FailureReason || data?.Message || data?.message || fallbackMessage;
};

const CourseService = {
  // جلب جميع الدورات مع الفلاتر
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

  // جلب دورة حسب المعرّف
  getCourseById: async (id) => {
    try {
      const response = await axiosInstance.get(`/Course/${id}`);
      return normalizeCourseData(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب تفاصيل الدورة'));
    }
  },

  // جلب دورات المدرّس
  getInstructorCourses: async (instructorId, filters = {}) => {
    try {
      const response = await axiosInstance.get(`/Course/instructor/${instructorId}`, {
        params: filters,
      });
      return response.data.map(normalizeCourseData);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في جلب دورات المدرّس'));
    }
  },

  // إنشاء دورة جديدة (يدعم رفع صورة)
  createCourse: async (formData) => {
    try {
      const response = await axiosInstance.post('/Course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Create Course Error:', error.response?.data || error.message);
      throw new Error(extractErrorMessage(error, 'فشل في إنشاء الدورة'));
    }
  },

  // تعديل دورة (بما في ذلك صورة إن وُجدت)
  updateCourse: async (id, courseData) => {
    const formData = new FormData();

    Object.keys(courseData).forEach(key => {
      const value = courseData[key];
      if (value !== undefined && value !== null) {
        if (key === "image" && value.originFileObj) {
          formData.append("ImageFile", value.originFileObj); // اسم الملف في DTO
        } else {
          formData.append(key, value);
        }
      }
    });

    try {
      const response = await axiosInstance.put(`/Course/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Update Course Error:', error.response?.data || error.message);
      throw new Error(extractErrorMessage(error, 'فشل في تحديث الدورة'));
    }
  },

  // تعديل دورة مع صورة (بديل عند استخدام endpoint مخصص)
  updateCourseWithImage: async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/Course/update-with-image/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في تحديث الدورة مع صورة'));
    }
  },

  // التحقق مما إذا كان المستخدم مسجل في دورة
  isEnrolled: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/Enrollment/is-enrolled/${courseId}`);
      return response.data; // true أو false
    } catch (error) {
      console.error('Enrollment Check Error:', error.response?.data || error.message);
      throw new Error(extractErrorMessage(error, 'فشل في التحقق من حالة التسجيل'));
    }
  },

  // حذف دورة
  deleteCourse: async (id) => {
    try {
      await axiosInstance.delete(`/Course/${id}`);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'فشل في حذف الدورة'));
    }
  },
};

export default CourseService;
