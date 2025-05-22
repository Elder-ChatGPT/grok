import React, { useState } from 'react';
import ProgressBar from './bar';
import { useNavigate } from 'react-router-dom';
import './Socialtest.css';

const questions = [
  [
    { question: "How many relatives do you see or hear from at least once a month?", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many relatives do you feel at ease with that you can talk about private matters?", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many relatives do you feel close to such that you could call on them for help?", options: [0, 1, 2, '3-4', '5-8', '9+'] }
  ],
  [
    { question: "When one of your relatives has an important decision to make, how often do they talk to you about it?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "How often is one of your relatives available for you to talk to when you have an important decision to make?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] }
  ],
  [
    { question: "How often do you see or hear from the relative with whom you have the most contact?", options: ['< Monthly', 'Monthly', 'Few times/month', 'Weekly', 'Few times/week', 'Daily'] }
  ],
  [
    { question: "How many of your friends do you see or hear from at least once a month? ", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many friends do you feel at ease with that you can talk about private matters? ", options: [0, 1, 2, '3-4', '5-8', '9+'] },
    { question: "How many friends do you feel close to such that you could call on them for help?", options: [0, 1, 2, '3-4', '5-8', '9+'] }
  ],
  [
    { question: "When one of your friends has an important decision to make, how often do they talk to you about it?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] },
    { question: "How often is one of your friends available for you to talk to when you have an important decision to make?", options: ['Never', 'Seldom', 'Sometimes', 'Often', 'VeryOften', 'Always'] }
  ],
  [
    { question: "How often do you see or hear from the friend with whom you have the most contact?", options: ['< Monthly', 'Monthly', 'Few times/month', 'Weekly', 'Few times/week', 'Daily'] }
  ]
];

const Socialtest = () => {
  const [answers, setAnswers] = useState(() => Array.from({ length: questions.length }, () => []));
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (questionIndex, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentPage][questionIndex] = answer;
    setAnswers(updatedAnswers);
  };

  const isAnswered = (answer) => answer !== null && answer !== undefined;
  const isPageCompleted = () => questions[currentPage].length === answers[currentPage].filter(isAnswered).length;

  const handleNextPage = () => {
    if (isPageCompleted() && currentPage < questions.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    if (isPageCompleted() && currentPage === questions.length - 1) {
      const userId = localStorage.getItem('userID');
      if (!userId) {
        alert('User ID is missing. Please log in again.');
        return;
      }

      const formattedAnswers = answers.flat().filter(a => a !== undefined);
      const submission = { userId, answers: formattedAnswers };

      try {
        const response = await fetch('https://sledssback.elderchatgpt.com./social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });

        if (response.ok) {
          alert('Answers submitted successfully!');
          const storedCompletedTests = JSON.parse(localStorage.getItem('completedTests')) || {};
          const completionDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          });

          storedCompletedTests[userId] = { 
            ...(storedCompletedTests[userId] || {}), 
            Socialize: { completedAt: completionDate }
          };
          localStorage.setItem('completedTests', JSON.stringify(storedCompletedTests));
          navigate('/socialanswers');
        } else {
          alert('Failed to submit answers. Please try again.');
        }
      } catch (error) {
        alert('An error occurred while submitting your answers.');
      }
    }
  };

  const totalQuestions = questions.flat().length;
  const answeredQuestions = answers.flat().filter(isAnswered).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  const currentCategory = currentPage <= 2 ? 'Family-Based Questions' : 'Friendship-Based Questions';

  return (
    <div className="socialtest-container">
      <h1 className="title">Lubben Social Networking Scale</h1>
      <ProgressBar progress={progress} />
      <h2 className="category">{currentCategory}</h2>

      {questions[currentPage].map((q, index) => (
        <div key={index} className="question-row">
          <div className="question-container">
            <span className="question">{q.question}</span>
          </div>
          <div className="options-container">
            {q.options.map(option => (
              <label key={option} className="option-wrapper">
                <span className="scale-text">{option}</span>
                <input
                  type="radio"
                  name={`question-${currentPage}-${index}`}
                  value={option}
                  checked={answers[currentPage][index] === option}
                  onChange={() => handleAnswer(index, option)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="navigation-buttons">
        {currentPage > 0 && <button className="prev-button" onClick={handlePrevPage}>Previous</button>}
        {currentPage < questions.length - 1 && isPageCompleted() && (
          <button className="next-button" onClick={handleNextPage}>Next</button>
        )}
        {currentPage === questions.length - 1 && isPageCompleted() && (
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};



export default Socialtest;
