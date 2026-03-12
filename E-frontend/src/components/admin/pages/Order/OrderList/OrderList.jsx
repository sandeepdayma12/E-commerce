import React, { useEffect, useState } from "react";
import "./OrderList.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function OrderList() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await axios.get("http://192.168.29.249:8004/orders");
      console.log("Orders:", res.data);

      setOrders(res.data); // <-- This is correct for array
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="orders-list-container">

      <div className="header">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search Orders..." />
        </div>

        <button className="add-btn">
          <Link to="/admin/exportOrders">Export All Orders</Link>
        </button>
      </div>

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
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default OrderList;
