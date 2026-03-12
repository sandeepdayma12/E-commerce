import React, { useContext, useState } from "react";
import { FaSearch, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";

function Header() {
  const { isAdminLoggedIn, logout } = useContext(AdminContext);
  const navigate = useNavigate();

 
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-header">
     
      <div className="navbar-logo">
        <div className="logo-text">
          <span className="brand-main">Shop</span>
          <span className="brand-sub">ix</span>
        </div>
      </div>


      <div className="header-right">

        {isAdminLoggedIn ? (
          <>
            {/* <FaBell className="icon bounce" />
            <MdEmail className="icon bounce" /> */}

            <Link to="/admin/profile" className="icon-link">
              <FaUser className="icon bounce" />
            </Link>

            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            {/* LOGIN visible first */}
            {!showRegister && (
              <Link
                to="/admin/login"
                className="icon-link"
                onClick={() => setShowRegister(true)}
              >
                <FaUser className="icon" /> Login
              </Link>
            )}

            {/* REGISTER visible after clicking Login */}
            {showRegister && (
              <Link
                to="/admin/register"
                className="icon-link"
                onClick={() => setShowRegister(false)}
              >
                <FaUser className="icon" /> Register
              </Link>
            )}
          </>
        )}

      </div>
      </div>

      );
}

      export default Header;
