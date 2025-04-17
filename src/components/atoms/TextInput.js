import React from 'react';
import './TextInput.css';

const TextInput = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  icon,
  iconPosition = 'left',
  className = '',
  multiline = false,
  rows = 3
}) => {
  if (multiline) {
    return (
      <div className={`text-input-container ${icon ? `text-input-with-icon text-input-icon-${iconPosition}` : ''} ${className}`}>
        {icon && iconPosition === 'left' && <span className="text-input-icon">{icon}</span>}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="text-input text-input-multiline"
          rows={rows}
        />
        {icon && iconPosition === 'right' && <span className="text-input-icon">{icon}</span>}
      </div>
    );
  }

  return (
    <div className={`text-input-container ${icon ? `text-input-with-icon text-input-icon-${iconPosition}` : ''} ${className}`}>
      {icon && iconPosition === 'left' && <span className="text-input-icon">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-input"
      />
      {icon && iconPosition === 'right' && <span className="text-input-icon">{icon}</span>}
    </div>
  );
};

export default TextInput; 