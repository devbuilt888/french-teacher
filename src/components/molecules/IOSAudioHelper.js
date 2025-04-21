import React, { useState, useEffect } from 'react';
import './IOSAudioHelper.css';
import { useChat } from '../../context/ChatContext';

const IOSAudioHelper = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const { audioInitialized, forceInitializeAudio } = useChat();

  useEffect(() => {
    // Check if device is iOS
    const checkIOS = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      setIsIOS(iOS);
      
      if (iOS) {
        // Show helper immediately on iOS
        setVisible(true);
      }
    };
    
    checkIOS();
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
      setFeedback('Initializing audio...');
      setAttempts(prev => prev + 1);
      
      // Use the context function to initialize audio
      forceInitializeAudio();
      
      // If we got here without errors, we're likely good
      setFeedback('Audio initialized successfully!');
      
      // Hide after success (the context effect will handle this)
    } catch (error) {
      console.error('Error enabling audio:', error);
      setFeedback('Failed to initialize audio. Please try again.');
    }
  };

  // Only show on iOS and if not yet initialized
  if (!isIOS || (audioInitialized && !visible)) return null;

  return (
    <div className="ios-audio-helper">
      <h3>iOS Audio Setup</h3>
      
      <p>
        {!audioInitialized ? 
          'Audio must be enabled on iOS devices. Please tap the button below to enable audio.' : 
          'Audio is now enabled! This message will disappear shortly.'}
      </p>
      
      {feedback && <div className="audio-feedback">{feedback}</div>}
      
      <div className="ios-audio-buttons">
        {!audioInitialized && (
          <button 
            className="audio-enable-button" 
            onClick={enableAudio}
          >
            Enable Audio
          </button>
        )}
        
        {attempts >= 2 && !audioInitialized && (
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
            <strong>Tips:</strong> Make sure your device is not on silent mode. 
            If audio still doesn't work, try reloading the page.
          </small>
        </div>
      )}
    </div>
  );
};

export default IOSAudioHelper; 