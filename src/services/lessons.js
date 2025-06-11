import axiosInstance from '../config/axios'; // تأكد من مسار ملف axiosInstance عندك

const LessonsService = {
  // ✅ التحقق من اشتراك الطالب في الكورس
  checkEnrollment: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/Enrollment/is-enrolled/${courseId}`);
      return response.data; // boolean: true أو false
    } catch (error) {
      throw error;
    }
  },

  // ✅ جلب كل الدروس لكورس معين
  getLessons: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons`);
      return response.data; // ApiResponse<List<LessonBriefDto>>
    } catch (error) {
      throw error;
    }
  },

  // ✅ جلب درس معين
  getLesson: async (courseId, lessonId) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/lessons/${lessonId}`);
      return response.data; // ApiResponse<LessonResponseDto>
    } catch (error) {
      throw error;
    }
  },

  // ✅ إنشاء درس جديد
// ✅ version: dto is already FormData (من الفرونت مباشرة)
createLesson: async (courseId, formData) => {
  try {
    const response = await axiosInstance.post(`/courses/${courseId}/lessons`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    // تحسين عرض رسائل الخطأ
    if (error.response) {
      const backendError = error.response.data;
      throw new Error(backendError.message || backendError.title || 'حدث خطأ أثناء إنشاء الدرس');
    }
    throw error;
  }
},


  // ✅ تحديث درس
 
  updateLesson: async (courseId, lessonId, data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        const value = data[key];
        if (key === 'pdfFile' && value) {
          formData.append('pdfFile', value);
        } else if (value !== null && value !== undefined && key !== 'pdfFile') {
          formData.append(key, value);
        }
      }

      const response = await axiosInstance.put(
        `/courses/${courseId}/lessons/${lessonId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },




  // ✅ حذف درس
  deleteLesson: async (courseId, lessonId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`);
      return response.data; // ApiResponse (204 NoContent)
    } catch (error) {
      throw error;
    }
  },

  // ✅ رفع مادة (ملف) لدرس معين
  uploadMaterial: async (courseId, lessonId, dto) => {
    try {
      const formData = new FormData();
      formData.append('File', dto.file);
      if (dto.description) formData.append('Description', dto.description);

      const response = await axiosInstance.post(
        `/courses/${courseId}/lessons/${lessonId}/materials`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: 50_000_000, // 50 MB limit
        }
      );
      return response.data; // ApiResponse<LessonMaterialDto>
    } catch (error) {
      throw error;
    }
  },

  // ✅ حذف مادة
  deleteMaterial: async (courseId, materialId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}/lessons/materials/${materialId}`);
      return response.data; // ApiResponse (204 NoContent)
    } catch (error) {
      throw error;
    }
  },
};

export default LessonsService;
