import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import config from './config';
const Literacyscore = () => {
  const [literacyScore, setLiteracyScore] = useState(null);
  const [literacyCategory, setLiteracyCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiteracyScore = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`  ${config.backendUrl}/api/learn-scale/${userId}`);
        setLiteracyScore(response.data.score);
        setLiteracyCategory(getLiteracyLabel(response.data.score));
      } catch (err) {
        setError(err.response?.data?.error || "Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiteracyScore();
  }, []);

  const getLiteracyLabel = (score) => {
    if (score >= 8) return "🧠 Strong Cognitive Function";
    if (score >= 6) return "🔍 Mild Cognitive Changes";
    return "⚠️ Potential Cognitive Concerns";
  };

  const data = [
    { name: "Score", value: literacyScore !== null ? literacyScore : 0, fill: "#4ad9e4" },
    { name: "Max", value: 10, fill: "#89f0f0" },
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.resultsContainer}>
          <h1 style={styles.header}>Cognitive Literacy Score</h1>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
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
                  <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={styles.scoreDisplay}>{literacyScore !== null ? literacyScore : "N/A"} / 10</div>
              <div style={styles.qualityLabel}>{literacyScore !== null ? literacyCategory : ""}</div>
              <div style={styles.legend}>
                <p>🧠 Strong Cognitive Function: <strong>8–10</strong></p>
                <p>🔍 Mild Cognitive Changes: <strong>6–7</strong></p>
                <p>⚠️ Potential Cognitive Concerns: <strong>0–5</strong></p>
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

export default Literacyscore;
