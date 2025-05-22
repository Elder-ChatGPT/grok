import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodImage from "./images/old.png";
import weightImage from "./images/old1.png";
import chairImage from "./images/old2.png";
import stressImage from "./images/old3.png";
import neuroImage from "./images/old4.png";

const TOTAL_STEPS = 5;

const MnaTest = () => {
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
      await axios.post("https://sledssback.elderchatgpt.com./api/mna-test", {
        userID,
        answers,
      });
      alert("Test submitted successfully!");
      const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
      const completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      storedCompletedTests[userID] = { ...(storedCompletedTests[userID] || {}), Diet: { completedAt: completionDate } };
      localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
      navigate("/mna");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    }
  };

  const isStepAnswered = () => {
    const stepQuestions = {
      1: "food-intake",
      2: "weight-loss",
      3: "mobility",
      4: "stress",
      5: "neuro",
    };
    return answers[stepQuestions[step]] !== undefined;
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", textAlign: "left", fontFamily: "Arial, sans-serif", fontSize: "20px" }}>
      <h2 style={{ color: "green", textAlign: "center" }}>Mini Nutritional Assessment</h2>
      <h3 style={{ color: "green", textAlign: "center" }}>(MNA)</h3>

      {step === 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
              Has food intake declined over the past 3 months due to loss of appetite, digestive problems, chewing, or swallowing difficulties?
            </p>
            {["severe decrease in food intake", "moderate decrease in food intake", "no decrease in food intake"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="food-intake" value={option} checked={answers["food-intake"] === option} onChange={(e) => handleSelect("food-intake", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={foodImage} alt="Food intake" style={{ width: "200px" }} />
        </div>
      )}

{step === 2 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            Weight loss during the last 3 months
            </p>
            {["weight loss greater than 3 kg (6.6 lbs)", "does not know", "weight loss between 1 and 3 kg (2.2 and 6.6 lbs)", "no weight loss"].map((option)=> (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="weight-loss" value={option} checked={answers["weight-loss"] === option} onChange={(e) => handleSelect("weight-loss", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={weightImage} alt="Weight loss" style={{ width: "200px" }} />
        </div>
      )}

{step === 3 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            Mobility
            </p>
            {["bed or chair bound", "able to get out of bed / chair but does not go out", "goes out"].map((option)=> (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="mobility" value={option} checked={answers["mobility"] === option} onChange={(e) => handleSelect("mobility", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={chairImage} alt="chair" style={{ width: "200px" }} />
        </div>
      )}

    
{step === 4 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            Has suffered psychological stress or acute disease in the past 3 months?
            </p>
            {["yes", "no"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="stress" value={option} checked={answers["stress"] === option} onChange={(e) => handleSelect("stress", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={stressImage} alt="Stress" style={{ width: "200px" }} />
        </div>
      )}


{step === 5 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            Has suffered psychological stress or acute disease in the past 3 months?
            </p>
            {["severe dementia or depression", "mild dementia", "no psychological problems"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="neuro" value={option} checked={answers["neuro"] === option} onChange={(e) => handleSelect("neuro", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={neuroImage} alt="Neuro" style={{ width: "200px" }} />
        </div>
      )}


      <div style={{ marginTop: "30px" }}>
        <div style={{ height: "7px", background: "#e0e0e0", borderRadius: "5px", width: "100%" }}>
          <div style={{ width: `${progress}%`, background: "green", height: "100%", borderRadius: "5px", transition: "width 0.7s ease-in-out" }}></div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <button onClick={() => setStep(step - 1)} disabled={step === 1} style={{ background: "#0e5580", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Back</button>
        {step < TOTAL_STEPS && isStepAnswered() && (
          <button onClick={() => setStep(step + 1)} style={{ background: "#0e5580", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Next</button>
        )}
        {step === TOTAL_STEPS && isStepAnswered() && (
          <button onClick={submitTest} style={{ background: "#28a745", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default MnaTest;
