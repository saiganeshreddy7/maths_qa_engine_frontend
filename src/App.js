import React, { useState, useRef, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';
import { askQuestion, submitFeedback } from './services/api';
import './App.css';

function App() {
  // Chat history to store all conversations
  const [conversations, setConversations] = useState([]);
  // Current active conversation
  const [activeConversationIndex, setActiveConversationIndex] = useState(null);
  // UI state
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // Derived values from current active conversation
  const activeConversation = activeConversationIndex !== null ? conversations[activeConversationIndex] : null;
  const messages = activeConversation ? activeConversation.messages : [];
  const convId = activeConversation ? activeConversation.convId : null;

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem('mathQaConversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        // Set the last conversation as active if available
        if (parsedConversations.length > 0) {
          setActiveConversationIndex(parsedConversations.length - 1);
        }
      } catch (e) {
        console.error('Error parsing saved conversations:', e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('mathQaConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('mathQAConversations');
    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations);
        setConversations(parsedConversations);
        
        // If there are conversations, set the most recent one as active
        if (parsedConversations.length > 0) {
          setActiveConversationIndex(parsedConversations.length - 1);
        }
      } catch (error) {
        console.error('Error parsing stored conversations:', error);
      }
    }
  }, []);
  
  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('mathQAConversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    setLoading(true);
    
    try {
      // If this is a new conversation, create one
      if (activeConversationIndex === null) {
        const newConversation = {
          title: question.substring(0, 30) + (question.length > 30 ? '...' : ''),
          convId: null,
          messages: [],
          createdAt: new Date().toISOString()
        };
        
        setConversations(prev => [...prev, newConversation]);
        setActiveConversationIndex(conversations.length);
      }
      
      // Get the current conversation index (whether existing or newly created)
      const currentIndex = activeConversationIndex !== null ? 
        activeConversationIndex : conversations.length;
      
      const currentConvId = activeConversation ? activeConversation.convId : null;
      const response = await askQuestion(currentConvId, question);
      const data = response[0]; // API returns array with one item
      
      // Create new message object
      const newMessage = {
        question: question,
        answer: data.answer,
        uniqueId: data.unique_id,
        feedback: null,
        timestamp: new Date().toISOString()
      };
      
      // Update the active conversation with new message and convId if needed
      setConversations(prev => {
        const updated = [...prev];
        
        // Ensure we're updating the correct conversation
        const index = currentIndex;
        
        if (!updated[index]) {
          console.error('Conversation index not found:', index);
          return prev;
        }
        
        updated[index] = {
          ...updated[index],
          convId: updated[index].convId || data.conv_id,
          messages: [...updated[index].messages, newMessage],
          // Update title if this is the first message
          title: updated[index].messages.length === 0 ? 
            question.substring(0, 30) + (question.length > 30 ? '...' : '') : 
            updated[index].title
        };
        
        return updated;
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to active conversation
      if (activeConversationIndex !== null) {
        setConversations(prev => {
          const updated = [...prev];
          const errorMessage = {
            question: question,
            answer: "Sorry, I encountered an error while processing your question. Please try again.",
            uniqueId: null,
            feedback: null,
            isError: true,
            timestamp: new Date().toISOString()
          };
          
          updated[activeConversationIndex] = {
            ...updated[activeConversationIndex],
            messages: [...updated[activeConversationIndex].messages, errorMessage]
          };
          
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (uniqueId, value, description = null) => {
    if (activeConversationIndex === null) return;
    
    try {
      await submitFeedback(uniqueId, value, description);
      
      // Update feedback in the active conversation
      setConversations(prev => {
        const updated = [...prev];
        const updatedMessages = updated[activeConversationIndex].messages.map(msg =>
          msg.uniqueId === uniqueId
            ? { ...msg, feedback: { value, description } }
            : msg
        );
        
        updated[activeConversationIndex] = {
          ...updated[activeConversationIndex],
          messages: updatedMessages
        };
        
        return updated;
      });
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleNewChat = () => {
    // Create a new empty conversation and set it as active
    setConversations(prev => [
      ...prev,
      {
        title: "New Chat",
        convId: null,
        messages: [],
        createdAt: new Date().toISOString()
      }
    ]);
    setActiveConversationIndex(conversations.length);
  };
  
  const handleSelectConversation = (index) => {
    setActiveConversationIndex(index);
    setShowSidebar(false); // Hide sidebar on mobile after selection
  };
  
  const handleDeleteConversation = (index, e) => {
    e.stopPropagation(); // Prevent triggering the select conversation
    
    setConversations(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // If we deleted the active conversation or a conversation before it, adjust the active index
    if (activeConversationIndex === index) {
      // If this was the only conversation, set to null
      if (conversations.length <= 1) {
        setActiveConversationIndex(null);
      } else {
        // Otherwise, select the previous conversation or the first one
        setActiveConversationIndex(Math.max(0, activeConversationIndex - 1));
      }
    } else if (activeConversationIndex > index) {
      // If we deleted a conversation before the active one, decrement the index
      setActiveConversationIndex(activeConversationIndex - 1);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="app">
      {/* Sidebar for conversation history */}
      <Sidebar 
        conversations={conversations}
        activeIndex={activeConversationIndex}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
        show={showSidebar}
      />
      
      {/* Main content area */}
      <div className={`main-content ${showSidebar ? 'sidebar-open' : ''}`}>
        {/* Header with app title and menu button */}
        <div className="chat-header">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle conversation history"
          >
            ☰
          </button>
          
          <h1>Math Q&A Assistant</h1>
          
          {convId && <span className="conv-id">Conversation: {convId}</span>}
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
    </div>
  );
}

export default App;