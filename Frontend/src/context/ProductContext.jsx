import { createContext, useEffect, useState } from "react";
import { getProductsService } from "../services/product.service";
import { getCachedValue, setCachedValue } from "../utils/indexedDb";

export const ProductContext = createContext();
const PRODUCTS_CACHE_KEY = "products";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const cachedProducts = await getCachedValue(PRODUCTS_CACHE_KEY);

      if (isMounted && Array.isArray(cachedProducts) && cachedProducts.length > 0) {
        setProducts(cachedProducts);
        setLoading(false);
      }

      try {
        const data = await getProductsService();
        const productList = Array.isArray(data) ? data : [];

        if (!isMounted) return;

        setProducts(productList);
        setCachedValue(PRODUCTS_CACHE_KEY, productList);
      } catch (error) {
        console.log("Product Load Error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}
