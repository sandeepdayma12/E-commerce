import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminStats, getRecentOrders } from '../../../../services/adminDashboard.service.js';
import { FaUsers, FaBox, FaShoppingCart, FaRupeeSign, FaChartLine, FaBell, FaSpinner } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getRecentOrders()
        ]);
        setStats(statsRes);
        setRecentOrders(ordersRes.slice(0, 5)); // Top 5 recent
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const salesData = stats?.salesData || [
    { month: 'Jan', sales: 400 },
    { month: 'Feb', sales: 300 },
    { month: 'Mar', sales: 500 },
    { month: 'Apr', sales: 420 },
    { month: 'May', sales: 600 },
    { month: 'Jun', sales: 580 },
  ];

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString()}`;

  if (loading) {
    return (
      <div className="dashboard">
        <h2 className="title">📊 Dashboard Overview</h2>
        <div className="cards">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)'}}>
              <div className="icon-box"><FaSpinner className="animate-spin" /></div>
              <h3>Loading...</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h2 className="title">📊 Dashboard Overview</h2>
        <div style={{textAlign: 'center', color: 'red'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <h2 className="title">📊 Dashboard Overview</h2>

    
      <div className="cards">

        <div className="card card-users">
          <div className="icon-box"><FaUsers /></div>
          <h3>Total Users</h3>
          <p>{stats?.totalUsers?.toLocaleString() || 0}</p>
        </div>

        <div className="card card-orders">
          <div className="icon-box"><FaShoppingCart /></div>
          <h3>Total Orders</h3>
          <p>{stats?.totalOrders?.toLocaleString() || 0}</p>
        </div>

        <div className="card card-revenue">
          <div className="icon-box"><FaRupeeSign /></div>
          <h3>Total Revenue</h3>
          <p>₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
        </div>

        <div className="card card-products">
          <div className="icon-box"><FaBox /></div>
          <h3>Total Products</h3>
          <p>{stats?.totalProducts?.toLocaleString() || 0}</p>
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
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
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
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const status = order.status || order.order_status || "pending";
                  const product =
                    order.product_name ||
                    order.product?.name ||
                    order.items?.[0]?.product_name ||
                    "Order item";
                  const userName =
                    order.user_name ||
                    order.user?.name ||
                    order.customer_name ||
                    "Customer";
                  const price = order.total_amount || order.price || order.amount;

                  return (
                    <tr key={order.id || `${userName}-${product}`}>
                      <td>{userName}</td>
                      <td>{product}</td>
                      <td className={`status ${String(status).toLowerCase()}`}>{status}</td>
                      <td>{formatCurrency(price)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No recent orders</td>
                </tr>
              )}
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
