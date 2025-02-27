import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const About1 = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID'); // Retrieve userID from local storage

  const [scores, setScores] = useState({
    Socialization: '',
    Learning: '',
    Exercise: '',
    Diet: '',
    Stress: '',
    Sleep: '',
  });

  const handleChange = (e) => {
    setScores({ ...scores, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert scores to numbers and validate range for only provided inputs
    const formattedScores = {};
    let atLeastOneProvided = false;
    for (let key in scores) {
      if (scores[key].trim() !== '') {
        atLeastOneProvided = true;
        const value = Number(scores[key]);
        if (value < 10 || value > 90) {
          alert(`${key} score must be between 10 and 90`);
          return;
        }
        formattedScores[key] = value;
      }
    }
    
    if (!atLeastOneProvided) {
      alert("Please enter at least one forum score.");
      return;
    }

    try {
      await axios.post('http://localhost:5009/submit-scores', { userID, scores: formattedScores });
      alert('Scores submitted successfully');
      navigate('/about5'); // Redirect to Advice Page
    } catch (error) {
      console.error('Score submission failed:', error);
      alert('Error submitting scores');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={headerStyle}>Score Submission Form</h1>
        {Object.keys(scores).map((forum) => (
          <div style={inputContainerStyle} key={forum}>
            <label style={labelStyle}>{forum} Score:</label>
            <input
              style={inputStyle}
              type="number"
              name={forum}
              value={scores[forum]}
              onChange={handleChange}
              min="10"
              max="90"
            />
          </div>
        ))}
        <button style={{ ...buttonStyle, marginLeft: "10px" }} type="submit">
          Submit Scores
        </button>
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
  width: "150px",
  textAlign: "center",
};

export default About1;
