import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BmiEvaluation = () => {
  const navigate = useNavigate();

  // State variables to store user inputs and BMI result
  const [feet, setFeet] = useState("0");
  const [inches, setInches] = useState("0");
  const [weight, setWeight] = useState("0");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState(""); // For displaying success or error message

  // Get userID from local storage
  const userID = localStorage.getItem("userID");

  // Function to calculate BMI based on user input
  const calculateBMI = async () => {
    const heightInInches = (parseInt(feet) * 12) + parseInt(inches);
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
  
      // ✅ Update state so BMI appears in frontend
      setBmi(bmiValue);
      setCategory(category);
  
      // ✅ Ensure userID is retrieved
      const userID = localStorage.getItem("userID"); 
  
      console.log("Sending request with:", { userID, bmi: bmiValue, category });
  
      if (!userID || !bmiValue || !category) {
        console.error("Missing required parameters in frontend:", { userID, bmiValue, category });
        setMessage("Error: Missing required data. Please try again.");
        return;
      }
  
      try {
        const response = await axios.post("http://184.168.29.119:5009/api/save-bmi", {
          userID,
          bmi: bmiValue,
          category
        });
  
        if (response.status === 200) {
          console.log("✅ BMI saved successfully!");
          setMessage("BMI saved successfully!");
        }
      } catch (error) {
        console.error("❌ Error saving BMI:", error.response?.data || error.message);
        setMessage("Error saving BMI. Please try again.");
      }
    } else {
      setMessage("Please enter valid height and weight.");
    }
  };
  
  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BODY MASS INDEX EVALUATION</h1>
      <p style={styles.title}>BMI</p>

      <div style={styles.inputContainer}>
        <div style={styles.heightContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Height (feet)</label>
            <select
              style={styles.select}
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
            >
              {[...Array(40).keys()].slice(1).map((n) => (
                <option key={n} value={n}>{n} feet</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Additional Inches</label>
            <select
              style={styles.select}
              value={inches}
              onChange={(e) => setInches(e.target.value)}
            >
              {[...Array(50).keys()].map((n) => (
                <option key={n} value={n}>{n} inches</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Weight (lbs)</label>
          <select
            style={styles.select}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          >
            {[...Array(501).keys()].slice(1).map((n) => (
              <option key={n} value={n}>{n} lbs</option>
            ))}
          </select>
        </div>
      </div>

      <button style={styles.button} onClick={calculateBMI}>Calculate BMI</button>

      {bmi && (
        <div style={styles.resultContainer}>
          <h2 style={styles.resultTitle}>BMI Results</h2>
          <div style={styles.resultLayout}>
            <div style={styles.bmiDisplay}>
              <h3 style={styles.bmiValue}>{bmi}</h3>
              <p style={styles.bmiCategory}>{category}</p>
            </div>

            <div style={styles.bmiGuide}>
              <p><strong>Below 18.5:</strong> Underweight</p>
              <p><strong>18.5 - 24.9:</strong> Healthy Weight</p>
              <p><strong>25.0 - 29.9:</strong> Overweight</p>
              <p><strong>30.0 - Above:</strong> Obese</p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div style={styles.messageContainer}>
          <p style={styles.message}>{message}</p>
        </div>
      )}

      <div style={styles.navButtons}>
        <button style={styles.navButton} onClick={() => navigate(-1)}>Back</button>
        <button style={styles.navButton} onClick={() => navigate("/nurtition")} disabled={!bmi}>Next</button>
      </div>
    </div>
  );
};

// CSS-in-JS styles for the component
const styles = {
  container: { textAlign: "center", padding: "20px" },
  title: { fontSize: "24px", fontWeight: "bold", color: "#2E8B57" },
  inputContainer: { margin: "20px" },
  heightContainer: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", alignItems: "center" },
  label: { fontSize: "18px", fontWeight: "bold", marginBottom: "5px" },
  select: {
    padding: "10px", 
    fontSize: "16px", 
    marginBottom: "10px", 
    width: "120px", 
    borderRadius: "5px", 
    border: "1px solid #ccc", 
    appearance: "none",
    backgroundColor: "#f8f8f8",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  button: {
    padding: "10px 20px", 
    margin: "10px", 
    backgroundColor: "green", 
    color: "white", 
    border: "none", 
    cursor: "pointer", 
    fontSize: "18px", 
    borderRadius: "5px"
  },
  resultContainer: {
    backgroundColor: "#dff0d8", 
    padding: "20px", 
    borderRadius: "8px", 
    marginTop: "15px", 
    textAlign: "center", 
    maxWidth: "600px", // Adjusted width for better alignment
    marginLeft: "auto", 
    marginRight: "auto"
  },
  resultTitle: { fontSize: "20px", fontWeight: "bold" },
  bmiDisplay: { 
    fontSize: "20px", 
    fontWeight: "bold", 
    padding: "5px", // Reduced padding for less white space
    backgroundColor: "#fff", 
    borderRadius: "8px", 
    display: "inline-block", 
    marginBottom: "10px", 
    marginTop: "20px",
    width: "100%", // Make it take up the full width for centering
    textAlign: "center", // Center the text inside the display area
    boxShadow: "none", // Removed shadow to make it blend better
  },
  bmiValue: { fontSize: "36px", fontWeight: "bold" },
  bmiCategory: { fontSize: "18px", fontWeight: "bold" },
  bmiGuide: { 
    fontSize: "16px", 
    marginTop: "10px", 
    width: "45%", // Same width as bmiDisplay to balance
    textAlign: "left", // Align the text to the left
    marginLeft: "10px", // Slight margin to add space between the sections
  },
  navButtons: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  navButton: { padding: "10px 20px", backgroundColor: "#0e5580", color: "white", border: "none", cursor: "pointer", fontSize: "16px", borderRadius: "5px" },
  messageContainer: { marginTop: "20px" },
  message: { fontSize: "18px", fontWeight: "bold", color: "#d9534f" } // Red color for error message
};

export default BmiEvaluation;








