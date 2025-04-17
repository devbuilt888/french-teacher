import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingTemplate from '../templates/LandingTemplate';
import SEO from '../atoms/SEO';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/chat');
  };

  return (
    <>
      <SEO 
        title="Welcome" 
        description="Learn French with our experienced native teachers. Start your journey today!" 
      />
      <LandingTemplate onStartClick={handleStartClick} />
    </>
  );
};

export default LandingPage; 