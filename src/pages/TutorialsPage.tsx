import React from 'react';
import { Mail, Facebook, CreditCard, Phone, AlertTriangle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const TutorialsPage: React.FC = () => {
  const { speakText } = useAccessibility();

  const tutorials = [
    {
      icon: Mail,
      title: 'How to Spot a Phishing Email',
      content: 'Learn to identify suspicious emails that try to steal your personal information. Look for urgent language, spelling mistakes, and requests for sensitive information.'
    },
    {
      icon: Facebook,
      title: 'Common Facebook Scams',
      content: 'Discover the most common scams on social media platforms and how to protect yourself from fake friend requests, prize scams, and malicious links.'
    },
    {
      icon: CreditCard,
      title: 'Online Shopping Safety',
      content: 'Essential tips for safe online shopping including how to verify legitimate websites, secure payment methods, and avoiding fake online stores.'
    },
    {
      icon: Phone,
      title: 'Phone and SMS Scams',
      content: 'Recognize common phone and text message scams including fake bank alerts, tech support scams, and prize notifications.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 cursor-pointer"
          onClick={() => speakText('Learn to Spot Scams')}
        >
          Learn to Spot Scams
        </h1>
        <p 
          className="text-xl text-gray-600 cursor-pointer"
          onClick={() => speakText('Educational resources to help you stay safe online')}
        >
          Educational resources to help you stay safe online
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
          <div>
            <h2 
              className="text-2xl font-bold text-red-700 mb-2 cursor-pointer"
              onClick={() => speakText('Important Safety Reminder')}
            >
              Important Safety Reminder
            </h2>
            <p 
              className="text-xl text-red-700 cursor-pointer"
              onClick={() => speakText('Never give out personal information, passwords, or banking details to anyone who contacts you unexpectedly. When in doubt, hang up and call the organisation directly using their official phone number.')}
            >
              Never give out personal information, passwords, or banking details to anyone who contacts you unexpectedly. When in doubt, hang up and call the organisation directly using their official phone number.
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Articles */}
      <div className="space-y-8">
        {tutorials.map((tutorial, index) => (
          <article key={index} className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-300 transition-colors duration-200">
            <div className="flex items-start gap-6">
              <tutorial.icon className="h-16 w-16 text-blue-500 flex-shrink-0 mt-2" />
              <div className="flex-1">
                <h2 
                  className="text-3xl font-bold text-gray-800 mb-4 cursor-pointer"
                  onClick={() => speakText(tutorial.title)}
                >
                  {tutorial.title}
                </h2>
                <p 
                  className="text-xl text-gray-600 leading-relaxed cursor-pointer"
                  onClick={() => speakText(tutorial.content)}
                >
                  {tutorial.content}
                </p>
                <button 
                  onClick={() => speakText(`Read more about ${tutorial.title}`)}
                  className="mt-6 text-blue-500 hover:text-blue-700 text-xl font-semibold underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                >
                  Read Full Guide →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Quick Tips Section */}
      <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
        <h2 
          className="text-3xl font-bold text-gray-800 mb-6 cursor-pointer"
          onClick={() => speakText('Quick Safety Tips')}
        >
          Quick Safety Tips
        </h2>
        <ul className="space-y-4 text-xl text-gray-700">
          <li 
            className="flex items-start gap-4 cursor-pointer"
            onClick={() => speakText('Always verify the sender before clicking links or downloading attachments')}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
            Always verify the sender before clicking links or downloading attachments
          </li>
          <li 
            className="flex items-start gap-4 cursor-pointer"
            onClick={() => speakText('Be suspicious of urgent requests for money or personal information')}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
            Be suspicious of urgent requests for money or personal information
          </li>
          <li 
            className="flex items-start gap-4 cursor-pointer"
            onClick={() => speakText('Check website addresses carefully - scammers often use similar-looking URLs')}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
            Check website addresses carefully - scammers often use similar-looking URLs
          </li>
          <li 
            className="flex items-start gap-4 cursor-pointer"
            onClick={() => speakText('When in doubt, ask a trusted friend or family member for advice')}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
            When in doubt, ask a trusted friend or family member for advice
          </li>
        </ul>
      </section>
    </div>
  );
};