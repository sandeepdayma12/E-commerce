import { adminAPI } from "../instances";

export const adminRegisterAPI = (data) => {
  return adminAPI.post("/admin/register", data);
};
