import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      navigate("/shop");
      return;
    }
    navigate(`/shop?search=${search}`);
  };

  // Auto-search on typing
  useEffect(() => {
  if (search.trim() !== "") {
    const delay = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delay);
  }
}, [search]);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-logo">
        <Link to="/" className="logo-text">
          <span className="brand-main">Shop</span>
          <span className="brand-sub">ix</span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="navbar-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      {/* DESKTOP BUTTONS */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-btn">
              <FaUser /> Profile
            </Link>

            <Link to="/cart" className="nav-btn">
              <FaShoppingCart /> Cart
            </Link>

            <button className="nav-btn logout-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>

              <Link
                to="/cart"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Cart
              </Link>

              <button
                className="mobile-item logout-btn"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="mobile-item"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

    </nav>
  );
}

export default Navbar;
