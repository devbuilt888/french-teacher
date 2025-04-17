// Get language preference from environment variables or use default
const getPreferredLanguage = () => {
  return process.env.REACT_APP_DEFAULT_LANGUAGE || 'fr-FR';
};

// Speech synthesis (Text-to-Speech)
export const speak = (text, rate = 1, pitch = 1, voice = null) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      reject('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
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
    
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (event) => {
      reject(event.error);
    };
    
    window.speechSynthesis.speak(utterance);
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