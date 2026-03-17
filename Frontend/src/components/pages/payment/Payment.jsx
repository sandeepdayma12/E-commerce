import React, { useContext, useEffect, useMemo, useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { ToastContext } from "../../../context/ToastContext";
import { PaymentService } from "../../../services/payment.service";
import "./Payment.css";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function PaymentForm() {
  const { clearCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const fallbackData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("pending_payment");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const paymentData = location.state || fallbackData;
  const orderId = paymentData?.orderId;
  const total = paymentData?.total;
  const billing = paymentData?.billing;

  useEffect(() => {
    if (!orderId || !total) {
      showToast("⚠️ Please complete checkout first.");
      navigate("/checkout");
    }
  }, [orderId, total, navigate, showToast]);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      showToast("⚠️ Payment system not ready.");
      return;
    }

    setLoading(true);
    setPaymentError("");

    try {
      const paymentIntent = await PaymentService.createPaymentIntent({
        amount: total,
        order_id: parseInt(orderId),
        currency: "inr",
      });

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent: confirmed } =
        await stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billing?.name || "",
              email: billing?.email || "",
              phone: billing?.phone || "",
            },
          },
        });

      if (error) {
        setPaymentError(error.message);
        showToast("❌ Payment failed.");
        return;
      }

      if (confirmed?.status === "succeeded") {
        showToast("✅ Payment successful!");
        clearCart();
        sessionStorage.removeItem("pending_payment");

        navigate("/order-success", {
          state: { orderId, total },
        });
      }
    } catch (err) {
      showToast("❌ Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minimal-checkout">
      <div className="checkout-card">

        <div className="top-bar">
          <div className="logo">Shopix</div>
          <div className="total-badge">₹{total || 0}</div>
        </div>

        <div className="card-content">

          <div className="section">
            <div className="section-title">
              <span className="number">1</span>
              <h3>Payment</h3>
            </div>

            {/* Card Icons */}
            <div className="card-icons">
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa"/>
              <img src="https://img.icons8.com/color/48/mastercard-logo.png" alt="Mastercard"/>
              <img src="https://img.icons8.com/color/48/rupay.png" alt="RuPay"/>
            </div>

            <div className="card-input">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#333",
                      "::placeholder": { color: "#aaa" }
                    },
                    invalid: {
                      color: "#e74c3c"
                    }
                  }
                }}
              />
            </div>

            {paymentError && (
              <p className="payment-error">{paymentError}</p>
            )}
          </div>

          <button
            className="complete-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : (
              <>
                Pay Now
                <span className="btn-amount">₹{total}</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  if (!stripePromise) {
    return <div>Stripe not configured</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}