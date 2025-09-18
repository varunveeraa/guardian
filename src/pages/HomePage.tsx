import React from 'react';
import { Lightbulb, Shield, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { speakText } = useAccessibility();

  const handleCardClick = (path: string, title: string) => {
    speakText(`Navigating to ${title}`);
    navigate(path);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      {/* Hero Section - 25% of screen height */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-8 py-8">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 cursor-pointer"
          onClick={() => speakText('Your Guardian for Safe Browsing')}
        >
          Your Guardian for Safe Browsing
        </h1>
        <p 
          className="text-2xl text-gray-600 cursor-pointer"
          onClick={() => speakText('Choose an option below to get started')}
        >
          Choose an option below to get started
        </p>
      </div>

      {/* Main Cards Section - 75% of screen height */}
      <div className="flex-[3] flex flex-col lg:flex-row gap-8 px-8 pb-8">
        {/* Learn Card */}
        <button
          onClick={() => handleCardClick('/tutorials', 'Learn to Spot Scams')}
          className="flex-1 bg-white border-4 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 group card-interactive learn-card"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <Lightbulb className="h-24 w-24 text-blue-500 group-hover:scale-110 transition-transform duration-200 card-icon" />
            <h2 className="text-3xl font-bold text-gray-800">Learn to Spot Scams</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Simple guides to help you recognise online risks.
            </p>
          </div>
        </button>

        {/* Protect Card */}
        <button
          onClick={() => handleCardClick('/prevention', 'Get Protected Now')}
          className="flex-1 bg-white border-4 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 group card-interactive protect-card"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <Shield className="h-24 w-24 text-blue-500 group-hover:scale-110 transition-transform duration-200 card-icon" />
            <h2 className="text-3xl font-bold text-gray-800">Get Protected Now</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Install our free browser guardian to check websites and emails for you.
            </p>
          </div>
        </button>

        {/* Support Card */}
        <button
          onClick={() => handleCardClick('/support', 'Find Help & Support')}
          className="flex-1 bg-white border-4 border-gray-200 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 group card-interactive support-card"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <Phone className="h-24 w-24 text-blue-500 group-hover:scale-110 transition-transform duration-200 card-icon" />
            <h2 className="text-3xl font-bold text-gray-800">Find Help & Support</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Official Australian hotlines and resources for when you need help.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};