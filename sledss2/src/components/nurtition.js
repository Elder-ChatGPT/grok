import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import foodImage from "./images/thinking.png";
import weightImage from "./images/fat.png";
import chairImage from "./images/chair.png";
import stressImage from "./images/lol.png";
import neuroImage from "./images/neuro.png";

const TOTAL_STEPS = 5;

const MnaTest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const progress = (Object.keys(answers).length / TOTAL_STEPS) * 100;

  const handleSelect = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const isNextEnabled = () => {
    return Object.keys(answers).length >= step;
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "green" }}>Mini Nutritional Assessment</h2>
      <h3 style={{ color: "green" }}>(MNA)</h3>

      {step === 1 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>
            Has food intake declined over the past 3 months due to loss of appetite, digestive problems, chewing, or swallowing difficulties?
          </p>
          <img src={foodImage} alt="Food intake" style={{ width: "100%", maxWidth: "150px" }} />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            {["severe decrease in food intake", "moderate decrease in food intake", "no decrease in food intake"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "10px" }}>
                <input type="radio" name="food-intake" value={option} checked={answers["food-intake"] === option} onChange={(e) => handleSelect("food-intake", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>Weight loss during the last 3 months</p>
          <img src={weightImage} alt="Weight loss" style={{ width: "100%", maxWidth: "150px" }} />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            {["weight loss greater than 3 kg (6.6 lbs)", "does not know", "weight loss between 1 and 3 kg (2.2 and 6.6 lbs)", "no weight loss"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "10px" }}>
                <input type="radio" name="weight-loss" value={option} checked={answers["weight-loss"] === option} onChange={(e) => handleSelect("weight-loss", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>Mobility</p>
          <img src={chairImage} alt="chair" style={{ width: "100%", maxWidth: "150px" }} />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            {["bed or chair bound", "able to get out of bed / chair but does not go out", "goes out"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "10px" }}>
                <input type="radio" name="mobility" value={option} checked={answers["mobility"] === option} onChange={(e) => handleSelect("mobility", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>Has suffered psychological stress or acute disease in the past 3 months?</p>
          <img src={stressImage} alt="Stress" style={{ width: "100%", maxWidth: "200px" }} />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            {["yes", "no"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "10px" }}>
                <input type="radio" name="stress" value={option} checked={answers["stress"] === option} onChange={(e) => handleSelect("stress", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <p style={{ fontWeight: "bold", marginTop: "20px" }}>Neuropsychological problems</p>
          <img src={neuroImage} alt="Neuro" style={{ width: "100%", maxWidth: "150px" }} />
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            {["severe dementia or depression", "mild dementia", "no psychological problems"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "10px" }}>
                <input type="radio" name="neuro" value={option} checked={answers["neuro"] === option} onChange={(e) => handleSelect("neuro", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <div style={{ height: "5px", background: "#e0e0e0", borderRadius: "5px", width: "100%" }}>
          <div style={{ width: `${progress}%`, background: "green", height: "150%", borderRadius: "5px", transition: "width 0.7s ease-in-out" }}></div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))} style={{ background: "#0e5580", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Back</button>
        {step === TOTAL_STEPS ? (
          <button style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
        ) : (
          <button onClick={() => setStep(step + 1)} style={{ background: "#0e5580", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Next</button>
        )}
      </div>
    </div>
  );
};

export default MnaTest;


