import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContext } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { OrderService } from "../../../services/orderService";
import "./Checkout.css";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { isLoggedIn, user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.Mobile_Number || "",
    address: "",
    city: "",
    pincode: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.length) navigate("/cart");
  }, [cart, navigate]);

  // Price calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  // Helper: update form fields
  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate fields
  const validateForm = () => {
  const { name, mobile, address, city, pincode } = formData;

  if (!name || !mobile || !address || !city || !pincode) {
    showToast("⚠️ Please fill all details");
    return false;
  }

  if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
    showToast("⚠️ Mobile number must be 10 digits (numbers only)");
    return false;
  }

  if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    showToast("⚠️ Pincode must be 6 digits (numbers only)");
    return false;
  }

  return true;
};


  // Submit order
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        cart_items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        shipping_address: {
          recipient_name: formData.name,
          street: formData.address,
          city: formData.city,
          postal_code: formData.pincode,
          country: "India",
        },
      };

      const result = await OrderService.createOrder(payload);

      showToast("✅ Order placed successfully!");

      clearCart();

      navigate("/order-success", {
        state: { orderId: result?.id, total },
      });
    } catch (error) {
      showToast("❌ Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minimal-checkout">
      <div className="checkout-card">

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="logo">Shopix</div>
          <div className="total-badge">₹{total}</div>
        </div>

        {/* CONTENT */}
        <div className="card-content">

          {/* SHIPPING INFO */}
          <div className="section">
            <div className="section-title">
              <span className="number">1</span>
              <h3>Shipping Information</h3>
            </div>

            <div className="inputs">
              <div className="row-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  maxLength="10"
                  onChange={(e) => updateForm("mobile", e.target.value)}
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />

              <div className="row-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  maxLength="6"
                  onChange={(e) => updateForm("pincode", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ORDER DETAILS */}
          <div className="section">
            <div className="section-title">
              <span className="number">2</span>
              <h3>Order Details</h3>
            </div>

            <div className="order-list">
              {cart.map((item) => (
                <div className="order-row" key={item.id}>
                  <div className="item-left">
                    <div className="qty-badge">{item.qty}x</div>
                    <span>{item.name}</span>
                  </div>
                  <span className="price">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="price-summary">
              <div className="price-line">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="price-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
            </div>
          </div>

          <button
            className="complete-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <span>Complete Order</span>
                <span className="btn-amount">₹{total}</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
