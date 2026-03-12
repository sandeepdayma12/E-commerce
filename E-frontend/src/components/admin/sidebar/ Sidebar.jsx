import React, { useState } from "react";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  const [isOpen, setIsOpen] = useState(true); // show sidebar by default

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      <div className={isOpen ? "sidebar open" : "sidebar closed"}>
        <h2 className="logo">ADMIN</h2>

        <ul className="menu-list">

          <li className="menu-item">
            <Link to="/admin/dashboard" className="li-link">
              <FaHome /><span>Dashboard</span>
            </Link>
          </li>

          {/* PRODUCT */}
          <li className="dropdown" onClick={() => setOpenProduct(!openProduct)}>
            <FaBox /><span>Product</span>
            {openProduct ? <FaChevronUp /> : <FaChevronDown />}
          </li>

          {openProduct && (
            <ul className="submenu">
              <li><Link to="/admin/addProduct">Create Product</Link></li>
              <li><Link to="/admin/productList">Product List</Link></li>
             
            </ul>
          )}

          {/* CATEGORY */}
          <li className="dropdown" onClick={() => setOpenCategory(!openCategory)}>
            <FaChartPie /><span>Category</span>
            {openCategory ? <FaChevronUp /> : <FaChevronDown />}
          </li>

          {openCategory && (
            <ul className="submenu">
              <li><Link to="/admin/createcategory">Create Category</Link></li>
              <li><Link to="/admin/categoryList">Category List</Link></li>
            </ul>
          )}

          {/* USERS */}
          <li className="menu-item">
            <Link to="/admin/users" className="li-link">
              <FaUsers /><span>Users</span>
            </Link>
          </li>

          {/* ORDERS */}
          <li className="dropdown" onClick={() => setOpenOrder(!openOrder)}>
            <FaShoppingCart /><span>Orders</span>
            {openOrder ? <FaChevronUp /> : <FaChevronDown />}
          </li>

          {openOrder && (
            <ul className="submenu">
              <li><Link to="/admin/orderList">Order List</Link></li>
            </ul>
          )}

        </ul>
      </div>
    </>
  );
}

export default Sidebar;
