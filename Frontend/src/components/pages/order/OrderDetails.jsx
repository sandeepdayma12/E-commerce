import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderService } from "../../../services/orderService";
import "./OrderDetails.css";
import { toProductImageUrl } from "../../../utils/image";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await OrderService.getOrderById(orderId);
      setOrder(data || null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setErrorMsg("Unable to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-IN", {
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

  if (errorMsg) {
    return (
      <div className="simple-error">
        <h2>{errorMsg}</h2>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button onClick={fetchOrderDetails}>Retry</button>
          <button onClick={() => navigate("/orders")}>Back to Orders</button>
        </div>
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

  const safeOrder = {
    ...order,
    shipping_address: order?.shipping_address || {},
    billing_address: order?.billing_address || {},
    payment_details: order?.payment_details || {},
  };

  const totalAmount =
    typeof safeOrder.total_amount === "number"
      ? safeOrder.total_amount
      : Number(safeOrder.total_amount || 0);
  const shippingCost =
    typeof safeOrder.shipping_cost === "number"
      ? safeOrder.shipping_cost
      : Number(safeOrder.shipping_cost || 0);
  const items = safeOrder.order_items || safeOrder.items || [];

  return (
    <div className="simple-order-page">
      <div className="simple-container">
        <header className="simple-header">
          <button className="back-link" onClick={() => navigate("/orders")}>
            ← Back
          </button>
          <div className="header-info">
            <h1>Order #{safeOrder.id}</h1>
            <div className="header-meta">
              <span className="order-date">{formatDate(safeOrder.created_at)}</span>
              <span className={`simple-status ${(safeOrder.status || "unknown").toLowerCase()}`}>
                {safeOrder.status || "Unknown"}
              </span>
            </div>
          </div>
        </header>

        <div className="simple-content">
          <div className="main-section">
            <section className="simple-card">
              <h2>Order Details</h2>
              <div className="info-list">
                <div className="info-item">
                  <span>Order Date</span>
                  <strong>{formatDate(safeOrder.created_at)}</strong>
                </div>
                <div className="info-item">
                  <span>Last Updated</span>
                  <strong>{formatDate(safeOrder.updated_at)}</strong>
                </div>
                {safeOrder.tracking_number && (
                  <div className="info-item">
                    <span>Tracking Number</span>
                    <strong className="tracking">{safeOrder.tracking_number}</strong>
                  </div>
                )}
                {safeOrder.shipping_method && (
                  <div className="info-item">
                    <span>Shipping Method</span>
                    <strong>{safeOrder.shipping_method}</strong>
                  </div>
                )}
              </div>
            </section>

            <section className="simple-card">
              <h2>Order Items ({items.length})</h2>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="order-item-row"
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      padding: "1rem 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.image_url && (
                      <img
                        src={toProductImageUrl(item.image_url)}
                        alt={item.product_name || "Item"}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>
                        {item.product_name || "N/A"}
                      </h4>
                      <p style={{ margin: 0 }}>Qty: {item.quantity || 0}</p>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        ₹{(Number(item.price_at_purchase || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items in this order.</p>
              )}
            </section>

            <section className="simple-card">
              <h2>Delivery Information</h2>
              {!safeOrder.shipping_address.recipient_name &&
                !safeOrder.shipping_address.street &&
                !safeOrder.shipping_address.city &&
                !safeOrder.shipping_address.postal_code &&
                !safeOrder.shipping_address.country &&
                !safeOrder.billing_address.recipient_name &&
                !safeOrder.billing_address.street &&
                !safeOrder.billing_address.city &&
                !safeOrder.billing_address.postal_code &&
                !safeOrder.billing_address.country && (
                  <p style={{ marginTop: "0.5rem" }}>Address not available.</p>
                )}

              <div className="address-group">
                <div className="address-block">
                  <h3>Shipping Address</h3>
                  <p className="name">{safeOrder.shipping_address.recipient_name || "—"}</p>
                  <p>{safeOrder.shipping_address.street || "—"}</p>
                  <p>
                    {safeOrder.shipping_address.city || "—"},{" "}
                    {safeOrder.shipping_address.postal_code || "—"}
                  </p>
                  <p>{safeOrder.shipping_address.country || "—"}</p>
                </div>

                <div className="divider"></div>

                <div className="address-block">
                  <h3>Billing Address</h3>
                  <p className="name">{safeOrder.billing_address.recipient_name || "—"}</p>
                  <p>{safeOrder.billing_address.street || "—"}</p>
                  <p>
                    {safeOrder.billing_address.city || "—"},{" "}
                    {safeOrder.billing_address.postal_code || "—"}
                  </p>
                  <p>{safeOrder.billing_address.country || "—"}</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="sidebar-section">
            <div className="simple-card summary-card">
              <h2>Summary</h2>
              <div className="summary-list">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>
                    {shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : <span className="free">Free</span>}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              {safeOrder.payment_details && (
                <div className="payment-info">
                  <div className="payment-row">
                    <span>Payment Method</span>
                    <span>{safeOrder.payment_details.method || "—"}</span>
                  </div>
                  <div className="payment-row">
                    <span>Status</span>
                    <span className="payment-badge">{safeOrder.payment_details.status || "—"}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="simple-card">
              <h2>Customer</h2>
              <p className="customer-id">{safeOrder.user_id || "—"}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
