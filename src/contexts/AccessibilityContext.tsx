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

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
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
    if (textToSpeech && speechSynthesis) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
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