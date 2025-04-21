// Get language preference from environment variables or use default
const getPreferredLanguage = () => {
  return process.env.REACT_APP_DEFAULT_LANGUAGE || 'fr-FR';
};

// Check if running on iOS device
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Initialize speech synthesis on iOS - this needs to be called early
export const initSpeechSynthesis = () => {
  // Try to wake up speech synthesis on page load (especially for iOS)
  if ('speechSynthesis' in window) {
    // Create an empty utterance
    const utterance = new SpeechSynthesisUtterance('');
    
    // Try to prevent the iOS bug where speech synthesis stops after a few seconds
    if (isIOS()) {
      setInterval(() => {
        // This keeps the speech synthesis service active
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 5000);
    }
    
    // Try to speak the empty utterance
    try {
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel(); // Immediately cancel it
    } catch (e) {
      console.warn('Failed to initialize speech synthesis:', e);
    }
  }
};

// Speech synthesis (Text-to-Speech)
export const speak = (text, rate = 1, pitch = 1, voice = null) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      reject('Speech synthesis not supported');
      return;
    }

    // Split long text into chunks for iOS (iOS has a character limit)
    let textChunks = [];
    if (isIOS() && text.length > 200) {
      // Split by sentences or reasonable chunks
      const sentences = text.split(/(?<=\.|\?|\!)\s+/);
      let currentChunk = '';
      
      sentences.forEach(sentence => {
        if (currentChunk.length + sentence.length < 200) {
          currentChunk += sentence + ' ';
        } else {
          if (currentChunk) textChunks.push(currentChunk.trim());
          currentChunk = sentence + ' ';
        }
      });
      
      if (currentChunk) textChunks.push(currentChunk.trim());
    } else {
      textChunks = [text];
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    let utteranceIndex = 0;
    let activeSpeech = false;
    
    // For iOS workaround
    let resumeTimer = null;
    
    // Setup iOS watchdog timer to prevent premature pausing
    const setupWatchdog = () => {
      if (isIOS() && activeSpeech) {
        // Clear existing timer if any
        if (resumeTimer) clearInterval(resumeTimer);
        
        // Set up a new resume timer
        resumeTimer = setInterval(() => {
          // Only act if we're still in active speech
          if (activeSpeech) {
            try {
              // Pause and resume to prevent iOS from stopping
              if (window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
              }
            } catch (e) {
              console.warn('Error in watchdog timer:', e);
            }
          } else {
            // Speech is done, clear the timer
            clearInterval(resumeTimer);
            resumeTimer = null;
          }
        }, 5000); // Check every 5 seconds
      }
    };
    
    // Function to speak the next chunk
    const speakNextChunk = () => {
      if (utteranceIndex >= textChunks.length) {
        activeSpeech = false;
        if (resumeTimer) {
          clearInterval(resumeTimer);
          resumeTimer = null;
        }
        resolve();
        return;
      }
      
      const chunk = textChunks[utteranceIndex];
      const utterance = new SpeechSynthesisUtterance(chunk);
      
      // Set voice if provided, otherwise it will use the default
      if (voice) {
        utterance.voice = voice;
      } else {
        // Try to find a voice for the preferred language, otherwise use default
        const preferredLang = getPreferredLanguage();
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.lang.includes(preferredLang.split('-')[0]));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      
      // Critical iOS workaround - this prevents premature stopping on iOS
      if (isIOS()) {
        utterance.onboundary = () => {
          // This helps prevent iOS from pausing
          try {
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.pause();
              setTimeout(() => {
                if (window.speechSynthesis.paused) window.speechSynthesis.resume();
              }, 0);
            }
          } catch (e) {
            console.warn('Error in boundary event:', e);
          }
        };
      }
      
      utterance.onstart = () => {
        activeSpeech = true;
        setupWatchdog();
      };
      
      utterance.onend = () => {
        utteranceIndex++;
        speakNextChunk();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        if (utteranceIndex < textChunks.length - 1) {
          // Try the next chunk if this one fails
          utteranceIndex++;
          speakNextChunk();
        } else {
          activeSpeech = false;
          if (resumeTimer) {
            clearInterval(resumeTimer);
            resumeTimer = null;
          }
          reject(event.error);
        }
      };
      
      // Critical iOS workaround to unmute audio
      if (isIOS() && utteranceIndex === 0) {
        // Create and play a silent audio clip to enable audio
        try {
          const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0L2YLwxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          silentAudio.volume = 0.1;
          silentAudio.play().then(() => {
            // Start speaking after audio context is activated
            window.speechSynthesis.speak(utterance);
          }).catch(err => {
            // If silent audio fails, try speaking directly
            console.warn("Silent audio failed, trying direct speech:", err);
            window.speechSynthesis.speak(utterance);
          });
        } catch (e) {
          console.warn("Error with silent audio, trying direct speech:", e);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        window.speechSynthesis.speak(utterance);
      }
    };
    
    // Start speaking
    speakNextChunk();
  });
};

// Get available voices for speech synthesis
export const getVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};

