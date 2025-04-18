import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PITT = ({ onNext, onBack }) => {
  
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate(-1));

  const questionHeaders = {
    1: "During the past month:",
    2: "During the past month, how often have you had trouble sleeping because you ..",
    3: "During the past month, how often have you had trouble sleeping because you ...",
    4: "During the past month:",
    5: "During the past month:",
    6: "Do you have a bed partner or roommate?",
    7: "If you have a roommate or bed partner, ask him/her how often in the past month you have had:",
  };

  const questions = {
    1: [
      "What time have you usually gone to bed at night?",
      "How long (in minutes) has it usually taken you to fall asleep each night?",
      "What time have you usually gotten up in the morning?",
      "During the past month, how many hours of actual sleep did you get at night?",
    ],
    2: [
      "Cannot get to sleep within 30 minutes",
      "Wake up in the middle of the night or early morning",
      " Have to get up to use the bathroom",
      "Cannot breathe comfortably",
      " Cough or snore loudly",
    ],
    3: [
      "Feel too hot",
      " Have bad dreams",
      "Have pain",
    ],
    4: [
      "How often have you taken medicine to help you sleep (prescribed or “over the counter”)?",
      "How often have you had trouble staying awake while driving, eating meals, or engaging in social activity?",
     
    ],
    5: [
      "How much of a problem has it been for you to keep up enough enthusiasm to get things done?",
      "How would you rate your sleep quality overall?",
      
    ],
    6: [
      
      "How would you rate your sleep quality overall?",
      
    ],

    7: [
      "Do you have a bed partner or room mate?",
     
    ],
    8: [
      "Loud snoring",
      "Long pauses between breaths while asleep",
      "Legs twitching or jerking while you sleep",
      "Episodes or disorientation or confusion during sleep",
    ],
  };

  const options = {
    2: ["Not during the past month", "Less than once a week", "Once or twice a week", "Three or more times a week"],
    3: ["Not during the past month", " Less than once a week", " Once or twice a week", " Three or more times a week"],
    4: [" Not during the past month", "Less than once a week", " Once or twice a week", " Three or more times a week"],
    5: ["No problem at all", "Only a very slight problem", "Somewhat of a problem", "A very big problem"],
    6: ["Very good", " Fairly good", " Fairly bad", "Very bad"],
    7: [" No bed partner of room mate", "Partner/room mate in other room", "Partner in same room but not same bed", "Partner in same bed"],
    8: ["Not during the past month", "Less than once a week", "Once or twice a week", " Three or more times a week"],
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
    const pageQuestions = questions[currentPage];
    return pageQuestions.some((_, index) => !responses[`${currentPage}-${index}`]);
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
      await axios.post("http://184.168.29.119:5009/api/sleep-scale", {
        userId,
        responses,
      });

      const storedCompletedTests = JSON.parse(localStorage.getItem("completedTests")) || {};
      const completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      storedCompletedTests[userId] = {
        ...(storedCompletedTests[userId] || {}),
        Sleep: { completedAt: completionDate },
      };
      localStorage.setItem("completedTests", JSON.stringify(storedCompletedTests));

      alert("Responses submitted successfully");
      navigate("/pittscore");
    } catch (error) {
      console.error("Error submitting responses", error);
      alert("Failed to submit responses");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pittsburgh Sleep Quality Index (PSQI)</h2>
      <p style={styles.subtitle}>Please take some time to answer ALL the questions</p>

      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.questionHeader}>{questionHeaders[currentPage]}</div>
          {currentPage !== 1 && (
            <div style={styles.optionHeaders}>
              {options[currentPage].map((option, index) => (
                <span key={index} style={styles.optionHeader}>{option}</span>
              ))}
            </div>
          )}
        </div>

        {questions[currentPage].map((question, questionIndex) => (
          <div key={questionIndex} style={styles.row}>
            <div style={styles.question}>{question}</div>
            {currentPage === 1 ? (
              <input
                type={questionIndex === 1 || questionIndex === 3 ? "number" : "text"}
                placeholder={
                  questionIndex === 0 ? "e.g. 10 pm" :
                  questionIndex === 1 ? "e.g. 30" :
                  questionIndex === 2 ? "e.g. 8 am" :
                  "e.g. 6"
                }
                value={responses[`${currentPage}-${questionIndex}`] || ""}
                onChange={(e) => handleChange(questionIndex, e.target.value)}
                style={{
                  marginLeft: "20px",
                  padding: "8px",
                  fontSize: "16px",
                  width: "150px",
                }}
              />
            ) : (
              <div style={styles.optionsRow}>
                {options[currentPage].map((option, optionIndex) => (
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
            )}
          </div>
        ))}
      </div>

      <div style={styles.buttonContainer}>
      <button style={styles.backButton} onClick={handleBackPage}>Back</button>

        {!isNextDisabled() && (
          <button style={styles.nextButton} onClick={handleNextPage}>
            {currentPage < Object.keys(questions).length ? "Next" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

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
    marginBottom: "40px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#A685E2",
    borderRadius: "8px",
    transition: "width 0.5s ease-out",
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
    paddingBottom: "10px",
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
    justifyContent: "center",
    marginTop: "10px",
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
    backgroundColor: "#A685E2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default PITT;
