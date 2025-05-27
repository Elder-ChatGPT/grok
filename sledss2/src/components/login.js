import React, { useState } from 'react';
import './Style6.css';

const forums = {
  Socialization: [
    "How can I improve my social interactions?",
    "What are the benefits of socializing regularly?",
    "How does isolation affect mental health?"
  ],
  Learning: [
    "What are effective ways to keep learning as I age?",
    "How does reading benefit cognitive health?",
    "What are some brain exercises for memory improvement?"
  ],
  Exercise: [
    "How often should I exercise for optimal health?",
    "What are the best low-impact exercises for seniors?",
    "How does physical activity affect mental well-being?"
  ],
  Diet: [
    "What are the best foods for brain health?",
    "How does hydration impact cognitive function?",
    "What are the benefits of a balanced diet?"
  ],
  Stress: [
    "What are some effective stress management techniques?",
    "How does stress impact overall health?",
    "What are the benefits of mindfulness and meditation?"
  ],
  Sleep: [
    "How many hours of sleep are optimal for cognitive health?",
    "What are common sleep disorders in older adults?",
    "How can I improve my sleep quality naturally?"
  ]
};

const Login = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const res = await fetch('  ${config.backendUrl}/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <header className="chat-header">
        <h2>Health Recommendations</h2>
        <h3>NB: For personalized advice, please log in.</h3>
      </header>
      <div className="chat-content">
        <aside className="forum-sidebar">
          <h3>Predefined Questions</h3>
          {Object.entries(forums).map(([forum, questions]) => (
            <div key={forum} className="forum-group">
              <h4>{forum}</h4>
              {questions.map((q, index) => (
                <button
                  key={index}
                  className="forum-question"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          ))}
        </aside>
        <main className="chat-main">
          <div className="chat-conversation">
            {loading ? (
              <div className="generating-message">Generating response...</div>
            ) : response ? (
              <div className="ai-response">
                <strong>Recommendations:</strong>
                <p>{response}</p>
              </div>
            ) : (
              <p className="placeholder-text">Your conversation will appear here...</p>
            )}
            {error && <p className="error-message">Error: {error}</p>}
          </div>
          <div className="chat-input-area">
            <textarea
              className="chat-input"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Or type your question here..."
            ></textarea>
            <button
              className="chat-button"
              onClick={() => sendMessage(message)}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;

