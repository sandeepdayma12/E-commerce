import {authAPI} from "../instances";

export const adminRegisterAPI = (data) => {
  return authAPI.post("/admin/register", data);
};
