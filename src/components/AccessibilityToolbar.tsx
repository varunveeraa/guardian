import React from 'react';
import { ZoomIn, ZoomOut, Contrast, Volume2 } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const AccessibilityToolbar: React.FC = () => {
  const { 
    fontSize, 
    highContrast, 
    textToSpeech,
    increaseFontSize, 
    decreaseFontSize, 
    toggleHighContrast, 
    toggleTextToSpeech,
    speakText
  } = useAccessibility();

  const handleButtonClick = (action: () => void, message: string) => {
    action();
    // Speak the message after the action
    speakText(message);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 accessibility-toolbar">
      <button
        onClick={() => handleButtonClick(increaseFontSize, 'Font size increased')}
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        title="Increase Font Size"
        aria-label="Increase Font Size"
      >
        <ZoomIn className="h-6 w-6" />
      </button>
      
      <button
        onClick={() => handleButtonClick(decreaseFontSize, 'Font size decreased')}
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        title="Decrease Font Size"
        aria-label="Decrease Font Size"
      >
        <ZoomOut className="h-6 w-6" />
      </button>
      
      <button
        onClick={() => handleButtonClick(toggleHighContrast, highContrast ? 'High contrast disabled' : 'High contrast enabled')}
        className={`w-12 h-12 ${highContrast ? 'bg-white text-black' : 'bg-blue-500 text-white'} hover:opacity-80 rounded-lg shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200`}
        title="Toggle High Contrast"
        aria-label="Toggle High Contrast Mode"
      >
        <Contrast className="h-6 w-6" />
      </button>
      
      <button
        onClick={() => handleButtonClick(toggleTextToSpeech, textToSpeech ? 'Text to speech disabled' : 'Text to speech enabled')}
        className={`w-12 h-12 ${textToSpeech ? 'bg-green-500' : 'bg-blue-500'} hover:opacity-80 text-white rounded-lg shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200`}
        title="Toggle Text to Speech"
        aria-label="Toggle Text to Speech"
      >
        <Volume2 className="h-6 w-6" />
      </button>
    </div>
  );
};