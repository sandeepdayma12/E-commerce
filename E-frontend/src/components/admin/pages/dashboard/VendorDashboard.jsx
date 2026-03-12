import React from "react";
import "./VendorDashboard.css";
import {
  FaBox,
  FaShoppingCart,
  FaClock,
  FaRupeeSign,
  FaChartLine,
  FaChartBar,
  FaBell,
} from "react-icons/fa";

function VendorDashboard() {
  return (
    <div className="vendor-dashboard">
      
      <h2 className="title">🏪 Vendor Dashboard</h2>

      {/* TOP METRIC CARDS */}
      <div className="vendor-cards">

        <div className="v-card v-products">
          <div className="v-icon"><FaBox /></div>
          <h4>Total Products</h4>
          <p>142</p>
        </div>

        <div className="v-card v-orders">
          <div className="v-icon"><FaShoppingCart /></div>
          <h4>Total Orders</h4>
          <p>870</p>
        </div>

        <div className="v-card v-pending">
          <div className="v-icon"><FaClock /></div>
          <h4>Pending Orders</h4>
          <p>32</p>
        </div>

        <div className="v-card v-revenue">
          <div className="v-icon"><FaRupeeSign /></div>
          <h4>Total Revenue</h4>
          <p>₹1,48,900</p>
        </div>

      </div>

      {/* GRAPH CARDS */}
      <h3 className="sub-title">📈 Performance Overview</h3>

      <div className="vendor-graphs">

        <div className="graph-card">
          <h3><FaChartLine /> Sales Growth</h3>
          <div className="graph-placeholder">Line Chart Coming Soon</div>
        </div>

        <div className="graph-card">
          <h3><FaChartBar /> Monthly Revenue</h3>
          <div className="graph-placeholder">Bar Chart Coming Soon</div>
        </div>

      </div>

      {/* PRODUCT PERFORMANCE */}
      <h3 className="sub-title">🔥 Top Selling Products</h3>

      <div className="vendor-top-products">
        <div className="top-product">
          <p><strong>Smartwatch X Pro</strong></p>
          <span>120 Sales</span>
        </div>

        <div className="top-product">
          <p><strong>Wireless Earbuds</strong></p>
          <span>98 Sales</span>
        </div>

        <div className="top-product">
          <p><strong>Bluetooth Speaker</strong></p>
          <span>76 Sales</span>
        </div>
      </div>

      {/* LOW STOCK ALERTS */}
      <h3 className="sub-title">⚠️ Low Stock Alerts</h3>

      <div className="vendor-low-stock">
        <div className="low-box">
          <FaBell />
          <p>3 Items are low in stock</p>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <h3 className="sub-title">📦 Recent Orders</h3>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Rahul</td>
            <td>Bluetooth Speaker</td>
            <td className="status delivered">Delivered</td>
            <td>₹1,499</td>
          </tr>

          <tr>
            <td>Priya</td>
            <td>Smart Watch</td>
            <td className="status pending">Pending</td>
            <td>₹2,799</td>
          </tr>

          <tr>
            <td>Ajay</td>
            <td>Earbuds</td>
            <td className="status shipped">Shipped</td>
            <td>₹999</td>
          </tr>

        </tbody>
      </table>

    </div>
  );
}

export default VendorDashboard;
