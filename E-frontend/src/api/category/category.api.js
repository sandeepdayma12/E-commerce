import { categoryAPI } from "../instances";

// GET all categories
export const getCategoriesAPI = () =>
  categoryAPI.get("/get_categories/");

// GET single category
export const getCategoryByIdAPI = (id) =>
  categoryAPI.get(`/get_category/${id}`);

// CREATE category
export const createCategoryAPI = (data) =>
  categoryAPI.post("/create_category/", data);

// UPDATE category
export const updateCategoryAPI = (id, data) =>
  categoryAPI.put(`/update_category/${id}`, data);

// DELETE category
export const deleteCategoryAPI = (id) =>
  categoryAPI.delete(`/delete_category/${id}`);
