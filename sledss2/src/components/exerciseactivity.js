import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Activity = ({ onNext, onBack }) => {
  
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate(-1));

  const questionHeaders = {
    1: "1. Over the past 7 days, how often did you participate in sitting activities such as ?",
    2: "2. Over the past 7 days, how often did you take a walk outside your home or yard for any reason?",
    3: "3. Over the past 7 days, how often did you engage in light sport or recreational activities?",
    4: "4. Over the past 7 days, how often did you engage in moderate sport and recreational activities?",
    5: "5. Over the past 7 days, how often did you engage in strenuous sport and recreational activities?",
    6: "6. Over the past 7 days, how often did you do exercises to increase muscle strength and endurance?",
    7: "7. During the past 7 days, have you done any light housework? ",
    8: "8. During the past 7 days, have you done any heavy housework or chores? ",
    9: "9. During the past 7 days, did you engage in any of the following activities?",
    10:"10.Work related ",
    11:"11.During the past 7 days, did you engage in any of the following activities?",
  };

  const questions = {
    1: [
      "Reading",
      "Watching TV",
      "Handicrafts",
      "Game",
      "Phone/ Computer",
    ],
    2: [
      "Walking a dog",
      "Walking in a park",
      "Walking to a store",
      "Walking in the neighborhood",
     
    ],
    3: [
      "Walking ",
      "Cycling",
      "Swimming",
      "Yoga"
    ],
    4: [
      "Brisk walking",
      "Cycling at moderate pace",
      "Climbing stairs",
      "Recreational swimming",
      
     
    ],
    5: [
      "Running",
      "Fast jump rope",
      "Fast cycling ",
      "High-intensity aerobics",
      
    ],
    6: [
      
      "Light weightlifting",
      "Push-ups or knee push-ups",
      "Bodyweight squats",
      "Resistance band exercises",
      
      
    ],

    7: [
      "(e.g., dusting, washing dishes)",
     
    ],
    8: [
     " (e.g., scrubbing floors, carrying wood)",
    ],

    9: [
        "Home repairs (e.g., painting, electrical work)",
        "Lawn or yard work (e.g., snow/leaf removal)",
        "Outdoor gardening",
        "Caring for another person (e.g., child, dependent adult)",
       ],


       10: [
        " During the past 7 days, did you work for pay or as a volunteer?",
       ],

       11: [
        "Mainly sitting (e.g., office worker, bus driver)",
        "Sitting/standing with some walking (e.g., cashier, office worker)",
        "Walking with light lifting (e.g., waiter, mail carrier)",
        "Walking & heavy manual work (e.g., construction worker, farm)",
       ],
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
    9: ["Yes ","No"],
    10: ["Yes ","No",],
    11: ["Yes","No"],
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
      await axios.post("http://184.168.29.119:5009/api/exercise-scale", {
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
        Exercise: { completedAt: completionDate },
      };
      localStorage.setItem("completedTests", JSON.stringify(storedCompletedTests));

      alert("Responses submitted successfully");
      navigate("/exerciseresult");
    } catch (error) {
      console.error("Error submitting responses", error);
      alert("Failed to submit responses");
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sports and Activities.</h2>
      <p style={styles.subtitle}>Please take some time to answer ALL the questions</p>

      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={styles.questionHeader}>{questionHeaders[currentPage]}</div>
          {currentPage !== 12 && (
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
            {currentPage === 12 ? (
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
    backgroundColor: "#E8C547",
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
    backgroundColor: "#E8C547",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default Activity;
