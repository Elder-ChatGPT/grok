import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaUsers, FaLightbulb } from 'react-icons/fa';
import './Style4.css';
import config from './config';

const About4 = () => {
  const [criteria, setCriteria] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const userID = localStorage.getItem('userID');
  

  useEffect(() => {
    if (criteria) {
      fetchAdvice(criteria);
    }
  }, [criteria]);

  const fetchAdvice = async (selectedCriteria) => {
    setLoading(true);
    setAdvice('');

    try {
      const response = await axios.post(`${config.backendUrl}/get-advice`, {
        userID,
        criteria: selectedCriteria,
      });
      setAdvice(response.data.advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdvice('⚠️ Oops! Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const renderAdvice = (text) => {
    const points = text.split(/\n|•|- /).filter(Boolean);
    return (
      <div className="advice-list">
        {points.map((point, index) => (
          <div key={index} className="advice-point">
            <FaLightbulb className="advice-icon" />
            <span>{point.trim()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="title">🌱 Your Personalized Wellbeing Advice</h2>
      <p className="subtitle">Select how you'd like your advice tailored</p>

      <div className="criteria-grid">
        <div
          className={`card ${criteria === 'Anyone' ? 'active' : ''}`}
          onClick={() => setCriteria('Anyone')}
        >
          <FaUser size={40} className="card-icon" />
          <h3>General Wellness</h3>
          <p>Tips for overall lifestyle and self-care.</p>
        </div>

        <div
          className={`card ${criteria === 'LikeMe' ? 'active' : ''}`}
          onClick={() => setCriteria('LikeMe')}
        >
          <FaUsers size={40} className="card-icon" />
          <h3>People Like Me</h3>
          <p>Insights based on individuals with similar habits and goals.</p>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching your personalized recommendations...</p>
        </div>
      )}

      {advice && !loading && (
        <div className="advice-container">
          <h4 className="advice-header">🧠 Smart Suggestions Just for You</h4>
          {renderAdvice(advice)}
        </div>
      )}
    </div>
  );
};

export default About4;