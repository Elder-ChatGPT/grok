import React, { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (!userID) {
      // Redirect using a full page reload
      window.location.replace("http://elderchatgpt.com:5018/");
    }
  }, [userID]);

  return userID ? children : null;
};

export default ProtectedRoute;
