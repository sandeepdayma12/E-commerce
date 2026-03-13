import React from "react";
import "./Dashboard.css";
import { FaUsers, FaBox, FaShoppingCart, FaRupeeSign, FaChartLine, FaBell } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="dashboard">

      <h2 className="title">📊 Dashboard Overview</h2>

    
      <div className="cards">

        <div className="card card-users">
          <div className="icon-box"><FaUsers /></div>
          <h3>Total Users</h3>
          <p>1,240</p>
        </div>

        <div className="card card-orders">
          <div className="icon-box"><FaShoppingCart /></div>
          <h3>Total Orders</h3>
          <p>780</p>
        </div>

        <div className="card card-revenue">
          <div className="icon-box"><FaRupeeSign /></div>
          <h3>Total Revenue</h3>
          <p>₹45,800</p>
        </div>

        <div className="card card-products">
          <div className="icon-box"><FaBox /></div>
          <h3>Total Products</h3>
          <p>320</p>
        </div>

      </div>

      
      <div className="grid-3">

        <div className="mini-card">
          <h4> Today’s Orders</h4>
          <p>54</p>
        </div>

        <div className="mini-card">
          <h4> Today’s Revenue</h4>
          <p>₹12,450</p>
        </div>

        <div className="mini-card">
          <h4>Customer Growth</h4>
          <p>+12%</p>
        </div>

      </div>

     
      <div className="grid-2">

        <div className="chart-box">
          <h3><FaChartLine /> Sales Analytics</h3>
          <div className="chart-placeholder">Chart Coming Soon</div>
        </div>

        <div className="orders-box">
          <h3><FaBell /> Recent Orders</h3>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Amit</td>
                <td>Smart Watch</td>
                <td className="status delivered">Delivered</td>
                <td>₹2,999</td>
              </tr>

              <tr>
                <td>Sara</td>
                <td>Headphones</td>
                <td className="status pending">Pending</td>
                <td>₹1,499</td>
              </tr>

              <tr>
                <td>John</td>
                <td>iPhone 14</td>
                <td className="status shipped">Shipped</td>
                <td>₹79,999</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      
      <div className="grid-2">

        <div className="info-box">
          <h3>Best Selling Product</h3>
          <p><strong>iPhone 14</strong> — 180 Sales</p>
        </div>

        <div className="info-box low-stock">
          <h3>Low Stock Alert</h3>
          <p>3 items are low in stock</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
