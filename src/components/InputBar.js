import React, { useState } from 'react';
import './InputBar.css';

const InputBar = ({ onSendMessage, onNewChat, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="input-bar">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
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
            >
              {loading ? '...' : '→'}
            </button>
            
            <button
              type="button"
              onClick={onNewChat}
              disabled={loading}
              className="new-chat-button"
            >
              New Chat
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputBar;