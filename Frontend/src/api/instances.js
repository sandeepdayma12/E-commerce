import axios from "axios";

/**
 * ===============================
 * API CONFIGURATION
 * ===============================
 */

const API_TIMEOUT = 15000;

const API_URLS = {
  AUTH: import.meta.env.VITE_AUTH_URL || "http://localhost:8001/",
  CART: import.meta.env.VITE_CART_URL || "http://localhost:8002/",
  ORDER: import.meta.env.VITE_ORDER_URL || "http://localhost:8003/",
  PAYMENT: import.meta.env.VITE_PAYMENT_URL || "http://localhost:8004/",
  PRODUCT: import.meta.env.VITE_PRODUCT_URL || "http://localhost:8005/",
  CATEGORY:
    import.meta.env.VITE_CATEGORY_URL ||
    "http://localhost:8005/categories/api",
};


/**
 * ===============================
 * AXIOS INSTANCE FACTORY
 * ===============================
 */

const createAPI = (baseURL, tokenKey = "userToken") => {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });


  /**
   * Request Interceptor
   * Adds JWT Token
   */
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(tokenKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );


  /**
   * Response Interceptor
   * Global Error Handler
   */
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem(tokenKey);

        // optional redirect
        // window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );


  return instance;
};

const createBareAPI = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });
};


/**
 * ===============================
 * USER SERVICES
 * ===============================
 */

export const authAPI = createAPI(
  API_URLS.AUTH,
  "userToken"
);

export const productAPI = createAPI(
  API_URLS.PRODUCT,
  "userToken"
);

export const categoryAPI = createAPI(
  API_URLS.CATEGORY,
  "userToken"
);

export const cartAPI = createAPI(
  API_URLS.CART,
  "userToken"
);

export const orderAPI = createAPI(
  API_URLS.ORDER,
  "userToken"
);

export const paymentAPI = createAPI(
  API_URLS.PAYMENT,
  "userToken"
);


/**
 * ===============================
 * ADMIN SERVICES
 * ===============================
 */

export const adminAPI = createAPI(
  API_URLS.AUTH,
  "adminToken"
);

export const productAdminAPI = createAPI(
  API_URLS.PRODUCT,
  "adminToken"
);

export const adminRefreshAPI = createBareAPI(
  API_URLS.AUTH
);