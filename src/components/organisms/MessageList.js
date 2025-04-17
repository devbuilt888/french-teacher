import React, { useRef, useEffect, useState } from 'react';
import Message from '../molecules/Message';
import Typography from '../atoms/Typography';
import './MessageList.css';

const MessageList = ({ messages, userAvatar, teacherAvatar }) => {
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Show typing indicator when user sends a message
    if (messages.length > 0 && messages[messages.length - 1].isUser) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000); // Match the response delay in ChatContext
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = '';
    
    messages.forEach((message, index) => {
      // Extract date from timestamp (assuming timestamp is in HH:MM format)
      // In a real app, you'd use the full date
      const today = new Date().toLocaleDateString();
      
      if (today !== currentDate) {
        currentDate = today;
        groups.push({ type: 'date', content: 'Today', id: `date-${index}` });
      }
      
      // Determine if we should show the avatar (group consecutive messages)
      const showAvatar = index === 0 || 
                         messages[index - 1]?.isUser !== message.isUser;
      
      groups.push({
        type: 'message',
        message: {
          ...message,
          showAvatar
        }
      });
    });
    
    return groups;
  };

  const renderContent = () => {
    const groups = groupMessagesByDate();
    
    return (
      <>
        {groups.map((item) => {
          if (item.type === 'date') {
            return (
              <div key={item.id} className="message-date-separator">
                <Typography variant="caption" className="message-date">
                  {item.content}
                </Typography>
              </div>
            );
          } else {
            const { message } = item;
            return (
              <Message
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isUser={message.isUser}
                avatar={message.isUser ? userAvatar : teacherAvatar}
                status={message.status}
                showAvatar={message.showAvatar}
              />
            );
          }
        })}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-bubble"></div>
            <div className="typing-bubble"></div>
            <div className="typing-bubble"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return (
    <div className="message-list">
      {renderContent()}
    </div>
  );
};

export default MessageList; 