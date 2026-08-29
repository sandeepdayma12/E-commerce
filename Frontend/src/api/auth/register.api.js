import {authAPI} from "../instances";

export const registerAPI = (data) => {
  return authAPI.post("/user/register", data);
};
