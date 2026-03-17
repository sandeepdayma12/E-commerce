import { AuthProvider } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { ToastProvider } from "./ToastContext";
import { AdminProvider } from "./AdminContext";

export default function AppContextProvider({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
