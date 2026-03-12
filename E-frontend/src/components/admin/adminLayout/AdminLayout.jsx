import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../sidebar/ Sidebar";
import Footer from "../footer/Footer";
import "./AdminLayout.css";

export default function Layout() {
  const location = useLocation();
  const authRoutes = ["/admin/login", "/admin/register"];

  const hideLayout = authRoutes.includes(location.pathname);
  return (
    <>
      { <Header />}
      <div className="layout-wrapper">
        {!hideLayout && <Sidebar />}
        <main className="layout-content" style={{ width: hideLayout ? "100%" : "auto" }}>
          <Outlet />
        </main>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}
