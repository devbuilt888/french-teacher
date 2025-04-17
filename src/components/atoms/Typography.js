import React from 'react';
import './Typography.css';

const Typography = ({ 
  variant = 'body1', 
  children, 
  className = '', 
  color = 'default',
  align = 'left'
}) => {
  const getComponent = () => {
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'subtitle1':
        return 'h6';
      case 'subtitle2':
        return 'h6';
      case 'body1':
        return 'p';
      case 'body2':
        return 'p';
      case 'caption':
        return 'span';
      default:
        return 'p';
    }
  };

  const Component = getComponent();

  return (
    <Component 
      className={`typography typography-${variant} typography-${color} typography-${align} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Typography; 