import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const Footer: React.FC = () => {
  const { speakText } = useAccessibility();

  return (
    <footer className="w-full py-6 px-8 border-t border-gray-200 mt-auto bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-6">
          <button 
            onClick={() => speakText('Privacy Policy')}
            className="text-blue-500 hover:text-blue-700 underline text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => speakText('Contact Us')}
            className="text-blue-500 hover:text-blue-700 underline text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 transition-colors"
          >
            Contact Us
          </button>
        </div>
        <p 
          className="text-gray-600 text-lg cursor-pointer hover:text-gray-800 transition-colors p-1"
          onClick={() => speakText('Proudly developed in Australia')}
        >
          Proudly developed in Australia
        </p>
      </div>
    </footer>
  );
};