import React from 'react';
import { Shield } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const Header: React.FC = () => {
  const { speakText } = useAccessibility();

  const handleLogoClick = () => {
    speakText('Guardian Safe Browsing - Your protection from online scams');
  };

  return (
    <header className="w-full py-6 px-8 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 hover:bg-gray-50 transition-colors"
        >
          <Shield className="h-10 w-10 text-blue-500" />
          <span className="text-2xl font-bold text-gray-800">Guardian</span>
        </button>
      </div>
    </header>
  );
};