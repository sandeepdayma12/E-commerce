import { authAPI } from "../instances";

export const loginAPI = (formData) =>
    authAPI.post("/user/login", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
