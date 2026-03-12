import { loginAPI } from "../api/auth/auth.api";
import { registerAPI } from "../api/auth/register.api";

export const loginService = async ({ username, password }) => {
  try {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);

    const res = await loginAPI(data);

    const token = res.data?.access_token;
    
    if (!token) {
      return {
        success: false,
        message: "Invalid username or password!",
      };
    }

    localStorage.setItem("token", token);

    return { success: true, token, data: res.data };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Invalid username or password!",
    };
  }
};



export const registerService = async (userData) => {
  try {
    const res = await registerAPI(userData);

    return {
      success: true,
      message: res.data.message || "Registration successful!",
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.detail || "Registration failed!",
    };
  }
};
