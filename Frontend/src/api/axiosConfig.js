import axios from "axios";

const API_TIMEOUT = 15000;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:8001/",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
