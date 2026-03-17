import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminLoggedIn, isAdminAuthLoading } = useContext(AdminContext);
  const location = useLocation();

  if (isAdminAuthLoading) {
    return (
      <div className="auth-guard">
        <div className="auth-guard__card">
          <div className="auth-guard__logo" />
          <div className="auth-guard__line auth-guard__line--lg" />
          <div className="auth-guard__line" />
          <div className="auth-guard__line" />
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedAdminRoute;
