import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Style5.css'; // Import external CSS file

const About5 = () => {
  const [newScores, setNewScores] = useState([]);
  const [oldScores, setOldScores] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID'); // Get logged-in user's ID

  useEffect(() => {
    if (!userID) {
      navigate('/about'); // Redirect if not logged in
    } else {
      axios.get(`http://localhost:5009/view-scores/${userID}`)
        .then(response => {
          const scores = response.data;
          
          // Sort scores by timestamp (latest first)
          scores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          // Group scores by forum type (keeping only the latest score in each forum as "new")
          const latestScores = {};
          const oldScoresList = [];

          scores.forEach(score => {
            if (!latestScores[score.forum]) {
              latestScores[score.forum] = score; // Store the latest score
            } else {
              oldScoresList.push(score); // Store older scores
            }
          });

          setNewScores(Object.values(latestScores)); // Convert latest scores to array
          setOldScores(oldScoresList); // Store old scores
        })
        .catch(error => console.error('Error fetching scores:', error));
    }
  }, [userID, navigate]);

  return (
    <div className="container">
      <h2 className="title">Your Submitted Scores</h2>

      <div className="score-tables">
        {/* Latest Scores Table (Left) */}
        <div className="score-section latest">
          <h3 className="section-title">Latest Scores</h3>
          <table className="score-table">
            <thead>
              <tr>
                <th>Forum</th>
                <th>Score</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {newScores.map((score, index) => (
                <tr key={index}>
                  <td>{score.forum}</td>
                  <td>{score.value}</td>
                  <td>{score.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-container">
        <button onClick={() => navigate('/about4')}>Get Personalized Advice</button>
      </div>
        </div>

        {/* Old Scores Table (Center) */}
        <div className="score-section old">
          <h3 className="section-title">Previous Scores</h3>
          <table className="score-table">
            <thead>
              <tr>
                <th>Forum</th>
                <th>Score</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {oldScores.map((score, index) => (
                <tr key={index}>
                  <td>{score.forum}</td>
                  <td>{score.value}</td>
                  <td>{score.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default About5;

