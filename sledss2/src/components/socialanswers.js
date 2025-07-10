import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import './socialanswers.css';
import config from './config';

function SocialAnswers() {
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchScore = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`  ${config.backendUrl}/social-score/${userId}`);        
        setScore(response.data.score);
      } catch (error) {
        console.error('Error fetching loneliness score:', error);
        setScore('N/A');
      }
    };
    fetchScore();
  }, [userId]);

  const data = [
    { name: 'Score', value: score !== null && score !== 'N/A' ? score : 0, fill: '#00e5a0' },
    { name: 'Max', value: 11, fill: '#e0f7f4' }
  ];

  return (
    <div className="social-answers-container">
      <div className="score-card">
        <h1 className="score-title">🧭 Your Social Connection Score</h1>
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            cx="50%" cy="100%" innerRadius="70%" outerRadius="100%"
            startAngle={180} endAngle={0} barSize={20} data={data}
          >
            <RadialBar background clockWise dataKey="value" />
            <PolarAngleAxis type="number" domain={[0, 11]} angleAxisId={0} />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="score-value">
          {score !== null && score !== 'N/A' ? (
            <span>{score}</span>
          ) : (
            <span className="error-text">No score found</span>
          )}
        </div>

        <div className="legend">
          <div><span>✅ Not Lonely</span> <strong>0–3</strong></div>
          <div><span>😐 Moderately Lonely</span> <strong>4–8</strong></div>
          <div><span>⚠️ Severely Lonely</span> <strong>9–10</strong></div>
          <div><span>🚨 Very Severely Lonely</span> <strong>11</strong></div>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/evaluations')}>
        🔙 Back to Evaluations
      </button>
    </div>
  );
}

export default SocialAnswers;
