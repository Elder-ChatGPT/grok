import React, { useState, useEffect } from 'react';
import ProgressBar from './bar';
import './Socialtest.css';

// Split questions across 5 pages
const questions = [
  [
    { question: "Family: Including by birth, marriage and adoption", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many relatives do you see or hear from at least once a month?", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many relatives do you feel at ease with that you can talk about private matters?", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many relatives do you feel close to such that you could call on them for help?", options: [0, 1, 2, '3-4', '5-8', '9+'] }
  ],
  [
    { question: "Family: Including by birth, marriage and adoption?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "When one of your relatives has an important decision to make, how often do they talk to you about it?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "How often is one of your relatives available for you to talk to when you have an important decision to make?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] }
  ],
  [
    { question: "Family: Including by birth, marriage and adoption?", options: ['Less than Monthly', 'Monthly', 'Few times a month', 'Weekly', 'Few times a week', 'Daily'] },
    { question: "How often do you see or hear from the relative with whom you have the most contact?", options: ['Less than Monthly', 'Monthly', 'Few times a month', 'Weekly', 'Few times a week', 'Daily'] }
  ],
  [
    { question: "Friendship: All your friends including those in your neighborhood", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "When one of your friends has an important decision to make, how often do they talk to you about it?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "How often is one of your friends available for you to talk to when you have an important decision to make?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] }
  ],
  [
    { question: "Friendship: All your friends including those in your neighborhood", options: ['Less than Monthly', 'Monthly', 'Few times a month', 'Weekly', 'Few times a week', 'Daily'] },
    { question: "How often do you see or hear from the friend with whom you have the most contact?", options: ['Less than Monthly', 'Monthly', 'Few times a month', 'Weekly', 'Few times a week', 'Daily'] }
  ]
];

const Socialtest = () => {
  const [answers, setAnswers] = useState([[], [], [] , [] , []]);
  const [currentPage, setCurrentPage] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch(`https://sledssback.elderchatgpt.com./social/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAnswers(data.answers || [[], [], []]);
        }
      } catch (error) {
        console.error('Error fetching previous answers:', error);
      }
    };

    fetchAnswers();
  }, [userId]);

  const handleAnswer = (questionIndex, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentPage][questionIndex] = answer;
    setAnswers(updatedAnswers);
  };

  const isPageCompleted = () => {
    return answers[currentPage].length === questions[currentPage].length &&
      answers[currentPage].every(answer => answer !== undefined && answer !== null);
  };

  const handleNextPage = () => {
    if (isPageCompleted()) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async () => {
    const submission = {
      userId,
      answers: JSON.stringify(answers.flat()) // Convert array to string for Neo4j compatibility
    };

    try {
      const response = await fetch('https://sledssback.elderchatgpt.com./social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify(submission)
      });

      if (response.ok) {
        alert('Answers submitted successfully!');
      } else {
        alert('Failed to submit answers. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('An error occurred while submitting your answers.');
    }
  };

  const progress = (answers.flat().filter(a => a !== null && a !== undefined).length / questions.flat().length) * 100;

  return (
    <div className="socialtest-container">
      <h1 className="title">Lubben Social Networking Scale</h1>
      <ProgressBar progress={progress} />

      {questions[currentPage].map((q, index) => (
        <div key={index} className="question-row">
          <div className="question-container">
            <span className="question">{q.question}</span>
          </div>
          <div className="options-container">
            {q.options.map(option => (
              <div key={option} className="option-wrapper">
                <span className="scale-text">{option}</span>
                <button
                  className={`option-button ${answers[currentPage][index] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(index, option)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="navigation-buttons">
        {currentPage > 0 && <button onClick={handlePrevPage}>Previous</button>}
        {currentPage < questions.length - 1 && isPageCompleted() && (
          <button onClick={handleNextPage}>Next</button>
        )}
        {currentPage === questions.length - 1 && isPageCompleted() && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Socialtest; 