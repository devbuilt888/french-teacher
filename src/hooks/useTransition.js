import { useState, useEffect } from 'react';

// A simple hook to handle transitions between pages
const useTransition = (initialState = false, duration = 300) => {
  const [isVisible, setIsVisible] = useState(initialState);
  const [isRendered, setIsRendered] = useState(initialState);

  useEffect(() => {
    let timer;
    if (isVisible) {
      setIsRendered(true);
      // Small delay to ensure DOM is updated before adding transition
      timer = setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 10);
    } else {
      document.body.style.overflow = '';
      timer = setTimeout(() => {
        setIsRendered(false);
      }, duration);
    }
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [isVisible, duration]);

  return [isVisible, setIsVisible, isRendered];
};

export default useTransition; 