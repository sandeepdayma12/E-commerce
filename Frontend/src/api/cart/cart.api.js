import { cartAPI } from "../instances";
export const getCartAPI = () => cartAPI.get("/cart");

export const addToCartAPI = (data) =>
  cartAPI.post("/cart/items", data);

export const deleteCartAPI = () =>
  cartAPI.delete("/cart");

export const updateCartItemAPI = (product_id, data) =>
  cartAPI.put(`/cart/items/${product_id}`, data);

export const getSingleCartItemAPI = (product_id) =>
  cartAPI.get(`/cart/items/${product_id}`);
