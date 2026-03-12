import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderService } from "../../../services/orderService";
import "./OrderDetails.css";

export default function OrderDetailsSimple() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      await OrderService.cancelOrder(orderId);
      fetchOrderDetails();
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="simple-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="simple-error">
        <h2>Order not found</h2>
        <button onClick={() => navigate("/orders")}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="simple-order-page">
      <div className="simple-container">
        
        {/* Header */}
        <header className="simple-header">
          <button className="back-link" onClick={() => navigate("/orders")}>
            ← Back
          </button>
          <div className="header-info">
            <h1>Order #{order.id}</h1>
            <div className="header-meta">
              <span className="order-date">{formatDate(order.created_at)}</span>
              <span className={`simple-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="simple-content">
          
          {/* Left Side */}
          <div className="main-section">
            
            {/* Order Info */}
            <section className="simple-card">
              <h2>Order Details</h2>
              <div className="info-list">
                <div className="info-item">
                  <span>Order Date</span>
                  <strong>{formatDate(order.created_at)}</strong>
                </div>
                <div className="info-item">
                  <span>Last Updated</span>
                  <strong>{formatDate(order.updated_at)}</strong>
                </div>
                {order.tracking_number && (
                  <div className="info-item">
                    <span>Tracking Number</span>
                    <strong className="tracking">{order.tracking_number}</strong>
                  </div>
                )}
                {order.shipping_method && (
                  <div className="info-item">
                    <span>Shipping Method</span>
                    <strong>{order.shipping_method}</strong>
                  </div>
                )}
              </div>
            </section>

            {/* Addresses */}
            <section className="simple-card">
              <h2>Delivery Information</h2>
              
              <div className="address-group">
                <div className="address-block">
                  <h3>Shipping Address</h3>
                  <p className="name">{order.shipping_address.recipient_name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.country}</p>
                </div>

                <div className="divider"></div>

                <div className="address-block">
                  <h3>Billing Address</h3>
                  <p className="name">{order.billing_address.recipient_name}</p>
                  <p>{order.billing_address.street}</p>
                  <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
                  <p>{order.billing_address.country}</p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <aside className="sidebar-section">
            
            {/* Payment Summary */}
            <div className="simple-card summary-card">
              <h2>Summary</h2>
              
              <div className="summary-list">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span className="free">Free</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>₹{order.total_amount.toFixed(2)}</strong>
                </div>
              </div>

              {order.payment_details && (
                <div className="payment-info">
                  <div className="payment-row">
                    <span>Payment Method</span>
                    <span>{order.payment_details.method}</span>
                  </div>
                  <div className="payment-row">
                    <span>Status</span>
                    <span className="payment-badge">{order.payment_details.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer */}
            <div className="simple-card">
              <h2>Customer</h2>
              <p className="customer-id">{order.user_id}</p>
            </div>

            {/* Actions */}
            {["pending", "processing"].includes(order.status.toLowerCase()) && (
              <button className="cancel-button" onClick={cancelOrder}>
                Cancel Order
              </button>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
}
