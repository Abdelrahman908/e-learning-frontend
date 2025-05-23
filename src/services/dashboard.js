import axios from "../config/axios"; // لو عندك ملف axios جاهز

export const getStudentDashboard = () => {
  return axios.get("/dashboard/student");
};
