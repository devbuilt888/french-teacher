import React from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import ModelLoader from '../3d/ModelLoader';
import './LandingTemplate.css';

const LandingTemplate = ({ onStartClick }) => {
  return (
    <div className="landing-template">
      <ModelLoader />
      <div className="landing-content">
        <div className="landing-hero">
          <Typography variant="h1" color="white" align="center" className="landing-title">
            Super French Teacher
          </Typography>
          <Typography variant="subtitle1" color="white" align="center" className="landing-subtitle">
            Improve your French skills with personalized conversation
          </Typography>
          
          <Button 
            onClick={onStartClick} 
            variant="primary" 
            size="lg"
            className="landing-cta"
            type="button"
          >
            Talk to Your Teacher
          </Button>
        </div>
      </div>
      <div className="flag-stripe"></div>
    </div>
  );
};

export default LandingTemplate; 