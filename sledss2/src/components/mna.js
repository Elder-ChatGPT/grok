import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useNavigate } from 'react-router-dom';

const MnaResult = () => {
  const [mnaScore, setMnaScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMnaScore = async () => {
      try {
        const userID = localStorage.getItem("userID");
        if (!userID) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://184.168.29.119:5009/api/mna-score", {
          params: { userID },
        });

        setMnaScore(response.data.mnaScore);
      } catch (err) {
        setError(err.response?.data?.error || "Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMnaScore();
  }, []);

  const data = [
    { name: "Score", value: mnaScore !== null ? mnaScore : 0, fill: "#4ad9e4" },
    { name: "Max", value: 14, fill: "#89f0f0" },
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.resultsContainer}>
          <h1 style={styles.header}>Mini Nutritional Assessment Score</h1>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="100%" innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} barSize={20} data={data}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" />
                  <PolarAngleAxis type="number" domain={[0, 14]} angleAxisId={0} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={styles.scoreDisplay}>{mnaScore !== null ? mnaScore : "N/A"}</div>
              <div style={styles.legend}>
                <p>✅ Normal Nutrition: <strong>12–14</strong></p>
                <p>⚠️ At Risk: <strong>8–11</strong></p>
                <p>🚨 Malnourished: <strong>0–7</strong></p>
              </div>
            </>
          )}
        </div>
        <button style={styles.backButton} onClick={() => navigate('/evaluations')}>Back to Evaluations</button>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  contentWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  resultsContainer: {
    backgroundColor: "#1e466c",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    width: "500px",
    height: "500px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  header: {
    color: "#2ecf80",
    fontSize: "2rem", // Increased from 1.5rem to 2rem
  },
  loading: {
    color: "#ffffff",
    fontSize: "1.25rem", // Increased from 1rem to 1.25rem
  },
  error: {
    color: "red",
    fontSize: "1.25rem", // Increased from 1rem to 1.25rem
  },
  scoreDisplay: {
    fontSize: "2rem", // Increased from 1.7rem to 2rem
    fontWeight: "bold",
    color: "#4ad9e4",
    marginTop: "-10px",
  },
  legend: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "1.25rem", // Increased from 1rem to 1.25rem
  },
  backButton: {
    backgroundColor: "#2ecf80",
    color: "white",
    border: "none",
    padding: "12px 24px", // Increased padding for better button size
    fontSize: "1.25rem", // Increased from 1rem to 1.25rem
    cursor: "pointer",
    borderRadius: "5px",
    alignSelf: "center",
  },
};

export default MnaResult;
