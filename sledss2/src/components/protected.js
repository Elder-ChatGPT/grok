import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userID = localStorage.getItem("userID"); // Check if user is logged in

  return userID ? children : <Navigate to="/home" replace />; // Redirect if not logged in
};

export default ProtectedRoute;