import React from "react";
import { Navigate } from "react-router-dom";

// allowedRole: the role required to access this route
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in but wrong role → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authorized → render page
  return children;
};

export default ProtectedRoute;
