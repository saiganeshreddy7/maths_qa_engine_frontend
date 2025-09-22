import React, { useState, useRef, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { askQuestion, submitFeedback } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [convId, setConvId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    setLoading(true);
    
    try {
      const response = await askQuestion(convId, question);
      const data = response[0]; // API returns array with one item
      
      // Add new message to chat
      setMessages(prev => [...prev, {
        question: question,
        answer: data.answer,
        uniqueId: data.unique_id,
        feedback: null
      }]);
      
      // Set conversation ID if this was the first message
      if (!convId) {
        setConvId(data.conv_id);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        question: question,
        answer: "Sorry, I encountered an error while processing your question. Please try again.",
        uniqueId: null,
        feedback: null,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (uniqueId, value, description = null) => {
    try {
      await submitFeedback(uniqueId, value, description);
      
      // Update message with feedback status
      setMessages(prev => prev.map(msg => 
        msg.uniqueId === uniqueId 
          ? { ...msg, feedback: { value, description } }
          : msg
      ));
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConvId(null);
  };

  return (
    <div className="app">
      {/* Fixed header */}
      <div className="chat-header">
        <h1>Math Q&A Assistant</h1>
        {convId && <span className="conv-id">Conversation: {convId}</span>}
      </div>
      
      {/* New Chat Button fixed at top left */}
      <div className="new-chat-container">
        <button 
          onClick={handleNewChat}
          disabled={loading}
          className="new-chat-btn"
          title="Start a new conversation"
        >
          New Chat
        </button>
      </div>
      
      {/* Scrollable chat content area */}
      <div className="chat-content-area">
        <ChatWindow 
          messages={messages} 
          onFeedback={handleFeedback}
          loading={loading}
        />
        
        {/* Scroll anchor for auto-scrolling */}
        <div ref={chatEndRef} className="scroll-anchor" />
      </div>
      
      {/* Fixed input bar at the bottom */}
      <InputBar 
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        loading={loading}
      />
    </div>
  );
}

export default App;