import React from "react";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('authToken'); // If you're using tokens
    localStorage.removeItem('userSession'); // Any other session data

    // ✅ Clear only the logged-out user's completed tests
    const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
    const userId = localStorage.getItem('userID');

    if (userId) {
      // Retrieve the completed tests from localStorage
      let storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};

      // ✅ If user has completed tests, remove "Checkmate" but keep timestamp
      if (storedCompletedTests[userId]) {
        Object.keys(storedCompletedTests[userId]).forEach((category) => {
          if (storedCompletedTests[userId][category].status === "Checkmate") {
            // Keep only the timestamp
            storedCompletedTests[userId][category] = {
              completedAt: storedCompletedTests[userId][category].completedAt
            };
          }
        });

        // Save the updated data back to localStorage
        localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
      }
    }
    alert('Logout successful');
    navigate('/'); // Redirect to login page
  };

  return (
    <div style={logoutContainer} onClick={handleLogout}>
      <LogOut size={30} color="white" style={iconStyle} />
      <span style={logoutTextStyle}>Logout</span>
    </div>
  );
};

// Styles
const logoutContainer = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  backgroundColor: '#0E5580',
  padding: '10px 15px',
  borderRadius: '25px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  cursor: 'pointer',
};

const logoutTextStyle = {
  color: 'white',
  marginLeft: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
};

export default Logout;
