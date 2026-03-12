import { productAPI } from "../instances";

// CREATE product
export const createProductAPI = (data) =>
  productAPI.post("/api/create_product/", data);

// GET all products
export const getProductsAPI = () =>
  productAPI.get("/api/get_products/");

// GET product by ID
export const getProductByIdAPI = (id) =>
  productAPI.get(`/api/product/get/${id}`);

// UPDATE product
export const updateProductAPI = (id, data) =>
  productAPI.put(`/api/update_product/${id}`, data);

// DELETE product
export const deleteProductAPI = (id) =>
  productAPI.delete(`/api/delete_product/${id}`);

export const getProductsByAdminAPI = () =>
  productAPI.get("/api/products/by_admin/");
