import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageBubble.css';

const MessageBubble = ({ content, type = 'user', timestamp }) => {
  // Format the timestamp (assuming it's a Date object or ISO string)
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`message-bubble message-bubble--${type}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
      {timestamp && (
        <div className="message-time">{formatTime(timestamp)}</div>
      )}
    </div>
  );
};

export default MessageBubble; 