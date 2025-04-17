import React from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import FeatureList from '../organisms/FeatureList';
import './LandingTemplate.css';

const LandingTemplate = ({ onStartClick }) => {
  return (
    <div className="landing-template">
      <div className="landing-content">
        <Typography variant="h1" color="white" align="center" className="landing-title">
          Super French Teacher
        </Typography>
        <Typography variant="subtitle1" color="primary" align="center" className="landing-subtitle">
          Improve your French skills with personalized lessons
        </Typography>
        
        <FeatureList />
        
        <Button 
          onClick={onStartClick} 
          variant="primary" 
          size="large"
          className="landing-cta"
        >
          Talk to Your Teacher
        </Button>
      </div>
    </div>
  );
};

export default LandingTemplate; 