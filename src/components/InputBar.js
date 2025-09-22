import React, { useState, useEffect, useRef } from 'react';
import './InputBar.css';

const InputBar = ({ onSendMessage, onNewChat, loading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Listen for example question clicks
  useEffect(() => {
    const handleExampleClick = (event) => {
      const { question } = event.detail;
      setInput(question);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };
    
    document.addEventListener('exampleQuestionClicked', handleExampleClick);
    
    return () => {
      document.removeEventListener('exampleQuestionClicked', handleExampleClick);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChatClick = () => {
    if (!loading) {
      onNewChat();
      setInput('');
      
      // Reset textarea height and focus
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }
  };

  return (
    <div className="input-bar">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a math question..."
            disabled={loading}
            rows="1"
            className="message-input"
          />
          
          <div className="button-group">
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="send-button"
              title="Send message"
              aria-label="Send message"
            >
              {loading ? (
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputBar;