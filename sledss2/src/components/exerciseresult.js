import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { useNavigate } from "react-router-dom"; import config from './config';
import "./activityscore.css";

const Activityscore = () => {
  const [exerciseScore, setExerciseScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExerciseScore = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.backendUrl}/api/exercise-score/${userId}`); 
        setExerciseScore(response.data.score);
      } catch (err) {
        setError(err.response?.data?.error || "Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseScore();
  }, []);

  const getActivityLevelLabel = (score) => {
    if (score < 50) return "💪 Very Low Activity";
    if (score < 150) return "🚶 Low to Moderate Activity";
    if (score < 250) return "🏃 Moderate to Active";
    return "🔥 Highly Active";
  };

  const data = [
    { name: "Score", value: exerciseScore !== null ? exerciseScore : 0, fill: "#00e5a0" },
    { name: "Max", value: 350, fill: "#e0f7f4" }
  ];

  return (
    <div className="activity-score-container">
      <div className="score-card">
        <h1 className="score-title">🏋️ Your Exercise Quality Score</h1>
        {loading ? (
          <p className="loading">Loading...</p>
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
                <RadialBar background clockWise dataKey="value" />
                <PolarAngleAxis type="number" domain={[0, 350]} angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="score-value">
              {exerciseScore !== null ? exerciseScore : "N/A"} / 350
            </div>
            <div className="activity-label">
              {exerciseScore !== null ? getActivityLevelLabel(exerciseScore) : ""}
            </div>
            <div className="legend">
              <div><span>💪 Very Low Activity</span> <strong>0–50</strong></div>
              <div><span>🚶 Low to Moderate Activity</span> <strong>51–150</strong></div>
              <div><span>🏃 Moderate to Active</span> <strong>151–250</strong></div>
              <div><span>🔥 Highly Active</span> <strong>251–350</strong></div>
            </div>
          </>
        )}
      </div>

      <button className="back-button" onClick={() => navigate("/evaluations")}>
        🔙 Back to Evaluations
      </button>
    </div>
  );
};

export default Activityscore;
