import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useNavigate } from "react-router-dom";

const PittScore = () => {
  const [sleepScore, setSleepScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSleepScore = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://sledssback.elderchatgpt.com./api/sleep-score/${userId}`);
        setSleepScore(response.data.score);
      } catch (err) {
        setError(err.response?.data?.error || "Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSleepScore();
  }, []);

  const getSleepQuality = (score) => {
    if (score <= 5) return "😴 Good Sleep";
    if (score <= 10) return "😐 Moderate Sleep";
    if (score <= 15) return "⚠️ Severe Sleep";
    return "🚨 Very Severe Sleep";
  };

  const data = [
    { name: "Score", value: sleepScore !== null ? sleepScore : 0, fill: "#4ad9e4" },
    { name: "Max", value: 21, fill: "#89f0f0" },
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.resultsContainer}>
          <h1 style={styles.header}>Sleep Quality Score</h1>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="100%"
                  innerRadius="70%"
                  outerRadius="100%"
                  startAngle={180}
                  endAngle={0}
                  barSize={20}
                  data={data}
                >
                  <RadialBar minAngle={15} background clockWise dataKey="value" />
                  <PolarAngleAxis type="number" domain={[0, 21]} angleAxisId={0} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={styles.scoreDisplay}>{sleepScore !== null ? sleepScore : "N/A"} / 21</div>
              <div style={styles.qualityLabel}>{sleepScore !== null ? getSleepQuality(sleepScore) : ""}</div>
              <div style={styles.legend}>
                <p>😴 Good Sleep: <strong>0–5</strong></p>
                <p>😐 Moderate Sleep: <strong>6–10</strong></p>
                <p>⚠️ Severe Sleep: <strong>11–15</strong></p>
                <p>🚨 Very Severe Sleep: <strong>16–21</strong></p>
              </div>
            </>
          )}
        </div>
        <button style={styles.backButton} onClick={() => navigate("/evaluations")}>
          Back to Evaluations
        </button>
      </div>
    </div>
  );
};

// Styling stays unchanged
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
    fontSize: "1.5rem",
  },
  loading: {
    color: "#ffffff",
    fontSize: "1rem",
  },
  error: {
    color: "red",
    fontSize: "1rem",
  },
  scoreDisplay: {
    fontSize: "1.7rem",
    fontWeight: "bold",
    color: "#4ad9e4",
    marginTop: "-10px",
  },
  qualityLabel: {
    fontSize: "1.2rem",
    marginTop: "5px",
    color: "#2ecf80",
  },
  legend: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "1rem",
  },
  backButton: {
    backgroundColor: "#2ecf80",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    alignSelf: "center",
  },
};

export default PittScore;
