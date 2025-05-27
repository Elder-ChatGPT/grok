import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
    if (!userId) return;
    
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
    <div style={styles.container}>
      <h1 style={styles.title}>S.L.E.D.S.S. Evaluations</h1>
      <div style={styles.grid}>
        {categories.map((category) => {
          const testInfo = completedTests[category.name];
          return (
            
            <div key={category.name} style={styles.categoryContainer}>
              
              <img src={category.image} alt={category.name} style={styles.image} />
              <div style={styles.buttonContainer}>
                <button
                  style={{ ...styles.button, backgroundColor: category.color }}
                  onClick={() => navigate(category.route)}
                >
                  {category.name}
                </button>
                {testInfo && testInfo.completedAt && (
                  <span style={styles.completedDate}>
                    Completed on: {testInfo.completedAt.split(',')[0]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
      </div>

      {hasCompletedAtLeastOneTest && (
        <button style={styles.adviceButton} onClick={() => navigate("/about4")}>
Activate Health Coach 
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    minHeight: "100vh",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  },
  image: {
    width: "100px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "5px",
  },
  button: {
    width: "120px",
    height: "40px",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  completedDate: {
    fontSize: "18px",
    color: "#555",
    marginTop: "5px",
  },
  adviceButton: {
    marginTop: "30px",
    backgroundColor:  " #0E5580",
    color: "#fff",
    padding: "12px 30px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Evaluations;
