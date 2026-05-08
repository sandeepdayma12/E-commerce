import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaCalendarAlt, FaChevronRight, FaReceipt, FaShoppingBag } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { OrderService } from "../../../services/orderService";
import { toProductImageUrl } from "../../../utils/image";
import "./OrderHistory.css";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getOrderItems = (order) => order?.items || order?.order_items || [];

const getItemImage = (item) =>
  item?.image_url || item?.image || item?.image_path?.[0] || "";

const getItemName = (item) =>
  item?.product_name || item?.name || `Product #${item?.product_id || "—"}`;

export default function OrderHistory() {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadOrders = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await OrderService.getUserOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Order fetch failed:", err);
        setErrorMsg("Unable to load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      ),
    [orders]
  );

  const totalItems = (order) =>
    getOrderItems(order).reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  if (loading) {
    return (
      <div className="orders-state">
        <div className="orders-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <header className="orders-hero">
        <div>
          <span className="orders-kicker"><FaReceipt /> Purchases</span>
          <h1>Your Orders</h1>
          <p>Track purchases, review delivery details, and open full invoices.</p>
        </div>
        <Link to="/shop" className="orders-shop-link">
          <FaShoppingBag /> Shop More
        </Link>
      </header>

      {errorMsg && (
        <div className="orders-alert">
          <strong>{errorMsg}</strong>
          <span>Refresh the page or try again after a moment.</span>
        </div>
      )}

      {sortedOrders.length === 0 ? (
        <div className="empty-orders">
          <FaBoxOpen className="empty-icon" />
          <h2>No orders yet</h2>
          <p>When you place an order, product images, totals, and delivery status will show here.</p>
          <Link to="/shop" className="start-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {sortedOrders.map((order) => {
            const items = getOrderItems(order);
            const previewItems = items.slice(0, 4);
            const status = String(order.status || "pending").toLowerCase();

            return (
              <button
                type="button"
                className="order-card"
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="order-card-main">
                  <div className="order-card-head">
                    <div>
                      <span className="order-label">Order #{order.id}</span>
                      <h2>{items.length ? getItemName(items[0]) : "Order details"}</h2>
                    </div>
                    <span className={`status-pill ${status}`}>{order.status || "Pending"}</span>
                  </div>

                  <div className="order-meta-row">
                    <span><FaCalendarAlt /> {formatDate(order.created_at)}</span>
                    <span>{totalItems(order)} item{totalItems(order) === 1 ? "" : "s"}</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>

                  <div className="order-preview-strip">
                    {previewItems.length > 0 ? (
                      previewItems.map((item, index) => (
                        <div className="order-preview-item" key={item.id || `${item.product_id}-${index}`}>
                          <img
                            src={toProductImageUrl(getItemImage(item))}
                            alt={getItemName(item)}
                            onError={(event) => {
                              event.currentTarget.src = "/vite.svg";
                            }}
                          />
                          <span>x{item.quantity || 1}</span>
                        </div>
                      ))
                    ) : (
                      <span className="order-no-items">No item details available</span>
                    )}
                    {items.length > previewItems.length && (
                      <div className="order-more">+{items.length - previewItems.length}</div>
                    )}
                  </div>
                </div>

                <div className="order-card-action">
                  <span>View Details</span>
                  <FaChevronRight />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
