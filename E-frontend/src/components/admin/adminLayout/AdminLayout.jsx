import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import "./AdminLayout.css";

export default function Layout() {
const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const authRoutes = ["/admin/login", "/admin/register"];

  const hideLayout = authRoutes.includes(location.pathname);
  return (
    <>
 {!hideLayout && <Header toggleSidebar={() => setIsOpen(!isOpen)} />}
      <div className="layout-wrapper">
 {!hideLayout && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
        <main className="layout-content" style={{ width: hideLayout ? "100%" : "auto" }}>
          <Outlet />
        </main>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}
