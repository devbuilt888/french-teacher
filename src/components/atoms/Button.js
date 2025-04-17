import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', size = 'medium', className = '' }) => {
  return (
    <button 
      className={`button button-${variant} button-${size} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 