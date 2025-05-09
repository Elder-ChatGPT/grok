import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StressScale = ({ onNext, onBack }) => {
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate(-1));

  const questionsPage1 = [
    "Been upset because of something that happened unexpectedly?",
    "Felt that you were unable to control the important things in your life?",
    "Felt confident about your ability to handle your personal problems?",
    "Felt nervous and stressed?",
    "Felt that things were going your way?",
  ];

  const questionsPage2 = [
    "Found that you could not cope with all the things that you had to do?",
    "Been angered because of things that happened that were outside of your control?",
    "Been able to control irritations in your life?",
    "Felt that you were on top of things?",
  ];

  const options = ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"];
  

  const handleChange = (questionIndex, value) => {
    setResponses({ ...responses, [`${currentPage}-${questionIndex}`]: value });
  };

  const isNextDisabled = (questions) => {
    return questions.some((_, index) => !responses[`${currentPage}-${index}`]);
  };

  const totalQuestions = questionsPage1.length + questionsPage2.length;
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleNextPage = () => {
    if (currentPage === 1) {
      setCurrentPage(2);
    } else {
      handleSubmit();
    }
  };

  const handleBackPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      handleBack(); 
    }
  };  

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userID"); // Get userID from local storage
    if (!userId) {
      alert("User not logged in");
      return;
    }
    try {
      await axios.post("http://localhost:5003/api/stress-scale", {
        userId,
        responses,
      });
      alert("Responses submitted successfully");
      const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
          const completionDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          });

          storedCompletedTests[userId] = { 
            ...(storedCompletedTests[userId] || {}), 
            Stress: { completedAt: completionDate }
          };
          localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));

      navigate("/stressscore"); // Redirect to the results page after submission
    } catch (error) {
      console.error("Error submitting responses", error);
      alert("Failed to submit responses");
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Perceived Stress Scale</h2>
      <p style={styles.subtitle}>Please take some time to answer ALL the questions</p>

      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.questionHeader}>In the last month, how often have you:</div>
          <div style={styles.optionHeaders}>
            {options.map((option, index) => (
              <span key={index} style={styles.optionHeader}>{option}</span>
            ))}
          </div>
        </div>

        {(currentPage === 1 ? questionsPage1 : questionsPage2).map((question, questionIndex) => (
          <div key={questionIndex} style={styles.row}>
            <div style={styles.question}>{question}</div>
            <div style={styles.optionsRow}>
              {options.map((option, optionIndex) => (
                <label key={optionIndex} style={styles.label}>
                  <input
                    type="radio"
                    name={`question-${currentPage}-${questionIndex}`}
                    value={option}
                    checked={responses[`${currentPage}-${questionIndex}`] === option}
                    onChange={() => handleChange(questionIndex, option)}
                    style={styles.radio}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.buttonContainer}>
      <button style={styles.backButton} onClick={handleBackPage}>Back</button>
        {!isNextDisabled(currentPage === 1 ? questionsPage1 : questionsPage2) && (
          <button
            style={styles.nextButton}
            onClick={handleNextPage}
          >
            {currentPage === 1 ? "Next" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    width: "80%",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    height: "16px",
    backgroundColor: "#d3ecff",
    borderRadius: "8px",
    marginBottom: "40px", // Increased margin for space between progress bar and other content
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4bb4f8",
    borderRadius: "8px",
    transition: "width 0.5s ease-out", // Reduced transition speed to 0.5s for smoother fill
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    borderRadius: "5px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontWeight: "bold",
    fontSize: "20px",
    paddingBottom: "10px", // Removed the border-bottom
  },
  questionHeader: {
    flex: 2,
    textAlign: "left",
  },
  optionHeaders: {
    flex: 3,
    display: "flex",
    justifyContent: "space-around",
  },
  optionHeader: {
    flex: 1,
    textAlign: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
    width: "100%",
  },
  question: {
    flex: 2,
    textAlign: "left",
    fontSize: "18px",
  },
  optionsRow: {
    flex: 3,
    display: "flex",
    justifyContent: "space-around",
  },
  label: {
    display: "inline-block",
    textAlign: "center",
  },
  radio: {
    width: "18px",
    height: "18px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center", // Centering buttons
    marginTop: "10px", // Reduced space between buttons
    width: "100%",
  },
  backButton: {
    padding: "10px 18px",
    backgroundColor: "#0a3d62",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginRight: "20px",
  },
  nextButton: {
    padding: "10px 18px",
    backgroundColor: "#4bb4f8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default StressScale;






