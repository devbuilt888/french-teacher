import React, { useState, useEffect, useRef } from 'react';
import TextInput from '../atoms/TextInput';
import Button from '../atoms/Button';
import { useChat } from '../../context/ChatContext';
import './ChatFooter.css';

const ChatFooter = () => {
  const [message, setMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);
  
  const { 
    sendMessage, 
    isLoading, 
    isRecording, 
    isSpeaking,
    startVoiceRecording, 
    stopVoiceRecording 
  } = useChat();

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      // Start a timer to track recording duration
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Clear the timer when recording stops
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    
    // Cleanup on unmount
    return () => {
      clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Format recording time as minutes:seconds
  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !isSpeaking) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleVoiceButton = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Prevent form submission while recording
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && isRecording) {
      e.preventDefault();
      stopVoiceRecording();
    }
  };

  return (
    <form className="chat-footer" onSubmit={handleSubmit}>
      <Button 
        type="button"
        variant="outline" 
        size="small" 
        className={`chat-footer-button ${isRecording ? 'recording' : ''}`}
        onClick={handleVoiceButton}
        disabled={isSpeaking} // Disable recording while speaking
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        title={isRecording ? "Stop recording" : "Start recording"}
      >
        <span className="footer-icon">{isRecording ? '⏹️' : '🎤'}</span>
      </Button>
      <TextInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isRecording 
          ? `Recording${recordingTime > 0 ? ` ${formatRecordingTime()}` : ''}... (click mic to stop)` 
          : "Type a message..."}
        className="chat-footer-input"
        disabled={isRecording || isSpeaking}
        onKeyDown={onKeyDown}
      />
      <Button 
        type="submit" 
        variant="primary" 
        size="small"
        className="chat-footer-send"
        disabled={!message.trim() || isLoading || isSpeaking || isRecording}
      >
        <span className="footer-icon">➤</span>
      </Button>
    </form>
  );
};

export default ChatFooter; 