import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../../helpers/AuthStatus";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();

  // Checks both: (1) Token existence and (2) Expiration against backend JWT `exp`
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If token is present and NOT expired, render children
  return children;
}