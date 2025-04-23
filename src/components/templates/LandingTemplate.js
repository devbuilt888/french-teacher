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
        <div className="promo-badges-container">
          <div className="promo-badge">
            <div className="promo-text">
              <span>💬</span> Talk about anything
            </div>
          </div>
          <div className="promo-badge">
            <div className="promo-text">
              <span>🧘</span> No judgement, no pressure
            </div>
          </div>
          <div className="promo-badge">
            <div className="promo-text">
              <span>∞</span> Unlimited practice
            </div>
          </div>
        </div>
        
        <div className="landing-hero">
          <Typography variant="h1" color="white" align="center" className="landing-title">
            French Conversation Pro
          </Typography>
          <Typography variant="subtitle1" color="white" align="center" className="landing-subtitle">
            Complement your language studies with realistic conversation practice using AI
          </Typography>
          
          <Button 
            onClick={onStartClick} 
            variant="primary" 
            size="lg"
            className="landing-cta"
            type="button"
          >
            Start Conversing Now
          </Button>
        </div>
      </div>
      <div className="flag-stripe"></div>
    </div>
  );
};

export default LandingTemplate; 