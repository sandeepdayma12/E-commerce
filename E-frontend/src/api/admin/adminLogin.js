import { authAPI } from "../instances";

export const AdminLoginAPI = (formData) =>
  authAPI.post("/admin/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

