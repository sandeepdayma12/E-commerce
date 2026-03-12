import { createContext, useEffect, useState } from "react";
import { productAPI } from "../api/instances"; 

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await productAPI.get("/api/get_products/");
        setProducts(res.data);
      } catch (error) {
        console.log("Product Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}
