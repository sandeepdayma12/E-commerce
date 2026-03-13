import axios from "axios";

/**
 * PORT MAPPING FROM YOUR DOCKER-COMPOSE:
 * Auth Service:    8001
 * Cart Service:    8002
 * Order Service:   8003
 * Payment Service: 8004
 * Product Service: 8005
 */

export const authAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:8001/",
});

export const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:8001/",
});

export const cartAPI = axios.create({
  baseURL: import.meta.env.VITE_CART_URL || "http://localhost:8002/",
});

export const orderAPI = axios.create({
  baseURL: import.meta.env.VITE_ORDER_URL || "http://localhost:8003/",
});

export const paymentAPI = axios.create({
  baseURL: import.meta.env.VITE_PAYMENT_URL || "http://localhost:8004/",
});

export const productAPI = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_URL || "http://localhost:8005/",
});

// Category API usually belongs to the Product Service
export const categoryAPI = axios.create({
  baseURL: import.meta.env.VITE_CATEGORY_URL || "http://localhost:8005/categories/api",
});

const userServices = [authAPI, productAPI, cartAPI, orderAPI, paymentAPI, categoryAPI];

// Interceptor to add User Token to user services
userServices.forEach((api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});

// Interceptor to add Admin Token to admin services
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
