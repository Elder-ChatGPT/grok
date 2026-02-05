import React, { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (!userID) {
      // Redirect to home page (works for both production and testing)
      window.location.replace("/");
    }
  }, [userID]);

  return userID ? children : null;
};

export default ProtectedRoute;
