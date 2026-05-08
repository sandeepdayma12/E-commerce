import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaCalendarAlt,
  FaCreditCard,
  FaMapMarkerAlt,
  FaReceipt,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { OrderService } from "../../../services/orderService";
import { toProductImageUrl } from "../../../utils/image";
import "./OrderDetails.css";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getOrderItems = (order) => order?.items || order?.order_items || [];

const getItemName = (item) =>
  item?.product_name || item?.name || `Product #${item?.product_id || "—"}`;

const getItemImage = (item) =>
  item?.image_url || item?.image || item?.image_path?.[0] || "";

const getItemPrice = (item) => Number(item?.price_at_purchase || item?.price || 0);

const AddressBlock = ({ title, address }) => (
  <div className="order-address-block">
    <h3>{title}</h3>
    {address ? (
      <>
        <strong>{address.recipient_name || "—"}</strong>
        <span>{address.street || "—"}</span>
        <span>
          {address.city || "—"} {address.postal_code ? `- ${address.postal_code}` : ""}
        </span>
        <span>{address.country || "—"}</span>
      </>
    ) : (
      <span>Address not available.</span>
    )}
  </div>
);

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrderDetails = useCallback(async () => {
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
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const items = useMemo(() => getOrderItems(order), [order]);
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getItemPrice(item) * Number(item.quantity || 0),
        0
      ),
    [items]
  );

  if (loading) {
    return (
      <div className="order-state-page">
        <div className="order-loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="order-state-page">
        <FaReceipt className="order-state-icon" />
        <h2>{errorMsg || "Order not found"}</h2>
        <div className="state-actions">
          {errorMsg && <button onClick={fetchOrderDetails}>Retry</button>}
          <button onClick={() => navigate("/orders")}>Back to Orders</button>
        </div>
      </div>
    );
  }

  const status = String(order.status || "pending").toLowerCase();
  const totalAmount = Number(order.total_amount || subtotal || 0);
  const shippingCost = Math.max(totalAmount - subtotal, 0);
  const paymentDetails = order.payment_details || {};

  return (
    <div className="order-detail-page">
      <header className="order-detail-hero">
        <button className="back-button" onClick={() => navigate("/orders")}>
          <FaArrowLeft /> Back
        </button>

        <div className="order-title-row">
          <div>
            <span className="order-kicker"><FaReceipt /> Order Receipt</span>
            <h1>Order #{order.id}</h1>
            <p>Placed on {formatDate(order.created_at)}</p>
          </div>
          <span className={`status-pill ${status}`}>{order.status || "Pending"}</span>
        </div>
      </header>

      <div className="order-detail-grid">
        <main className="order-main-column">
          <section className="order-panel">
            <div className="panel-title">
              <FaBox />
              <div>
                <h2>Items in this order</h2>
                <p>{items.length} product{items.length === 1 ? "" : "s"} purchased</p>
              </div>
            </div>

            <div className="order-items-list">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const price = getItemPrice(item);
                  const quantity = Number(item.quantity || 0);
                  const lineTotal = price * quantity;

                  return (
                    <article className="order-item-card" key={item.id || `${item.product_id}-${index}`}>
                      <div className="item-image-box">
                        <img
                          src={toProductImageUrl(getItemImage(item))}
                          alt={getItemName(item)}
                          onError={(event) => {
                            event.currentTarget.src = "/vite.svg";
                          }}
                        />
                      </div>
                      <div className="item-content">
                        <div>
                          <span className="item-product-id">Product #{item.product_id || "—"}</span>
                          <h3>{getItemName(item)}</h3>
                        </div>
                        <div className="item-facts">
                          <span>Qty {quantity}</span>
                          <span>{formatCurrency(price)} each</span>
                          {item.admin_id && <span>Seller #{item.admin_id}</span>}
                        </div>
                      </div>
                      <strong className="item-total">{formatCurrency(lineTotal)}</strong>
                    </article>
                  );
                })
              ) : (
                <p className="muted-text">No item details were returned for this order.</p>
              )}
            </div>
          </section>

          <section className="order-panel">
            <div className="panel-title">
              <FaMapMarkerAlt />
              <div>
                <h2>Delivery information</h2>
                <p>Shipping and billing address used for this purchase</p>
              </div>
            </div>
            <div className="address-grid">
              <AddressBlock title="Shipping Address" address={order.shipping_address} />
              <AddressBlock title="Billing Address" address={order.billing_address} />
            </div>
          </section>
        </main>

        <aside className="order-side-column">
          <section className="order-panel summary-panel">
            <div className="panel-title compact">
              <FaReceipt />
              <h2>Price Summary</h2>
            </div>

            <div className="summary-lines">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal || totalAmount)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shippingCost > 0 ? formatCurrency(shippingCost) : "Free"}</strong>
              </div>
              <div className="summary-grand">
                <span>Total Paid</span>
                <strong>{formatCurrency(totalAmount)}</strong>
              </div>
            </div>
          </section>

          <section className="order-panel order-facts-panel">
            <div className="fact-row">
              <FaCalendarAlt />
              <div>
                <span>Created</span>
                <strong>{formatDate(order.created_at)}</strong>
              </div>
            </div>
            <div className="fact-row">
              <FaCalendarAlt />
              <div>
                <span>Updated</span>
                <strong>{formatDate(order.updated_at)}</strong>
              </div>
            </div>
            <div className="fact-row">
              <FaTruck />
              <div>
                <span>Shipping Method</span>
                <strong>{order.shipping_method || "Standard Delivery"}</strong>
              </div>
            </div>
            <div className="fact-row">
              <FaTruck />
              <div>
                <span>Tracking Number</span>
                <strong>{order.tracking_number || "Not assigned"}</strong>
              </div>
            </div>
            <div className="fact-row">
              <FaUser />
              <div>
                <span>Customer ID</span>
                <strong>{order.user_id || "—"}</strong>
              </div>
            </div>
          </section>

          <section className="order-panel payment-panel">
            <div className="panel-title compact">
              <FaCreditCard />
              <h2>Payment</h2>
            </div>
            <div className="payment-grid">
              <span>Method</span>
              <strong>{paymentDetails.method || "Card / Online"}</strong>
              <span>Status</span>
              <strong>{paymentDetails.status || (status === "cancelled" ? "Cancelled" : "Paid / Pending")}</strong>
              <span>Payment ID</span>
              <strong>{paymentDetails.payment_id || paymentDetails.id || "—"}</strong>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
