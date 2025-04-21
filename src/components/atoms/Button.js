import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const sizeClass = `btn-${size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size}`;
  const variantClass = `btn-${variant}`;
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 