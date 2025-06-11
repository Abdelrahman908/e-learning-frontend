import axiosInstance from '../config/axios';

const mapProfileDtoToCamelCase = (data) => ({
  id: data.Id,
  bio: data.Bio,
  profilePicture: data.ProfilePicture,
  address: data.Address,
  phone: data.Phone,
  userId: data.UserId,
  userName: data.UserName,
  email: data.Email,
  updatedAt: data.UpdatedAt,
});

const ProfileService = {
  create: async (data) => {
    const response = await axiosInstance.post('/Profile', data);
    return mapProfileDtoToCamelCase(response.data);
  },

  getMyProfile: async () => {
    const response = await axiosInstance.get('/Profile/me');
    return { data: mapProfileDtoToCamelCase(response.data) };
  },

  update: async (data) => {
    const response = await axiosInstance.patch('/Profile', data);
    return {
      message: response.data?.Message,
      profile: mapProfileDtoToCamelCase(response.data?.Profile),
    };
  },

  delete: async () => {
    const response = await axiosInstance.delete('/Profile');
    return response.data;
  },

  uploadPicture: async (formData) => {
    const response = await axiosInstance.post('/Profile/upload-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default ProfileService;
