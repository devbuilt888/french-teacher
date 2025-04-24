import React, { useState, useEffect } from 'react';
import ChatHeader from '../molecules/ChatHeader';
import MessageList from '../organisms/MessageList';
import ChatFooter from '../molecules/ChatFooter';
import ApiKeyForm from '../molecules/ApiKeyForm';
import Typography from '../atoms/Typography';
import IOSAudioHelper from '../molecules/IOSAudioHelper';
import { useChat } from '../../context/ChatContext';
import './ChatTemplate.css';

const ChatTemplate = ({ onBackClick, teacherName = "Super French Tutor" }) => {
  const [isSafari, setIsSafari] = useState(false);
  const [safariWarningDismissed, setSafariWarningDismissed] = useState(false);
  
  const { 
    messages, 
    userAvatar, 
    teacherAvatar, 
    isInitialized, 
    isLoading, 
    error, 
    isSpeaking,
    hasApiKey
  } = useChat();
  
  useEffect(() => {
    // Check if browser is Safari
    const checkSafari = () => {
      const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      setIsSafari(isSafariBrowser);
    };
    
    checkSafari();
  }, []);

  const dismissSafariWarning = () => {
    setSafariWarningDismissed(true);
  };

  return (
    <div className="chat-template">
      <ChatHeader 
        name={teacherName} 
        status="online"
        avatarSrc={teacherAvatar}
        onBackClick={onBackClick}
      />
      
      {isSafari && !safariWarningDismissed && (
        <div className="browser-compatibility-warning">
          <Typography variant="subtitle2" color="primary">
            Browser Compatibility Notice
          </Typography>
          <Typography variant="body2" color="dark">
            Safari may have issues with speech and audio features. For the best experience, 
            consider using Chrome, Firefox, or Edge.
          </Typography>
          <button 
            className="dismiss-warning-button"
            onClick={dismissSafariWarning}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="chat-content">
        {!isInitialized && (
          <div className="chat-api-key-container">
            {!hasApiKey ? (
              <div className="env-instructions">
                <Typography variant="subtitle1" color="primary">
                  Missing OpenAI API Key
                </Typography>
                <Typography variant="body2" color="dark">
                  To use this application, you need to add your OpenAI API key to the environment.
                </Typography>
                <div className="code-block">
                  <code>
                    # Create a .env.local file in the project root and add:<br />
                    REACT_APP_OPENAI_API_KEY=your_openai_api_key
                  </code>
                </div>
                <Typography variant="body2" color="dark">
                  After adding the API key, restart the application.
                </Typography>
              </div>
            ) : (
              <ApiKeyForm />
            )}
          </div>
        )}
        
        {error && (
          <div className="chat-error">
            <Typography variant="body2" color="primary">
              {error}
            </Typography>
          </div>
        )}
        
        {isLoading && (
          <div className="chat-loading">
            <Typography variant="body2" color="secondary">
              Loading...
            </Typography>
          </div>
        )}
        
        {isSpeaking && (
          <div className="chat-speaking-indicator">
            <Typography variant="caption" color="secondary">
              Speaking...
            </Typography>
          </div>
        )}
        
        <MessageList 
          messages={messages}
          userAvatar={userAvatar}
          teacherAvatar={teacherAvatar}
        />
      </div>
      
      <ChatFooter />
      <IOSAudioHelper />
    </div>
  );
};

export default ChatTemplate; 