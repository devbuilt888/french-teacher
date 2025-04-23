import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatTemplate from '../templates/ChatTemplate';
import ChatBackground3D from '../3d/ChatBackground3D';
import SEO from '../atoms/SEO';

const ChatPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
      <SEO 
        title="Chat with Your Teacher" 
        description="Have a conversation with your French teacher and improve your language skills." 
      />
      <ChatBackground3D />
      <ChatTemplate onBackClick={handleBackClick} />
    </>
  );
};

export default ChatPage; 