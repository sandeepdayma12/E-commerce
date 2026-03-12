import { data } from "react-router-dom";
import { cartAPI } from "../api/instances";

// Generic request wrapper
const request = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    console.error("Cart API Error:", err);
    throw err.response?.data || err;
  }
};

// GET cart items
export const getCartAPI = () =>
  request(() => cartAPI.get("/cart"));

// ADD item
export const addToCartAPI = (product_id, quantity = 1) =>
  request(() =>
    cartAPI.post("/cart/items", { product_id, quantity })
  );

// UPDATE qty
export const updateCartItemAPI = (product_id, quantity) =>
  request(() =>
    cartAPI.put(`/cart/items/${product_id}`, { quantity })
  );

// DELETE single cart item
export const removeCartItemAPI = (product_id) =>
  request(() => cartAPI.delete(`/cart/items/${product_id}`));

// DELETE entire cart
export const deleteCartAPI = () =>
  request(() => cartAPI.delete("/cart"));

// GET single cart item
export const getSingleCartItemAPI = (product_id) =>
  request(() => cartAPI.get(`/cart/items/${product_id}`));
