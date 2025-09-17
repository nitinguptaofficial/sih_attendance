import api from "./api.config";

export const userService = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
};

export default userService;
