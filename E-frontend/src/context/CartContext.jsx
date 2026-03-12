import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";

import {
  getCartAPI,
  addToCartAPI,
  deleteCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
} from "../services/cartService";

import { ToastContext } from "./ToastContext";
import { AuthContext } from "./AuthContext";
import { getProductByIdAPI } from "../api/product/product.api";
import { productAPI } from "../api/instances";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const productCache = useRef({});

  const BASE_IMAGE_URL = productAPI.defaults.baseURL;

  const fetchProductDetails = useCallback(async (product_id) => {
    if (productCache.current[product_id]) {
      return productCache.current[product_id];
    }

    try {
      const res = await getProductByIdAPI(product_id);
      const product = res.data;

      productCache.current[product_id] = product;
      return product;
    } catch (err) {
      console.error("Product fetch failed:", err);
      return null;
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await getCartAPI();
      const items = res.items || [];

      const merged = await Promise.all(
        items.map(async (item) => {
          const product = await fetchProductDetails(item.product_id);

          let imageList = [];
          try {
            imageList = JSON.parse(product?.image_path || "[]");
          } catch {
            imageList = [];
          }

          const img = imageList.length
            ? `${BASE_IMAGE_URL}/${imageList[0].replace(/^\/+/, "")}`
            : "/placeholder.png";

          return {
            id: item.product_id,
            qty: item.quantity,
            name: product?.name || "Unknown",
            price: Number(product?.price || 0),
            stock: Number(product?.quantity || 0),
            img,
          };
        })
      );

      merged.sort((a, b) => a.id - b.id);
      setCart(merged);

    } catch (err) {
      console.error("Cart load error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchProductDetails, BASE_IMAGE_URL]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [isLoggedIn, fetchCart]);

  const addToCart = useCallback(
    async (product_id, qty = 1) => {
      const existing = cart.find((i) => i.id === product_id);

      if (existing) {
        const newQty = existing.qty + qty;

        if (newQty > existing.stock) {
          showToast(`Only ${existing.stock} items available`);
          return;
        }

        await updateCartItemAPI(product_id, newQty);
        showToast("Cart updated!");
        fetchCart();
        return;
      }

      try {
        await addToCartAPI(product_id, qty);
        showToast("Added to cart!");
        fetchCart();
      } catch (e) {
        console.error("addToCart error:", e);
      }
    },
    [cart, fetchCart, showToast]
  );

  const updateQty = useCallback(
    async (product_id, qty) => {
      const item = cart.find((i) => i.id === product_id);
      if (!item) return;

      if (qty > item.stock) {
        showToast(`Only ${item.stock} available`);
        return;
      }

      if (qty < 1) return;

      try {
        await updateCartItemAPI(product_id, qty);
        fetchCart();
      } catch (e) {
        console.error("Update qty error:", e);
      }
    },
    [cart, fetchCart, showToast]
  );

  const removeFromCart = useCallback(
    async (product_id) => {
      try {
        await removeCartItemAPI(product_id);
        fetchCart();
      } catch (e) {
        console.error("Remove error:", e);
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await deleteCartAPI();
      setCart([]);
    } catch (e) {
      console.error("Clear cart error:", e);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
