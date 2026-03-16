import React, { useEffect, useState } from "react";
import "./OrderList.css";
import { orderAPI } from "../../../../../api/instances";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadOrders = async () => {
    try {
      const res = await orderAPI.get("/orders");
      console.log("Orders:", res.data);

      setOrders(res.data); // <-- This is correct for array
    } catch (error) {
      console.error("Error loading orders:", error);
      setStatus({ type: "error", message: "Failed to load orders." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const exportOrders = () => {
    if (!orders.length) return;

    const headers = ["Order ID", "User Email", "Total Amount", "Status", "Created At"];
    const rows = orders.map((o) => [
      o.id,
      o.user_id,
      o.total_amount,
      o.status,
      o.created_at ? new Date(o.created_at).toISOString() : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="orders-list-container">

      <div className="header">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search Orders..." />
        </div>

        <button className="add-btn" onClick={exportOrders} disabled={!orders.length}>
          Export All Orders
        </button>
      </div>

      {status.message && (
        <p className={status.type === "error" ? "error-text" : "success-text"}>
          {status.message}
        </p>
      )}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Email</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user_id}</td>
              <td>₹{o.total_amount}</td>
              <td>{o.status}</td>
              <td>{o.created_at ? new Date(o.created_at).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && orders.length === 0 && (
        <p className="empty-text">No orders found.</p>
      )}

    </div>
  );
}

export default OrderList;
