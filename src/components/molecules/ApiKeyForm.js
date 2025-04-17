import React, { useState } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import { useChat } from '../../context/ChatContext';
import './ApiKeyForm.css';

const ApiKeyForm = () => {
  const { apiKey, setOpenAIKey } = useChat();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setOpenAIKey(inputKey.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="api-key-form">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Typography variant="body2" color="dark" className="api-key-label">
            Enter your OpenAI API Key to continue:
          </Typography>
          <div className="api-key-input-container">
            <TextInput
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
            />
            <Button type="submit" variant="primary" size="small">
              Save
            </Button>
          </div>
          <Typography variant="caption" color="dark" className="api-key-info">
            Your API key is stored locally on your device and is never sent to our servers.
          </Typography>
        </form>
      ) : (
        <div className="api-key-display">
          <Typography variant="body2" color="dark">
            API Key: •••••••••••••••••••••••
          </Typography>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Change
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyForm; 