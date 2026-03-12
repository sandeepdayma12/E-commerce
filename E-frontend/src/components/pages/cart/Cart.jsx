import React, { useContext, useMemo, useCallback } from "react";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();


  /* ---------------- CALCULATIONS (memoized) ---------------- */

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const shipping = useMemo(() => (subtotal > 500 ? 0 : 50), [subtotal]);
  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);

  /* ---------------- HANDLE CHECKOUT ---------------- */

  const handleCheckout = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }, [isLoggedIn, navigate]);

  /* ---------------- EMPTY CART UI ---------------- */

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon"><i class="ri-shopping-cart-2-fill"></i></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <button className="shop-now-btn" onClick={() => navigate("/shop")}>
          Start Shopping
        </button>
      </div>
    );
  }


  return (
    <div className="cart-page">
      <div className="cart-container">
        
        {/* LEFT - CART ITEMS */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2>Shopping Cart ({cart.length} items)</h2>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear All
            </button>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-card" key={item.id}>

                <div className="cart-item-image">
                  <img src={item.img} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price} each</p>

                  <div className="cart-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <p className="total-price">₹{item.price * item.qty}</p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          {subtotal < 500 && (
            <div className="free-shipping-notice">
              Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
