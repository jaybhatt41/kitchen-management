import React from "react";
import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = Date.now() >= payload.exp * 1000;
    if(isExpired)
    {
        localStorage.removeItem("token")
    }
    return !isExpired;
  } catch (error) {
    localStorage.removeItem("token")

    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

export default ProtectedRoute;
