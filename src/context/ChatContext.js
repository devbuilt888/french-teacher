import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { userAvatar, teacherAvatar } from '../assets/teacherAvatar';
import { initOpenAI, sendMessageToGPT, createFrenchTeacherSystemMessage } from '../services/openaiService';
import { speak, getVoices, initSpeechRecognition, startRecording, stopRecording, initSpeechSynthesis } from '../services/speechService';
import { getOpenAIApiKey } from '../services/envService';
import useLocalStorage from '../hooks/useLocalStorage';

// Initial messages
const initialMessages = [
  {
    id: 1,
    content: "Bonjour! Je suis votre Super French Tutor. Comment puis-je vous aider aujourd'hui?",
    timestamp: "09:30",
    isUser: false,
    status: 'read'
  }
];

// Check if running on iOS device
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Create context
const ChatContext = createContext();

// Custom hook to use chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage('openai_api_key', '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const recognitionRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const envApiKey = getOpenAIApiKey();

  // Initialize speech synthesis as early as possible
  useEffect(() => {
    // Early initialize speech synthesis (especially important for iOS)
    try {
      initSpeechSynthesis();
      
      // Attempt to create an AudioContext (important for iOS)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        
        // If the context is suspended (common on iOS), try to resume it
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().then(() => {
            console.log('AudioContext successfully resumed');
            setAudioInitialized(true);
          }).catch(e => {
            console.warn('Could not resume AudioContext:', e);
          });
        } else {
          setAudioInitialized(true);
        }
      }
    } catch (e) {
      console.warn('Error initializing audio systems:', e);
    }
  }, []);

  // Initialize voices
  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await getVoices();
      setVoices(availableVoices);
      
      // Try to find a French voice
      const frenchVoice = availableVoices.find(voice => voice.lang.includes('fr'));
      if (frenchVoice) {
        setSelectedVoice(frenchVoice);
      } else {
        setSelectedVoice(availableVoices[0]);
      }
    };
    
    loadVoices();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = initSpeechRecognition();
  }, []);

  // Start a new conversation with the French teacher
  const startConversation = useCallback(async () => {
    if (!isInitialized) {
      setError('OpenAI API is not initialized. Please check your API key in .env.local file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialize conversation history with system message
      conversationHistoryRef.current = [createFrenchTeacherSystemMessage()];
      
      // Get initial response from GPT
      const response = await sendMessageToGPT(conversationHistoryRef.current);
      
      // Add teacher's initial message to the conversation
      const initialMessage = {
        id: 1,
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        status: 'read'
      };
      
      setMessages([initialMessage]);
      
      // Add the assistant's response to the conversation history
      conversationHistoryRef.current.push({
        role: "assistant",
        content: response
      });
      
      // Speak the response
      speakMessage(response);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Initialize OpenAI with API key from environment variables or stored key
  useEffect(() => {
    const initAPI = async () => {
      // Try to use environment API key first
      const keyToUse = envApiKey || apiKey;
      
      if (keyToUse) {
        try {
          initOpenAI(keyToUse);
          setIsInitialized(true);
          setError(null);
          
          // Start conversation if it's empty
          if (messages.length === 0) {
            await startConversation();
          }
        } catch (error) {
          console.error('Failed to initialize OpenAI:', error);
          setError('Failed to initialize OpenAI API. Please check your API key in .env.local file.');
          setIsInitialized(false);
        }
      } else {
        setIsInitialized(false);
        setError('OpenAI API key is missing. Please add REACT_APP_OPENAI_API_KEY to your .env.local file.');
      }
    };
    
    initAPI();
  }, [apiKey, envApiKey, messages.length, startConversation]);

  // Add a message to the UI
  const addMessage = (content, isUser) => {
    const newMessage = {
      id: messages.length + 1,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser,
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Update message status
  const updateMessageStatus = (id, status) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, status } : msg
      )
    );
  };

  // Speak a message using the selected voice
  const speakMessage = async (text) => {
    if (!text) return;
    
    setIsSpeaking(true);
    try {
      // For iOS, make sure audio is initialized
      if (isIOS() && !audioInitialized) {
        try {
          // Try to initialize audio context
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const audioCtx = new AudioContext();
            audioCtx.resume();
            
            // Try to play a silent audio first
            const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0L2YLwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
            await silentAudio.play();
            
            setAudioInitialized(true);
          }
        } catch (e) {
          console.warn('Failed to initialize audio for iOS:', e);
        }
      }
      
      // Attempt to use the Web Speech API
      await speak(text, 1, 1, selectedVoice);
    } catch (error) {
      console.error('Error speaking message:', error);
      
      // If browser is iOS Safari, try to show an audio fallback message
      if (isIOS()) {
        setError('Audio may not be working on your iOS device. Please ensure your device is not muted and you have granted audio permissions.');
        
        // Show the error for just 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  // Start recording user's voice
  const startVoiceRecording = () => {
    if (isRecording || !recognitionRef.current) return;
    
    // Set recording state before starting the recording
    setIsRecording(true);
    
    startRecording(
      recognitionRef.current,
      (fullTranscript, confidence) => {
        // Process the full transcript when manually stopped
        if (fullTranscript && fullTranscript.trim()) {
          // Check if the message isn't empty or just repetitive content
          const processedText = fullTranscript.trim();
          if (processedText.length > 0) {
            sendMessage(processedText);
          } else {
            console.log('Empty or repetitive transcript detected, not sending message');
          }
        }
      },
      (error) => {
        // Handle recording error
        console.error('Recording error:', error);
        setIsRecording(false);
        if (error !== 'no-speech') { // Don't show error for no speech detected
          setError(`Recording error: ${error}`);
        }
      }
    );
  };

  // Stop recording user's voice
  const stopVoiceRecording = () => {
    if (!recognitionRef.current) return;
    
    // Prevent double stopping
    if (!isRecording) return;
    
    stopRecording(recognitionRef.current);
    setIsRecording(false);
  };

  // Process a text response from OpenAI
  const processOpenAIResponse = async (userMessageId) => {
    try {
      // Mark the user message as delivered
      updateMessageStatus(userMessageId, 'delivered');
      
      // Get response from GPT
      const response = await sendMessageToGPT(conversationHistoryRef.current);
      
      // Mark the user message as read
      updateMessageStatus(userMessageId, 'read');
      
      // Add the assistant's message to UI
      addMessage(response, false);
      
      // Add the assistant's response to the conversation history
      conversationHistoryRef.current.push({
        role: "assistant",
        content: response
      });
      
      // Speak the response
      speakMessage(response);
      
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the chat
  const sendMessage = async (content) => {
    if (!content?.trim()) return;
    if (!isInitialized) {
      setError('OpenAI API is not initialized. Please check your API key in .env.local file.');
      return;
    }
    
    // Check if this message would be a duplicate of the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isUser && lastMessage.content === content) {
      console.log('Duplicate message detected, not sending');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Add user message to UI
    const userMessage = addMessage(content, true);
    
    // Add the user's message to the conversation history
    conversationHistoryRef.current.push({
      role: "user",
      content
    });
    
    // Process the response from OpenAI
    processOpenAIResponse(userMessage.id);
  };

  // Set the OpenAI API key
  const setOpenAIKey = (key) => {
    setApiKey(key);
  };

  // Change the selected voice
  const changeVoice = (voice) => {
    setSelectedVoice(voice);
  };

  // Reset the conversation
  const resetConversation = () => {
    setMessages([]);
    conversationHistoryRef.current = [];
    startConversation();
  };

  // Force initialize audio (for iOS)
  const forceInitializeAudio = () => {
    // Try to play a test sound to initialize audio on iOS
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        
        // Create a short beep
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.value = 0.1; // Low volume
        
        oscillator.frequency.value = 440; // A4 note
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1); // Very short beep
        
        setAudioInitialized(true);
      }
    } catch (e) {
      console.error('Error initializing audio:', e);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage,
      userAvatar,
      teacherAvatar,
      isInitialized,
      isLoading,
      error,
      apiKey: envApiKey || apiKey,
      setOpenAIKey,
      voices,
      selectedVoice,
      changeVoice,
      isRecording,
      isSpeaking,
      startVoiceRecording,
      stopVoiceRecording,
      resetConversation,
      hasApiKey: !!envApiKey,
      audioInitialized,
      forceInitializeAudio
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 