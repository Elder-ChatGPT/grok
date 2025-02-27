import React, { useState } from "react";
import axios from "axios";

export const About2 = ({ token }) => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState("");

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setError("");
    const userMessage = { role: "user", content: prompt };
    setConversation([...conversation, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:5009/api/ai-advice",
        { prompt },
        { headers: { Authorization: token } }
      );

      const aiMessage = { role: "assistant", content: response.data.advice };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI advice. Please try again.");
    }

    setPrompt("");
  };

  const handleStartNewChat = () => {
    setConversation([]);
    setError("");
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
        <h1 className="text-2xl font-bold">AI-Driven Advice</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold"
          onClick={handleStartNewChat}
        >
          Start New Chat
        </button>
      </div>

      {/* Conversation Display */}
      <div className="flex-grow overflow-y-auto p-6 bg-gray-100">
        {conversation.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation to get advice.</p>
        ) : (
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-900 self-end"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{
                  maxWidth: "75%",
                  marginLeft: message.role === "user" ? "auto" : "0",
                }}
              >
                <strong>{message.role === "user" ? "You" : "AI"}:</strong> {message.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex items-center">
        <textarea
          className="flex-grow border p-6 rounded-md mr-4 text-lg"
          rows="6"
          placeholder="Type your question or request here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-8 py-4 rounded-md text-lg font-semibold"
          onClick={handleSendPrompt}
        >
          Send
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

// Export the component
export default About2;


