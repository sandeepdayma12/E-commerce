import { adminAPI } from "../instances";

export const AdminLoginAPI = (formData) =>
  adminAPI.post("/admin/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
