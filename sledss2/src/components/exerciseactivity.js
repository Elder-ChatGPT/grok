import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Activity.css";
 import config from './config';

function Activity({ onNext, onBack }) {
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate("/evaluations"));

  const questionHeaders = {
    1: "1. Over the past 7 days, how often did you participate in sitting activities such as?",
    2: "2. Over the past 7 days, how often did you take a walk outside your home or yard for any reason?",
    3: "3. Over the past 7 days, how often did you engage in light sport or recreational activities?",
    4: "4. Over the past 7 days, how often did you engage in moderate sport and recreational activities?",
    5: "5. Over the past 7 days, how often did you engage in strenuous sport and recreational activities?",
    6: "6. Over the past 7 days, how often did you do exercises to increase muscle strength and endurance?",
    7: "7. During the past 7 days, have you done any light housework?",
    8: "8. During the past 7 days, have you done any heavy housework or chores?",
    9: "9. During the past 7 days, did you engage in any of the following activities?",
    10: "10. Work related",
    11: "11. During the past 7 days, did you engage in any of the following activities?"
  };

  const questions = {
    1: ["Reading", "Watching TV", "Handicrafts", "Game", "Phone/ Computer"],
    2: ["Walking a dog", "Walking in a park", "Walking to a store", "Walking in the neighborhood"],
    3: ["Walking", "Cycling", "Swimming", "Yoga"],
    4: ["Brisk walking", "Cycling at moderate pace", "Climbing stairs", "Recreational swimming"],
    5: ["Running", "Fast jump rope", "Fast cycling", "High-intensity aerobics"],
    6: ["Light weightlifting", "Push-ups or knee push-ups", "Bodyweight squats", "Resistance band exercises"],
    7: ["(e.g., dusting, washing dishes)"],
    8: ["(e.g., scrubbing floors, carrying wood)"],
    9: ["Home repairs (e.g., painting, electrical work)", "Lawn or yard work", "Outdoor gardening", "Caring for another person"],
    10: ["During the past 7 days, did you work for pay or as a volunteer?"],
    11: [
      "Mainly sitting (e.g., office worker, bus driver)",
      "Sitting/standing with some walking",
      "Walking with light lifting",
      "Walking & heavy manual work"
    ]
  };

  const options = {
    1: ["Never", "1-2 days", "3-4 days", "5-7 days"],
    2: ["Never", "Almost", "Sometimes", "Fairly Often"],
    3: ["Never", "1-2 days", "3-4 days", "5-7 days"],
    4: ["Never", "1-2 days", "3-4 days", "5-7 days"],
    5: ["Never", "1-2 days", "3-4 days", "5-7 days"],
    6: ["Never", "1-2 days", "3-4 days", "5-7 days"],
    7: ["Yes", "No"],
    8: ["Yes", "No"],
    9: ["Yes", "No"],
    10: ["Yes", "No"],
    11: ["Yes", "No"]
  };

  const handleChange = (questionIndex, value) => {
    setResponses({ ...responses, [`${currentPage}-${questionIndex}`]: value });
  };

  const handleBackPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      handleBack();
    }
  };

  const isNextDisabled = () => {
    return questions[currentPage].some((_, i) => !responses[`${currentPage}-${i}`]);
  };

  const totalQuestions = Object.values(questions).reduce((sum, q) => sum + q.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleNextPage = () => {
    if (currentPage < Object.keys(questions).length) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
       await axios.post(`  ${config.backendUrl}/api/exercise-scale`, {   userId, responses });

      const storedCompletedTests = JSON.parse(localStorage.getItem("completedTests")) || {};
      const completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "2-digit", day: "2-digit"
      });

      storedCompletedTests[userId] = {
        ...(storedCompletedTests[userId] || {}),
        Exercise: { completedAt: completionDate }
      };

      localStorage.setItem("completedTests", JSON.stringify(storedCompletedTests));
      alert("Responses submitted successfully");
      navigate("/exerciseresult");
    } catch (error) {
      console.error("Submission error", error);
      alert("Failed to submit responses");
    }
  };

  return (
    <div className="activity-container">
      <h2 className="activity-title">Sports and Activities</h2>
      <p className="activity-subtitle">Please take some time to answer ALL the questions</p>

      <div className="activity-progress-bar">
        <div className="activity-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="activity-question-section">
        <div className="activity-question-header">{questionHeaders[currentPage]}</div>

        {questions[currentPage].map((question, questionIndex) => (
          <div className="activity-row" key={questionIndex}>
            <div className="activity-question-text">{question}</div>

            <div className="activity-options">
              {options[currentPage].map((option, idx) => {
  const isSelected = responses[`${currentPage}-${questionIndex}`] === option;
  return (
    <label key={idx} className={`activity-option ${isSelected ? "selected" : ""}`}>
      <input
        type="radio"
        name={`question-${currentPage}-${questionIndex}`}
        value={option}
        checked={isSelected}
        onChange={() => handleChange(questionIndex, option)}
        readOnly
      />
      <span className="option-text">{option}</span>
      {isSelected && <span className="check-icon">✅</span>}
    </label>
  );
})}
            </div>
          </div>
        ))}
      </div>

      <div className="activity-button-group">
        <button className="activity-button activity-back-button" onClick={handleBackPage}>Back</button>

        {!isNextDisabled() && (
          <button
            className={`activity-button ${currentPage < Object.keys(questions).length ? "activity-next-button" : "activity-submit-button"}`}
            onClick={handleNextPage}
          >
            {currentPage < Object.keys(questions).length ? "Next" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Activity;