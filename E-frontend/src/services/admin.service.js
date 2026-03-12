import { AdminLoginAPI } from "../api/admin/adminLogin";
import { adminRegisterAPI } from "../api/admin/admin.api";

export const adminLoginService = async ({ Email, password }) => {
  try {
    // Backend EXPECTS FormData, NOT JSON
    const formData = new FormData();
    formData.append("Email", Email);      // must match backend EXACTLY
    formData.append("password", password);

    const res = await AdminLoginAPI(formData);

    const token = res.data?.access_token;

    if (token) {
      localStorage.setItem("token", token);
    }

    return {
      success: true,
      token,
      message: res.data?.message || "Login successful"
    };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Invalid credentials!"
    };
  }
};

export const adminRegisterService = async (adminData) => {
  try {
    const res = await adminRegisterAPI(adminData);

    return {
      success: true,
      message: res.data.message || "Admin registration successful!"
    };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed!"
    };
  }
};
