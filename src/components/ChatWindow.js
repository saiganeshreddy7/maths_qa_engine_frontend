import React from 'react';
import Message from './Message';
import './ChatWindow.css';

const ChatWindow = ({ messages, onFeedback, loading }) => {
  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h2>Welcome to Math Q&A Assistant!</h2>
          <p>Ask me any mathematical question and I'll help you solve it.</p>
          <div className="example-questions">
            <p>Try asking:</p>
            <ul>
              <li>"What is the derivative of x²?"</li>
              <li>"Solve 2x + 5 = 15"</li>
              <li>"Explain the Pythagorean theorem"</li>
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