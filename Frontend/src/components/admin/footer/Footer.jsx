import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} Your E-Commerce Admin Panel. All Rights Reserved.</p>
    </footer>
  );
}
