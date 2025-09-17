import api from "./api.config";

export const attendanceService = {
  markAttendance: async (userId) => {
    const response = await api.post("/attendance/mark", { userId });
    return response.data;
  },

  getAttendanceList: async () => {
    const response = await api.get("/attendance");
    return response.data;
  },
};

export default attendanceService;
