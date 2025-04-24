import React, { useState, useEffect } from 'react';
import './IOSAudioHelper.css';
import { useChat } from '../../context/ChatContext';

const IOSAudioHelper = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [visible, setVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const { audioInitialized, forceInitializeAudio } = useChat();

  useEffect(() => {
    // Check if device is iOS or Safari
    const checkBrowser = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIOS(iOS);
      
      const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      setIsSafari(safari);
      
      // Show helper immediately on iOS or Safari
      if (iOS || safari) {
        setVisible(true);
      }
    };
    
    checkBrowser();
  }, []);
  
  useEffect(() => {
    // Hide the helper if audio is initialized
    if (audioInitialized && visible) {
      // Show success message briefly
      setFeedback('Audio successfully initialized!');
      
      // Hide helper after a delay
      const timer = setTimeout(() => {
        setVisible(false);
        setFeedback('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [audioInitialized, visible]);

  const enableAudio = async () => {
    try {
      setFeedback('Initializing audio and requesting microphone access...');
      setAttempts(prev => prev + 1);
      
      // Use the context function to initialize audio
      forceInitializeAudio();
      
      // If we got here without errors, we're likely good
      setFeedback('Audio initialized successfully! A permission prompt for microphone access may appear.');
      
      // Hide after success (the context effect will handle this)
    } catch (error) {
      console.error('Error enabling audio:', error);
      setFeedback('Failed to initialize audio. Please try again and ensure you allow microphone access.');
    }
  };

  // Show for iOS or Safari when audio is not initialized
  if ((!isIOS && !isSafari) || (audioInitialized && !visible)) return null;

  const browserType = isIOS ? 'iOS' : 'Safari';

  return (
    <div className="ios-audio-helper">
      <h3>{browserType} Audio & Microphone Setup</h3>
      
      <p>
        {!audioInitialized ? 
          `Audio initialization is required for ${browserType}. Please tap the button below to enable these features.` : 
          'Audio is now enabled! This message will disappear shortly.'}
      </p>
      
      {feedback && <div className="audio-feedback">{feedback}</div>}
      
      <div className="ios-audio-buttons">
        {!audioInitialized && (
          <button 
            className="audio-enable-button" 
            onClick={enableAudio}
          >
            Enable Audio & Microphone
          </button>
        )}
        
        {attempts >= 1 && !audioInitialized && (
          <button 
            className="audio-reload-button" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        )}
      </div>
      
      {!audioInitialized && (
        <div className="audio-tips">
          <small>
            <strong>Tips for {browserType}:</strong>
            <ul>
              {isIOS && <li>Make sure your device is not on silent mode</li>}
              <li>Ensure microphone and audio access is allowed for this website</li>
              {isIOS && <li>If using as a Home Screen app, you may need to open in Safari first and grant permissions</li>}
              <li>After granting permissions, you might need to reload the page</li>
              {isSafari && <li>Consider using Chrome or Firefox for better compatibility</li>}
              {isSafari && <li>Check your Safari security settings to ensure they allow audio</li>}
            </ul>
          </small>
        </div>
      )}
    </div>
  );
};

export default IOSAudioHelper; 