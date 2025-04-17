import React from 'react';
import Avatar from '../atoms/Avatar';
import MessageBubble from '../atoms/MessageBubble';
import './Message.css';

const Message = ({ 
  content, 
  timestamp, 
  isUser = false, 
  avatar, 
  status = 'sent',
  showAvatar = true
}) => {
  return (
    <div className={`message ${isUser ? 'message-right' : 'message-left'}`}>
      {!isUser && showAvatar && (
        <div className="message-avatar">
          <Avatar src={avatar} alt="Contact" size="small" />
        </div>
      )}
      <MessageBubble 
        isUser={isUser} 
        timestamp={timestamp}
        status={status}
      >
        {content}
      </MessageBubble>
      {isUser && showAvatar && (
        <div className="message-avatar">
          <Avatar src={avatar} alt="You" size="small" />
        </div>
      )}
    </div>
  );
};

export default Message; 