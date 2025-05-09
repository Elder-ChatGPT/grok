import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodImage from "./images/lit1.png";
import weightImage from "./images/lit2.png";
import chairImage from "./images/lit3.png";
import stressImage from "./images/lit4.png";
import neuroImage from "./images/old4.png";
import cardImage from "./images/lit5.png";
import classImage from "./images/lit6.png";


const TOTAL_STEPS = 7;

const Literacy = () => {
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
      await axios.post("http://184.168.29.119:5009/api/learn-scale", {
        userID,
        answers,
      });
      alert("Test submitted successfully!");
      const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
      const completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      storedCompletedTests[userID] = { ...(storedCompletedTests[userID] || {}), Learning: { completedAt: completionDate } };
      localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
      navigate("/literacyscore");
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
      6: "skill",
      7: "class",
    };
    return answers[stepQuestions[step]] !== undefined;
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", textAlign: "left", fontFamily: "Arial, sans-serif", fontSize: "20px" }}>
      <h2 style={{  textAlign: "center" }}> Digital Literacy Survey for Older Adults</h2>
      <h3 style={{  textAlign: "center" }}> Please take some time to answer ALL the questions</h3>


      <div style={{ marginTop: "30px" }}>
        <div style={{ height: "7px", background: "#e0e0e0", borderRadius: "5px", width: "100%" }}>
          <div style={{ width: `${progress}%`, background: "#D38F5D", height: "100%", borderRadius: "10px", transition: "width 0.7s ease-in-out" }}></div>
        </div>
      </div>


      {step === 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            How old are you?
            </p>
            {["Under 50", "50-59", "60-69", "70 and above"].map((option) => (
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
            Which device do you usually use for digital activities?
            
            </p>
            {[" Smartphone", "Tablet", "Laptop/Desktop computer", "Smart TV", "None"].map((option)=> (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="weight-loss" value={option} checked={answers["weight-loss"] === option} onChange={(e) => handleSelect("weight-loss", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={weightImage} alt="Weight loss" style={{ width: "250px" }} />
        </div>
      )}

{step === 3 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            How often do you use the internet?
            </p>
            {["Daily", "A few times a week", " A few times a month", "Rarely/Never"].map((option)=> (
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
            Which of the following online activity do you usually engage in?
            
            </p>
            {[" Sending emails", "Browsing social media" , "Online shopping", "Online banking" , "Watching videos"].map((option) => (
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
            Do you believe that digital literacy is important for older adults?
            </p>
            {["Yes", " No", " Not sure"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="neuro" value={option} checked={answers["neuro"] === option} onChange={(e) => handleSelect("neuro", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={neuroImage} alt="Neuro" style={{ width: "200px" }} />
        </div>
      )}




{step === 6 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            What motivates you to improve your digital skills? 
            </p>
            {["Stay connected with family and friends", "Accessing information/news", "Entertainment purposes", "Improving job opportunities", "Pursuing hobbies/interests"].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="skill" value={option} checked={answers["skill"] === option} onChange={(e) => handleSelect("skill", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={cardImage} alt="skill" style={{ width: "250px" }} />
        </div>
      )}


{step === 7 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ flex: 1, marginRight: "30px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "25px" }}>
            Have you taken any digital literacy classes or courses?
            </p>
            {["Yes", "No" ].map((option) => (
              <label key={option} style={{ display: "block", marginBottom: "20px" }}>
                <input type="radio" name="class" value={option} checked={answers["class"] === option} onChange={(e) => handleSelect("class", e.target.value)} style={{ marginRight: "10px" }} />
                {option}
              </label>
            ))}
          </div>
          <img src={classImage} alt="class" style={{ width: "250px" }} />
        </div>
      )}



     

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <button onClick={() => setStep(step - 1)} disabled={step === 1} style={{ background: "#0e5580", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Back</button>
        {step < TOTAL_STEPS && isStepAnswered() && (
          <button onClick={() => setStep(step + 1)} style={{ background: "#D38F5D", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Next</button>
        )}
        {step === TOTAL_STEPS && isStepAnswered() && (
          <button onClick={submitTest} style={{ background: "#D38F5D", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "20px" }}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Literacy;