// Initialize speech recognition (varies by browser)
export const initSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported');
    return null;
  }
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep recording continuously
  recognition.interimResults = true; // Get interim results
  recognition.lang = getPreferredLanguage(); // Set to preferred language from env vars
  recognition.maxAlternatives = 1; // Only get best interpretation
  
  // Initialize custom properties
  recognition.isListening = false;
  recognition.manualStop = false;
  recognition.fullTranscript = ''; // Track the complete transcript during recording
  recognition.processedSegments = new Set(); // Track processed segments to avoid duplication
  
  // Add event handlers
  recognition.onend = () => {
    // This event fires when recognition stops for any reason
    console.log('Speech recognition ended');
    // Restart if not manually stopped
    if (recognition.isListening && !recognition.manualStop) {
      console.log('Restarting speech recognition');
      try {
        recognition.start();
      } catch (e) {
        console.error('Error restarting recognition:', e);
        // Small delay before restarting
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error('Failed to restart recognition after delay:', err);
          }
        }, 100);
      }
    }
  };
  
  return recognition;
};

// Start recording with speech recognition
export const startRecording = (recognition, onResult, onError) => {
  if (!recognition) {
    onError('Speech recognition not supported');
    return;
  }
  
  // Ensure any previous recognition sessions are stopped
  try {
    recognition.abort();
  } catch (e) {
    // Ignore errors from stopping a recognition that hasn't started
  }
  
  // Reset control flags
  recognition.manualStop = false;
  recognition.isListening = true;
  recognition.fullTranscript = ''; // Reset the full transcript
  recognition.processedSegments = new Set(); // Reset the processed segments
  
  // For preventing multiple triggers
  let resultDebounceTimer = null;
  
  // Handle results - both interim and final
  recognition.onresult = (event) => {
    // Collect results from all speech segments
    let interimTranscript = '';
    let finalTranscript = '';
    let newSegmentFound = false;
    
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      // We use the first (most likely) alternative
      const transcript = result[0].transcript;
      
      // Create a unique key for this segment
      const segmentKey = `${i}-${transcript}`;
      
      if (result.isFinal) {
        // Only process this segment if we haven't seen it before
        if (!recognition.processedSegments.has(segmentKey)) {
          finalTranscript += transcript + ' ';
          recognition.processedSegments.add(segmentKey);
          recognition.fullTranscript += transcript + ' ';
          newSegmentFound = true;
        }
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Store the current state for when the user stops recording
    if (finalTranscript && newSegmentFound) {
      console.log('Final transcript segment:', finalTranscript);
    }
    
    // If manually stopped, return the full transcript
    if (recognition.manualStop) {
      // Clear any pending debounce timers
      if (resultDebounceTimer) {
        clearTimeout(resultDebounceTimer);
      }
      
      // Deduplicate words if necessary (split by space, deduplicate, rejoin)
      const finalText = recognition.fullTranscript.trim();
      const words = finalText.split(/\s+/);
      
      // Check for repeating patterns and simplify
      const simplifiedText = simplifyRepeatedText(finalText);
      
      // Return the full accumulated transcript when manually stopped
      onResult(simplifiedText, 1.0);
    }
  };
  
  // Handle errors
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    // Don't report no-speech as error unless recording was just started
    const startTime = recognition.startTime || 0;
    const now = Date.now();
    const elapsedTime = now - startTime;
    
    if (event.error === 'no-speech' && elapsedTime > 1000) {
      // Ignore no-speech errors after the first second
      console.log('No speech detected, continuing recording...');
    } else {
      onError(event.error);
    }
  };
  
  // Start the recording with a small delay
  setTimeout(() => {
    try {
      // Track when recording started
      recognition.startTime = Date.now();
      recognition.start();
      console.log('Speech recognition started');
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      onError('Failed to start speech recognition');
    }
  }, 100);
};

// Helper function to simplify repeated text patterns
function simplifyRepeatedText(text) {
  if (!text) return '';
  
  // Split into words
  const words = text.split(/\s+/);
  
  // If few words, just return original text
  if (words.length < 4) return text;
  
  // Find and remove long repetitions
  const result = [];
  const maxPatternLength = Math.min(10, Math.floor(words.length / 2));
  
  // Start with no repetition detection
  let i = 0;
  while (i < words.length) {
    let patternFound = false;
    
    // Try to find repeating patterns starting from current position
    for (let patternLength = 2; patternLength <= maxPatternLength; patternLength++) {
      if (i + patternLength * 2 > words.length) continue;
      
      // Get the potential pattern
      const pattern = words.slice(i, i + patternLength);
      const patternStr = pattern.join(' ');
      
      // Check if the next set of words match the pattern
      const nextSet = words.slice(i + patternLength, i + patternLength * 2);
      const nextSetStr = nextSet.join(' ');
      
      // If pattern repeats
      if (patternStr === nextSetStr) {
        // Check how many times this pattern repeats
        let repeatCount = 2;
        let nextChunkStart = i + patternLength * 2;
        
        while (nextChunkStart + patternLength <= words.length) {
          const chunk = words.slice(nextChunkStart, nextChunkStart + patternLength);
          if (chunk.join(' ') === patternStr) {
            repeatCount++;
            nextChunkStart += patternLength;
          } else {
            break;
          }
        }
        
        // If the pattern repeats more than once, add it just once
        if (repeatCount >= 2) {
          result.push(...pattern);
          i = nextChunkStart;
          patternFound = true;
          break;
        }
      }
    }
    
    // If no pattern found, add the current word and move on
    if (!patternFound) {
      result.push(words[i]);
      i++;
    }
  }
  
  return result.join(' ');
}

// Stop recording
export const stopRecording = (recognition) => {
  if (!recognition) return;
  
  try {
    // Set the manual stop flag before stopping
    recognition.manualStop = true;
    recognition.isListening = false;
    
    console.log('Manual stop requested, full transcript:', recognition.fullTranscript);
    
    // Stop the recognition
    recognition.stop();
  } catch (err) {
    console.error('Error stopping speech recognition:', err);
  }
}; 