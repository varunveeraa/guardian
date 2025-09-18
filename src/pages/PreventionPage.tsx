import React from 'react';
import { Download, QrCode, XCircle, Lock, Car as IdCard, Link, ShieldPlus, CheckCircle, AlertTriangle, XCircle as XCircleRed, Mail, Brain } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const PreventionPage: React.FC = () => {
  const { speakText } = useAccessibility();

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 space-y-16">
      {/* Page Title */}
      <div className="text-center">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 cursor-pointer"
          onClick={() => speakText('How Our Browser Guardian Protects You')}
        >
          How Our Browser Guardian Protects You
        </h1>
      </div>

      {/* Section 1: Get Protected */}
      <section className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('Get Protected in Two Clicks')}
        >
          Get Protected in Two Clicks
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <button 
            onClick={() => speakText('Install the Browser Guardian button')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 rounded-lg text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-4"
          >
            <Download className="h-8 w-8" />
            Install the Browser Guardian
          </button>
          
          <div className="flex-1 text-center">
            <QrCode className="h-32 w-32 mx-auto text-gray-400 mb-4" />
            <p 
              className="text-xl text-gray-600 cursor-pointer"
              onClick={() => speakText('Get it on your Phone or Tablet')}
            >
              Get it on your Phone or Tablet
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: 5-Point Safety Check */}
      <section className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('Our Automatic 6-Point Safety Check')}
        >
          Our Automatic 6-Point Safety Check
        </h2>

        <div className="space-y-6">
          {[
            { icon: XCircle, title: 'Checks Against Known Dangers', description: 'We see if the website is on a list of known fraudulent sites.' },
            { icon: Lock, title: 'Looks for the Secure Padlock', description: 'We ensure your connection to the website is private and secure (HTTPS).' },
            { icon: IdCard, title: "Verifies the Website's ID", description: "We check that the website's official security certificate is valid." },
            { icon: Link, title: 'Ensures All Parts are Secure', description: 'We make sure there are no insecure elements on an otherwise secure page.' },
            { icon: ShieldPlus, title: 'Enforces Extra Security', description: 'We check if the site uses a special policy to guarantee a secure connection.' },
            { icon: Brain, title: 'AI-Powered Suspicious URL Detection', description: 'Our advanced machine learning model analyzes website addresses to spot cleverly disguised scam sites that try to look like legitimate businesses.' }
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <step.icon className="h-12 w-12 text-blue-500" />
              </div>
              <div>
                <h3 
                  className="text-2xl font-bold text-gray-800 mb-2 cursor-pointer"
                  onClick={() => speakText(`Step ${index + 1}: ${step.title}`)}
                >
                  Step {index + 1}: {step.title}
                </h3>
                <p 
                  className="text-xl text-gray-600 cursor-pointer"
                  onClick={() => speakText(step.description)}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: How it Works */}
      <section className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('Your At-a-Glance Safety Signal')}
        >
          Your At-a-Glance Safety Signal
        </h2>

        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md inline-block">
              <div className="flex items-center gap-4">
                <span className="text-xl">Browser Address Bar</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">Our Shield:</span>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xl">
            <p 
              className="cursor-pointer"
              onClick={() => speakText('After installing, you will see our shield icon in the top corner of your browser.')}
            >
              After installing, you will see our shield icon in the top corner of your browser.
            </p>
            <p 
              className="cursor-pointer"
              onClick={() => speakText('As you browse, this shield automatically runs the 6-Point Safety Check on every site.')}
            >
              As you browse, this shield automatically runs the 6-Point Safety Check on every site.
            </p>
            <p 
              className="cursor-pointer"
              onClick={() => speakText('The icon\'s color changes instantly based on the website\'s safety score.')}
            >
              The icon's color changes instantly based on the website's safety score.
            </p>
            <p 
              className="cursor-pointer"
              onClick={() => speakText('You can click the shield icon at any time to see a simple report.')}
            >
              You can click the shield icon at any time to see a simple report.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Color Warnings */}
      <section className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('What the Colours Mean')}
        >
          What the Colours Mean
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 
              className="text-2xl font-bold text-green-700 mb-4 cursor-pointer"
              onClick={() => speakText('Green - Looks Safe')}
            >
              Looks Safe
            </h3>
            <p 
              className="text-xl text-gray-700 cursor-pointer"
              onClick={() => speakText('The shield icon is green. You can browse with peace of mind.')}
            >
              The shield icon is green. You can browse with peace of mind.
            </p>
          </div>

          <div className="text-center p-8 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <h3 
              className="text-2xl font-bold text-orange-700 mb-4 cursor-pointer"
              onClick={() => speakText('Orange - Be Cautious')}
            >
              Be Cautious
            </h3>
            <p 
              className="text-xl text-gray-700 cursor-pointer"
              onClick={() => speakText('The shield icon is orange. Click the icon to see our concerns.')}
            >
              The shield icon is orange. Click the icon to see our concerns.
            </p>
          </div>

          <div className="text-center p-8 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircleRed className="h-12 w-12 text-white" />
            </div>
            <h3 
              className="text-2xl font-bold text-red-700 mb-4 cursor-pointer"
              onClick={() => speakText('Red - Danger!')}
            >
              Danger!
            </h3>
            <p 
              className="text-xl text-gray-700 cursor-pointer"
              onClick={() => speakText('The shield icon is red, and we will show a full-screen warning urging you to close the website immediately.')}
            >
              The shield icon is red, and we will show a full-screen warning urging you to close the website immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Email Protection */}
      <section className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('Your Guardian for Gmail')}
        >
          Your Guardian for Gmail
        </h2>

        <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="h-12 w-12 text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800">Email Protection</h3>
          </div>
          <p 
            className="text-xl text-gray-700 cursor-pointer"
            onClick={() => speakText('When you have Gmail open, our tool also helps scan your emails for suspicious links or urgent language, giving you a friendly heads-up.')}
          >
            When you have Gmail open, our tool also helps scan your emails for suspicious links or urgent language, giving you a friendly heads-up.
          </p>
        </div>
      </section>
    </div>
  );
};