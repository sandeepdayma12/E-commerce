import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
  useMemo,
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
import { toProductImageUrl, getProductImagePaths } from "../utils/image";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const productCache = useRef({});

  const fetchProductDetails = useCallback(async (product_id) => {
    if (productCache.current[product_id]) {
      return productCache.current[product_id];
    }

    try {
      const res = await getProductByIdAPI(product_id);
      const product = res.data;

      productCache.current[product_id] = product;
      return product;
    } catch {
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

          const imagePaths = getProductImagePaths(product?.image_path);
          const img = imagePaths.length > 0
            ? toProductImageUrl(imagePaths[0])
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

    } catch {
      // Cart load error handled by context state
    } finally {
      setLoading(false);
    }
  }, [fetchProductDetails]);

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
      } catch {
        // Add to cart error handled by toast
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
      } catch {
        // Update qty error handled by context state
      }
    },
    [cart, fetchCart, showToast]
  );

  const removeFromCart = useCallback(
    async (product_id) => {
      try {
        await removeCartItemAPI(product_id);
        fetchCart();
      } catch {
        // Remove error handled by context state
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await deleteCartAPI();
      setCart([]);
    } catch {
      // Clear cart error handled by context state
    }
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
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
