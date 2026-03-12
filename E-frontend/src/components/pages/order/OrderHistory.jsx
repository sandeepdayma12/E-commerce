import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { OrderService } from "../../../services/orderService";
import { Link, useNavigate } from "react-router-dom";
import "./OrderHistory.css";

export default function OrderHistory() {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) loadOrders();
  }, [isLoggedIn]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getUserOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Order fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="orders-page">
      
      <div className="orders-header">
        <h1>Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-box">
            <span className="empty-emoji">🛒</span>
            <h2>No orders yet</h2>
            <p>Your order history will appear here</p>
            <Link to="/shop" className="start-btn">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div 
              className="order-box" 
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
            >
              
              <div className="box-top">
                <div className="order-number">
                  <small>Order</small>
                  <strong>#{order.id}</strong>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="box-date">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="box-items">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <div className="mini-item" key={idx}>
                    <img
                      src={`${
                        import.meta.env.VITE_PRODUCT_URL ||
                        "http://192.168.29.249:8001"
                      }/${item.image?.replace(/^\/+/, "")}`}
                      alt={item.name}
                    />
                    <div className="mini-details">
                      <p>{item.name}</p>
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                ))}

                {order.items?.length > 3 && (
                  <p className="more-items">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="box-bottom">
                <span className="total-text">Total</span>
                <span className="total-price">₹{order.total_amount}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
