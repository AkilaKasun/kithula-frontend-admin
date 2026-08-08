import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../helpers/AuthStatus";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAccessToken();

  // Pure synchronous check: If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If token exists, render children directly WITHOUT setting state
  return children;
}