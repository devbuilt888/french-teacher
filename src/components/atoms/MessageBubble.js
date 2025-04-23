import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageBubble.css';

const MessageBubble = ({ 
  children, 
  isUser = false, 
  timestamp,
  status = 'sent', 
  className = '' 
}) => {
  return (
    <div className={`message-bubble ${isUser ? 'message-user' : 'message-other'} ${className}`}>
      <div className="message-content">
        {typeof children === 'string' ? (
          <ReactMarkdown>{children}</ReactMarkdown>
        ) : (
          children
        )}
      </div>
      <div className="message-footer">
        <span className="message-time">{timestamp}</span>
        {isUser && (
          <span className={`message-status message-status-${status}`}>
            {status === 'sent' && '✓'}
            {status === 'delivered' && '✓✓'}
            {status === 'read' && '✓✓'}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 