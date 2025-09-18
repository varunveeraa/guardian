import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'larger';
  highContrast: boolean;
  textToSpeech: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleTextToSpeech: () => void;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setVoices(voices);
        console.log('Available voices:', voices.length);
      };
      
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  const increaseFontSize = () => {
    setFontSize(current => {
      if (current === 'normal') return 'large';
      if (current === 'large') return 'larger';
      return 'larger';
    });
  };

  const decreaseFontSize = () => {
    setFontSize(current => {
      if (current === 'larger') return 'large';
      if (current === 'large') return 'normal';
      return 'normal';
    });
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech(!textToSpeech);
  };

  const speakText = (text: string) => {
    if (!textToSpeech) return;
    
    if (speechSynthesis) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Small delay to ensure cancellation completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find and assign a suitable voice
        let selectedVoice = voices.find(voice => voice.lang === 'en-US');
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0]; // Fallback to first available voice
        }
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US';
        
        // Add error handling
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis completed');
        };
        
        speechSynthesis.speak(utterance);
      }, 100);
    } else {
      console.warn('Speech synthesis not available');
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Apply font size to root element
    root.classList.remove('font-normal', 'font-medium', 'font-large');
    if (fontSize === 'large') {
      root.classList.add('font-medium');
    } else if (fontSize === 'larger') {
      root.classList.add('font-large');
    } else {
      root.classList.add('font-normal');
    }
    
    // Apply high contrast
    if (highContrast) {
      body.classList.add('high-contrast');
      body.style.backgroundColor = '#000000';
      body.style.color = '#FFFFFF';
    } else {
      body.classList.remove('high-contrast');
      body.style.backgroundColor = '';
      body.style.color = '';
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      highContrast,
      textToSpeech,
      increaseFontSize,
      decreaseFontSize,
      toggleHighContrast,
      toggleTextToSpeech,
      speakText
    }}>
      <div className={`min-h-screen transition-all duration-300 ${
        fontSize === 'large' ? 'font-medium' : fontSize === 'larger' ? 'font-large' : 'font-normal'
      } ${
        highContrast ? 'bg-black text-white' : 'bg-white text-gray-800'
      }`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};