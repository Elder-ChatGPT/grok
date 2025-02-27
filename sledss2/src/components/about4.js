import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style4.css'; // Import external CSS file

const About4 = () => {
  const [criteria, setCriteria] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const userID = localStorage.getItem('userID'); // Get logged-in user ID
  const navigate = useNavigate();

  const handleGetAdvice = async () => {
    if (!criteria) {
      alert('Please select a criteria.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5009/get-advice', {
        userID,
        criteria,
      });

      setAdvice(response.data.advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdvice('Failed to fetch advice. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="title">Get Personalized Advice</h2>
      <p className="criteria-description">Please select a criteria inorder to receive personalized advice.</p>

      <div className="criteria-container">
        <div className={`criteria-box ${criteria === 'Anyone' ? 'selected' : ''}`} onClick={() => setCriteria('Anyone')}>
          <input
            type="radio"
            value="Anyone"
            checked={criteria === 'Anyone'}
            onChange={() => setCriteria('Anyone')}
            className="radio-input"
          />
          <label className="radio-label">Anyone</label>
          <p className="criteria-description">Get advice based on your personal data.</p>
        </div>

        <div className={`criteria-box ${criteria === 'LikeMe' ? 'selected' : ''}`} onClick={() => setCriteria('LikeMe')}>
          <input
            type="radio"
            value="LikeMe"
            checked={criteria === 'LikeMe'}
            onChange={() => setCriteria('LikeMe')}
            className="radio-input"
          />
          <label className="radio-label">LikeMe</label>
          <p className="criteria-description">Receive advice based on people with similar characteristics like you.</p>
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleGetAdvice} disabled={loading} className="advice-button">
          {loading ? 'Fetching Advice...' : 'Get Advice'}
        </button>
      </div>

      {advice && (
        <div className="advice-container">
        <div className="advice-text">
          <strong>Your Personalized Advice</strong>
          <div >{advice}</div>
        </div>
        </div>
      )}

    </div>
  );
};

export default About4;
