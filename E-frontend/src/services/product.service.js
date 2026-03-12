import {
  createProductAPI,
  getProductsAPI,
  getProductByIdAPI,
  updateProductAPI,
  deleteProductAPI,
  getProductsByAdminAPI
} from "../api/product/product.api";

// Create Product
export const createProductService = async (formData) => {
  const res = await createProductAPI(formData);
  return res.data;
};

// Get all Products
export const getProductsService = async () => {
  const res = await getProductsAPI();
  return res.data;
};

// Get Product by ID
export const getProductByIdService = async (id) => {
  const res = await getProductByIdAPI(id);
  return res.data;
};

// Update Product
export const updateProductService = async (id, data) => {
  const res = await updateProductAPI(id, data);
  return res.data;
};

// Delete Product
export const deleteProductService = async (id) => {
  const res = await deleteProductAPI(id);
  return res.data;
};

export const getProductsByAdminService = async () => {
  const res = await getProductsByAdminAPI();
  return res.data;
};

