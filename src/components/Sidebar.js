import React from 'react';
import './Sidebar.css';

const Sidebar = ({ 
  conversations, 
  activeIndex, 
  onSelectConversation, 
  onDeleteConversation,
  onNewChat,
  show
}) => {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`sidebar ${show ? 'show' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <span>+ New Chat</span>
        </button>
      </div>
      
      <div className="sidebar-content">
        {conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          <ul className="conversation-list">
            {conversations.map((conversation, index) => (
              <li 
                key={index}
                className={`conversation-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => onSelectConversation(index)}
              >
                <div className="conversation-title">{conversation.title}</div>
                <div className="conversation-meta">
                  <span className="conversation-date">{formatDate(conversation.createdAt)}</span>
                  <button 
                    className="delete-conversation-btn"
                    onClick={(e) => onDeleteConversation(index, e)}
                    aria-label="Delete conversation"
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;