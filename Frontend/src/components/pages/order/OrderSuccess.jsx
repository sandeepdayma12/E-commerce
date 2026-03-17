import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const total = location.state?.total;

  return (
    <div className="success-page">
      <div className="success-container">
        
        {/* Success Icon */}
        <div className="icon-wrapper">
          <svg className="success-icon" viewBox="0 0 52 52">
            <circle className="circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        {/* Content */}
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase</p>

        {/* Order Info */}
        {orderId && (
          <div className="order-info">
            <span className="info-label">Order Number</span>
            <span className="info-value">#{orderId}</span>
          </div>
        )}

        {total && (
          <div className="amount-paid">
            <span>Amount Paid</span>
            <strong>₹{total}</strong>
          </div>
        )}

        {/* Buttons */}
        <div className="button-group">
          <Link to="/orders" className="btn-primary">
            View Orders
          </Link>
          <Link to="/shop" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
