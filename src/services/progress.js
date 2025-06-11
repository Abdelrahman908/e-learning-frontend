import axiosInstance from '../config/axios';

const API_URL = '/users';

const getUserProgress = async (userId) => {
  const response = await axiosInstance.get(`${API_URL}/${userId}/progress`);
  return response.data;
};

const getCourseProgress = async (userId, courseId) => {
  const response = await axiosInstance.get(`${API_URL}/${userId}/progress/courses/${courseId}`);
  return response.data;
};

const getLessonProgress = async (userId, lessonId) => {
  const response = await axiosInstance.get(`${API_URL}/${userId}/progress/lessons/${lessonId}`);
  return response.data;
};

const updateProgress = async (userId, lessonId, progressData) => {
  const response = await axiosInstance.put(`${API_URL}/${userId}/progress/lessons/${lessonId}`, progressData);
  return response.data;
};

const ProgressService = {
  getUserProgress,
  getCourseProgress,
  getLessonProgress,
  updateProgress,
};

export default ProgressService;
