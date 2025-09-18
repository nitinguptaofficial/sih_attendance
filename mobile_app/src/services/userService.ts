import api from './api.config';

export const userService = {
  register: async (userData: {
    name: string;
    email: string;
    role: string;
    faceDescriptor: string;
  }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default userService;
