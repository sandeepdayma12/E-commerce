import { productAPI } from "../api/instances";

const PRODUCT_BASE_URL = (productAPI.defaults.baseURL || "").replace(/\/+$/, "");

export const toProductImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path).replace(/^\/+/, "");
  return PRODUCT_BASE_URL ? `${PRODUCT_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
};

export const getProductImagePaths = (imagePath) => {
  if (!imagePath) return [];
  if (Array.isArray(imagePath)) return imagePath.filter(Boolean);
  if (typeof imagePath === "string") {
    const trimmed = imagePath.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (parsed) return [String(parsed)];
    } catch {
      return [trimmed];
    }
  }
  return [];
};
