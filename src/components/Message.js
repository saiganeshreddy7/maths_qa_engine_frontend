import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './Message.css';

const Message = ({ message, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackDescription, setFeedbackDescription] = useState('');
  
  // Format timestamp
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const feedbackOptions = [
    { value: 'correct', label: '✓ Correct', color: '#38a169' },
    { value: 'unclear', label: '? Unclear', color: '#dd6b20' },
    { value: 'not understandable', label: '✗ Not Understandable', color: '#e53e3e' },
    { value: 'wrong', label: '✗ Wrong', color: '#e53e3e' },
    { value: 'irrelevant', label: '⚠ Irrelevant', color: '#718096' }
  ];

  const handleFeedbackSubmit = (value) => {
    onFeedback(message.uniqueId, value, feedbackDescription || null);
    setShowFeedback(false);
    setFeedbackDescription('');
  };

  return (
    <div className="message">
      {/* User Question */}
      <div className="user-message">
        <div className="message-content">
          {message.question}
        </div>
      </div>

      {/* AI Answer */}
      <div className={`ai-message ${message.isError ? 'error' : ''}`}>
        <div className="message-avatar">AI</div>
        <div className="message-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {message.answer}
          </ReactMarkdown>
        </div>

        {/* Feedback Section */}
        {message.uniqueId && !message.isError && (
          <div className="feedback-section">
            {message.feedback ? (
              <div className="feedback-submitted">
                <span>Feedback: {message.feedback.value}</span>
                {message.feedback.description && (
                  <span className="feedback-description">
                    {message.feedback.description}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <button 
                  className="feedback-toggle"
                  onClick={() => setShowFeedback(!showFeedback)}
                >
                  {showFeedback ? 'Cancel' : 'Give Feedback'}
                </button>

                {showFeedback && (
                  <div className="feedback-popup">
                    <div className="feedback-options">
                      {feedbackOptions.map((option) => (
                        <button
                          key={option.value}
                          className="feedback-option"
                          style={{ borderColor: option.color, color: option.color }}
                          onClick={() => handleFeedbackSubmit(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Optional: Add description..."
                      value={feedbackDescription}
                      onChange={(e) => setFeedbackDescription(e.target.value)}
                      className="feedback-description-input"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;