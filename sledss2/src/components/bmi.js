import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BmiEvaluation = () => {
  const navigate = useNavigate();
  const [feet, setFeet] = useState("0");
  const [inches, setInches] = useState("0");
  const [weight, setWeight] = useState("0");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const userID = localStorage.getItem("userID");

  const calculateBMI = async () => {
    const heightInInches = parseInt(feet) * 12 + parseInt(inches);
    const weightInPounds = parseInt(weight);

    if (heightInInches > 0 && weightInPounds > 0) {
      const bmiValue = ((weightInPounds / (heightInInches * heightInInches)) * 703).toFixed(1);
      let category = "";

      if (bmiValue < 18.5) {
        category = "Underweight";
      } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        category = "Healthy Weight";
      } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
        category = "Overweight";
      } else {
        category = "Obese";
      }

      setBmi(bmiValue);
      setCategory(category);

      if (!userID) {
        setMessage("Error: User not logged in.");
        return;
      }

      try {
        const response = await axios.post("https://sledssback.elderchatgpt.com./api/save-bmi", {
          userID,
          bmi: bmiValue,
          category
        });

        if (response.status === 200) {
          setMessage("BMI saved successfully!");
        }
      } catch (error) {
        setMessage("Error saving BMI. Please try again.");
      }
    } else {
      setMessage("Please enter valid height and weight.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BODY MASS INDEX EVALUATION</h1>
      
      <div style={styles.layout}>
        {/* Left Section: Inputs */}
        <div style={styles.inputContainer}>
          <h2 style={styles.sectionTitle}>Enter Your Details</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Height (feet)</label>
            <select style={styles.select} value={feet} onChange={(e) => setFeet(e.target.value)}>
              {[...Array(10).keys()].slice(1).map((n) => (
                <option key={n} value={n}>{n} feet</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Additional Inches</label>
            <select style={styles.select} value={inches} onChange={(e) => setInches(e.target.value)}>
              {[...Array(12).keys()].map((n) => (
                <option key={n} value={n}>{n} inches</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Weight (lbs)</label>
            <select style={styles.select} value={weight} onChange={(e) => setWeight(e.target.value)}>
              {[...Array(301).keys()].slice(50).map((n) => (
                <option key={n} value={n}>{n} lbs</option>
              ))}
            </select>
          </div>

          <button style={styles.button} onClick={calculateBMI}>Calculate BMI</button>
        </div>

        {/* Right Section: Results */}
        <div style={styles.resultContainer}>
          <h2 style={styles.sectionTitle}>BMI Results</h2>
          {bmi && (
            <div style={styles.bmiDisplay}>
              <h3 style={styles.bmiValue}>{bmi}</h3>
              <p style={styles.bmiCategory}>{category}</p>
            </div>
          )}

          <div style={styles.bmiGuide}>
            <p><strong>Below 18.5:</strong> Underweight</p>
            <p><strong>18.5 - 24.9:</strong> Healthy Weight</p>
            <p><strong>25.0 - 29.9:</strong> Overweight</p>
            <p><strong>30.0 and above:</strong> Obese</p>
          </div>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={styles.navButtons}>
        <button style={styles.navButton} onClick={() => navigate(-1)}>Back</button>
        <button style={styles.navButton} onClick={() => navigate("/nurtition")} disabled={!bmi}>Next</button>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: { textAlign: "center", padding: "20px" },
  title: { fontSize: "26px", fontWeight: "bold", color: "#2E8B57" }, // Increased font size
  layout: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: "900px", margin: "auto" },
  
  // Left Section (Inputs)
  inputContainer: { width: "45%", textAlign: "left" },
  sectionTitle: { fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }, // Increased font size
  inputGroup: { marginBottom: "15px" },
  label: { fontSize: "20px", fontWeight: "bold", display: "block", marginBottom: "5px" }, // Increased font size
  select: {
    width: "100%", padding: "10px", fontSize: "20px", borderRadius: "5px", border: "1px solid #ccc", // Increased font size
    backgroundColor: "#f8f8f8", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  button: {
    width: "100%", padding: "12px", backgroundColor: "green", color: "white",
    border: "none", cursor: "pointer", fontSize: "20px", borderRadius: "5px" // Increased font size
  },

  // Right Section (Results)
  resultContainer: { width: "45%", backgroundColor: "#dff0d8", padding: "15px", borderRadius: "8px", textAlign: "center" },
  bmiDisplay: { fontSize: "22px", fontWeight: "bold", padding: "10px", backgroundColor: "#fff", borderRadius: "8px" }, // Increased font size
  bmiValue: { fontSize: "30px", fontWeight: "bold" }, // Increased font size
  bmiCategory: { fontSize: "20px", fontWeight: "bold" }, // Increased font size
  bmiGuide: { fontSize: "20px", marginTop: "10px", textAlign: "left" }, // Increased font size
  message: { fontSize: "20px", color: "#d9534f", fontWeight: "bold" }, // Increased font size

  // Navigation Buttons
  navButtons: { display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" },
  navButton: { padding: "12px 24px", backgroundColor: "#0e5580", color: "white", border: "none", cursor: "pointer", fontSize: "20px", borderRadius: "5px" } // Increased font size
};



export default BmiEvaluation;
