import React from 'react';
import Typography from '../atoms/Typography';
import './Feature.css';

const Feature = ({ icon, title, description, className = '' }) => {
  return (
    <div className={`feature ${className}`}>
      <i className="feature-icon">{icon}</i>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body2" color="light">{description}</Typography>
    </div>
  );
};

export default Feature; 