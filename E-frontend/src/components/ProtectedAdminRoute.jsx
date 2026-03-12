import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminLoggedIn } = useContext(AdminContext);

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
