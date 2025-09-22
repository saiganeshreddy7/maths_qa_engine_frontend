import React from 'react';
import Message from './Message';
import './ChatWindow.css';

const ChatWindow = ({ messages, onFeedback, loading }) => {
  // Example questions that can be clicked
  const exampleQuestions = [
    "What is the derivative of x²?",
    "Solve 2x + 5 = 15",
    "Explain the Pythagorean theorem"
  ];

  // Function to handle when an example question is clicked
  const handleExampleClick = (question) => {
    // Create a custom event to simulate typing the question
    const customEvent = new CustomEvent('exampleQuestionClicked', {
      detail: { question }
    });
    document.dispatchEvent(customEvent);
  };

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h2>Welcome to Math Q&A Assistant!</h2>
          <p>Ask me any mathematical question and I'll help you solve it.</p>
          <div className="example-questions">
            <p>Try asking:</p>
            <ul>
              {exampleQuestions.map((question, index) => (
                <li key={index} onClick={() => handleExampleClick(question)}>
                  "{question}"
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="messages">
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              onFeedback={onFeedback}
            />
          ))}
          {loading && (
            <div className="loading-message">
              <div className="user-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;