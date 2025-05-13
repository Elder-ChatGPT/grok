import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userID) {
      // Redirect to login page if user is not authenticated
      navigate("http://elderchatgpt.com:5018/", { replace: true });
    }
  }, [userID, navigate, location]);

  // Render children only if user is authenticated
  return userID ? children : null;
};

export default ProtectedRoute;
