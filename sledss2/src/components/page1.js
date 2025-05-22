import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style6.css'; // Import external CSS file

const Page1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    // Calculate the age based on current year and entered year of birth
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - Number(yearOfBirth);
    
    try {
      await axios.post('https://sledssback.elderchatgpt.com./register', { 
        email, 
        password, 
        age: calculatedAge, 
        gender,
        yearOfBirth: Number(yearOfBirth)
      });

   
      alert('Registration successful. Please login.');
      navigate('/about'); // Redirect to Login Page
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Error registering user');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleRegister}>
        <h1 style={headerStyle}>Registration Form</h1>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Email:</label>
          <input 
            style={inputStyle}
            type="email" 
            value={email} 
            required 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Password:</label>
          <input 
            style={inputStyle}
            type="password" 
            value={password} 
            required 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Year of Birth:</label>
          <input 
            style={inputStyle}
            type="number" 
            value={yearOfBirth} 
            required 
            onChange={(e) => setYearOfBirth(e.target.value)} 
            placeholder="e.g. 1950"
          />
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Gender:</label>
          <select 
            style={inputStyle} 
            value={gender} 
            required 
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <button style={{ ...buttonStyle, marginLeft: "10px" }} type="submit">
          Submit
        </button>
        
        <p>
          Already have an account?{' '}
          <span 
            onClick={() => navigate('/about')} 
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: "#f5f5f5",
  padding: "20px",
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
};

const headerStyle = {
  textAlign: "center",
  color: "#0E5580",
  marginBottom: "20px",
};

const inputContainerStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#0E5580",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "100px",
  textAlign: "center",
};

export default Page1;



