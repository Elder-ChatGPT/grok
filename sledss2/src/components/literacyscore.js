import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import config from './config'; 
import "./LiteracyScore.css";

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
        setError(
          err.response?.data?.error || "Network error. Check your connection."
        );
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
    {
      name: "Score",
      value: literacyScore !== null ? literacyScore : 0,
      fill: "#00b894",
    },
    {
      name: "Max",
      value: 10,
      fill: "#c8f7f4",
    },
  ];

  return (
    <div className="social-answers-container">
      <div className="score-card">
        <h1 className="score-title">Cognitive Literacy Score</h1>
        {loading ? (
          <p className="score-loading">Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
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
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                />
                <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="score-value">
              {literacyScore !== null ? literacyScore : "N/A"} / 10
            </div>
            <div className="score-label">
              {literacyScore !== null ? literacyCategory : ""}
            </div>
            <div className="legend">
              <div>
                🧠 <span>Strong Cognitive Function</span>: 8–10
              </div>
              <div>
                🔍 <span>Mild Cognitive Changes</span>: 6–7
              </div>
              <div>
                ⚠️ <span>Potential Cognitive Concerns</span>: 0–5
              </div>
            </div>
          </>
        )}
        <button className="back-button" onClick={() => navigate("/evaluations")}>
          Back to Evaluations
        </button>
      </div>
    </div>
  );
};

export default Literacyscore;
