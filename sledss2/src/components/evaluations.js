import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Evaluations.css';
import SocializationImg from './images/sp.png';
import LearningImg from './images/Lp.png';
import ExerciseImg from './images/ep.png';
import DietImg from './images/dp.png';
import StressImg from './images/stp.png';
import SleepImg from './images/Slp.png';

const Evaluations = () => {
  const navigate = useNavigate();
  const [completedTests, setCompletedTests] = useState({});
  const [userID, setUserId] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      setUserId(userId);
    }
    const storedCompletedTests = JSON.parse(localStorage.getItem("completedTests")) || {};
    setCompletedTests(storedCompletedTests[userId] || {});
  }, []);

  const categories = [
    { name: "Socialize", color: "#B90E3E", image: SocializationImg, route: "/socialization" },
    { name: "Learning", color: "#D38F5D", image: LearningImg, route: "/learning" },
    { name: "Exercise", color: "#E8C547", image: ExerciseImg, route: "/exercise" },
    { name: "Diet", color: "#2E8B57", image: DietImg, route: "/diet" },
    { name: "Stress", color: "#38B6FF", image: StressImg, route: "/stress" },
    { name: "Sleep", color: "#A685E2", image: SleepImg, route: "/sleep" },
  ];

  const hasCompletedAtLeastOneTest = Object.values(completedTests).some(test => test.completedAt);

  return (
    <div className="eval-container">
      <h1 className="eval-title">S.L.E.D.S.S. Evaluations</h1>
      <p className="eval-subtitle">Tap a category to begin or review your progress.</p>

      <div className="eval-grid">
        {categories.map((category) => {
          const testInfo = completedTests[category.name];
          return (
            <div className="eval-card" key={category.name}>
              <img src={category.image} alt={category.name} className="eval-image" />
              <div className="eval-content">
                <button
                  className="eval-button"
                  style={{ backgroundColor: category.color }}
                  onClick={() => navigate(category.route)}
                >
                  {category.name}
                </button>
                {testInfo?.completedAt && (
                  <p className="eval-date">Completed on: {testInfo.completedAt.split(',')[0]}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasCompletedAtLeastOneTest && (
        <button className="eval-advice-button" onClick={() => navigate("/about4")}>
          Activate Health Coach
        </button>
      )}
    </div>
  );
};

export default Evaluations;
