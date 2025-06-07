import axiosInstance from '../config/axios'; // ✅ صح

const ProfileService = {
  create: (data) => axiosInstance.post('/Profile', data),
getMyProfile: () => axiosInstance.get('/Profile/me'), // ✅ الحروف تتطابق مع السيرفر
  update: (data) => axiosInstance.patch('/Profile', data),
  delete: () => axiosInstance.delete('/Profile'),
  uploadPicture: (formData) =>
    axiosInstance.post('/Profile/upload-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default ProfileService;
