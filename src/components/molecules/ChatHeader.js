import React from 'react';
import Avatar from '../atoms/Avatar';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import VoiceSettings from './VoiceSettings';
import './ChatHeader.css';

const ChatHeader = ({ name, status, avatarSrc, onBackClick }) => {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <Button 
          className="chat-header-back"
          onClick={onBackClick}
          variant="outline"
          size="small"
        >
          ←
        </Button>
        <Avatar src={avatarSrc} alt={name} status={status} />
        <div className="chat-header-info">
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="caption" color="light" className="chat-header-status">
            {status === 'online' ? 'Online' : 
             status === 'away' ? 'Away' : 
             status === 'busy' ? 'Do not disturb' : 'Offline'}
          </Typography>
        </div>
      </div>
      <div className="chat-header-actions">
        <VoiceSettings className="header-voice-settings" />
      </div>
    </div>
  );
};

export default ChatHeader; 