import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt, size = 'medium', status = '', className = '' }) => {
  return (
    <div className={`avatar avatar-${size} ${className}`}>
      <img src={src} alt={alt} className="avatar-image" />
      {status && <span className={`avatar-status avatar-status-${status}`}></span>}
    </div>
  );
};

export default Avatar; 