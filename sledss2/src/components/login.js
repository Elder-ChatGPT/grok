import React, { useState } from 'react';
import './Style6.css';
import config from './config';

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
      const res = await fetch(`${config.backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();
      setResponse(data);
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <header className="chat-header">
        <h2>🌿 Healthy Life Assistant</h2>
        <p>Ask questions or select a topic below to get AI-powered lifestyle advice.</p>
      </header>

      <div className="chat-layout">
        <aside className="question-sidebar">
          <h3>💡 Ask by Topic</h3>
          {Object.entries(forums).map(([title, questions]) => (
            <div className="category-block" key={title}>
              <h4 className="category-title">{title}</h4>
              {questions.map((q, index) => (
                <button className="question-btn" key={index} onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className="chat-main">
          <div className="ask-input">
            <textarea
              className="chat-input"
              rows="3"
              placeholder="Type your question here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="chat-send"
              onClick={() => sendMessage(message)}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className="chat-box">
            {loading && <div className="loading-msg">⏳ Generating recommendations...</div>}
            {!loading && response && (
              <div className="ai-response">
                <strong>AI Recommendation:</strong>
                <p>{response}</p>
              </div>
            )}
            {!response && !loading && (
              <div className="empty-state">
                🧘 Your response will appear here. Select a question or type your own!
              </div>
            )}
            {error && <div className="error-msg">❌ {error}</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
