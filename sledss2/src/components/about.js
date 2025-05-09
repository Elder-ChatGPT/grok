import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Custom hook to get query parameters (userId)
const useUserId = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get('userId'); // '12345'
};

const About = () => {
  const navigate = useNavigate();
  const userId = useUserId(); // Call the custom hook here, at the top of the component
  const [storedUserId, setStoredUserId] = useState(null); // State to store the userId

  useEffect(() => {
    if (userId) {
      setStoredUserId(userId); // Store userId in state
      localStorage.setItem('userID', userId); // Store userId in localStorage
    }
  }, [userId]); // Dependency array ensures it runs only when userId changes

  const handleLogin = async () => {
    
    try {
      navigate('/home'); // Navigate to evaluations page
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid email');
    }
  };

  return (
    <div style={bodyStyle}>
      
      <button style={{ ...buttonStyle, marginLeft: '10px' }}  onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: '#f5f5f5',
  padding: '20px',
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const buttonStyle = {
  backgroundColor: '#0E5580',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100px',
  textAlign: 'center',
};

export default About;
