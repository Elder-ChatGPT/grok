import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodImage from "./images/lit11.jpeg";
import weightImage from "./images/lit12.jpeg";
import chairImage from "./images/lit13.jpeg";
import stressImage from "./images/lit14.jpeg";
import neuroImage from "./images/lit15.jpeg";
import cardImage from "./images/lit16.jpeg";
import classImage from "./images/lit17.jpeg";
import config from './config';
import "./Literacy.css";

const TOTAL_STEPS = 7;

function Literacy() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (!storedUserID) {
      alert("User not logged in. Please log in first.");
      navigate("/login");
    } else {
      setUserID(storedUserID);
    }
  }, [navigate]);

  const progress = (Object.keys(answers).length / TOTAL_STEPS) * 100;

  const handleSelect = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const submitTest = async () => {
    if (!userID) return;

    try {
      await axios.post(`  ${config.backendUrl}/api/learn-scale`, {
        userID,
        answers,
      });
      alert("Test submitted successfully!");
      const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
      const completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      storedCompletedTests[userID] = {
        ...(storedCompletedTests[userID] || {}),
        Learning: { completedAt: completionDate }
      };
      localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
      navigate("/literacyscore");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    }
  };

  const stepQuestions = {
    1: { key: "food-intake", question: "How old are you?", options: ["Under 50", "50-59", "60-69", "70 and above"], image: foodImage },
    2: { key: "weight-loss", question: "Which device do you usually use for digital activities?", options: ["Smartphone", "Tablet", "Laptop/Desktop computer", "Smart TV", "None"], image: weightImage },
    3: { key: "mobility", question: "How often do you use the internet?", options: ["Daily", "A few times a week", "A few times a month", "Rarely/Never"], image: chairImage },
    4: { key: "stress", question: "Which of the following online activity do you usually engage in?", options: ["Sending emails", "Browsing social media", "Online shopping", "Online banking", "Watching videos"], image: stressImage },
    5: { key: "neuro", question: "Do you believe that digital literacy is important for older adults?", options: ["Yes", "No", "Not sure"], image: neuroImage },
    6: { key: "skill", question: "What motivates you to improve your digital skills?", options: ["Stay connected with family and friends", "Accessing information/news", "Entertainment purposes", "Improving job opportunities", "Pursuing hobbies/interests"], image: cardImage },
    7: { key: "class", question: "Have you taken any digital literacy classes or courses?", options: ["Yes", "No"], image: classImage }
  };

  const current = stepQuestions[step];

  return (
    <div className="socialtest-container">
      <h2 className="title">Digital Literacy Survey for Older Adults</h2>
      <h3 className="category">Please take some time to answer ALL the questions</h3>

      <div style={{ marginBottom: "30px" }}>
        <div style={{ height: "10px", background: "#e0e0e0", borderRadius: "8px" }}>
          <div
            style={{
              width: `${progress}%`,
              background: "#D38F5D",
              height: "100%",
              borderRadius: "8px",
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
      </div>

      <div className="question-row">
        <p className="question">{current.question}</p>
        <div className="options-container">
          {current.options.map((option) => {
            const isSelected = answers[current.key] === option;
            return (
              <label
                key={option}
                className={`option-wrapper ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(current.key, option)}
              >
                <span className="scale-text">{option}</span>
                {isSelected && <span className="check-icon">✅</span>}
                <input
                  type="radio"
                  name={current.key}
                  value={option}
                  checked={isSelected}
                  readOnly
                />
              </label>
            );
          })}
        </div>
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <img src={current.image} alt="question visual" style={{ width: "240px", borderRadius: "16px" }} />
        </div>
      </div>

     <div className="navigation-buttons">
  <button
    className="prev-button"
    onClick={() => {
      if (step === 1) {
        navigate('/learning');  // go back to evaluations page
      } else {
        setStep(step - 1); // go to previous step
      }
    }}
  >
    Back
  </button>

        {step < TOTAL_STEPS && answers[current.key] && (
          <button className="next-button" onClick={() => setStep(step + 1)}>Next</button>
        )}

        {step === TOTAL_STEPS && answers[current.key] && (
          <button className="submit-button" onClick={submitTest}>Submit</button>
        )}
      </div>
    </div>
  );
}

export default Literacy;
