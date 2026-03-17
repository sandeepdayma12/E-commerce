import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAuthLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthLoading) {
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

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
