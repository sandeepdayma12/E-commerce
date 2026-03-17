import { productAPI } from "../api/instances";

const PRODUCT_BASE_URL = (productAPI.defaults.baseURL || "").replace(/\/+$/, "");

export const toProductImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path).replace(/^\/+/, "");
  return PRODUCT_BASE_URL ? `${PRODUCT_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
};
