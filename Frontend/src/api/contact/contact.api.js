import { authAPI } from "../instances";

export const createContactAPI = (data) =>
  authAPI.post("/api/contact", data);
