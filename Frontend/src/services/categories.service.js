// src/services/category.service.js

import {
  getCategoriesAPI,
  getCategoryByIdAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from "../api/category/category.api";

// Load all categories
export const getCategoriesService = async () => {
  const response = await getCategoriesAPI();
  return response.data;
};

// Get single category
export const getCategoryService = async (id) => {
  const response = await getCategoryByIdAPI(id);
  return response.data;
};

// Create new category
export const createCategoryService = async (data) => {
  const response = await createCategoryAPI(data);
  return response.data;
};

// Update category
export const updateCategoryService = async (id, data) => {
  const response = await updateCategoryAPI(id, data);
  return response.data;
};

// Delete category
export const deleteCategoryService = async (id) => {
  const response = await deleteCategoryAPI(id);
  return response.data;
};
